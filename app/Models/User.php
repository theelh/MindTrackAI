<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Laravel\Passport\HasApiTokens;
use Laravel\Passport\Contracts\OAuthenticatable;
use Laravel\Cashier\Billable;
use App\Models\JournalEntry;
use App\Models\Payment;
use App\Models\EmotionAnalysis;

class User extends Authenticatable implements MustVerifyEmail, OAuthenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, HasApiTokens, Notifiable, TwoFactorAuthenticatable, Billable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'plan', 
        'trial_ends_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }
    public function journalEntries()
{
    return $this->hasMany(JournalEntry::class);
}

public function chatMessages()
{
    return $this->hasMany(ChatMessage::class);
}

public function hasActivePlan()
{
    return $this->plan === 'pro';
}

public function payments()
{
    return $this->hasMany(Payment::class);
}

public function emotionAnalyses()
{
    return $this->hasManyThrough(
        EmotionAnalysis::class,
        JournalEntry::class,
        'user_id',
        'journal_entry_id',
        'id',
        'id' 
    );
}



}
