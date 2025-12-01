import React from "react";
import AppLayout from "@/layouts/app-layout";
import FeedCard, {Suggestion} from "@/components/FeedCard";
import { Head } from "@inertiajs/react";
import { BreadcrumbItem } from "@/types";

interface FeedProps {
    suggestions: Suggestion[];
    latestMood: string;
}

const moodLabels: Record<string, string> = {
    happy: "😊 Happy",
    sad: "😔 Sad",
    stressed: "😫 Stressed",
    default: "🙂 Neutral",
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Feed Suggestions',
        href: '/feed',
    },
];

const Feed: React.FC<FeedProps> = ({ suggestions, latestMood }) => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Feed" />
            <div className="w-full  mx-auto px-5 py-8 space-y-6">
                <h1 className="text-3xl font-bold">🎧 Suggestions for your mood</h1>
                <p className="text-gray-600 mb-3">
                    Your current mood : <strong>{moodLabels[latestMood]}</strong>
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {suggestions.map((item, idx) => (
                        <FeedCard key={idx} item={item} />
                    ))}
                </div>
            </div>
        </AppLayout>
    );
};

export default Feed;