import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

type Member = {
    id: number;
    full_name: string;
    batch_year: number;
    whatsapp_number: string;
    status: 'active' | 'inactive' | 'trial';
    gender: 'M' | 'F';
    department: string;
};

export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

export type Paginated<T> = {
    total: ReactNode;
    to: ReactNode;
    from: ReactNode;
    data: T[];
    links: PaginationLink[];
};

export type Event = {
    id: number
    title: string
    description?: string | null
    event_date: string
    location?: string | null
    max_participants: number
    status: 'open' | 'closed'
    image?: string | null
    created_at: string
    updated_at: string
}
