<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\JournalEntry;

class AnalyticsController extends Controller
{
    public function index()
{
    $user = auth()->user();

    // Get all journal entries for the user with their emotion analysis
    $entries = JournalEntry::where('user_id', $user->id)
        ->with('emotionAnalysis') // eager load emotion analyses
        ->orderBy('created_at')
        ->get()
        ->map(function ($entry) {
            return [
                'date' => $entry->created_at->format('Y-m-d'),
                'entries' => 1, // each journal counts as 1
                'emotion_label' => $entry->emotionAnalysis->emotion_label ?? null,
                'confidence' => $entry->emotionAnalysis->confidence ?? null,                
            ];
        });

    return Inertia::render('AnalyticsPage', [
        'data' => $entries,
    ]);
}

}