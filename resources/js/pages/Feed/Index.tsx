import React, { useState } from "react";
import AppLayout from "@/layouts/app-layout";
import FeedCard, {Suggestion} from "@/components/FeedCard";
import { Head } from "@inertiajs/react";
import { BreadcrumbItem } from "@/types";
import { useTranslation } from "react-i18next";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

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

const Feed: React.FC<FeedProps> = ({ suggestions, latestMood }) => {

    const { t } = useTranslation();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t("feed.FeedSuggestions"),
            href: '/feed',
        },
    ];

    const [activeTab, setActiveTab] = useState<"youtube" | "spotify">("youtube");

  const filteredSuggestions = suggestions.filter(
    (item) => item.type === activeTab
  );

  const { i18n } = useTranslation();
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Feed" />
            <div className="w-full  mx-auto px-5 py-8 space-y-6">
                <h1 className="text-3xl font-bold">{t("feed.title")}</h1>
                <p className="text-gray-600 mb-3">
                    {t("feed.yourMood")} <strong>{t(`feed.mood.${latestMood}`)}</strong>
                </p>

                <div className="w-full max-w-[58rem]">
                    {/* Toggle Switch */}
                    <div className="flex justify-center mb-6 gap-4">
                        <button
                        className={`px-4 py-2 rounded-full font-semibold transition ${
                            activeTab === "youtube"
                            ? "bg-red-500 text-white"
                            : "bg-gray-200 text-gray-700"
                        }`}
                        onClick={() => setActiveTab("youtube")}
                        >
                        YouTube
                        </button>
                        <button
                        className={`px-4 py-2 rounded-full font-semibold transition ${
                            activeTab === "spotify"
                            ? "bg-green-500 text-white"
                            : "bg-gray-200 text-gray-700"
                        }`}
                        onClick={() => setActiveTab("spotify")}
                        >
                        Spotify
                        </button>
                    </div>

                    {/* Carousel */}
                    <Carousel className="relative w-full">
                        <CarouselContent className={`gap-6 ${
                            i18n.language === "ar" ? "flex-row-reverse" : "flex-row"
                        }`}>
                        {filteredSuggestions.map((item, idx) => (
                            <CarouselItem key={idx} className="w-full md:w-1/2">
                            <FeedCard item={item} />
                            </CarouselItem>
                        ))}
                        </CarouselContent>

                        <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md">
                        ❮
                        </CarouselPrevious>
                        <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md">
                        ❯
                        </CarouselNext>
                    </Carousel>
                </div>
            </div>
        </AppLayout>
    );
};

export default Feed;