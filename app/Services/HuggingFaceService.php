<?php
namespace App\Services;

use GuzzleHttp\Client;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class HuggingFaceService
{
    protected Client $client;
    protected string $apiKey;
    protected string $baseUrl;

    public function __construct(){
        $this->apiKey = config('services.huggingface.key');
        $this->baseUrl = config('services.huggingface.url') ?? 'https://router.huggingface.co/hf-inference';
        $this->client = new Client([
            'base_uri' => $this->baseUrl,
            'headers' => [
                'Authorization' => "Bearer {$this->apiKey}",
                'Accept' => 'application/json'
            ],
            'timeout' => 60
        ]);
    }

    /**
     * Call a Hugging Face model
     *
     * @param string $model Model name (e.g., "gpt2")
     * @param array $inputs Input data
     * @return array
     */

    // Speech to text: upload file and call model (e.g. openai/whisper or facebook/wav2vec)
    public function speechToText(string $s3path)
{
    try {
        $filePath = storage_path('app/public/' . ltrim($s3path, '/'));

        if (!file_exists($filePath)) {
            Log::error("🎤 Audio file not found at: {$filePath}");
            return null;
        }

        $fileContents = file_get_contents($filePath);

        $url = "https://router.huggingface.co/hf-inference/models/openai/whisper-large";

        $res = $this->client->post($url, [
            'body' => $fileContents,
            'headers' => ['Content-Type' => 'application/octet-stream']
        ]);

        $json = json_decode($res->getBody()->getContents(), true);

        return $json['text'] ?? ($json[0]['text'] ?? null);

    } catch (\Exception $e) {
        Log::error('🎤 Speech to text failed: ' . $e->getMessage());
        return null;
    }
}

    public function analyzeTextEmotion(string $text)
{
    try {
        if (empty(trim($text))) {
            Log::warning('⚠️ Empty text input for emotion analysis.');
            return ['label' => null, 'score' => null, 'model' => 'text->emotion', 'raw' => []];
        }

        // ✅ Correct Hugging Face endpoint for text models
        $model = 'j-hartmann/emotion-english-distilroberta-base';
        $url = "https://router.huggingface.co/hf-inference/models/{$model}";

        $res = $this->client->post($url, [
            'json' => ['inputs' => $text],
        ]);

        $body = (string) $res->getBody();
        $json = json_decode($body, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            Log::error("🧩 JSON decode failed: " . json_last_error_msg());
            return ['label' => null, 'score' => null, 'model' => $model, 'raw' => []];
        }

        // ✅ Handle different possible HF response formats
        if (isset($json[0]['label'])) {
            // Simple classification output
            return [
                'label' => $json[0]['label'],
                'score' => $json[0]['score'] ?? null,
                'model' => $model,
                'raw' => $json,
            ];
        } elseif (isset($json[0][0]['label'])) {
            // Nested array output (some text models)
            return [
                'label' => $json[0][0]['label'],
                'score' => $json[0][0]['score'] ?? null,
                'model' => $model,
                'raw' => $json,
            ];
        }

        Log::warning("⚠️ Unexpected emotion response format for text: " . json_encode($json));
        return ['label' => null, 'score' => null, 'model' => $model, 'raw' => $json];

    } catch (\Exception $e) {
        Log::error('💬 Text emotion analysis failed: ' . $e->getMessage());
        return ['label' => null, 'score' => null, 'model' => 'text->emotion', 'raw' => []];
    }
}

    public function summarizeText(string $text){
       $model = 'meta-llama/Llama-3.1-8B-Instruct:novita';
        $res = Http::withHeaders([
    'Authorization' => 'Bearer ' . env('HUGGINGFACE_API_KEY'),
    'Content-Type' => 'application/json',
])->post("https://router.huggingface.co/v1/chat/completions", [
            'json' => ['inputs' => $text]
        ]);
        $json = json_decode($res->getBody()->getContents(), true);
        return ['summary' => is_string($json) ? $json : ($json[0]['summary_text'] ?? null), 'model' => $model];
    }

    public function analyzeAudioEmotion(string $s3path)
{
    try {
        // Step 1: Convert audio to text (speech-to-text)
        $transcribed = $this->speechToText($s3path);

        if (empty($transcribed)) {
            Log::warning('⚠️ No text extracted from audio: ' . $s3path);
            return ['label' => null, 'score' => null, 'model' => 'audio->text->emotion', 'raw' => []];
        }

        // Step 2: Analyze emotion from transcribed text
        $emotion = $this->analyzeTextEmotion($transcribed);

        return [
            'label' => $emotion['label'],
            'score' => $emotion['score'],
            'model' => 'audio->text->emotion',
            'raw'   => ['transcribed' => $transcribed, 'emotion' => $emotion],
        ];

    } catch (\Exception $e) {
        Log::error('🎤 Audio emotion analysis failed: ' . $e->getMessage());
        return ['label' => null, 'score' => null, 'model' => 'audio->text->emotion', 'raw' => []];
    }
}

public function analyzeImageEmotion(string $s3path)
{
    try {
        if (str_starts_with($s3path, 'http://') || str_starts_with($s3path, 'https://')) {
            $relativePath = str_replace(['http://localhost:8000/storage/', '/storage/'], '', $s3path);
            $filePath = storage_path('app/public/' . $relativePath);
        } else {
            $filePath = storage_path('app/public/' . ltrim($s3path, '/'));
        }

        if (!file_exists($filePath)) {
            Log::error("🖼️ Image file not found at: " . $filePath);
            return ['label' => null, 'score' => null, 'model' => 'image->emotion', 'raw' => []];
        }

        $fileContents = file_get_contents($filePath);

        // ✅ Correct Hugging Face endpoint for the router
        $model = 'microsoft/resnet-50';
        $url = "https://router.huggingface.co/hf-inference/models/{$model}";

        $res = $this->client->post($url, [
            'body' => $fileContents,
            'headers' => ['Content-Type' => 'application/octet-stream']
        ]);

        $body = (string) $res->getBody();
        $json = json_decode($body, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            Log::error("🧩 JSON decode failed: " . json_last_error_msg());
            return ['label' => null, 'score' => null, 'model' => $model, 'raw' => []];
        }

        if (isset($json[0]['generated_text']) || isset($json['generated_text'])) {
            // The BLIP model returns captions in generated_text
            $caption = $json[0]['generated_text'] ?? $json['generated_text'];
            return [
                'label' => $caption,
                'score' => 1.0,
                'model' => $model,
                'raw' => $json,
            ];
        }

        if (isset($json[0]['label'])) {
            return [
                'label' => $json[0]['label'],
                'score' => $json[0]['score'] ?? null,
                'model' => $model,
                'raw' => $json,
            ];
        }

        return ['label' => null, 'score' => null, 'model' => $model, 'raw' => $json];

    } catch (\Exception $e) {
        Log::error('🖼️ Image emotion analysis failed: ' . $e->getMessage());
        return ['label' => null, 'score' => null, 'model' => 'image->emotion', 'raw' => []];
    }
}



//    public function generateQuote(): ?string
// {
//     $model = "openai-community/gpt2"; // modèle anglais simple et hébergé
//     $prompt = "Generate a short motivational quote in English.";

//     try {
//         // Utilisation de $this->client défini dans le constructeur
//         $res = $this->client->post("/{$model}", [
//             'json' => [
//                 'inputs' => $prompt,
//                 'parameters' => [
//                     'max_new_tokens' => 50,
//                     'temperature' => 0.8
//                 ]
//             ]
//         ]);

//         $data = json_decode($res->getBody()->getContents(), true);
//         Log::info('🔎 Hugging Face router response: ' . json_encode($data));

//         // Retourne la citation générée ou null si absence
//         return $data[0]['generated_text'] ?? null;

//     } catch (\Exception $e) {
//         Log::error('💥 Hugging Face Exception: ' . $e->getMessage());
//         return null;
//     }
// }

public function query(string $model, array $inputs): array
    {
        $model = 'meta-llama/Llama-3.1-8B-Instruct:novita';
        $response = Http::withHeaders([
    'Authorization' => 'Bearer ' . env('HUGGINGFACE_API_KEY'),
    'Content-Type' => 'application/json',
])->post("https://router.huggingface.co/v1/chat/completions", [
    'model' => $model,
    'messages' => [
        [
            'role' => 'user',
            'content' => 'Generate a short quote in english',
        ],
    ],
]);


if ($response->failed()) {
    throw new \Exception('Hugging Face API request failed: ' . $response->body());
}

        return $response->json();
    }

}