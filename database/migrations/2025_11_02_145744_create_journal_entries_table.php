<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(){
        Schema::create('journal_entries', function (Blueprint $table){
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->text('text_content')->nullable();
            $table->string('media_path')->nullable();
            $table->enum('media_type',['text','audio','image'])->default('text');
            $table->json('metadata')->nullable();
            $table->timestamps();
        });
    }
    public function down(){
        Schema::dropIfExists('journal_entries');
    }
};
