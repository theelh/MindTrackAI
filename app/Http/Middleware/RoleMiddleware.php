<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Enums\UserRole;

class RoleMiddleware
{

public function handle($request, Closure $next, ...$roles)
{
    $user = $request->user();

    if (! $user) {
        abort(403);
    }

    // ENUM SAFE CHECK
    if (! in_array($user->role->value, $roles)) {
        abort(403);
    }

    return $next($request);
}

}