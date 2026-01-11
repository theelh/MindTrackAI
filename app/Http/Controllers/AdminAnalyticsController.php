<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;

class AdminAnalyticsController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/analytics/index', [
            'usersPerMonth' => User::selectRaw('COUNT(*) as total, MONTH(created_at) as month')
                ->groupBy('month')->get(),
            'journalsPerDay' => JournalEntry::selectRaw('COUNT(*) as total, DATE(created_at) as day')
                ->groupBy('day')->get(),
        ]);
    }
}

