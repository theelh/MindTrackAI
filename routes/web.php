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
use \App\Http\Controllers\ContactController;
use \App\Http\Controllers\AdminDashController;
use \App\Http\Controllers\JournalEntryController;
use App\Enums\UserRole;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\AdminJournalController;
use App\Http\Controllers\AdminSettingsController;
use App\Http\Controllers\AdminAnalyticsController;
use App\Models\Setting;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');


Route::middleware(['auth', 'verified','role:user'])->group(function () {
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
    Route::post('/journalsC', [JournalController::class, 'store'])->name('journals.store');
    Route::get('/journals/{id}', [JournalController::class, 'show'])->name('journals.show');
    Route::delete('/journals/{id}', [JournalController::class, 'destroy'])->name('journals.destroy');
    // routes/api.php ou routes/web.php (avec API)
    Route::get('/quotes', [QuoteController::class, 'index'])->name('quotes.index');
    Route::post('/quotes/generate', [QuoteController::class, 'generate'])->name('quotes.generate');

    //Contact
    Route::get('/contact', [ContactController::class, 'index'])->name('contact.page');
    Route::post('/contact/send', [ContactController::class, 'send'])->name('contact.send');
});

Route::middleware(['auth', 'verified','role:admin'])->group(function () {
    Route::get('adminDash', [AdminDashController::class, 'index'])->name('adminDashboard');

    Route::get('/admin/users', [AdminUserController::class, 'index']);
    Route::post('/admin/users/{user}/role', [AdminUserController::class, 'updateRole']);
    Route::post('/admin/users/{user}/plan', [AdminUserController::class, 'updatePlan']);
    Route::delete('/admin/users/{user}', [AdminUserController::class, 'destroy']);

    Route::get('/admin/journals', [AdminJournalController::class, 'index']);
    Route::delete('/admin/journals/{journal}', [AdminJournalController::class, 'destroy']);

    Route::get('/settings', [AdminSettingsController::class, 'index']);
    Route::post('/admin/settings', [AdminSettingsController::class, 'update']);
    
    Route::post('/admin/users/{user}/role', [AdminDashController::class, 'updateRole'])
        ->name('users.role');

    Route::post('/admin/users/{user}/plan', [AdminDashController::class, 'updatePlan'])
        ->name('users.plan');

    Route::delete('/admin/users/{user}/delete', [AdminDashController::class, 'destroy'])
        ->name('users.destroy');

    // User can only see their own, admin can see all
    Route::get('/admin/journals', function(){
        $journals = JournalEntry::with(['user', 'latestEmotion'])
            ->latest()
            ->get();

            //dd($journals);
        return Inertia::render('admin/journals', [
            'journals' => $journals,
        ]);
    })->name('journals.index');

    // About page admin
    Route::get('/admin/about', function () {
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
    })->name('admin.about');

    // Create new journal
    Route::post('/admin/journales', [JournalEntryController::class, 'store'])->name('journals.store');

    // Delete journal
    Route::delete('/admin/journals/{journal}', [JournalEntryController::class, 'destroy'])->name('journals.destroy');

    //Paymen route
    Route::get('/admin/plans', [SubscriptionController::class, 'index'])->name('subscription.plans');
    Route::post('/checkout', [SubscriptionController::class, 'checkout'])->name('subscription.checkout');
    Route::get('/subscription/success', [SubscriptionController::class, 'success'])->name('subscription.success');
    Route::get('/subscription/cancel', [SubscriptionController::class, 'cancel'])->name('subscription.cancel');
});
require __DIR__.'/settings.php';
