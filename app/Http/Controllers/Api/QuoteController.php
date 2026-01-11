<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Services\HuggingFaceService;
use App\Models\Quote;
use App\Http\Controllers\Controller;

class QuoteController extends Controller
{
    protected HuggingFaceService $huggingFace;

    public function __construct(HuggingFaceService $huggingFace)
    {
        $this->huggingFace = $huggingFace;
    }

    // ✅ GET /api/quotes
    public function index()
    {
        $quotes = Quote::latest()->take(7)->get();

        return response()->json([
            'success' => true,
            'data' => $quotes,
        ]);
    }

    // ✅ POST /api/quotes/generate
    public function generate()
    {
        $model = 'meta-llama/Llama-3.1-8B-Instruct:novita';
        $input = ["Generate a short quote in english"];

        $result = $this->huggingFace->query($model, $input);

        if (!$result || empty($result)) {
            Log::error('❌ Quote generation failed at ' . now());

            return response()->json([
                'success' => false,
                'message' => 'Failed to generate quote.',
            ], 500);
        }

        $quoteText = $result['choices'][0]['message']['content'] ?? null;

        if (!$quoteText) {
            return response()->json([
                'success' => false,
                'message' => 'Empty quote returned from model.',
            ], 500);
        }

        $quote = Quote::create([
            'text' => $quoteText,
        ]);

        Log::info('✅ Quote generated successfully', [
            'quote' => $quoteText,
        ]);

        return response()->json([
            'success' => true,
            'data' => $quote,
        ], 201);
    }
}
