<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Cashier\Exceptions\IncompletePayment;
use App\Models\Payment;
use Inertia\Inertia;

class SubscriptionController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        return inertia('Billing/Plans', [
            'plans' => [
                ['id' => 'price_free', 'type' => 'Free Plan', 'price' => 0, 'limit' => 3],
                ['id' => 'price_1SQXefPlmXtgBRwN9TF9gwnc', 'type' => 'Pro Plan', 'price' => 4.99, 'limit' => 'Unlimited'],
            ],
            'userPlan' => $user->plan,
            'trialEndsAt' => $user->trial_ends_at,
        ]);
    }

    public function checkout(Request $request)
    {
        $user = Auth::user();
        $planId = $request->input('plan');

        if ($planId === 'price_free') {
            $user->update(['plan' => 'free']);
            return back()->with('success', 'You are using the free plan.');
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

    // Refresh local model
    $user->refresh();

    // Try to fetch the subscription normally
    $subscription = $user->subscription('default');

    // If Cashier hasn’t stored it yet, load from Stripe manually
    if (!$subscription) {
        $stripe = new \Stripe\StripeClient(config('cashier.secret'));

        $remoteSubscriptions = $stripe->subscriptions->all([
            'customer' => $user->stripe_id,
        ]);

        if (count($remoteSubscriptions->data) > 0) {

            $remote = $remoteSubscriptions->data[0];

            // Store subscription locally in Laravel Cashier tables
            $user->subscriptions()->updateOrCreate(
                ['stripe_id' => $remote->id],
                [
                    'type' => 'default',
                    'stripe_status' => $remote->status,
                    'stripe_price' => $remote->items->data[0]->price->id,
                    'quantity' => 1,
                ]
            );

            // Retrieve the newly stored subscription
            $subscription = $user->subscription('default');
        }
    }

    // Now subscription is guaranteed to exist
    if ($subscription) {
        $stripeSub = $subscription->asStripeSubscription();
        $item = $stripeSub->items->data[0];

        $amount = $item->price->unit_amount / 100;
        $planName = $item->price->nickname ?? 'Pro Plan';
        $stripeId = $stripeSub->id;

        // Prevent duplicates
        if (!Payment::where('stripe_id', $stripeId)->exists()) {
            Payment::create([
                'user_id' => $user->id,
                'plan_name' => $planName,
                'amount' => $amount,
                'payment_status' => 'paid',
                'stripe_id' => $stripeId,
            ]);
        }

        $user->update(['plan' => 'pro']);
    }

    return Inertia::render('Billing/Success', [
        'subscription' => $subscription,
    ]);
}


    public function cancel()
    {
        return inertia('Billing/Cancel');
    }
}