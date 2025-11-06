<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Cashier\Exceptions\IncompletePayment;

class SubscriptionController extends Controller
{
    public function index()
    {
        return inertia('Billing/Plans', [
            'plans' => [
                ['id' => 'price_free', 'name' => 'Free Plan', 'price' => 0, 'limit' => 3],
                ['id' => 'price_1SQXefPlmXtgBRwN9TF9gwnc', 'name' => 'Pro Plan', 'price' => 4.99, 'limit' => 'Unlimited'],
            ],
        ]);
    }

    public function checkout(Request $request)
    {
        $user = Auth::user();
        $planId = $request->input('plan');

        if ($planId === 'price_free') {
            $user->update(['plan' => 'free']);
            return back()->with('success', '✅ You are already using the free plan.');
        }

        try {
            return $user->newSubscription('default', $planId)
                ->checkout([
                    'success_url' => route('subscription.success'),
                    'cancel_url' => route('subscription.cancel'),
                ]);
        } catch (IncompletePayment $exception) {
            return redirect()->route('cashier.payment', [$exception->payment->id]);
        }
    }

    public function success()
    {
        $user = Auth::user();
        $user->update(['plan' => 'pro']);
        return inertia('Billing/Success');
    }

    public function cancel()
    {
        return inertia('Billing/Cancel');
    }
}
