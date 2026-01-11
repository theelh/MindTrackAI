<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\JournalEntry;

class AdminJournalController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/journals/index', [
            'journals' => JournalEntry::with('user','latestEmotion')
                ->latest()
                ->paginate(12),
        ]);
    }

    public function destroy(JournalEntry $journal)
    {
        $journal->delete();
        return back()->with('success', 'Journal deleted');
    }
}

