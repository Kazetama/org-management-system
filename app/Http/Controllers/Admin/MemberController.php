<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\MemberRequest;
use Illuminate\Http\Request;
use App\Models\Member;
use Inertia\Inertia;

class MemberController extends Controller
{
    public function index(Request $request)
    {
        $members = Member::query()
            ->when($request->search, function ($query, $search) {
                $query->where('full_name', 'like', "%{$search}%")
                    ->orWhere('department', 'like', "%{$search}%")
                    ->orWhere('batch_year', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('members/index', [
            'members' => $members,
            'filters' => $request->only('search'),
        ]);
    }

    public function create()
    {
        return Inertia::render('members/create');
    }

    public function store(MemberRequest $request)
    {
        Member::create($request->validated());

        return redirect()
            ->route('members.index')
            ->with('success', 'Member created successfully');
    }

    public function edit(Member $member)
    {
        return Inertia::render('members/edit', [
            'member' => $member,
        ]);
    }

    public function update(MemberRequest $request, Member $member)
    {
        $member->update($request->validated());

        return redirect()
            ->route('members.index')
            ->with('success', 'Member updated successfully');
    }

    public function destroy(Member $member)
    {
        $member->delete();

        return back()->with('success', 'Member deleted');
    }
}
