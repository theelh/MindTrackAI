<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Services\HuggingFaceService;
use App\Models\JournalEntry;
use App\Models\EmotionAnalysis;
use App\Http\Controllers\Controller;

class EmotionAnalysisControllerApi extends Controller
{
    protected HuggingFaceService $huggingFace;

    public function __construct(HuggingFaceService $huggingFace)
    {
        $this->huggingFace = $huggingFace;
    }

    public function analyzingEmotion(Request $request)
    {
        $request->validate([
            'journal_entry_id' => 'required|integer|exists:journal_entries,id',
        ]);

        $journal = JournalEntry::findOrFail($request->journal_entry_id);

        try {
            $result = null;

            switch ($journal->media_type) {
                case 'text':
                    $result = $this->huggingFace->analyzeTextEmotion($journal->text_content);
                    break;

                case 'audio':
                    // $audioPath = storage_path('app/public/' . $journal->media_path);
                    $audioPath = $journal->media_path;

                    // if (!file_exists($audioPath)) {
                    //     Log::error('🎤 Audio file not found at: ' . $audioPath);
                    //     return response()->json([
                    //         'error' => 'Audio file not found.',
                    //     ], 404);
                    // }

                    $result = $this->huggingFace->analyzeAudioEmotionApi($audioPath);

                    break;

                default:
                    throw new \Exception('Unsupported media type: ' . $journal->media_type);
            }

            if (!$result || empty($result['label'])) {
                Log::error('❌ Empty emotion result for journal ID ' . $journal->id);
                return response()->json(['error' => 'Failed to analyze emotion.'], 500);
            }

            $emotion = EmotionAnalysis::create([
                'journal_entry_id' => $journal->id,
                'emotion_label' => $result['label'],
                'confidence' => $result['score'],
                'raw_result' => $result,
                'model_used' => $result['model'],
            ]);

            return response()->json([
                'success' => true,
                'data' => [
                    'emotion_label' => $emotion->emotion_label,
                    'confidence' => $emotion->confidence,
                ],
            ]);

        } catch (\Exception $e) {
            Log::error('💥 Emotion analysis failed: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to analyze emotion.'], 500);
        }
    }
}