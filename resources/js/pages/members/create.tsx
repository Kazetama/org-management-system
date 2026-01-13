import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Members Management',
        href: '/members',
    },
    {
        title: 'Create Members',
        href: '#',
    },
];

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        full_name: '',
        batch_year: '',
        whatsapp_number: '',
        status: 'active',
        gender: 'M',
        department: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/members');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Member" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 dark:border-sidebar-border">
                    <h1 className="mb-6 text-lg font-semibold">
                        Create New Member
                    </h1>

                    <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
                        {/* Full Name */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium">
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={data.full_name}
                                onChange={(e) =>
                                    setData('full_name', e.target.value)
                                }
                                className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                            {errors.full_name && (
                                <span className="text-xs text-red-500">
                                    {errors.full_name}
                                </span>
                            )}
                        </div>

                        {/* Batch Year */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium">
                                Batch Year
                            </label>
                            <input
                                type="number"
                                value={data.batch_year}
                                onChange={(e) =>
                                    setData('batch_year', e.target.value)
                                }
                                className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                            />
                            {errors.batch_year && (
                                <span className="text-xs text-red-500">
                                    {errors.batch_year}
                                </span>
                            )}
                        </div>

                        {/* WhatsApp Number */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium">
                                WhatsApp Number
                            </label>
                            <input
                                type="text"
                                value={data.whatsapp_number}
                                onChange={(e) =>
                                    setData('whatsapp_number', e.target.value)
                                }
                                className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                            />
                            {errors.whatsapp_number && (
                                <span className="text-xs text-red-500">
                                    {errors.whatsapp_number}
                                </span>
                            )}
                        </div>

                        {/* Department */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium">
                                Department
                            </label>
                            <input
                                type="text"
                                value={data.department}
                                onChange={(e) =>
                                    setData('department', e.target.value)
                                }
                                className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                            />
                            {errors.department && (
                                <span className="text-xs text-red-500">
                                    {errors.department}
                                </span>
                            )}
                        </div>

                        {/* Gender */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium">
                                Gender
                            </label>
                            <select
                                value={data.gender}
                                onChange={(e) =>
                                    setData('gender', e.target.value)
                                }
                                className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                            >
                                <option value="M">Male</option>
                                <option value="F">Female</option>
                            </select>
                            {errors.gender && (
                                <span className="text-xs text-red-500">
                                    {errors.gender}
                                </span>
                            )}
                        </div>

                        {/* Status */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium">
                                Status
                            </label>
                            <select
                                value={data.status}
                                onChange={(e) =>
                                    setData('status', e.target.value)
                                }
                                className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="trial">Trial</option>
                            </select>
                            {errors.status && (
                                <span className="text-xs text-red-500">
                                    {errors.status}
                                </span>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="col-span-full flex justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={() => router.visit('/members')}
                                className="rounded-md border border-input px-4 py-2 text-sm hover:bg-muted"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                            >
                                {processing ? 'Saving...' : 'Save Member'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
