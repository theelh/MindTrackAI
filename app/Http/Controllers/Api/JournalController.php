<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\JournalEntry;
use App\Jobs\ProcessEmotionJob;
use Illuminate\Support\Facades\Storage;

class JournalController extends Controller
{
    /**
     * Store a new journal entry
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'text_content' => 'nullable|string',
            'media' => 'nullable|file|max:10240', // 10MB
            'media_type' => 'required|in:text,audio',
        ]);

        $user = $request->user();

        // 🔒 Subscription / limit check
        if (!$user->subscribed('default')) {
            $entriesCount = $user->journalEntries()->count();

            if ($entriesCount >= 3 && $user->plan === 'free') {
                return response()->json([
                    'message' => 'Journal limit reached. Upgrade to pro plan.'
                ], 403);
            }
        }

        // 📎 Media upload
        $path = null;
        if ($request->hasFile('media')) {
            $path = $request->file('media')->store('uploads', 'public');
            $path = asset("storage/$path");
        }

        // 📝 Create entry
        $entry = JournalEntry::create([
            'user_id' => $user->id,
            'text_content' => $validated['text_content'] ?? null,
            'media_path' => $path,
            'media_type' => $validated['media_type'],
            'metadata' => [
                'agent' => $request->header('User-Agent'),
            ],
        ]);

        // ⚙️ Background job
        ProcessEmotionJob::dispatch($entry->id)->onQueue('analysis');

        return response()->json([
            'message' => 'Journal entry created successfully',
            'data' => $entry,
        ], 201);
    }

    /**
     * Show a journal entry
     */
    public function show($id)
    {
        $entry = JournalEntry::with('analysis')->findOrFail($id);

        // $this->authorize('view', $entry);

        return response()->json([
            'data' => $entry,
        ]);
    }

    /**
     * Delete a journal entry
     */
    public function destroy($id)
    {
        $entry = JournalEntry::findOrFail($id);

        // $this->authorize('delete', $entry);

        // 🗑 Delete media if exists
        if ($entry->media_path) {
            $relativePath = str_replace(asset('storage/') . '/', '', $entry->media_path);
            Storage::disk('public')->delete($relativePath);
        }

        $entry->delete();

        return response()->json([
            'message' => 'Journal entry deleted successfully',
        ]);
    }
}