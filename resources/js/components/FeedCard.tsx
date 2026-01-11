import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Youtube, Music2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export interface Suggestion {
    type: "youtube" | "spotify";
    title: string;
    videoId?: string;
    trackId?: string;
}

interface FeedCardProps {
    item: Suggestion;
}

const FeedCard: React.FC<FeedCardProps> = ({ item }) => {
    const { t } = useTranslation();
    const spotifyList = [
        t("feedCard.spotify.list1"),
        t("feedCard.spotify.list2"),
        t("feedCard.spotify.list3"),
        t("feedCard.spotify.list4"),
        t("feedCard.spotify.list5"),
        t("feedCard.spotify.list6"),
        t("feedCard.spotify.list7"),
    ];

    const youtubeList = [
        t("feedCard.youtube.list1"),
        t("feedCard.youtube.list2"),
        t("feedCard.youtube.list3"),
        t("feedCard.youtube.list4"),
        t("feedCard.youtube.list5"),
        t("feedCard.youtube.list6"),
        t("feedCard.youtube.list7"),
    ];
    return (
        <Card className="rounded-2xl mt-7 shadow hover:scale-[1.01] transition-all hover:shadow-xl duration-500">
            <CardContent className="p-4 space-y-3">
                {/* Icon selon type */}
                {item.type === "youtube" && <div className="flex gap-3 items-center">
                        <Youtube className="w-7 h-7 text-red-500" />
                        <h2 className="font-semibold text-xl text-black">{t("feedCard.youtubeTitle")}</h2>
                    </div>}
                {item.type === "spotify" && <div className="flex gap-3 items-center">
                        <Music2 className="w-7 h-7 text-green-500" />
                        <h2 className="font-semibold text-xl text-black">{t("feedCard.spotifyTitle")}</h2>
                    </div>}

                {/* Titre */}
                <h2 className="text-[16px] font-normal">{item.title}</h2>

                {/* YouTube embed */}
                {item.type === "youtube" && item.videoId && (
                    <iframe
                        className="rounded-xl w-full h-[48vh]"
                        src={`https://www.youtube.com/embed/${item.videoId}`}
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    />
                )}
                
                {/* Spotify embed */}
                {item.type === "spotify" && item.trackId && (
                    <iframe
                        src={`https://open.spotify.com/embed/track/${item.trackId}`}
                        className="rounded-xl w-full h-[76vh]"
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        />
                    )}
                {/* Description list */}
                <div className={`flex-col ${item.type === "spotify" ? "-mt-[10rem]" : "mt-[3.2rem]"} items-center`}>
                    <ul className="list-decimal p-5 text-sm gap-5 flex flex-col items-center">
                        {(item.type === "spotify" ? spotifyList : youtubeList).map((line, index) => (
                            <li key={index}>{line}</li>
                        ))}
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
};

export default FeedCard;
