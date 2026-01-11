<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use Inertia\Response;
use Illuminate\Support\Facades\Log;

class AdminUserController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/users/index', [
            'users' => User::latest()->paginate(10),
            'stats' => [
                'total' => User::count(),
                'pro' => User::where('plan','pro')->count(),
                'free' => User::where('plan','free')->count(),
            ],
        ]);
    }

    public function updateRole(Request $request, User $user)
    {
        $request->validate(['role' => 'in:admin,user']);
        $user->update(['role' => $request->role]);
        return back()->with('success', 'Role updated');
    }

    public function updatePlan(Request $request, User $user)
    {
        $request->validate(['plan' => 'in:free,pro']);
        $user->update(['plan' => $request->plan]);
        return back()->with('success', 'Plan updated');
    }

    public function destroy(User $user)
    {
        $user->delete();
        return back()->with('success', 'User deleted');
    }
}

