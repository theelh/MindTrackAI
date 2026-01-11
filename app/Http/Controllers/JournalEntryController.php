<?php

namespace App\Http\Controllers;

use App\Models\JournalEntry;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JournalEntryController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        // Admin sees all journals, user sees only their own
        $journals = $user->role === 'admin'
            ? JournalEntry::latest()->with('user')->get()
            : JournalEntry::where('user_id', $user->id)->latest()->get();

        return Inertia::render('admin/journals', [
            'journals' => $journals,
            'userPlan' => $user->plan,
        ]);
    }

    public function store(Request $request)
    {
        $user = auth()->user();

        // Only Pro users can create journals
        if ($user->plan !== 'pro') {
            return back()->with('error', 'You must have a Pro plan to create a journal entry.');
        }

        $request->validate([
            'text_content' => 'required|string',
            'media_path' => 'nullable|file|mimes:jpg,png,mp4,mp3',
        ]);

        $mediaPath = null;
        $mediaType = null;

        if ($request->hasFile('media_path')) {
            $file = $request->file('media_path');
            $mediaPath = $file->store('journals', 'public');
            $mediaType = $file->getClientMimeType();
        }

        $journal = JournalEntry::create([
            'user_id' => $user->id,
            'text_content' => $request->text_content,
            'media_path' => $mediaPath,
            'media_type' => $mediaType,
        ]);

        return back()->with('success', 'Journal entry created successfully.');
    }

    public function destroy(JournalEntry $journal)
    {
        $journal->delete();
        return back()->with('success', 'Journal entry deleted successfully.');
    }
}