<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Services\HuggingFaceService;
use App\Models\JournalEntry;
use App\Models\EmotionAnalysis;
use Inertia\Inertia;

class EmotionAnalysisController extends Controller
{
    protected HuggingFaceService $huggingFace;

    public function __construct(HuggingFaceService $huggingFace)
    {
        $this->huggingFace = $huggingFace;
    }

    // Analyze emotion of a single journal entry
    public function analyze(Request $request)
    {
        $request->validate([
            'journal_entry_id' => 'required|integer|exists:journal_entries,id',
        ]);

        $journal = JournalEntry::findOrFail($request->journal_entry_id);

        try {
            // Call HuggingFaceService
            $result = $this->huggingFace->analyzeTextEmotion($journal->text_content);

            if (!$result || empty($result['label'])) {
                Log::error('❌ Hugging Face returned empty for journal ID ' . $journal->id);
                return response()->json(['error' => 'Failed to analyze emotion.'], 500);
            }

            // Save result in DB
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
            Log::error('❌ Emotion analysis failed: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to analyze emotion.'], 500);
        }
    }
}
