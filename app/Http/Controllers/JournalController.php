<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\JournalEntry;
use App\Jobs\ProcessEmotionJob;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use App\Models\Journal;

class JournalController extends Controller
{
    public function index()
    {
        $journals = Journal::where('user_id', auth()->id())->get();

        return Inertia::render('Journals/index', [
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

        $user = Auth::user();

        $path = null;
        if($request->hasFile('media')){
            $path = $request->file('media')->store('uploads','s3'); // s3 disk in config
        }

        $entry = JournalEntry::create([
            'user_id' => $user->id,
            'text_content' => $request->input('text_content'),
            'media_path' => $path,
            'media_type' => $request->input('media_type'),
            'metadata' => ['agent' => $request->header('User-Agent')]
        ]);

        // Dispatch async job for analysis
        ProcessEmotionJob::dispatch($entry->id)->onQueue('analysis');

        return response()->json(['status'=>'queued','entry_id'=>$entry->id],201);
    }

    public function show($id){
        $entry = JournalEntry::with('analysis')->findOrFail($id);
        $this->authorize('view',$entry);
        return response()->json($entry);
    }
}