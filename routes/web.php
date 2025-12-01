<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\JournalController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\QuoteController;
use App\Http\Controllers\EmotionAnalysisController;
use App\Http\Controllers\AnalyticsController;
use Illuminate\Support\Facades\Log;
use Inertia\Response;
use App\Models\Quote;
use App\Models\User;
use App\Models\JournalEntry;
use App\Models\EmotionAnalysis;
use App\Models\Payment;
use \App\Http\Controllers\ChatController;
use \App\Http\Controllers\FeedController;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {        
        $user = auth()->user();
        $quotes = Quote::latest()->take(10)->get();
        return Inertia::render('dashboard', [
            'quotes' => $quotes,
            'userPlan' => $user->plan,
            'trialEndsAt' => $user->trial_ends_at,
        ]);    
    })->name('dashboard');
    Route::get('services', function () {        
        $user = auth()->user();
        $quotes = Quote::latest()->take(10)->get();
        return Inertia::render('services', [
            'quotes' => $quotes,
            'userPlan' => $user->plan,
            'trialEndsAt' => $user->trial_ends_at,
        ]);    
    })->name('services');
    Route::get('/journals', [JournalController::class, 'index'])->name('journals');
    Route::get('/journal/create', function () {
        return Inertia::render('create');
    })->name('journalCreate');
    //chatmodel
    Route::post('/chatbot/send', [ChatController::class, 'sendMessage'])->name('chatbot.send');
    Route::get('/chatbot/history', [ChatController::class, 'history'])->name('chatbot.history');

    //Paymen route
    Route::get('/plans', [SubscriptionController::class, 'index'])->name('subscription.plans');
    Route::post('/checkout', [SubscriptionController::class, 'checkout'])->name('subscription.checkout');
    Route::get('/subscription/success', [SubscriptionController::class, 'success'])->name('subscription.success');
    Route::get('/subscription/cancel', [SubscriptionController::class, 'cancel'])->name('subscription.cancel');

    Route::get('/about', function () {
        $userCount = User::count();
        $quoteCount = Quote::count();

        // happy users (e.g., journal with emotion = 'happy')
        $positiveEmotions = [
            'happy',
            'joy',
            'happiness',
            'joyful',
            'delighted',
            'cheerful',
            'content',
            'contentment',
            'positive',
            'optimistic',
            'excited',
            'enthusiasm',
            'pleased',
            'satisfaction',
            'grateful',
            'gratitude',
            'peaceful',
            'calm',
            'relaxed',
            'hopeful',
            'motivated',
            'confident',
            'love',
            'affection',
            'proud'
        ];

    $happyUsers = EmotionAnalysis::whereIn('emotion_label', $positiveEmotions)->count();

        // fixed value or from DB
        $capital = Payment::where('payment_status', 'paid')->sum('amount');

        return Inertia::render('about', [
            'userCount'   => $userCount,
            'quoteCount'  => $quoteCount,
            'happyUsers'  => $happyUsers,
            'capital'     => $capital,
        ]);
    })->name('about');

    //Emotion analysis route 
    Route::post('/emotion/analyze', [EmotionAnalysisController::class, 'analyzeEmotion'])->name('emotion.analyze');
    Route::get('/emotion/analytics', [AnalyticsController::class, 'index']);

    //Feed page
    Route::get('/feed', [FeedController::class, 'index'])->name('feed');
    //journal route
    Route::post('/journals', [JournalController::class, 'store'])->name('journals.store');
    Route::get('/journals/{id}', [JournalController::class, 'show'])->name('journals.show');
    Route::delete('/journals/{id}', [JournalController::class, 'destroy'])->name('journals.destroy');
    // routes/api.php ou routes/web.php (avec API)
    Route::get('/quotes', [QuoteController::class, 'index'])->name('quotes.index');
    Route::post('/quotes/generate', [QuoteController::class, 'generate'])->name('quotes.generate');

});

require __DIR__.'/settings.php';
