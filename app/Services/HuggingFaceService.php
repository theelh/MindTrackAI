<?php
namespace App\Services;

use GuzzleHttp\Client;
use Illuminate\Support\Facades\Storage;

class HuggingFaceService
{
    protected Client $client;
    protected string $apiKey;
    protected string $baseUrl;

    public function __construct(){
        $this->apiKey = config('services.huggingface.key');
        $this->baseUrl = config('services.huggingface.url') ?? 'https://api-inference.huggingface.co/models';
        $this->client = new Client([
            'base_uri' => $this->baseUrl,
            'headers' => [
                'Authorization' => "Bearer {$this->apiKey}",
                'Accept' => 'application/json'
            ],
            'timeout' => 60
        ]);
    }

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
}