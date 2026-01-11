<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Services\HuggingFaceService;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Inertia\Response;
use App\Models\Quote;

class QuoteController extends Controller
{
    protected HuggingFaceService $huggingFace;

    public function __construct(HuggingFaceService $huggingFace)
    {
        $this->huggingFace = $huggingFace;
    }
    // 🔹 Affiche la page avec les citations du jour
    public function index()
    {
        $quotes = Quote::latest()->take(7)->get();

        return Inertia::render('Quotes', ['quotes' => $quotes]);
    }

    // 🔹 Génère plusieurs citations depuis Hugging Face
    public function generate(HuggingFaceService $hf)
{
    $model = 'meta-llama/Llama-3.1-8B-Instruct:novita';
    $input = ["Generate a short quote in english"];

    $result = $hf->query($model, $input);

    if (!$result || empty($result)) {
        Log::error('Aucune citation générée depuis Hugging Face à ' . now());
        return back()->with('error', 'Échec de la génération de la citation. Veuillez réessayer.');
    }

    // Hugging Face renvoie souvent un tableau avec "summary_text"
    $quoteText = $result['choices'][0]['message']['content'] ?? null;

    // Sauvegarde dans la DB
    $quote = Quote::create(['text' => $quoteText]);

    Log::info('✅ Quote generated successfully: ' . $quoteText);

    return back()->with('success', 'Quote generated successfully !');
}

}
