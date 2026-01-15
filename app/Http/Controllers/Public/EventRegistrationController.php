<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\EventRegistration;
use DB;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class EventRegistrationController extends Controller
{
    public function store(Request $request, Event $event)
    {
        if ($event->status !== 'open') {
            return back()->with('error', 'Event sudah ditutup.');
        }

        try {
            DB::transaction(function () use ($request, $event) {

                // 🔒 Cek kuota
                if ($event->registrations()->count() >= $event->max_participants) {
                    throw ValidationException::withMessages([
                        'email' => 'Kuota event sudah penuh.',
                    ]);
                }

                // ✅ Validasi ketat
                $validated = $request->validate([
                    'full_name' => [
                        'required',
                        'string',
                        'max:255',
                        'regex:/^[a-zA-Z\s]+$/',
                    ],
                    'school_origin' => 'required|string|max:255',
                    'phone' => [
                        'required',
                        'string',
                        'max:20',
                        'regex:/^[0-9+]+$/',
                    ],
                    'email' => 'required|email|max:255',
                ]);

                // 🧼 Normalisasi nama
                $normalizedName = preg_replace(
                    '/\s+/',
                    ' ',
                    strtolower(trim($validated['full_name']))
                );

                // 🔍 Duplicate check
                $exists = EventRegistration::where('event_id', $event->id)
                    ->where(function ($q) use ($validated, $normalizedName) {
                        $q->where('email', $validated['email'])
                            ->orWhereRaw(
                                'LOWER(TRIM(full_name)) = ?',
                                [$normalizedName]
                            );
                    })
                    ->exists();

                if ($exists) {
                    throw ValidationException::withMessages([
                        'email' => 'Anda sudah terdaftar di event ini.',
                    ]);
                }

                // 💾 Simpan data
                $event->registrations()->create([
                    'full_name' => trim($validated['full_name']),
                    'school_origin' => $validated['school_origin'],
                    'phone' => $validated['phone'],
                    'email' => strtolower($validated['email']),
                ]);
            });

            return back()->with('success', 'Berhasil mendaftar event.');

        } catch (ValidationException $e) {
            return back()
                ->withErrors($e->errors())
                ->withInput();
        }
    }
}
