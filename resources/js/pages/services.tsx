import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { UserInfo } from '@/components/user-info';
import { useInitials } from '@/hooks/use-initials';
import AppLayout from '@/layouts/app-layout';
import { journals } from '@/routes';
import { SharedData, type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { BrowserRouter, Routes, Route, data } from 'react-router-dom';
import { type User } from '@/types';
import { UserInfoName } from '@/components/UserInfoName';
import {BadgeHelpIcon, Mail, Plus, ChartNoAxesCombinedIcon, Quote, BadgePlusIcon, Crown, Gift, ArrowRightIcon} from "lucide-react";

interface Quote {
    id: number;
    text: string;
    created_at: string;
}

interface Props {
    quotes: Quote[];
}



const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Services',
        href: '/services',        
    },
];

interface Quote {
    id: number;
    text: string;
}

export default function Services({ quotes }: Props) {  
    const handleGenerate = () => {
        router.post("/quotes/generate");
    };

    const { props } = usePage<{ 
        auth: { user: User }, 
        userPlan?: string, 
        trialEndsAt?: string 
    }>();

    const userPlan = props.userPlan;
    const trialEndsAt = props.trialEndsAt;

    const hasActivePlan = userPlan && userPlan !== "free";
    return (
        <>
            {/* <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />                    
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                </div>
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div> */}
        <Head title="Home" />

            {/* ✅ Background container with controlled layering */}
            <div className="absolute inset-0 overflow-hidden z-0">
            <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full fixed h-full object-cover"
            >
                <source src="/videos/87787-602074236.mp4" type="video/mp4" />
            </video>
            </div>

            {/* ✅ Actual page content above it */}
            <AppLayout breadcrumbs={breadcrumbs}>
            <main className="relative z-10 flex flex-col w-full mb-6">
                <div className="flex pt-8 justify-between">
                    <h1 className="text-[48px] px-10 pt-8 my-4 font-semibold text-black leading-[3rem]"> Services</h1>
                    <div className="p-14">
                    {hasActivePlan ? (
                        <button className="bg-indigo-500 w-full text-[15px] text-white rounded-md flex items-center justify-center border font-semibold border-white px-3 py-2">
                            <a href="/journal/create">Add Journal</a>
                            <Plus className="w-5 h-5 ml-2" />
                        </button>
                    ) : (
                        <div className="flex flex-col gap-3">
                            <button className="bg-yellow-500 text-white text-[15px] rounded-md flex items-center justify-center border font-semibold border-white px-3 py-2">
                                <a href="/plans">Get your plan</a>
                                <Crown className="w-5 h-5 ml-2" />
                            </button>
                            <button className="bg-gray-200 text-[15px] rounded-md flex items-center justify-center border font-semibold border-gray-300 px-3 py-2">
                                <a href="/trial">Continue Free Trial</a>
                                <Gift className="w-5 h-5 ml-2" />
                            </button>
                        </div>
                    )}
                </div>
                </div>
            <section className="flex px-10 gap-6 flex-col md:flex-row items-start justify-between p-6">
                <div
                    style={{
                        backgroundImage: "url('/img/modern-3d-black-paper-style-background.jpg')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                    }}
                    className="w-full flex gap-10 p-10 border border-gray-700 rounded-2xl overflow-x-scroll snap-x snap-mandatory scroll-smooth"
                    >
                    {[
                        {
                        title: "Mood Detection",
                        subtitle: "AI Emotion Recognition",
                        desc: "Understand your emotional tone from text, voice, and facial cues.",
                        img: "./img/face-recognition-modif.png",
                        },
                        {
                        title: "Trend Analytics",
                        subtitle: "Visualize Emotional Growth",
                        desc: "See progress over days, weeks, and months through interactive charts.",
                        img: "./img/robot-showing-low-results-statistics.jpg",
                        },
                        {
                        title: "Personalized Guidance",
                        subtitle: "Tailored Recommendations",
                        desc: "Receive music, meditation, and self-care content matching your mood.",
                        img: "./img/call-center-worker-using-ai-tech-laptop-reply-customers-closeup.jpg",
                        },
                        {
                        title: "Secure Storage",
                        subtitle: "Your Data, Your Control",
                        desc: "All information is encrypted and stored with complete transparency.",
                        img: "./img/secured-file-folder-futuristic-data-network.jpg",
                        },
                    ].map((card, index) => (
                        <div
                        key={index}
                        className="min-w-full md:min-w-[50%] snap-center flex flex-col items-center justify-center bg-white/5 backdrop-blur-md border border-gray-700 rounded-3xl p-7 shadow-xl hover:scale-[1.03] transition-all duration-500"
                        >
                        <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 text-[36px] md:text-[48px] font-bold text-center mb-4">
                            {card.title}
                        </h1>

                        {/* ✅ Uniform Image Section */}
                        <div className="w-[85%] md:w-[70%] h-[300px] md:h-[150px] flex items-center justify-center overflow-hidden rounded-2xl shadow-lg">
                            <img
                            src={card.img}
                            alt={card.title}
                            className="w-full h-full object-cover"
                            />
                        </div>

                        <h2 className="text-xl md:text-2xl text-gray-300 font-semibold mt-6">
                            {card.subtitle}
                        </h2>
                        <p className="max-w-3xl text-[16px] md:text-[18px] text-gray-400 text-center mt-3">
                            {card.desc}
                        </p>
                        </div>
                    ))}
                    </div>
            </section>
            <section className="flex gap-6 flex-col md:flex-row items-start justify-between p-6">
                <div className="px-14 w-full">
                    <h1 className="text-2xl my-4 text-black font-semibold">Today’s Quote</h1>

                    <div className="space-y-6">
                        <div
                            style={{
                            backgroundImage: "url('/img/modern-3d-black-paper-style-background.jpg')",
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            }}
                            className="w-full  p-8 border border-gray-300 rounded-2xl overflow-x-auto"
                            >
                            <ul className="flex flex-nowrap gap-8 min-w-max px-2">
                            {quotes.map((q) => (
                                <li
                                key={q.id}
                                 className="bg-gray-100 shadow-lg shadow-white/30 italic flex-col items-center justify-center px-6 text-3xl py-4 rounded-xl text-gray-700 font-medium hover:bg-gray-200 transition max-w-md break-words"
                                >                            
                                {q.text}
                                <p className="font-semibold text-xl my-5">Author: MindTrack AI</p>
                                </li>
                            ))}
                            </ul>
                        </div>

                    <button
                        onClick={handleGenerate}
                        className="bg-gradient-to-tr text-[15px] cursor-pointer mt-5 rounded-md flex items-center justify-center border font-semibold border-gray-300 px-5 py-2 from-gray-200 via-white to-gray-200"
                    >
                        <BadgePlusIcon className="w-5 h-5 mr-2" />
                        Generate a new Quote
                    </button>
                    </div>
                </div>
                </section>
            <section className="flex gap-6 flex-col md:flex-row items-start justify-between p-6">
                <div className="px-14 w-full">
                    <h1 className="text-2xl my-4 text-black font-semibold">What Your Mind Needs Today</h1>
                    <p className="max-w-2xl text-[18px] text-[#656565]">
                        Enjoy personalized suggestions — meditation audios, playlists, or motivational content based on your current state of mind.
                    </p>
                    <div className="my-3">
                        <p>#------------------------Adding an image for feed viewing------------------------#</p>
                    </div>
                    <button
                        className="bg-gradient-to-tr text-[15px] cursor-pointer mt-5 rounded-md flex items-center justify-center border font-semibold border-gray-300 px-5 py-2 from-gray-200 via-white to-gray-200"
                    >
                        <ArrowRightIcon className="w-5 h-5 mr-2" />
                        <a href="/feed">Feed</a>
                    </button>
                </div>
            </section>
        </main>
        </AppLayout>
        </>
    );
}