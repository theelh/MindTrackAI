<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Models\JournalEntry;
use App\Http\Controllers\Controller;

class AnalyticsController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated'
            ], 401);
        }

        // Get all journal entries with emotion analysis
        $entries = JournalEntry::where('user_id', $user->id)
            ->with('emotionAnalysis')
            ->orderBy('created_at')
            ->get()
            ->map(function ($entry) {
                return [
                    'date' => $entry->created_at->format('Y-m-d'),
                    'entries' => 1,
                    'emotion_label' => $entry->emotionAnalysis->emotion_label ?? null,
                    'confidence' => $entry->emotionAnalysis->confidence ?? null,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $entries,
        ], 200);
    }
}
