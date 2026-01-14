import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';

// --- SHADCN COMPONENTS ---
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    Calendar,
    MapPin,
    Users,
    Type,
    AlignLeft,
    Image as ImageIcon,
    ArrowLeft,
    Save,
    Plus,
    Trash2,
    UploadCloud
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Events', href: '/events' },
    { title: 'Create', href: '/events/create' },
];

export default function Create() {
    // State lokal untuk menyimpan URL preview gambar
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        event_date: '',
        location: '',
        max_participants: '',
        image: null as File | null,
    });

    // Fungsi untuk menangani perubahan file dan membuat preview
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Fungsi untuk menghapus gambar yang sudah dipilih
    const removeImage = () => {
        setData('image', null);
        setImagePreview(null);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/events', {
            forceFormData: true,
            onSuccess: () => {
                // Opsional: reset atau notifikasi
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Event" />

            <div className="flex flex-1 flex-col p-6 md:p-10 mx-auto w-full">
                {/* Header Section */}
                <div className="mb-8 flex items-center justify-between">
                    <div className="space-y-1">
                        <Link
                            href="/events"
                            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-2 w-fit"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Events
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight">Create New Event</h1>
                    </div>
                </div>

                <form onSubmit={submit} className="grid gap-6">
                    <Card className="border-border/50 shadow-sm bg-card/50 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                            <CardDescription>
                                Masukkan detail utama event Anda agar mudah dipahami oleh peserta.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">

                            {/* Judul Event */}
                            <div className="space-y-2">
                                <Label htmlFor="title" className="flex items-center gap-2 text-sm font-semibold">
                                    <Type className="h-4 w-4 text-muted-foreground" />
                                    Event Title
                                </Label>
                                <Input
                                    id="title"
                                    placeholder="Contoh: Workshop UI/UX Modern 2026"
                                    value={data.title}
                                    onChange={e => setData('title', e.target.value)}
                                    className={errors.title ? 'border-destructive focus-visible:ring-destructive' : ''}
                                />
                                {errors.title && <p className="text-xs font-medium text-destructive">{errors.title}</p>}
                            </div>

                            {/* Deskripsi */}
                            <div className="space-y-2">
                                <Label htmlFor="description" className="flex items-center gap-2 text-sm font-semibold">
                                    <AlignLeft className="h-4 w-4 text-muted-foreground" />
                                    Description
                                </Label>
                                <Textarea
                                    id="description"
                                    placeholder="Jelaskan secara detail mengenai acara ini..."
                                    rows={5}
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    className={errors.description ? 'border-destructive resize-none' : 'resize-none'}
                                />
                                {errors.description && <p className="text-xs font-medium text-destructive">{errors.description}</p>}
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Tanggal */}
                                <div className="space-y-2">
                                    <Label htmlFor="event_date" className="flex items-center gap-2 text-sm font-semibold">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        Date & Time
                                    </Label>
                                    <Input
                                        id="event_date"
                                        type="datetime-local"
                                        value={data.event_date}
                                        onChange={e => setData('event_date', e.target.value)}
                                        className={errors.event_date ? 'border-destructive' : ''}
                                    />
                                    {errors.event_date && <p className="text-xs font-medium text-destructive">{errors.event_date}</p>}
                                </div>

                                {/* Lokasi */}
                                <div className="space-y-2">
                                    <Label htmlFor="location" className="flex items-center gap-2 text-sm font-semibold">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        Location
                                    </Label>
                                    <Input
                                        id="location"
                                        placeholder="Gedung Serbaguna, Lantai 2"
                                        value={data.location}
                                        onChange={e => setData('location', e.target.value)}
                                        className={errors.location ? 'border-destructive' : ''}
                                    />
                                    {errors.location && <p className="text-xs font-medium text-destructive">{errors.location}</p>}
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Max Participants */}
                                <div className="space-y-2">
                                    <Label htmlFor="max_participants" className="flex items-center gap-2 text-sm font-semibold">
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                        Participant Limit
                                    </Label>
                                    <Input
                                        id="max_participants"
                                        type="number"
                                        placeholder="100"
                                        value={data.max_participants}
                                        onChange={e => setData('max_participants', e.target.value)}
                                        className={errors.max_participants ? 'border-destructive' : ''}
                                    />
                                    {errors.max_participants && <p className="text-xs font-medium text-destructive">{errors.max_participants}</p>}
                                </div>

                                {/* Upload Image Banner */}
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 text-sm font-semibold">
                                        <ImageIcon className="h-4 w-4 text-muted-foreground" />
                                        Event Banner
                                    </Label>

                                    <div className="relative">
                                        {imagePreview ? (
                                            <div className="relative group overflow-hidden rounded-lg border border-border aspect-video shadow-inner bg-muted">
                                                <img
                                                    src={imagePreview}
                                                    alt="Banner Preview"
                                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={removeImage}
                                                        className="shadow-lg"
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Ganti Gambar
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <label
                                                htmlFor="image-upload"
                                                className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-muted-foreground/20 rounded-lg cursor-pointer bg-muted/20 hover:bg-muted/40 hover:border-primary/50 transition-all duration-200"
                                            >
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <div className="p-2 bg-background rounded-full shadow-sm mb-3">
                                                        <UploadCloud className="h-5 w-5 text-muted-foreground" />
                                                    </div>
                                                    <p className="text-sm text-foreground font-medium">Klik untuk upload banner</p>
                                                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG atau WEBP (Maks. 2MB)</p>
                                                </div>
                                                <input
                                                    id="image-upload"
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={handleImageChange}
                                                />
                                            </label>
                                        )}
                                    </div>
                                    {errors.image && <p className="text-xs font-medium text-destructive mt-1">{errors.image}</p>}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex items-center justify-end gap-3 mb-10">
                        <Button variant="outline" asChild disabled={processing}>
                            <Link href="/events">Batal</Link>
                        </Button>
                        <Button type="submit" disabled={processing} className="min-w-[140px] shadow-sm">
                            {processing ? (
                                <span className="flex items-center gap-2">
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    Menyimpan...
                                </span>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Publish Event
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
