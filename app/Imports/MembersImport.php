<?php

namespace App\Imports;

use App\Models\Member;
use Illuminate\Validation\Rule;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\SkipsFailures;
use Maatwebsite\Excel\Concerns\Importable;

class MembersImport implements
    ToModel,
    WithHeadingRow,
    WithValidation,
    SkipsOnFailure
{
    use Importable, SkipsFailures;

    public function model(array $row)
    {
        return new Member([
            'full_name'       => $row['full_name'],
            'whatsapp_number' => $row['whatsapp_number'],
            'batch_year'      => $row['batch_year'],
            'department'      => $row['department'],
            'gender'          => strtoupper($row['gender']),
            'status'          => strtolower($row['status']) ?? 'active',
        ]);
    }

    public function rules(): array
    {
        return [
            '*.full_name' => ['required', 'string', 'max:255'],
            '*.whatsapp_number' => ['required', 'string'],
            '*.batch_year' => ['required', 'integer'],
            '*.department' => ['required', 'string'],
            '*.gender' => ['required', Rule::in(['M', 'F'])],
            '*.status' => ['nullable', Rule::in(['active', 'inactive'])],
        ];
    }
}
