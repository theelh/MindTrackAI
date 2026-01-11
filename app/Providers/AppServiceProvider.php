<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Laravel\Passport\Passport;
use Illuminate\Support\Facades\Route;
use App\Http\Middleware\RoleMiddleware;
use Carbon\CarbonInterval;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        Passport::ignoreRoutes();
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //Passport::loadKeysFrom(__DIR__.'/../storage/oauth');
        Route::aliasMiddleware('role', \App\Http\Middleware\RoleMiddleware::class);
        Passport::loadKeysFrom(storage_path('oauth'));
        Passport::tokensExpireIn(CarbonInterval::days(3));
    }
}
