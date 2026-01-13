<?php

namespace App\Exports;

use App\Models\Member;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class MembersExport implements FromCollection, ShouldAutoSize, WithColumnFormatting, WithEvents, WithHeadings, WithMapping, WithStyles
{
    public function collection()
    {
        return Member::all();
    }

    public function headings(): array
    {
        return [
            'ID',
            'Full Name',
            'Whatsapp Number',
            'Batch Year',
            'Department',
            'Gender',
            'Status',
            'Created At',
        ];
    }

    public function map($member): array
    {
        return [
            $member->id,
            $member->full_name,
            $member->whatsapp_number,
            $member->batch_year,
            $member->department,
            strtoupper($member->gender),
            ucfirst($member->status),
            $member->created_at?->format('Y-m-d'),
        ];
    }

    /**
     * Styling header
     */
    public function styles(Worksheet $sheet)
    {
        return [
            1 => [
                'font' => [
                    'bold' => true,
                    'color' => ['rgb' => 'FFFFFF'],
                ],
                'fill' => [
                    'fillType' => 'solid',
                    'startColor' => ['rgb' => '2563EB'], // blue-600 vibes
                ],
                'alignment' => [
                    'horizontal' => 'center',
                    'vertical' => 'center',
                ],
            ],
        ];
    }

    /**
     * Format kolom tertentu
     */
    public function columnFormats(): array
    {
        return [
            'C' => NumberFormat::FORMAT_TEXT,          // Whatsapp
            'D' => NumberFormat::FORMAT_NUMBER,        // Batch year
            'H' => NumberFormat::FORMAT_DATE_YYYYMMDD, // Created at
        ];
    }

    /**
     * Event tambahan (freeze, border)
     */
    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $sheet = $event->sheet->getDelegate();
                $lastRow = $sheet->getHighestRow();
                $lastColumn = $sheet->getHighestColumn();

                // Freeze header
                $sheet->freezePane('A2');

                // Border semua tabel
                $sheet->getStyle("A1:{$lastColumn}{$lastRow}")
                    ->getBorders()
                    ->getAllBorders()
                    ->setBorderStyle('thin');

                // Align ID & Batch Year ke tengah
                $sheet->getStyle("A2:A{$lastRow}")
                    ->getAlignment()
                    ->setHorizontal('center');

                $sheet->getStyle("D2:D{$lastRow}")
                    ->getAlignment()
                    ->setHorizontal('center');
            },
        ];
    }
}
