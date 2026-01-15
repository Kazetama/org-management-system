import { Head, useForm, usePage } from '@inertiajs/react';
import {
    Calendar,
    MapPin,
    Users,
    School,
    User,
    Phone,
    Mail,
    CheckCircle2,
    AlertCircle,
    ArrowRight
} from 'lucide-react';

// --- SHADCN COMPONENTS ---
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function EventShow({ event }: any) {
    const { flash }: any = usePage().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        full_name: '',
        school_origin: '',
        phone: '',
        email: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/events/${event.id}/register`, {
            onSuccess: () => reset(),
        });
    };

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20">
            <Head title={event.title} />

            {/* HERO SECTION WITH IMAGE */}
            <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden bg-slate-900">
                {event.image ? (
                    <img
                        src={`/storage/${event.image}`}
                        alt={event.title}
                        className="w-full h-full object-cover opacity-60"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900" />
                )}
                <div className="absolute inset-0 flex items-end">
                    <div className="max-w-4xl mx-auto w-full p-6 md:p-10 text-white">
                        <Badge variant={event.status === 'open' ? 'default' : 'destructive'} className="mb-4">
                            {event.status === 'open' ? 'Registration Open' : 'Closed'}
                        </Badge>
                        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 drop-shadow-md">
                            {event.title}
                        </h1>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 -mt-10 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* LEFT COLUMN: EVENT DETAILS */}
                    <div className="lg:col-span-7 space-y-6">
                        <Card className="border-none shadow-xl shadow-slate-200/50">
                            <CardContent className="p-6 md:p-8 space-y-6">
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-slate-800">Tentang Event</h3>
                                    <p className="text-slate-600 leading-relaxed italic">
                                        "{event.description || 'Tidak ada deskripsi untuk acara ini.'}"
                                    </p>
                                </div>

                                <Separator />

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                            <Calendar className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 font-medium uppercase">Tanggal & Waktu</p>
                                            <p className="text-sm font-semibold text-slate-700">{event.event_date}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                            <MapPin className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 font-medium uppercase">Lokasi</p>
                                            <p className="text-sm font-semibold text-slate-700">{event.location}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                            <Users className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 font-medium uppercase">Kapasitas</p>
                                            <p className="text-sm font-semibold text-slate-700">
                                                {event.registered} / {event.max_participants} Peserta
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT COLUMN: REGISTRATION FORM */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-6 space-y-4">
                            {/* STATUS MESSAGES */}
                            {flash?.success && (
                                <Alert className="bg-green-50 border-green-200 text-green-800">
                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                    <AlertTitle>Berhasil!</AlertTitle>
                                    <AlertDescription>{flash.success}</AlertDescription>
                                </Alert>
                            )}

                            {flash?.error && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Gagal</AlertTitle>
                                    <AlertDescription>{flash.error}</AlertDescription>
                                </Alert>
                            )}

                            {event.is_full && (
                                <Alert variant="destructive" className="bg-amber-50 border-amber-200 text-amber-900">
                                    <AlertCircle className="h-4 w-4 text-amber-600" />
                                    <AlertTitle>Kuota Penuh</AlertTitle>
                                    <AlertDescription>Mohon maaf, kuota pendaftaran untuk event ini sudah habis.</AlertDescription>
                                </Alert>
                            )}

                            {/* REGISTRATION CARD */}
                            {!flash?.success && event.status === 'open' && !event.is_full ? (
                                <Card className="border-none shadow-2xl shadow-primary/10">
                                    <CardHeader className="pb-4 text-center">
                                        <CardTitle className="text-2xl font-bold">Daftar Sekarang</CardTitle>
                                        <CardDescription>Isi data diri Anda dengan benar untuk mendaftar.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={submit} className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="full_name" className="text-sm font-semibold">Nama Lengkap</Label>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                                    <Input
                                                        id="full_name"
                                                        placeholder="John Doe"
                                                        className="pl-10 focus-visible:ring-primary"
                                                        value={data.full_name}
                                                        onChange={(e) => setData('full_name', e.target.value)}
                                                    />
                                                </div>
                                                {errors.full_name && <p className="text-xs font-medium text-destructive">{errors.full_name}</p>}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="school" className="text-sm font-semibold">Asal Sekolah</Label>
                                                <div className="relative">
                                                    <School className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                                    <Input
                                                        id="school"
                                                        placeholder="SMA Negeri 1..."
                                                        className="pl-10"
                                                        value={data.school_origin}
                                                        onChange={(e) => setData('school_origin', e.target.value)}
                                                    />
                                                </div>
                                                {errors.school_origin && <p className="text-xs font-medium text-destructive">{errors.school_origin}</p>}
                                            </div>

                                            <div className="grid grid-cols-1 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="phone" className="text-sm font-semibold">No WhatsApp</Label>
                                                    <div className="relative">
                                                        <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                                        <Input
                                                            id="phone"
                                                            placeholder="0812..."
                                                            className="pl-10"
                                                            value={data.phone}
                                                            onChange={(e) => setData('phone', e.target.value)}
                                                        />
                                                    </div>
                                                    {errors.phone && <p className="text-xs font-medium text-destructive">{errors.phone}</p>}
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="email" className="text-sm font-semibold">Email</Label>
                                                    <div className="relative">
                                                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                                        <Input
                                                            id="email"
                                                            type="email"
                                                            placeholder="john@example.com"
                                                            className="pl-10"
                                                            value={data.email}
                                                            onChange={(e) => setData('email', e.target.value)}
                                                        />
                                                    </div>
                                                    {errors.email && <p className="text-xs font-medium text-destructive">{errors.email}</p>}
                                                </div>
                                            </div>

                                            <Button
                                                className="w-full mt-2 font-bold group"
                                                size="lg"
                                                disabled={processing}
                                            >
                                                {processing ? 'Memproses...' : (
                                                    <span className="flex items-center gap-2">
                                                        Kirim Pendaftaran <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                                    </span>
                                                )}
                                            </Button>
                                        </form>
                                    </CardContent>
                                </Card>
                            ) : (
                                <Card className="border-dashed border-2 bg-slate-50">
                                    <CardContent className="p-8 text-center space-y-3">
                                        <div className="mx-auto w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                                            <AlertCircle className="h-6 w-6" />
                                        </div>
                                        <h3 className="font-bold text-slate-700">Pendaftaran Tidak Tersedia</h3>
                                        <p className="text-sm text-slate-500">Event ini sudah penuh atau pendaftaran telah ditutup.</p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
