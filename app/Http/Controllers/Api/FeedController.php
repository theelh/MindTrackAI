<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\EmotionAnalysis;
use App\Http\Controllers\Controller;

class FeedController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated'
            ], 401);
        }

        // Get latest emotion analysis for the user
        $latestAnalysis = EmotionAnalysis::whereHas('journalEntry', function($query) use ($user) {
            $query->where('user_id', $user->id);
        })->latest('created_at')->first();

        $latestMoodLabel  = strtolower($latestAnalysis?->emotion_label ?? 'default');

        // Define word lists
        $happyWords = [
            'happy','joy','happiness','joyful','delighted','cheerful','content',
            'contentment','positive','optimistic','excited','enthusiasm','pleased',
            'satisfaction','grateful','gratitude','peaceful','calm','relaxed',
            'hopeful','motivated','confident','love','affection','proud'
        ];

        $sadWords = ['sad','sadness','unhappy','gloomy','depressed','melancholy','down','lonely','angry','frustrated'];
        $stressedWords = ['stressed','anxious','nervous','tense','overwhelmed','worried','burnout'];

        // Determine latest mood
        if (in_array($latestMoodLabel, $happyWords)) {
            $latestMood = 'happy';
        } elseif (in_array($latestMoodLabel, $sadWords)) {
            $latestMood = 'sad';
        } elseif (in_array($latestMoodLabel, $stressedWords)) {
            $latestMood = 'stressed';
        } else {
            $latestMood = 'Neutral';
        }

        // Prepare suggestions based on mood
        $suggestions = [];

        if ($latestMood === 'sad') {
            $suggestions = [
                ["type"=>"youtube","title"=>"Concentration sound","videoId"=>"jXZAbnn1kTU"],
                ["type"=>"youtube","title"=>"Clear your mind","videoId"=>"9TGlc0Fufgk"],
                ["type"=>"spotify","title"=>"Relaxing your brain","trackId"=>"04JXK1GuqYWZHaRPpdIiv9"]
            ];
        } elseif ($latestMood === 'stressed') {
            $suggestions = [
                ["type"=>"spotify","title"=>"Stress Relief","trackId"=>"6aj0zW0b8pFXKtQ4Svze3u"],
                ["type"=>"spotify","title"=>"Relaxing with noise","trackId"=>"7zTRBQY1gHajCzXVt7SuEG"],
                ["type"=>"youtube","title"=>"Relaxing Sounds","videoId"=>"1ZYbU82GVz4"],
                ["type"=>"spotify","title"=>"Relaxing your brain","trackId"=>"7zTRBQY1gHajCzXVt7SuEG"]
            ];
        } elseif ($latestMood === 'happy') {
            $suggestions = [
                ["type"=>"spotify","title"=>"Happy Vibes","trackId"=>"7fxyd90zOGhAPWJQTaX2Ed"],
                ["type"=>"youtube","title"=>"Feel Good Music","videoId"=>"d-diB65scQU"],
                ["type"=>"spotify","title"=>"Chill Hits","trackId"=>"7fxyd90zOGhAPWJQTaX2Ed"]
            ];
        } else { // Neutral
            $suggestions = [
                ["type"=>"youtube","title"=>"Relaxing Nature","videoId"=>"1ZYbU82GVz4"],
                ["type"=>"spotify","title"=>"Chill Playlist","trackId"=>"60xh2M0EKXpmZkeoh5Snyo"]
            ];
        }

        return response()->json([
            'success' => true,
            'latestMood' => $latestMood,
            'suggestions' => $suggestions
        ]);
    }
}
