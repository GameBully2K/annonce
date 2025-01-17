import { writable } from 'svelte/store';

interface Publication {
    id: string;
    userId: string;
    title: string;
    companyType: string;
    publicationType: string;
    body: string;
    status: 'pending' | 'verified' | 'rejected';
    reviewedBy?: string;
    reviewedAt?: number;
    feedback?: string;
    createdAt: number;
    updatedAt: number;
}

export const selectedPublicationStore = writable<Publication | null>(null);