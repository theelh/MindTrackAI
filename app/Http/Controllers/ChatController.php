<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\HuggingFaceService;
use Illuminate\Support\Facades\Log;
use App\Models\ChatMessage;

class ChatController extends Controller
{
    protected HuggingFaceService $hf;

    public function __construct(HuggingFaceService $hf)
    {
        $this->hf = $hf;
    }

    /**
     * Handle chatbot message
     */
    public function sendMessage(Request $request)
{
    Log::info("🤖 Chatbot request received", [
        'user_id' => auth()->id(),
        'message' => $request->message
    ]);

    try {
        $user = auth()->user();

        // Save user message
        ChatMessage::create([
            'user_id' => $user->id,
            'sender' => 'user',
            'message' => $request->message,
        ]);

        // Call HuggingFace service
        $response = $this->hf->chatbotText($request->message);

        Log::info("🤖 Chatbot HF response", $response);

        // Save assistant message
        ChatMessage::create([
            'user_id' => $user->id,
            'sender' => 'assistant',
            'message' => $response['reply'],
        ]);

        return response()->json([
            'success' => true,
            'reply' => $response['reply'],
        ]);
    } catch (\Throwable $e) {
        Log::error("💥 Chatbot error", [
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);

        return response()->json([
            'success' => false,
            'reply' => "Impossible to contact the assistant."
        ], 500);
    }
}

public function history()
{
    try {
        $user = auth()->user();

        if (!$user) {
            return response()->json([
                'history' => [],
                'error' => 'Not authenticated'
            ], 401);
        }

        $messages = $user->chatMessages()
            ->orderBy('created_at')
            ->get(['sender', 'message', 'created_at']);

        return response()->json([
            'history' => $messages,
        ], 200);

    } catch (\Exception $e) {
        \Log::error("❌ Failed to load chat history: " . $e->getMessage());

        return response()->json([
            'history' => [],
            'error' => 'Server error'
        ], 500);
    }
}


}