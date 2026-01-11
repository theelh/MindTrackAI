<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingsSeeder extends Seeder
{
    public function run(): void
    {
        Setting::set('registrationEnabled', true);
        Setting::set('maintenanceMode', false);
        Setting::set('freePlanLimit', 10);
        Setting::set('proPlanLimit', 100);
        Setting::set('aiEnabled', true);
        Setting::set('maxPromptLength', 2000);
    }
}
