import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, type Member } from '@/types';

// --- SHADCN COMPONENTS ---
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft, Loader2, Save } from 'lucide-react';

type Gender = 'M' | 'F';
type Status = 'active' | 'inactive' | 'trial';

type Props = {
    member: Member;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Members', href: '/members' },
    { title: 'Edit Member', href: '#' },
];

export default function Edit({ member }: Props) {
    const { data, setData, put, processing, errors } = useForm<{
        full_name: string;
        batch_year: string | number;
        whatsapp_number: string;
        status: Status;
        gender: Gender;
        department: string;
    }>({
        full_name: member.full_name || '',
        batch_year: member.batch_year || '',
        whatsapp_number: member.whatsapp_number || '',
        status: member.status || 'active',
        gender: member.gender || 'M',
        department: member.department || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/members/${member.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Member" />
            <div className="flex flex-1 flex-col items-center justify-center p-4 md:p-8">
                <div className="w-full">
                    <div className="mb-4">
                        <Button variant="ghost" size="sm" asChild className="-ml-2 text-muted-foreground">
                            <Link href="/members">
                                <ChevronLeft className="mr-1 h-4 w-4" />
                                Back to Members
                            </Link>
                        </Button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <Card className="border-border/60 shadow-sm">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-xl">Edit Member Details</CardTitle>
                                <CardDescription>
                                    Update the information for <strong>{member.full_name}</strong>.
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="grid gap-4 md:grid-cols-2">
                                {/* --- Full Name --- */}
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="full_name">Full Name <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="full_name"
                                        placeholder="e.g. Teuku Aryansyah Pratama"
                                        value={data.full_name}
                                        onChange={(e) => setData('full_name', e.target.value)}
                                        className={errors.full_name ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                    />
                                    {errors.full_name && <p className="text-xs text-red-500 font-medium">{errors.full_name}</p>}
                                </div>

                                {/* --- Department --- */}
                                <div className="space-y-2 md:col-span-1">
                                    <Label htmlFor="department">Department</Label>
                                    <Input
                                        id="department"
                                        placeholder="e.g. Departemen Publika"
                                        value={data.department}
                                        onChange={(e) => setData('department', e.target.value)}
                                        className={errors.department ? 'border-red-500' : ''}
                                    />
                                    {errors.department && <p className="text-xs text-red-500 font-medium">{errors.department}</p>}
                                </div>

                                {/* --- Batch Year --- */}
                                <div className="space-y-2 md:col-span-1">
                                    <Label htmlFor="batch_year">Batch Year (Class of)</Label>
                                    <Input
                                        id="batch_year"
                                        type="number"
                                        placeholder="e.g. 2023"
                                        value={data.batch_year}
                                        onChange={(e) => setData('batch_year', e.target.value)}
                                        className={errors.batch_year ? 'border-red-500' : ''}
                                    />
                                    {errors.batch_year && <p className="text-xs text-red-500 font-medium">{errors.batch_year}</p>}
                                </div>

                                {/* --- WhatsApp Number --- */}
                                <div className="space-y-2 md:col-span-1">
                                    <Label htmlFor="whatsapp">WhatsApp Number</Label>
                                    <Input
                                        id="whatsapp"
                                        type="tel"
                                        placeholder="e.g. 081234567890"
                                        value={data.whatsapp_number}
                                        className={errors.whatsapp_number ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/[^0-9]/g, '');
                                            setData('whatsapp_number', val);
                                        }}
                                    />
                                    {errors.whatsapp_number && (
                                        <p className="text-xs text-red-500 font-medium">{errors.whatsapp_number}</p>
                                    )}
                                </div>

                                {/* --- Gender (Select) --- */}
                                <div className="space-y-2 md:col-span-1">
                                    <Label>Gender</Label>
                                    <Select
                                        value={data.gender}
                                        onValueChange={(val) => setData('gender', val as Gender)}
                                    >
                                        <SelectTrigger className={errors.gender ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Select gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="M">Male</SelectItem>
                                            <SelectItem value="F">Female</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.gender && <p className="text-xs text-red-500 font-medium">{errors.gender}</p>}
                                </div>

                                {/* --- Status --- */}
                                <div className="space-y-2 md:col-span-2">
                                    <Label>Account Status</Label>
                                    <Select
                                        value={data.status}
                                        onValueChange={(val) => setData('status', val as Status)}
                                    >
                                        <SelectTrigger className={errors.status ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">
                                                <div className="flex items-center gap-2">
                                                    <span className="h-2 w-2 rounded-full bg-green-500" />
                                                    <span>Active</span>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="trial">
                                                <div className="flex items-center gap-2">
                                                    <span className="h-2 w-2 rounded-full bg-orange-400" />
                                                    <span>Trial</span>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="inactive">
                                                <div className="flex items-center gap-2">
                                                    <span className="h-2 w-2 rounded-full bg-slate-400" />
                                                    <span>Inactive</span>
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>

                            <div className="px-6 pb-6">
                                <Separator className="mb-6" />
                                <div className="flex items-center justify-end gap-3">
                                    <Button variant="outline" type="button" asChild>
                                        <Link href="/members">Cancel</Link>
                                    </Button>
                                    <Button type="submit" disabled={processing} className="min-w-[120px]">
                                        {processing ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Updating...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="mr-2 h-4 w-4" />
                                                Update Member
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
