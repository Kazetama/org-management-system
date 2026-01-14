<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EventRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $isUpdate = in_array($this->method(), ['PUT', 'PATCH']);

        return [
            'title' => [$isUpdate ? 'sometimes' : 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'event_date' => [$isUpdate ? 'sometimes' : 'required', 'date'],
            'location' => ['nullable', 'string'],
            'max_participants' => [$isUpdate ? 'sometimes' : 'required', 'integer', 'min:1'],
            'image' => ['sometimes', 'nullable', 'image', 'max:2048'],
            'status' => [$isUpdate ? 'sometimes' : 'nullable', 'in:open,closed'],
        ];
    }

    /**
     * Biar konsisten input angka
     */
    protected function prepareForValidation(): void
    {
        if ($this->has('max_participants')) {
            $this->merge([
                'max_participants' => (int) $this->max_participants,
            ]);
        }
    }
}
