<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Inertia\Inertia;

class EventPageController extends Controller
{
    public function show(Event $event)
    {
        $event->loadCount('registrations');

        return Inertia::render('public/events/show', [
            'event' => [
                'id' => $event->id,
                'title' => $event->title,
                'description' => $event->description,
                'event_date' => $event->event_date->format('d M Y H:i'),
                'location' => $event->location,
                'image' => $event->image,
                'max_participants' => $event->max_participants,
                'registered' => $event->registrations_count,
                'is_full' => $event->registrations_count >= $event->max_participants,
                'status' => $event->status,
            ],
        ]);
    }
}
