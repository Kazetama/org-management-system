<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\Admin\MemberController;
use App\Http\Controllers\Admin\EventController;
use App\Http\Controllers\Public\EventPageController;
use App\Http\Controllers\Public\EventRegistrationController;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::post('/members/import', [MemberController::class, 'import'])
    ->name('members.import');

    Route::get('/members/export', [MemberController::class, 'export'])
        ->name('members.export');

    Route::resource('members', MemberController::class)
        ->except(['show']);

    Route::resource('events', EventController::class);
});


Route::get('/events/{event}', [EventPageController::class, 'show'])
    ->name('public.events.show');

Route::post('/events/{event}/register', [EventRegistrationController::class, 'store'])
    ->name('events.register');

require __DIR__.'/settings.php';
