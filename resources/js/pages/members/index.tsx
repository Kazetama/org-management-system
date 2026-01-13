import { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { type BreadcrumbItem, type Member, type Paginated } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// --- ICONS ---
import {
    MoreHorizontal,
    Plus,
    Search,
    FileSpreadsheet,
    Download,
    Upload,
    Loader2,
    Trash2,
    Pencil
} from 'lucide-react';

// --- TYPES ---
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

// Helper: Membuat inisial nama (contoh: "John Doe" -> "JD")
const getInitials = (name: string) => {
    return name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
};

export default function Index({ members, filters }: Props) {
    // --- STATE MANAGEMENT ---

    // Form pencarian
    const { data, setData } = useForm({
        search: filters.search || '',
    });

    // Form Import
    const importForm = useForm<{ file: File | null }>({
        file: null,
    });

    const [showImportModal, setShowImportModal] = useState(false);
    const [importSuccess, setImportSuccess] = useState(false);

    // State untuk konfirmasi hapus
    const [deleteId, setDeleteId] = useState<number | null>(null);

    // --- HANDLERS ---

    // Handle Search (Real-time atau via Enter)
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/members', data, { preserveState: true, replace: true });
    };

    // Handle Delete
    const confirmDelete = () => {
        if (deleteId) {
            router.delete(`/members/${deleteId}`, {
                onFinish: () => setDeleteId(null),
                preserveScroll: true,
            });
        }
    };

    // Handle Import
    const submitImport = (e: React.FormEvent) => {
        e.preventDefault();
        importForm.post('/members/import', {
            forceFormData: true,
            onSuccess: () => {
                setImportSuccess(true);
                setTimeout(() => {
                    setShowImportModal(false);
                    setImportSuccess(false);
                    importForm.reset();
                }, 1500);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Members Management" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-8">

                {/* --- HEADER SECTION --- */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">
                            Members
                        </h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            Manage your organization members, batches, and statuses here.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowImportModal(true)}
                            className="hidden sm:flex"
                        >
                            <Upload className="mr-2 h-4 w-4" />
                            Import
                        </Button>
                        <Button variant="outline" size="sm" asChild className="hidden sm:flex">
                            <a href="/members/export">
                                <Download className="mr-2 h-4 w-4" />
                                Export
                            </a>
                        </Button>
                        <Button size="sm" asChild>
                            <Link href="/members/create">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Member
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* --- MAIN CONTENT (CARD & TABLE) --- */}
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between space-y-0 pb-4">
                        <div>
                            <CardTitle className="text-lg font-medium">All Members</CardTitle>
                            <CardDescription>
                                A list of all registered members in the system.
                            </CardDescription>
                        </div>

                        {/* Search Input */}
                        <form onSubmit={handleSearch} className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search by name, batch..."
                                    className="w-full pl-9 sm:w-[250px] lg:w-[300px]"
                                    value={data.search}
                                    onChange={(e) => setData('search', e.target.value)}
                                />
                            </div>
                        </form>
                    </CardHeader>

                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[80px] hidden sm:table-cell">Avatar</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead className="hidden md:table-cell">Batch</TableHead>
                                        <TableHead className="hidden md:table-cell">Department</TableHead>
                                        <TableHead className="hidden lg:table-cell">Gender</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {members.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="h-32 text-center">
                                                <div className="flex flex-col items-center justify-center text-muted-foreground">
                                                    <Search className="h-8 w-8 mb-2 opacity-50" />
                                                    <p>No members found matching your criteria.</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        members.data.map((member) => (
                                            <TableRow key={member.id}>
                                                {/* Avatar Column */}
                                                <TableCell className="hidden sm:table-cell">
                                                    <Avatar className="h-9 w-9">
                                                        <AvatarImage
                                                            src={`https://ui-avatars.com/api/?name=${member.full_name}&background=random&color=fff`}
                                                            alt={member.full_name}
                                                        />
                                                        <AvatarFallback>{getInitials(member.full_name)}</AvatarFallback>
                                                    </Avatar>
                                                </TableCell>

                                                {/* Name Column */}
                                                <TableCell className="font-medium">
                                                    <div className="flex flex-col">
                                                        <span>{member.full_name}</span>
                                                        {/* Mobile view details */}
                                                        <span className="text-xs text-muted-foreground md:hidden">
                                                            {member.batch_year} • {member.department}
                                                        </span>
                                                    </div>
                                                </TableCell>

                                                <TableCell className="hidden md:table-cell">{member.batch_year}</TableCell>
                                                <TableCell className="hidden md:table-cell">{member.department}</TableCell>

                                                {/* Gender Badge */}
                                                <TableCell className="hidden lg:table-cell">
                                                    <Badge variant="outline" className="font-normal text-muted-foreground">
                                                        {member.gender === 'M' ? 'Male' : 'Female'}
                                                    </Badge>
                                                </TableCell>

                                                {/* Status Badge */}
                                                <TableCell>
                                                    <Badge
                                                        variant={member.status === 'active' ? 'default' : 'secondary'}
                                                        className={member.status === 'active' ? 'bg-green-600 hover:bg-green-700' : ''}
                                                    >
                                                        {member.status}
                                                    </Badge>
                                                </TableCell>

                                                {/* Actions Dropdown */}
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                                <span className="sr-only">Open menu</span>
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/members/${member.id}/edit`} className="cursor-pointer w-full flex items-center">
                                                                    <Pencil className="mr-2 h-4 w-4 text-muted-foreground" />
                                                                    Edit Details
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                                                                onClick={() => setDeleteId(member.id)}
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Delete Member
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* --- PAGINATION --- */}
                        {members.data.length > 0 && (
                            <div className="mt-4 flex flex-col-reverse items-center justify-between gap-4 sm:flex-row">
                                <div className="text-sm text-muted-foreground">
                                    Showing <span className="font-medium">{members.from}</span> to <span className="font-medium">{members.to}</span> of <span className="font-medium">{members.total}</span> results
                                </div>
                                <div className="flex items-center gap-1">
                                    {members.links.map((link, i) => {
                                        const label = link.label
                                            .replace('&laquo; Previous', 'Prev')
                                            .replace('Next &raquo;', 'Next');

                                        if(!link.url && !link.label.includes('...')) return null;

                                        return (
                                            <Button
                                                key={i}
                                                variant={link.active ? "default" : "outline"}
                                                size="sm"
                                                disabled={!link.url}
                                                onClick={() => link.url && router.visit(link.url)}
                                                className={`h-8 w-8 p-0 sm:w-auto sm:px-3 ${!link.url ? 'opacity-50 cursor-default' : ''}`}
                                            >
                                                <span dangerouslySetInnerHTML={{ __html: label }} />
                                            </Button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* --- MODAL: IMPORT FILE --- */}
            <Dialog open={showImportModal} onOpenChange={setShowImportModal}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Import Members</DialogTitle>
                        <DialogDescription>
                            Upload an Excel or CSV file to bulk add members.
                        </DialogDescription>
                    </DialogHeader>

                    {importSuccess ? (
                        <div className="flex flex-col items-center justify-center py-8 text-green-600 animate-in fade-in zoom-in duration-300">
                             <div className="rounded-full bg-green-100 p-3 mb-3">
                                <FileSpreadsheet className="h-8 w-8 text-green-600" />
                             </div>
                            <p className="text-lg font-semibold">Import Successful!</p>
                        </div>
                    ) : (
                        <form onSubmit={submitImport} className="space-y-4 pt-4">
                            <div className="grid w-full items-center gap-1.5">
                                <div className="relative border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center hover:bg-muted/50 hover:border-primary/50 transition cursor-pointer group">
                                    <Upload className="h-10 w-10 text-muted-foreground mb-3 group-hover:text-primary transition" />
                                    <p className="text-sm font-medium">
                                        Click to browse or drag file
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        XLSX or CSV (Max 5MB)
                                    </p>
                                    <Input
                                        type="file"
                                        accept=".xlsx,.csv"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        onChange={(e) => importForm.setData('file', e.target.files?.[0] ?? null)}
                                        required
                                    />
                                </div>

                                {importForm.data.file && (
                                    <div className="flex items-center justify-between bg-muted/50 p-2 rounded border text-sm">
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <FileSpreadsheet className="h-4 w-4 flex-shrink-0 text-primary" />
                                            <span className="truncate">{importForm.data.file.name}</span>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                                            onClick={() => importForm.setData('file', null)}
                                        >
                                            &times;
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* Progress Bar */}
                            {importForm.progress && (
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>Uploading...</span>
                                        <span>{importForm.progress.percentage}%</span>
                                    </div>
                                    <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                                        <div
                                            className="bg-primary h-full transition-all duration-300 ease-out"
                                            style={{ width: `${importForm.progress.percentage}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            <DialogFooter className="gap-2 sm:gap-0">
                                <Button type="button" variant="secondary" onClick={() => setShowImportModal(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={importForm.processing || !importForm.data.file}>
                                    {importForm.processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {importForm.processing ? 'Importing...' : 'Import File'}
                                </Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>

            {/* --- MODAL: DELETE CONFIRMATION --- */}
            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the member
                            and remove their data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-red-600 hover:bg-red-700 focus:ring-red-600 text-white"
                        >
                            Delete Member
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
