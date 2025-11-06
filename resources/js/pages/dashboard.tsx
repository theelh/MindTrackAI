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
import {BadgeHelpIcon, Mail, Plus, ChartNoAxesCombinedIcon, Quote, BadgePlusIcon, Crown, Gift} from "lucide-react";
import { url } from 'inspector';

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
                        <button className="bg-gradient-to-tr text-[15px] rounded-md flex items-center justify-center border font-semibold border-spacing-5 border-gray-300 px-5 py-2 from-gray-200 via-white to-gray-200">
                            <a href="/processes">View Analytics</a>
                            <ChartNoAxesCombinedIcon className="w-5 h-5 ml-2"/>
                        </button>
                    </div>
                </div>
                <div className="p-14 w-80">
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
                        Upload your image and get your emotional analyses
                    </p>
                    <button
                        className="bg-gradient-to-tr text-[15px] cursor-pointer mt-5 rounded-md flex items-center justify-center border font-semibold border-gray-300 px-5 py-2 from-gray-200 via-white to-gray-200"
                    >
                        <BadgePlusIcon className="w-5 h-5 mr-2" />
                        <a href="/upload">Upload your image</a>
                    </button>
                </div>
            </section>
        </main>
        </AppLayout>
        </>
    );
}
