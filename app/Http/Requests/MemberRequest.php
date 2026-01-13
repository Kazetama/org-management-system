<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MemberRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // or role-based later
    }

    public function rules(): array
    {
        return [
            'full_name' => 'sometimes|string|max:255',
            'batch_year' => 'sometimes|integer',
            'whatsapp_number' => 'sometimes|string',
            'status' => 'sometimes|in:active,inactive,trial',
            'gender' => 'sometimes|in:M,F',
            'department' => 'sometimes|string|max:255',
        ];
    }
}
