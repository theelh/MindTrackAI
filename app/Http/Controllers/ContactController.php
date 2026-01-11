<?php

namespace App\Http\Controllers;

use App\Mail\ContactFormMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function send(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:150',
            'email' => 'required|email',
            'message' => 'required|string|max:2000',
        ]);

        Mail::to('theelhelh@gmail.com')->send(new ContactFormMail($data));

        return response()->json(['success' => true, 'message' => 'Thank you! Your message has been sent successfully. We’ll get back to you soon.']);
    }

    public function index()
    {
        return inertia('contact'); // ContactPage.tsx
    }

}