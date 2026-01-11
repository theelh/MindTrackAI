<?php

namespace App\Http\Responses;

use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{
    public function toResponse($request)
    {
        $user = $request->user();
        
        // dd($user->role);

        return redirect()->intended(
            $user->role->value === 'admin'
                ? '/adminDash'
                : '/dashboard'
        );
    }
}