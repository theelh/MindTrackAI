<?php
namespace App\Jobs;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\JournalEntry;
use App\Services\HuggingFaceService;
use App\Models\EmotionAnalysis;
use Illuminate\Support\Facades\Log;

class ProcessEmotionJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $entryId;

    public function __construct(int $entryId){
        $this->entryId = $entryId;
    }

    public function handle(HuggingFaceService $hf){
        $entry = JournalEntry::find($this->entryId);
        if(!$entry) return;

        $raw = [];
        $summary = null;
        $emotion = null;
        $confidence = null;
        $model = null;

        // Decide pipeline based on media_type
        if($entry->media_type === 'audio' && $entry->media_path){
            // 1) Speech-to-text
            $transcript = $hf->speechToText($entry->media_path);
            $raw['transcript'] = $transcript;
            $textToAnalyze = $transcript;
        } else {
            \Log ::info('Processing text/media for entry ID: '.$entry->id);            
            $textToAnalyze = $entry->text_content ?? '';
        }

        // 2) Text sentiment/emotion
        if(!empty($textToAnalyze)){
            $res = $hf->analyzeTextEmotion($textToAnalyze);
            $raw['text_emotion'] = $res;
            $emotion = $res['label'] ?? null;
            $confidence = $res['score'] ?? null;
            $model = $res['model'] ?? null;
        }

        // 3) Summarize
        $sum = $hf->summarizeText($textToAnalyze);
        $summary = $sum['summary'] ?? null;
        $raw['summary'] = $sum;

        // Save analysis
        EmotionAnalysis::create([
            'journal_entry_id' => $entry->id,
            'emotion_label' => $emotion,
            'confidence' => $confidence,
            'summary_text' => $summary,
            'raw_result' => $raw,
            'model_used' => $model
        ]);
    }
}