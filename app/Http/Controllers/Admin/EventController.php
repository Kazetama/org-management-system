<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Event;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\EventRequest;

class EventController extends Controller
{
    public function index()
    {
        return Inertia::render('events/index', [
            'events' => Event::latest()->paginate(10),
        ]);
    }

    public function create()
    {
        return Inertia::render('events/create');
    }

    public function store(EventRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('events', 'public');
        }

        Event::create($data);

        return redirect()->route('events.index')
            ->with('success', 'Event created successfully');
    }

    public function edit(Event $event)
    {
        return Inertia::render('events/edit', [
            'event' => $event,
        ]);
    }

    public function update(EventRequest $request, Event $event)
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            if ($event->image) {
                Storage::disk('public')->delete($event->image);
            }
            $data['image'] = $request->file('image')->store('events', 'public');
        }

        $event->update($data);

        return redirect()->route('events.index')
            ->with('success', 'Event updated');
    }

    public function destroy(Event $event)
    {
        if ($event->image) {
            Storage::disk('public')->delete($event->image);
        }

        $event->delete();

        return back()->with('success', 'Event deleted');
    }
}

