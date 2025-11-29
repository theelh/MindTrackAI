import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { UserInfo } from '@/components/user-info';
import { useInitials } from '@/hooks/use-initials';
import AppLayout from '@/layouts/app-layout';
import { dashboard, journals } from '@/routes';
import { SharedData, type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { BrowserRouter, Routes, Route, data } from 'react-router-dom';
import { type User } from '@/types';
import { UserInfoName } from '@/components/UserInfoName';
import {BadgeHelpIcon, Mail, Plus, ChartNoAxesCombinedIcon, Quote, BadgePlusIcon, Crown, Gift, ArrowRightIcon} from "lucide-react";
import HeroAnimation from '@/components/HeroAnimation';
import HeroAnimationUniq from '@/components/HeroAnimationUniq';
import LineChart from '@/components/LineChart';

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
        title: 'Home',
        href: dashboard().url,        
    },
];

interface Quote {
    id: number;
    text: string;
}

export default function Dashboard({ quotes }: Props) {  
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
            <div className="h-full fixed flex inset-0 items-end justify-end overflow-hidden z-0">
            <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full fixed h-full object-cover"
            >
                <source src="/videos/87787-602074236.mp4" type="video/mp4" />
            </video>
            <HeroAnimationUniq
            imageBaseUrl="/img/fram2"
                totalFrames={200}
                scale={1}
            />
            </div>

            {/* ✅ Actual page content above it */}
            <AppLayout breadcrumbs={breadcrumbs}>
            <main className="relative z-10 flex flex-col w-full mb-6">
            <section className="flex gap-6 flex-col md:flex-row items-start justify-between p-6">
                <div className="p-14 max-w-5xl">
                    <h2 className="text-2xl  font-bold">Welcome, <span className="text-[#4556FE]"><UserInfoName user={props.auth.user} /></span></h2>
                    <h1 className="text-[48px] my-4 font-semibold leading-[3rem]"> <span className="bg-clip-text text-transparent bg-gradient-to-r from-black to-[#4556FE]">Your emotional journey at a glance.</span></h1>
                    <p className="max-w-2xl text-[18px] text-[#656565]">
                        Start your day with awareness. See your current emotional balance, your latest activity, and personalized AI insights — all in one glance.
                    </p>
                    <div className="mt-8 flex gap-4">
                        <button className="bg-gradient-to-tr text-[15px] rounded-md flex items-center justify-center border font-semibold border-spacing-5 border-gray-300 px-5 py-2 from-gray-200 via-white to-gray-200">
                            <a  href="/about">About </a>
                            <BadgeHelpIcon className="w-5 h-5 ml-2"/>
                        </button>
                        <a
                            href="/emotion/analytics"
                            className="bg-gradient-to-tr text-[15px] rounded-md flex items-center justify-center border font-semibold px-5 py-2 from-gray-200 via-white to-gray-200"
                            >
                            View Analytics
                            <ChartNoAxesCombinedIcon className="w-5 h-5 ml-2" />
                        </a>
                    </div>
                </div>
                <div className="p-14 w-80">
                    {hasActivePlan ? (
                        <button className="bg-gradient-to-tr shadow-lg shadow-white text-[15px] cursor-pointer mt-5 rounded-md flex items-center justify-center border font-semibold border-gray-300 px-5 py-2 from-gray-200 via-white to-gray-200">
                            <a href="/journal/create">Add Journal</a>
                            <Plus className="w-5 h-5 ml-2" />
                        </button>
                    ) : (
                        <div className="flex flex-col gap-1">
                            <button className="hover:scale-[1.03] hover:shadow-xl hover:shadow-yellow-300/40 hover:text-white transition-all duration-500 bg-yellow-400 text-white shadow-lg shadow-yellow-100 text-[15px] cursor-pointer mt-5 rounded-md flex items-center justify-center border font-semibold border-yellow-200 border-spacing-5 py-2">
                                <a href="/plans">Get your plan</a>
                                <Crown className="w-5 h-5 ml-2" />
                            </button>
                            <button className="hover:scale-[1.03] hover:shadow-xl hover:border-indigo-400 hover:shadow-white/60 hover:bg-gradient-to-tr hover:from-black hover:via-indigo-600 hover:to-indigo-200 hover:text-white transition-all duration-500 bg-gradient-to-tr text-[15px] cursor-pointer mt-5 rounded-md flex items-center justify-center border font-semibold border-gray-300  py-2 from-gray-200 via-white to-gray-200">
                                <a href="/trial">Continue Free Trial</a>
                                <Gift className="w-5 h-5 ml-2" />
                            </button>
                        </div>
                    )}
                </div>
            </section>
            <section className="flex gap-6 flex-col md:flex-row items-start justify-between p-6">
                <div className="px-14 w-full">
                    <h1 className="text-2xl my-4 text-black font-semibold">Today’s Quote</h1>

                    <div className="space-y-6">
                        <div
                            className="w-[60%] backdrop-blur-sm bg-white/35 p-8 border border-white border-spacing-5 rounded-2xl overflow-x-auto"
                            >
                            <ul className="flex flex-nowrap gap-8 min-w-max px-2">
                            {quotes.map((q) => (
                                <li
                                key={q.id}
                                 className="bg-gray-100 shadow-lg border border-black/10 italic flex-col items-center justify-center px-6 text-3xl py-4 rounded-xl text-gray-700 font-medium hover:bg-gray-200 transition max-w-md break-words"
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

                {/* chart section */}
                <section className="flex gap-6 flex-col md:flex-row my-[6rem] items-start justify-between p-6">
                    <div className="px-14 max-w-3xl">
                        <h1 className="text-2xl my-4 text-black font-semibold">Mood Evolution Over Time</h1>
                        <p className="max-w-2xl text-[18px] text-[#656565]">
                            Track your emotional patterns through daily, weekly, and monthly insights.
                        </p>
                        <div className="my-3 bg-white/60 backdrop-blur-sm p-6 rounded-xl border border-white shadow-lg">
                            <LineChart
                                labels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
                                happyUsers={[12, 19, 7, 14, 22, 29, 40]}
                                emotions={[10, 15, 12, 20, 18, 25, 30]}
                            />
                        </div>
                        <button
                            className="bg-gradient-to-tr text-[15px] cursor-pointer mt-5 rounded-md flex items-center justify-center border font-semibold border-gray-300 px-5 py-2 from-gray-200 via-white to-gray-200"
                        >
                            <a href="/emotion/analytics">View Analytics</a>
                            <ChartNoAxesCombinedIcon className="w-5 h-5 ml-2" />
                        </button>
                    </div>
                </section>
                {/* Feed section */}
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
                {/* Payment section */}
                <section className="flex max-w-3xl gap-6 flex-col md:flex-row items-start justify-between p-6">
                    <div className="mx-14 pb-7 rounded-[1.5rem] w-full bg-white">
                        <div className="mb-3">
                            <img className="rounded-t-[1.5rem]" src="/img/pay-sect-image.jpg" alt="pay-sect-image" />
                        </div>
                        <div className="flex px-7 justify-between">
                            <h1 className="text-2xl text-black font-semibold">Choose Your Wellness Plan</h1>
                            <p className="border px-2 py-1 rounded-xl bg-yellow-500 text-white font-semibold">
                                Pro Plan
                            </p>
                        </div>
                        
                        <div className="flex border-b px-7 border-black/25 gap-[6rem] mt-4 w-full">
                            <ul className="list-disc my-5 pl-5">
                                <li className="max-w-2xl text-[16px] text-[#656565]">
                                    All features
                                </li>
                                <li className="max-w-2xl text-[16px] text-[#656565]">
                                    Mood predictions
                                </li>
                            </ul>
                            <ul className="list-disc my-5 pl-5">
                                <li className="max-w-2xl text-[16px] text-[#656565]">
                                    Personalized content
                                </li>
                                <li className="max-w-2xl text-[16px] text-[#656565]">
                                    Priority support
                                </li>
                            </ul>
                        </div>
                        <div className="px-7">
                            {hasActivePlan ? (
                                <button className="bg-gradient-to-tr shadow-lg shadow-white text-[15px] cursor-pointer mt-5 rounded-md flex items-center justify-center border font-semibold border-gray-300 px-5 py-2 from-gray-200 via-white to-gray-200">
                                    <a href="/journal/create">Add Journal</a>
                                    <Plus className="w-5 h-5 ml-2" />
                                </button>
                            ) : (
                                <button className="hover:scale-[1.09] hover:shadow-xl hover:shadow-yellow-600/40 hover:text-yellow-600 transition-all duration-500 bg-gradient-to-tr text-[15px] cursor-pointer mt-5 rounded-md flex items-center justify-center border font-semibold border-gray-300 px-5 py-2 from-gray-200 via-white to-gray-200">
                                    <a href="/plans">Get your plan</a>
                                    <Crown className="w-5 h-5 ml-2" />
                                </button>
                            )}
                        </div>
                    </div>
                </section>
        </main>
        </AppLayout>
        </>
    );
}
