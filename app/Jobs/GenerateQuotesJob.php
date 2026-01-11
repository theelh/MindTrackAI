<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Services\HuggingFaceService;
use Illuminate\Support\Facades\Storage;

class GenerateQuotesJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle(HuggingFaceService $hf)
    {
        $quotes = [];

        for ($i = 0; $i < 5; $i++) {
            $quote = $hf->generateQuote();
            if ($quote) {
                $quotes[] = trim($quote);
            }
        }

        Storage::disk('local')->put('quotes.json', json_encode([
            'date' => now()->toDateString(),
            'quotes' => $quotes,
        ], JSON_PRETTY_PRINT));
    }
}
