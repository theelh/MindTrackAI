<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\JournalEntry;

class EmotionAnalysis extends Model {
    use HasFactory;
    protected $fillable = ['journal_entry_id','emotion_label','confidence','summary_text','raw_result','model_used'];
    protected $casts = ['raw_result' => 'array'];

    public function journalEntry(){
        return $this->belongsTo(JournalEntry::class);
    }
}
