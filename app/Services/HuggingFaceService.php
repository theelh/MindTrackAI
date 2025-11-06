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
    public function speechToText(string $s3path){
        $temp = Storage::disk('s3')->temporaryUrl($s3path, now()->addMinutes(15));
        // Download to temp and call HF API with file contents
        $fileContents = file_get_contents($temp);
        $res = $this->client->post('/openai/whisper-large', [
            'body' => $fileContents,
            'headers' => ['Content-Type' => 'application/octet-stream']
        ]);
        $json = json_decode($res->getBody()->getContents(), true);
        return $json['text'] ?? ($json[0]['text'] ?? null) ;
    }

    public function analyzeTextEmotion(string $text){
        $model = '/j-hartmann/emotion-english-distilroberta-base'; // example
        $res = $this->client->post($model, [
            'json' => ['inputs' => $text]
        ]);
        $json = json_decode($res->getBody()->getContents(), true);
        // HF sometimes returns array of {label,score}
        if(is_array($json) && isset($json[0]['label'])){
            return ['label'=>$json[0]['label'],'score'=>$json[0]['score'],'model'=>$model];
        }
        return ['label'=>null,'score'=>null,'model'=>$model,'raw'=>$json];
    }

    public function summarizeText(string $text){
        if(empty($text)) return ['summary'=>null];
        $model = '/facebook/bart-large-cnn';
        $res = $this->client->post($model, [
            'json' => ['inputs' => $text]
        ]);
        $json = json_decode($res->getBody()->getContents(), true);
        return ['summary' => is_string($json) ? $json : ($json[0]['summary_text'] ?? null), 'model' => $model];
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