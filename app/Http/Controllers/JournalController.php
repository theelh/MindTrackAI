<?php
namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\JournalEntry;
use App\Jobs\ProcessEmotionJob;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class JournalController extends Controller
{
    public function index()
    {
        $journals = JournalEntry::with('latestEmotion')->where('user_id', auth()->id())->get();

        return Inertia::render('journals', [
            'journals' => $journals,
        ]);
    }

    public function store(Request $request)
{
    $request->validate([
        'text_content' => 'nullable|string',
        'media' => 'nullable|file|max:10240', // 10MB
        'media_type' => 'required|in:text,audio,image'
    ]);

    $user = auth()->user();
    
    if (!$user->subscribed('default')) {
        $entriesCount = $user->journalEntries()->count(); // relation: hasMany(JournalEntry::class)

        if ($entriesCount >= 3) {
            return redirect()->route('plans')->with('error', '🚫 Vous avez atteint la limite du plan gratuit (3 journaux). Passez au plan Pro pour continuer.');
        }
    }

    $path = null;

    if ($request->hasFile('media')) {
        $path = $request->file('media')->store('uploads', 'public');
        $path = asset("storage/$path");
    }

    $entry = JournalEntry::create([
        'user_id' => $user->id,
        'text_content' => $request->input('text_content'),
        'media_path' => $path,
        'media_type' => $request->input('media_type'),
        'metadata' => ['agent' => $request->header('User-Agent')],
    ]);

    ProcessEmotionJob::dispatch($entry->id)->onQueue('analysis');

    return redirect()->route('journals')->with('success', '📝 Journal entry saved!');
}


    public function show($id){
        $entry = JournalEntry::with('analysis')->findOrFail($id);
        $this->authorize('view',$entry);
        return response()->json($entry);
    }

    public function destroy($id)
{
    $entry = JournalEntry::findOrFail($id);    

    // Delete the media file if exists
    if ($entry->media_path) {
        // remove "storage/" prefix to get relative path
        $relativePath = str_replace(asset('storage/') . '/', '', $entry->media_path);
        \Storage::disk('public')->delete($relativePath);
    }

    $entry->delete();

    return redirect()->route('journals')->with('success', 'Journal entry deleted successfully!');
}
}