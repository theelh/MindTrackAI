<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Cashier\Subscription as CashierSubscription;

use App\Models\User;

class Subscription extends CashierSubscription
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'stripe_id',
        'stripe_status',
        'stripe_price',
        'quantity',
        'trial_ends_at',
        'ends_at',
        'amount',        // custom field
        'plan_name',     // custom field
        'payment_status' // custom field
    ];

    // Relationship: subscription belongs to a user
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Optional: cast dates
    protected $dates = [
        'trial_ends_at',
        'ends_at',
        'created_at',
        'updated_at',
    ];
}