<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use \App\Models\EmotionAnalysis;
use \App\Models\User;
use Inertia\Inertia;

class FeedController extends Controller
{
    public function index()
{

    // Récupérer la dernière EmotionAnalysis via les journaux de l’utilisateur
    $user = Auth::user();

    // Récupérer la dernière humeur
    $latestAnalysis = EmotionAnalysis::whereHas('journalEntry', function($query) use ($user) {
        $query->where('user_id', $user->id);
    })->latest('created_at')->first();

    $latestMoodLabel  = strtolower($latestAnalysis?->emotion_label ?? 'default');


    //turn all of the emotions words into a table
    $happyWords = [
    'happy','joy','happiness','joyful','delighted','cheerful','content',
    'contentment','positive','optimistic','excited','enthusiasm','pleased',
    'satisfaction','grateful','gratitude','peaceful','calm','relaxed',
    'hopeful','motivated','confident','love','affection','proud'
    ];

    $sadWords = ['sad','unhappy','gloomy','depressed','melancholy','down','lonely','angry','frustrated'];
    $stressedWords = ['stressed','anxious','nervous','tense','overwhelmed','worried','burnout'];

    //Checking if emotion is in table content
    if (in_array($latestMoodLabel, $happyWords)) {
        $latestMood = 'happy';
    } elseif (in_array($latestMoodLabel, $sadWords)) {
        $latestMood = 'sad';
    } elseif (in_array($latestMoodLabel, $stressedWords)) {
        $latestMood = 'stressed';
    } else {
        $latestMood = 'Neutral';
    }


$suggestions = [];

if ($latestMood === 'sad') {
    $suggestions[] = [
        "type" => "youtube",
        "title" => "Concentration sound",
        "videoId" => "jXZAbnn1kTU", //work
    ];
    $suggestions[] = [
        "type" => "youtube",
        "title" => "Clear your mind",
        "videoId" => "9TGlc0Fufgk", //work
    ];
    $suggestions[] = [
        "type" => "spotify",
        "title" => "Relaxing your brain",
        "trackId" => "04JXK1GuqYWZHaRPpdIiv9", //work
    ];
}

if ($latestMood === 'stressed') {
    $suggestions[] = [
        "type" => "spotify",
        "title" => "Stress Relief",
        "trackId" => "6aj0zW0b8pFXKtQ4Svze3u", //work
    ];
    $suggestions[] = [
        "type" => "spotify",
        "title" => "Relaxing with noise",
        "trackId" => "7zTRBQY1gHajCzXVt7SuEG", //work
    ];
    $suggestions[] = [
        "type" => "youtube",
        "title" => "Relaxing Sounds",
        "videoId" => "1ZYbU82GVz4", //work
    ];
    $suggestions[] = [
        "type" => "spotify",
        "title" => "Relaxing your brain",
        "trackId" => "7zTRBQY1gHajCzXVt7SuEG", //work
    ];
}

if ($latestMood === 'happy') {
    $suggestions[] = [
        "type" => "spotify",
        "title" => "Happy Vibes",
        "trackId" => "7fxyd90zOGhAPWJQTaX2Ed", //work
    ];
    $suggestions[] = [
        "type" => "youtube",
        "title" => "Feel Good Music",
        "videoId" => "d-diB65scQU", //work
    ];
    $suggestions[] = [
        "type" => "spotify",
        "title" => "Chill Hits",
        "trackId" => "7fxyd90zOGhAPWJQTaX2Ed", //work
    ];
}

if ($latestMood === 'Neutral') {
    $suggestions[] = [
        "type" => "youtube",
        "title" => "Relaxing Nature",
        "videoId" => "1ZYbU82GVz4", //work
    ];
    $suggestions[] = [
        "type" => "spotify",
        "title" => "Chill Playlist",
        "trackId" => "60xh2M0EKXpmZkeoh5Snyo", //work
    ];
}


    return inertia("Feed/Index", [
        "suggestions" => $suggestions,
        'latestMood' => $latestMood ?? 'Neutral',
    ]);
}

}
