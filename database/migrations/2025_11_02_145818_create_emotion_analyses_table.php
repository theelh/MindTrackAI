<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(){
        Schema::create('emotion_analyses', function (Blueprint $table){
            $table->id();
            $table->foreignId('journal_entry_id')->constrained('journal_entries')->onDelete('cascade');
            $table->string('emotion_label')->nullable();
            $table->float('confidence')->nullable();
            $table->text('summary_text')->nullable();
            $table->json('raw_result')->nullable();
            $table->string('model_used')->nullable();
            $table->timestamps();
        });
    }
    public function down(){
        Schema::dropIfExists('emotion_analyses');
    }
};
