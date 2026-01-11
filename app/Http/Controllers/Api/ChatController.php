<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Services\HuggingFaceService;
use Illuminate\Support\Facades\Log;
use App\Models\ChatMessage;
use App\Http\Controllers\Controller;

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

        if (!$user) {
            return response()->json([
                'success' => false,
                'reply' => 'Unauthenticated'
            ], 401);
        }

        ChatMessage::create([
            'user_id' => $user->id,
            'sender' => 'user',
            'message' => $request->message,
        ]);

        $response = $this->hf->chatbotText($request->message);

        Log::info("🤖 HF raw response", ['response' => $response]);

        $reply = $response['reply']
            ?? $response['choices'][0]['message']['content']
            ?? null;

        if (!$reply) {
            throw new \Exception('No reply returned from assistant');
        }

        ChatMessage::create([
            'user_id' => $user->id,
            'sender' => 'assistant',
            'message' => $reply,
        ]);

        return response()->json([
            'success' => true,
            'reply' => $reply,
        ]);

    } catch (\Throwable $e) {
        Log::error("💥 Chatbot error", [
            'error' => $e->getMessage(),
        ]);

        return response()->json([
            'success' => false,
            'reply' => 'Impossible to contact the assistant.'
        ], 500);
    }
}
    /**
     * Get chat history
     */

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