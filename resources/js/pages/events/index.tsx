import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, type Paginated, type Event } from '@/types';

// --- SHADCN COMPONENTS ---
import { Button } from '@/components/ui/button';
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
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MoreHorizontal, Pencil, Plus, Trash2, Image as ImageIcon, Users } from 'lucide-react';

type Props = {
    events: Paginated<Event>;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Events', href: '/events' },
];

export default function Index({ events }: Props) {
    // State untuk mengontrol modal hapus
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

    const openDeleteModal = (id: number) => {
        setSelectedEventId(id);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (selectedEventId) {
            router.delete(`/events/${selectedEventId}`, {
                onFinish: () => {
                    setIsDeleteDialogOpen(false);
                    setSelectedEventId(null);
                }
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Events" />

            <div className="flex flex-1 flex-col p-6 md:p-10 max-w-[1600px] mx-auto w-full">
                {/* Header Section */}
                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Events Management</h1>
                        <p className="mt-1.5 text-base text-muted-foreground">
                            Organize and keep track of your upcoming schedules and activities.
                        </p>
                    </div>
                    <Button asChild size="lg" className="shadow-sm">
                        <Link href="/events/create">
                            <Plus className="mr-2 h-5 w-5" />
                            Create Event
                        </Link>
                    </Button>
                </div>

                {/* Table Section */}
                <Card className="border-border/50 shadow-sm overflow-hidden bg-card/50 backdrop-blur-sm">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/30 hover:bg-muted/30 border-b">
                                    <TableHead className="w-[100px] py-5 pl-6 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Preview</TableHead>
                                    <TableHead className="py-5 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Event Information</TableHead>
                                    <TableHead className="py-5 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Participants</TableHead>
                                    <TableHead className="py-5 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Scheduled Date</TableHead>
                                    <TableHead className="py-5 pr-6 text-right text-sm font-semibold uppercase tracking-wider text-muted-foreground">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {events.data.length > 0 ? (
                                    events.data.map((event) => (
                                        <TableRow key={event.id} className="group transition-colors hover:bg-muted/20">
                                            <TableCell className="py-6 pl-6">
                                                <div className="h-16 w-16 overflow-hidden rounded-xl border border-border/60 bg-muted shadow-sm group-hover:scale-105 transition-transform duration-200">
                                                    {event.image ? (
                                                        <img
                                                            src={`/storage/${event.image}`}
                                                            alt={event.title}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center bg-muted/80">
                                                            <ImageIcon className="h-6 w-6 text-muted-foreground/40" />
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-6 min-w-[300px]">
                                                <div className="flex flex-col gap-1.5">
                                                    <span className="text-lg font-semibold text-foreground leading-none">
                                                        {event.title}
                                                    </span>
                                                    <p className="text-sm text-muted-foreground leading-relaxed max-w-md line-clamp-2 italic">
                                                        {event.description || 'No additional details provided for this event.'}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-6">
                                                <Badge variant="outline" className="px-3 py-1 font-medium bg-background/50 border-primary/20 text-primary">
                                                    <Users className="mr-2 h-3.5 w-3.5" />
                                                    {event.max_participants} Max
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="py-6">
                                                <Badge variant="outline" className="px-3 py-1 font-medium bg-background/50 border-primary/20 text-primary">
                                                    <Calendar className="mr-2 h-3.5 w-3.5" />
                                                    {event.event_date}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="py-6 pr-6 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-muted-foreground/10">
                                                            <MoreHorizontal className="h-5 w-5" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48 p-2">
                                                        <DropdownMenuItem asChild className="rounded-md">
                                                            <Link href={`/events/${event.id}/edit`} className="flex w-full items-center">
                                                                <Pencil className="mr-2 h-4 w-4 text-blue-500" />
                                                                Edit Details
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-destructive focus:text-destructive focus:bg-destructive/10 rounded-md cursor-pointer"
                                                            onClick={() => openDeleteModal(event.id)}
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Remove Event
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-64 text-center">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <ImageIcon className="h-12 w-12 text-muted-foreground/20" />
                                                <p className="text-lg font-medium text-muted-foreground">No events found</p>
                                                <Button variant="link" asChild>
                                                    <Link href="/events/create">Start by creating your first event</Link>
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* --- DELETE CONFIRMATION MODAL --- */}
                <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the event
                                and remove the data from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={confirmDelete}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 text-white"
                            >
                                Delete Event
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AppLayout>
    );
}
