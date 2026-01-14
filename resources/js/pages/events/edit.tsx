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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Calendar,
    MapPin,
    Users,
    Type,
    AlignLeft,
    Image as ImageIcon,
    ArrowLeft,
    Save,
    Trash2,
    UploadCloud,
    // CheckCircle2
} from 'lucide-react';

export default function Edit({ event }: any) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Events', href: '/events' },
        { title: 'Edit Event', href: '#' },
    ];

    // Inisialisasi preview dengan gambar lama dari storage
    const [imagePreview, setImagePreview] = useState<string | null>(
        event.image ? `/storage/${event.image}` : null
    );

    const { data, setData, post, processing, errors } = useForm({
        _method: 'put', // Penting untuk spoofing PUT saat upload file
        title: event.title,
        description: event.description ?? '',
        event_date: event.event_date,
        location: event.location ?? '',
        max_participants: event.max_participants?.toString() ?? '',
        status: event.status,
        image: null as File | null,
    });

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

    const removeImage = () => {
        setData('image', null);
        // Kembalikan preview ke gambar lama jika ada
        setImagePreview(event.image ? `/storage/${event.image}` : null);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/events/${event.id}`, { forceFormData: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit - ${event.title}`} />

            <div className="flex flex-1 flex-col p-4 md:p-8 max-w-7xl mx-auto w-full">
                {/* Back Button & Title */}
                <div className="mb-6">
                    <Link href="/events" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-2 transition-colors">
                        <ArrowLeft className="h-4 w-4" /> Kembali ke Daftar Event
                    </Link>
                    <h1 className="text-2xl font-bold tracking-tight">Edit Event</h1>
                </div>

                <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* --- KOLOM KIRI (INFORMASI UTAMA) --- */}
                    <div className="lg:col-span-8 space-y-6">
                        <Card className="border-border/60 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">Informasi Dasar</CardTitle>
                                <CardDescription>Detail konten dan deskripsi acara Anda.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="title" className="flex items-center gap-2 font-medium">
                                        <Type className="h-4 w-4 text-muted-foreground" /> Nama Event
                                    </Label>
                                    <Input id="title" value={data.title} onChange={e => setData('title', e.target.value)} />
                                    {errors.title && <p className="text-xs text-destructive font-medium">{errors.title}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description" className="flex items-center gap-2 font-medium">
                                        <AlignLeft className="h-4 w-4 text-muted-foreground" /> Deskripsi Acara
                                    </Label>
                                    <Textarea
                                        id="description"
                                        rows={10}
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        className="resize-none"
                                    />
                                    {errors.description && <p className="text-xs text-destructive font-medium">{errors.description}</p>}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-border/60 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">Lokasi & Kapasitas</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="location" className="flex items-center gap-2 font-medium">
                                        <MapPin className="h-4 w-4 text-muted-foreground" /> Lokasi
                                    </Label>
                                    <Input id="location" value={data.location} onChange={e => setData('location', e.target.value)} />
                                    {errors.location && <p className="text-xs text-destructive font-medium">{errors.location}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="max_participants" className="flex items-center gap-2 font-medium">
                                        <Users className="h-4 w-4 text-muted-foreground" /> Batas Peserta
                                    </Label>
                                    <Input id="max_participants" type="number" value={data.max_participants} onChange={e => setData('max_participants', e.target.value)} />
                                    {errors.max_participants && <p className="text-xs text-destructive font-medium">{errors.max_participants}</p>}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* --- KOLOM KANAN (BANNER & STATUS) --- */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* Status Card */}
                        <Card className="border-border/60 shadow-sm bg-muted/20">
                            <CardHeader>
                                <CardTitle className="text-lg">Status & Jadwal</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 font-medium">
                                        <CheckCircle2 className="h-4 w-4 text-muted-foreground" /> Status Registrasi
                                    </Label>
                                    <Select value={data.status} onValueChange={(v) => setData('status', v)}>
                                        <SelectTrigger className="bg-background">
                                            <SelectValue placeholder="Pilih Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="open">Open / Aktif</SelectItem>
                                            <SelectItem value="closed">Closed / Berakhir</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 font-medium">
                                        <Calendar className="h-4 w-4 text-muted-foreground" /> Waktu Acara
                                    </Label>
                                    <Input
                                        type="datetime-local"
                                        value={data.event_date}
                                        onChange={e => setData('event_date', e.target.value)}
                                        className="bg-background"
                                    />
                                    {errors.event_date && <p className="text-xs text-destructive font-medium">{errors.event_date}</p>}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Banner Card */}
                        <Card className="border-border/60 shadow-sm overflow-hidden">
                            <CardHeader>
                                <CardTitle className="text-lg">Event Banner</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="relative group aspect-video rounded-lg border-2 border-dashed border-muted-foreground/20 overflow-hidden bg-muted/40">
                                        {imagePreview ? (
                                            <>
                                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                    <Button type="button" variant="secondary" size="sm" onClick={() => document.getElementById('image-upload')?.click()}>
                                                        Ubah Banner
                                                    </Button>
                                                    {data.image && (
                                                        <Button type="button" variant="destructive" size="sm" onClick={removeImage}>
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </>
                                        ) : (
                                            <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-muted/60 transition-colors">
                                                <UploadCloud className="h-8 w-8 text-muted-foreground mb-2" />
                                                <span className="text-xs font-medium">Upload Banner Baru</span>
                                            </label>
                                        )}
                                        <input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                                    </div>
                                    <p className="text-[10px] text-muted-foreground italic text-center leading-tight">
                                        *Biarkan kosong jika tidak ingin mengubah gambar lama.
                                    </p>
                                    {errors.image && <p className="text-xs text-destructive font-medium text-center">{errors.image}</p>}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-2">
                            <Button type="submit" className="w-full" disabled={processing}>
                                {processing ? 'Menyimpan...' : <><Save className="mr-2 h-4 w-4" /> Simpan Perubahan</>}
                            </Button>
                            <Button variant="ghost" asChild className="w-full">
                                <Link href="/events">Batal</Link>
                            </Button>
                        </div>
                    </div>

                </form>
            </div>
        </AppLayout>
    );
}

const CheckCircle2 = (props: any) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="m9 12 2 2 4-4" /></svg>
)
