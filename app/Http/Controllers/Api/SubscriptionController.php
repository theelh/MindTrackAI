<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Cashier\Exceptions\IncompletePayment;
use App\Models\Payment;
use App\Http\Controllers\Controller;
use Stripe\StripeClient;

class SubscriptionController extends Controller
{
    /**
     * 🔹 Get available plans
     */
    public function index()
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated'
            ], 401);
        }

        return response()->json([
            'success' => true,
            'plans' => [
                [
                    'id' => 'price_free',
                    'type' => 'Free Plan',
                    'price' => 0,
                    'limit' => 3
                ],
                [
                    'id' => 'price_1SQXefPlmXtgBRwN9TF9gwnc',
                    'type' => 'Pro Plan',
                    'price' => 4.99,
                    'limit' => 'Unlimited'
                ],
            ],
            'userPlan' => $user->plan,
            'trialEndsAt' => $user->trial_ends_at,
        ], 200);
    }

    /**
     * 🔹 Start checkout
     */
    public function checkout(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated'
            ], 401);
        }

        $request->validate([
            'plan' => 'required|string'
        ]);

        $planId = $request->plan;

        // 🆓 Free plan
        if ($planId === 'price_free') {
            $user->update(['plan' => 'free']);

            return response()->json([
                'success' => true,
                'message' => 'You are now using the free plan.'
            ]);
        }

        try {
            $checkout = $user->newSubscription('default', $planId)
                ->checkout([
                    'success_url' => route('subscription.success'),
                    'cancel_url' => route('subscription.cancel'),
                ]);

            return response()->json([
                'success' => true,
                'checkout_url' => $checkout->url
            ]);

        } catch (IncompletePayment $exception) {
            return response()->json([
                'success' => false,
                'payment_url' => route('cashier.payment', [$exception->payment->id])
            ], 402);
        }
    }

    /**
     * ✅ Payment success callback
     */
    public function success()
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated'
            ], 401);
        }

        $user->refresh();

        $subscription = $user->subscription('default');

        // 🔁 Fallback: fetch from Stripe if missing locally
        if (!$subscription) {
            $stripe = new StripeClient(config('cashier.secret'));

            $remoteSubscriptions = $stripe->subscriptions->all([
                'customer' => $user->stripe_id,
            ]);

            if (!empty($remoteSubscriptions->data)) {
                $remote = $remoteSubscriptions->data[0];

                $user->subscriptions()->updateOrCreate(
                    ['stripe_id' => $remote->id],
                    [
                        'type' => 'default',
                        'stripe_status' => $remote->status,
                        'stripe_price' => $remote->items->data[0]->price->id,
                        'quantity' => 1,
                    ]
                );

                $subscription = $user->subscription('default');
            }
        }

        if ($subscription) {
            $stripeSub = $subscription->asStripeSubscription();
            $item = $stripeSub->items->data[0];

            $amount = $item->price->unit_amount / 100;
            $planName = $item->price->nickname ?? 'Pro Plan';
            $stripeId = $stripeSub->id;

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

        return response()->json([
            'success' => true,
            'message' => 'Subscription activated successfully.',
            'subscription' => $subscription,
        ]);
    }

    /**
     * ❌ Payment canceled
     */
    public function cancel()
    {
        return response()->json([
            'success' => false,
            'message' => 'Payment was canceled.'
        ], 200);
    }
}
