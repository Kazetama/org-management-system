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
    Pencil,
    ChevronLeft,
    ChevronRight
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
    { title: 'Members', href: '/members' },
];

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
    const { data, setData } = useForm({
        search: filters.search || '',
    });

    const importForm = useForm<{ file: File | null }>({
        file: null,
    });

    const [showImportModal, setShowImportModal] = useState(false);
    const [importSuccess, setImportSuccess] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    // --- HANDLERS ---
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/members', data, { preserveState: true, replace: true });
    };

    const confirmDelete = () => {
        if (deleteId) {
            router.delete(`/members/${deleteId}`, {
                onFinish: () => setDeleteId(null),
                preserveScroll: true,
            });
        }
    };

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
            <div className="flex flex-col min-h-max bg-muted/10 p-6 md:p-8 gap-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">
                            Members
                        </h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            Manage access, status, and member details.
                        </p>
                    </div>

                    {/* Action Buttons & Search */}
                    <div className="flex items-center gap-2">
                        {/* Search Input Clean */}
                        <form onSubmit={handleSearch} className="relative hidden sm:block">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search..."
                                className="w-[200px] pl-9 h-9 bg-background"
                                value={data.search}
                                onChange={(e) => setData('search', e.target.value)}
                            />
                        </form>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowImportModal(true)}
                            className="hidden sm:flex h-9 bg-background"
                        >
                            <Upload className="mr-2 h-3.5 w-3.5" />
                            Import
                        </Button>
                        <Button variant="outline" size="sm" asChild className="hidden sm:flex h-9 bg-background">
                            <a href="/members/export">
                                <Download className="mr-2 h-3.5 w-3.5" />
                                Export
                            </a>
                        </Button>
                        <Button size="sm" asChild className="h-9 shadow-sm">
                            <Link href="/members/create">
                                <Plus className="mr-2 h-3.5 w-3.5" />
                                Add Member
                            </Link>
                        </Button>
                    </div>
                    <form onSubmit={handleSearch} className="relative sm:hidden">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search members..."
                            className="w-full pl-9 h-9 bg-background"
                            value={data.search}
                            onChange={(e) => setData('search', e.target.value)}
                        />
                    </form>
                </div>

                <div className="flex flex-col rounded-xl border bg-background shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent border-b">
                                <TableHead className="w-[60px] pl-6">Avatar</TableHead>
                                <TableHead>Member Info</TableHead>
                                <TableHead className="hidden md:table-cell">Batch & Dept</TableHead>
                                <TableHead className="hidden lg:table-cell">Gender</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right pr-6">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {members.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center">
                                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                                            <Search className="h-8 w-8 mb-2 opacity-20" />
                                            <p>No members found matching your criteria.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                members.data.map((member) => (
                                    <TableRow key={member.id} className="group hover:bg-muted/30">
                                        <TableCell className="pl-6 py-3">
                                            <Avatar className="h-9 w-9 border">
                                                <AvatarImage
                                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                        member.full_name
                                                    )}&background=6b7280&color=ffffff&size=64`}
                                                    alt={member.full_name}
                                                />
                                                <AvatarFallback className="text-xs bg-muted">{getInitials(member.full_name)}</AvatarFallback>
                                            </Avatar>
                                        </TableCell>

                                        <TableCell className="py-3">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-foreground">{member.full_name}</span>
                                                <span className="text-xs text-muted-foreground md:hidden mt-1">
                                                    {member.batch_year} • {member.department}
                                                </span>
                                            </div>
                                        </TableCell>

                                        <TableCell className="hidden md:table-cell py-3">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium">{member.department}</span>
                                                <span className="text-xs text-muted-foreground">Class of {member.batch_year}</span>
                                            </div>
                                        </TableCell>

                                        <TableCell className="hidden lg:table-cell py-3">
                                            <span className="text-sm text-muted-foreground">
                                                {member.gender === 'M' ? 'Male' : 'Female'}
                                            </span>
                                        </TableCell>

                                        <TableCell className="py-3">
                                            <Badge
                                                variant="outline"
                                                className={`
                                                    font-normal capitalize pl-2 pr-2.5 py-0.5 rounded-full border-0
                                                    ${member.status === 'active'
                                                        ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20'
                                                        : 'bg-zinc-50 text-zinc-700 ring-1 ring-inset ring-zinc-500/10'}
                                                `}
                                            >
                                                <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${member.status === 'active' ? 'bg-green-600' : 'bg-zinc-400'}`}></span>
                                                {member.status}
                                            </Badge>
                                        </TableCell>

                                        <TableCell className="text-right pr-6 py-3">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-[160px]">
                                                    <DropdownMenuLabel className="font-normal text-xs text-muted-foreground">Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/members/${member.id}/edit`} className="cursor-pointer">
                                                            <Pencil className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                                                            Edit Details
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                                                        onClick={() => setDeleteId(member.id)}
                                                    >
                                                        <Trash2 className="mr-2 h-3.5 w-3.5" />
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

                    {/* --- PAGINATION (Clean Footer) --- */}
                    {members.data.length > 0 && (
                        <div className="flex items-center justify-between border-t px-6 py-4 bg-muted/5 rounded-b-xl">
                            <div className="text-xs text-muted-foreground">
                                Showing <span className="font-medium text-foreground">{members.from}-{members.to}</span> of {members.total}
                            </div>
                            <div className="flex items-center gap-1">
                                {members.links.map((link, i) => {
                                    // Clean up labels
                                    const label = link.label
                                        .replace('&laquo; Previous', '')
                                        .replace('Next &raquo;', '');

                                    const isPrev = link.label.includes('Previous');
                                    const isNext = link.label.includes('Next');

                                    if (!link.url && !link.label.includes('...')) return null;

                                    return (
                                        <Button
                                            key={i}
                                            variant={link.active ? "secondary" : "ghost"}
                                            size="icon"
                                            disabled={!link.url}
                                            onClick={() => link.url && router.visit(link.url)}
                                            className={`
                                                h-8 w-8 rounded-lg text-xs
                                                ${link.active ? 'bg-white shadow-sm ring-1 ring-inset ring-gray-300 text-foreground font-semibold' : 'text-muted-foreground hover:bg-muted'}
                                                ${!link.url ? 'opacity-30' : ''}
                                            `}
                                        >
                                            {isPrev ? <ChevronLeft className="h-4 w-4" /> :
                                                isNext ? <ChevronRight className="h-4 w-4" /> :
                                                    <span dangerouslySetInnerHTML={{ __html: label }} />}
                                        </Button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

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
                        <div className="flex flex-col items-center justify-center py-8 text-green-600">
                            <div className="rounded-full bg-green-50 p-3 mb-3">
                                <FileSpreadsheet className="h-8 w-8 text-green-600" />
                            </div>
                            <p className="text-lg font-semibold">Import Successful!</p>
                        </div>
                    ) : (
                        <form onSubmit={submitImport} className="space-y-4 pt-2">
                            <div className="grid w-full items-center gap-1.5">
                                <div className="relative border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition cursor-pointer group">
                                    <Upload className="h-10 w-10 text-muted-foreground mb-3 group-hover:text-primary transition" />
                                    <p className="text-sm font-medium">Click to browse or drag file</p>
                                    <p className="text-xs text-muted-foreground mt-1">XLSX or CSV (Max 5MB)</p>
                                    <Input
                                        type="file"
                                        accept=".xlsx,.csv"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        onChange={(e) => importForm.setData('file', e.target.files?.[0] ?? null)}
                                        required
                                    />
                                </div>
                                {importForm.data.file && (
                                    <div className="flex items-center justify-between bg-muted/50 p-2 rounded border text-sm mt-2">
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <FileSpreadsheet className="h-4 w-4 flex-shrink-0 text-primary" />
                                            <span className="truncate">{importForm.data.file.name}</span>
                                        </div>
                                        <Button
                                            type="button" variant="ghost" size="sm" className="h-6 w-6 p-0 hover:text-red-600"
                                            onClick={() => importForm.setData('file', null)}
                                        >
                                            &times;
                                        </Button>
                                    </div>
                                )}
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="ghost" onClick={() => setShowImportModal(false)}>Cancel</Button>
                                <Button type="submit" disabled={importForm.processing || !importForm.data.file}>
                                    {importForm.processing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Import File'}
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
                            This will permanently delete the member and remove their data.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
