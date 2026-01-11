<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Setting;
use Illuminate\Support\Facades\Log;

class AdminSettingsController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/settings/index', [
            'settings' => [
                'registrationEnabled' => (bool) Setting::get('registrationEnabled'),
                'maintenanceMode' => (bool) Setting::get('maintenanceMode'),
                'freePlanLimit' => (int) Setting::get('freePlanLimit'),
                'proPlanLimit' => (int) Setting::get('proPlanLimit'),
                'aiEnabled' => (bool) Setting::get('aiEnabled'),
                'maxPromptLength' => (int) Setting::get('maxPromptLength'),
            ],
        ]);
    }

    public function update(Request $request)
    {
        Setting::set($request->key, $request->value);

        return back();
    }
}

