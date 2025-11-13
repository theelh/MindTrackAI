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
    });
    //Paymen route
    Route::get('/plans', [SubscriptionController::class, 'index'])->name('subscription.plans');
    Route::post('/checkout', [SubscriptionController::class, 'checkout'])->name('subscription.checkout');
    Route::get('/subscription/success', [SubscriptionController::class, 'success'])->name('subscription.success');
    Route::get('/subscription/cancel', [SubscriptionController::class, 'cancel'])->name('subscription.cancel');

    //Emotion analysis route 
    Route::post('/emotion/analyze', [EmotionAnalysisController::class, 'analyzeEmotion'])->name('emotion.analyze');
    Route::get('/emotion/analytics', [AnalyticsController::class, 'index']);

    //journal route
    Route::post('/journals', [JournalController::class, 'store'])->name('journals.store');
    Route::get('/journals/{id}', [JournalController::class, 'show'])->name('journals.show');
    Route::delete('/journals/{id}', [JournalController::class, 'destroy'])->name('journals.destroy');
    // routes/api.php ou routes/web.php (avec API)
    Route::get('/quotes', [QuoteController::class, 'index'])->name('quotes.index');
    Route::post('/quotes/generate', [QuoteController::class, 'generate'])->name('quotes.generate');

});

require __DIR__.'/settings.php';
