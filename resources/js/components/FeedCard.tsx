import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Youtube, Music2, MusicIcon } from "lucide-react";

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
    return (
        <Card className="rounded-2xl mt-7 shadow hover:scale-[1.05] transition-all hover:shadow-xl duration-500">
            <CardContent className="p-4 space-y-3">
                {/* Icon selon type */}
                {item.type === "youtube" && <div className="flex gap-3 items-center">
                        <Youtube className="w-7 h-7 text-red-500" />
                        <h2 className="font-semibold text-xl text-black">YouTube Videos:</h2>
                    </div>}
                {item.type === "spotify" && <div className="flex gap-3 items-center">
                        <Music2 className="w-7 h-7 text-green-500" />
                        <h2 className="font-semibold text-xl text-black">Spotify Playlists:</h2>
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
                {item.type === "spotify" ? 
                <div className="flex-col -mt-[10rem] items-center">
                    <ul className="list-decimal p-5 text-sm gap-5 flex flex-col items-center">
                        <li>
                            Curated music selected to match your emotional state and help you feel better throughout the day.
                        </li>
                        <li>                            
                            A personalized playlist designed to support your mood and guide you into a more balanced mindset.
                        </li>
                        <li>
                            Discover music that aligns with your energy and helps you reset, focus, or unwind with ease.
                        </li>
                        <li>
                            Thoughtfully chosen tracks meant to enhance your well-being and gently shift your emotions.
                        </li>
                        <li>
                            Music crafted to complement your current mood and encourage a healthier emotional flow.
                        </li>
                        <li>
                            Let these curated sounds guide your mood toward clarity, calmness, or motivation — whatever you need right now.
                        </li>
                        <li>
                            A smooth selection of tracks tailored to support relaxation, focus, or positivity.
                        </li>
                    </ul>
                </div> :  <div className="flex-col mt-[3.2rem] items-center">
                    <ul className="list-decimal p-5 text-sm gap-5 flex flex-col items-center">
                        <li>
                            Helpful video content selected to uplift your mood and give you a moment of clarity or inspiration.
                        </li>
                        <li>                            
                            A guided moment designed to help you relax, refocus, or shift your emotional state in a healthier direction.
                        </li>
                        <li>
                            Engaging videos chosen to match your mood and provide motivation, calmness, or emotional support.
                        </li>
                        <li>
                            Short, impactful content curated to help you breathe, reset, and feel more grounded.
                        </li>
                        <li>
                            Meaningful visuals and guidance designed to support your mental well-being and brighten your mindset.
                        </li>
                        <li>
                            Videos crafted to match your emotional needs, offering comfort, motivation, or peacefulness.
                        </li>
                        <li>
                            Selected content meant to help you recenter your thoughts and move toward a healthier mood.
                        </li>
                    </ul>
                </div>
                }
            </CardContent>
        </Card>
    );
};

export default FeedCard;
