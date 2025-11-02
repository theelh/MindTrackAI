<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\JournalController;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    Route::get('/journals', [JournalController::class, 'index'])->name('journals.index');
    Route::post('/api/journals', [JournalController::class, 'store']);
    Route::get('/api/journals/{id}', [JournalController::class, 'show']);
});

require __DIR__.'/settings.php';
