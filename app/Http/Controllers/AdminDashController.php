<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Quote;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class AdminDashController extends Controller
{
    public function index()
    {
        // 🔐 Ensure only admin
        $admin = auth()->user();

        // 👤 USERS
        $users = User::latest()
            ->select('id', 'name', 'email', 'role', 'plan', 'created_at')
            ->paginate(10);

        $totalUsers = User::count();
        $proUsers = User::where('plan', 'pro')->count();
        $freeUsers = User::where('plan', 'free')->count();
        $trialUsers = User::whereNotNull('trial_ends_at')->count();

        // 📊 ANALYTICS
        $newUsersThisMonth = User::whereMonth('created_at', now()->month)->count();

        // 🧠 CONTENT (example)
        $quotes = Quote::latest()->take(5)->get();

        // 💳 PAYMENTS (Stripe via Cashier)
        $monthlyRevenue = User::where('plan', 'pro')
            ->whereNotNull('stripe_id')
            ->count() * 9.99;
        $quotes = Quote::latest()->take(10)->get();

        return Inertia::render('admin/dashboard', [
            'admin' => $admin->only('id', 'name', 'role'),

            // USERS
            'users' => $users,
            'stats' => [
                'totalUsers' => $totalUsers,
                'proUsers' => $proUsers,
                'freeUsers' => $freeUsers,
                'trialUsers' => $trialUsers,
                'newUsersThisMonth' => $newUsersThisMonth,
            ],

            // PAYMENTS
            'payments' => [
                'monthlyRevenue' => $monthlyRevenue,
            ],

            // CONTENT
            'quotes' => $quotes,
        ]);  
    }

    public function updateRole(Request $request, User $user)
{
    $request->validate([
        'role' => 'required|in:admin,user',
    ]);

    // 🚫 Prevent admin from removing their own admin role
    if ($user->id === auth()->id() && $request->role !== 'admin') {
        return back()->with('error', 'You cannot remove your own admin role.');
    }

    // 🚫 No change
    if ($user->role === $request->role) {
        return back()->with('success', 'User already has this role.');
    }

    $user->update([
        'role' => $request->role,
    ]);

    return back()->with('success', 'User role updated successfully.');
}


public function updatePlan(Request $request, User $user)
{
    $request->validate([
        'plan' => 'required|in:free,pro',
    ]);

    $newPlan = $request->plan;
    $currentPlan = $user->plan;

    // No change
    if ($newPlan === $currentPlan) {
        return back()->with('info', 'User is already on this plan.');
    }

    // Free -> Pro
    if ($currentPlan === 'free' && $newPlan === 'pro') {

        // Check for attached payment method
        $paymentMethod = $user->defaultPaymentMethod()?->id;
        if (!$paymentMethod) {
            return back()->with('error', 'User has no payment method attached. Cannot upgrade to Pro.');
        }

        try {
            if ($user->subscribed('default')) {
                $user->subscription('default')->resume();
            } else {
                $user->newSubscription('default', config('services.stripe.pro_price_id'))
                    ->create($paymentMethod);
            }

            $user->update([
                'plan' => 'pro',
                'trial_ends_at' => null,
            ]);

            return back()->with('success', 'User upgraded to Pro successfully.');

        } catch (\Exception $e) {
            // Catch Stripe errors
            return back()->with('error', 'Stripe error: ' . $e->getMessage());
        }
    }

    // Pro -> Free
    if ($currentPlan === 'pro' && $newPlan === 'free') {
        if ($user->subscribed('default')) {
            $user->subscription('default')->cancel();
        }

        $user->update([
            'plan' => 'free',
            'trial_ends_at' => null,
        ]);

        return back()->with('success', 'User downgraded to Free successfully.');
    }

    return back()->with('error', 'Invalid plan transition.');
}


public function destroy(User $user)
{
    $user->delete();

    return back()->with('success', 'User deleted.');
}

}
