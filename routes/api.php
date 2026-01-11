<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Laravel\Passport\Passport;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Api\JournalController;
use App\Http\Controllers\Api\EmotionAnalysisControllerApi;
use App\Http\Controllers\Api\QuoteController;
use App\Http\Controllers\Api\ChatController;
use App\Http\Controllers\Api\AnalyticsController;
use App\Http\Controllers\Api\SubscriptionController;
use App\Http\Controllers\Api\FeedController;
use App\Http\Controllers\Api\ContactController;

//Auth Routes
Route::post('/mobile/register',
    function (Request $request) {
        // Passport::ignoreRoutes();
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);
        //Log error
        Log::info('Mobile registration attempt', ['data' => $request->all()]);

        if ($validator->fails()) {
            Log::error('Validation failed during mobile registration', ['errors' => $validator->errors()]);
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $token = $user->createToken('MobileAppToken')->accessToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    });

    Route::post('/mobile/login', function (Request $request) {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $token = $user->createToken('MobileAppToken')->accessToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    });

// === PROTECTED ROUTES (require Passport token) === //
Route::middleware(['auth:api','role:user'])->group(function () {

    Route::get('/user', function (Request $request) {
        return response()->json($request->user());
    });

    // quote routing
    Route::get('/quotes', [QuoteController::class, 'index']);
    Route::post('/quotes/generate', [QuoteController::class, 'generate']);

    //chatmodel
    Route::post('/chatbot/send', [ChatController::class, 'sendMessage']);
    Route::get('/chatbot/history', [ChatController::class, 'history']);

    //Analytics route
    Route::get('/analytics', [AnalyticsController::class, 'index']);

    //Subscription routes
    Route::get('/subscription/plans', [SubscriptionController::class, 'index']);
    Route::post('/subscription/checkout', [SubscriptionController::class, 'checkout']);
    Route::get('/subscription/success', [SubscriptionController::class, 'success'])
        ->name('subscription.success');
    Route::get('/subscription/cancel', [SubscriptionController::class, 'cancel'])
        ->name('subscription.cancel');

    //Feed routes
    Route::get('/feed', [FeedController::class, 'index']);

    //Journal routes
    Route::post('/journals', [JournalController::class, 'store']);
    Route::get('/journals/{id}', [JournalController::class, 'show']);
    Route::delete('/journals/destroy/{id}', [JournalController::class, 'destroy']);

    //Emotion Analysis route
    Route::post('/emo/analyzing', [EmotionAnalysisControllerApi::class, 'analyzingEmotion']);

    //Contact
    Route::post('/contact/send', [ContactController::class, 'send']);

    Route::post('/logout', function (Request $request) {
        $request->user()->token()->revoke();
        return response()->json(['message' => 'Logged out successfully']);
    });
});