<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\EmotionAnalysis;
use App\Models\User;

class JournalEntry extends Model {
    use HasFactory;
    protected $fillable = ['user_id','text_content','media_path','media_type','metadata'];
    protected $casts = ['metadata' => 'array'];

    public function analysis(){
        return $this->hasOne(EmotionAnalysis::class);
    }

    public function user(){
        return $this->belongsTo(User::class);
    }
    
    // app/Models/JournalEntry.php

public function emotionAnalyses()
{
    return $this->hasMany(EmotionAnalysis::class);
}

// Optional: latest analysis
public function latestEmotion()
{
    return $this->hasOne(EmotionAnalysis::class)->latestOfMany();
}

}