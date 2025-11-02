import AppLayout from '@/layouts/app-layout';
import { journals } from '@/routes';
import { BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

interface Journal {
    id: number;
    title: string;
    emotion: string;
    created_at: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Journals',
        href: journals().url,
    },
];

export default function Index() {
    const { journals: journalData } = usePage<{ journals: Journal[] }>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Journals" />
            <div className="p-6">
                <h1 className="text-2xl font-semibold mb-4">My Journal Entries</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {journalData && journalData.length > 0 ? (
                        journalData.map((journal) => (
                            <div key={journal.id} className="border rounded-lg p-4 shadow-sm">
                                <h2 className="font-medium text-lg">{journal.title}</h2>
                                <p className="text-sm text-gray-500">Emotion: {journal.emotion}</p>
                                <p className="text-xs text-gray-400">{journal.created_at}</p>
                            </div>
                        ))
                    ) : (
                        <p>No journal entries found.</p>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}