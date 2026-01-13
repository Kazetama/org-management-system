import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { type Member, type Paginated } from '@/types';

type Props = {
    members: Paginated<Member>;
    filters: {
        search?: string;
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Members Management', href: '/members' },
];

export default function Index({ members, filters }: Props) {
    const { data, setData } = useForm({
        search: filters.search || '',
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();

        router.get('/members', data, {
            preserveState: true,
            replace: true,
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this member?')) {
            router.delete(`/members/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Members" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <h1 className="text-xl font-semibold">
                        Member Management
                    </h1>

                    <Link
                        href="/members/create"
                        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                    >
                        Add Member
                    </Link>
                </div>

                {/* Search */}
                <form
                    onSubmit={handleSearch}
                    className="flex max-w-sm gap-2"
                >
                    <input
                        type="text"
                        value={data.search}
                        onChange={(e) =>
                            setData('search', e.target.value)
                        }
                        placeholder="Search name, department, batch..."
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                    <button
                        type="submit"
                        className="rounded-md bg-muted px-4 text-sm hover:bg-muted/80"
                    >
                        Search
                    </button>
                </form>

                {/* Table */}
                <div className="relative flex-1 overflow-x-auto rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <table className="w-full border-collapse text-sm">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="px-4 py-3 text-left">Name</th>
                                <th className="px-4 py-3 text-left">Batch</th>
                                <th className="px-4 py-3 text-left">Department</th>
                                <th className="px-4 py-3 text-left">Gender</th>
                                <th className="px-4 py-3 text-left">Status</th>
                                <th className="px-4 py-3 text-right">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {members.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-4 py-6 text-center text-muted-foreground"
                                    >
                                        No members found.
                                    </td>
                                </tr>
                            )}

                            {members.data.map((member) => (
                                <tr
                                    key={member.id}
                                    className="border-t"
                                >
                                    <td className="px-4 py-3 font-medium">
                                        {member.full_name}
                                    </td>
                                    <td className="px-4 py-3">
                                        {member.batch_year}
                                    </td>
                                    <td className="px-4 py-3">
                                        {member.department}
                                    </td>
                                    <td className="px-4 py-3">
                                        {member.gender === 'M'
                                            ? 'Male'
                                            : 'Female'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="rounded-full bg-muted px-2 py-1 text-xs">
                                            {member.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link
                                                href={`/members/${member.id}/edit`}
                                                className="rounded-md px-3 py-1 text-xs hover:bg-muted"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() =>
                                                    handleDelete(member.id)
                                                }
                                                className="rounded-md px-3 py-1 text-xs text-red-600 hover:bg-red-50"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex flex-wrap gap-1">
                    {members.links.map((link, i) => (
                        <button
                            key={i}
                            disabled={!link.url}
                            onClick={() =>
                                link.url && router.visit(link.url)
                            }
                            className={`rounded-md px-3 py-1 text-sm ${
                                link.active
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted hover:bg-muted/80'
                            }`}
                            dangerouslySetInnerHTML={{
                                __html: link.label,
                            }}
                        />
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
