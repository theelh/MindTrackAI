import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { UserInfo } from '@/components/user-info';
import { useInitials } from '@/hooks/use-initials';
import AppLayout from '@/layouts/app-layout';
import { SharedData, type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { BrowserRouter, Routes, Route, data } from 'react-router-dom';
import { type User } from '@/types';
import { UserInfoName } from '@/components/UserInfoName';
import {BadgeHelpIcon, Mail, Plus, ChartNoAxesCombinedIcon, Quote, BadgePlusIcon, Crown, Gift, ArrowRightIcon} from "lucide-react";
import HeroAnimation from '@/components/HeroAnimation';
import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from 'react';
import { ScrollSmoother } from 'gsap/ScrollSmoother';


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

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export default function Services({ quotes }: Props) {  
   useEffect(() => {
    const cards = [".card-1", ".card-2", ".card-3", ".card-4"];

    cards.forEach((card) => {
      gsap.fromTo(
        card,
        { opacity: 0, x: 100 },
        {
          opacity: 1,
          x: 0,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            toggleActions: "play none none reverse",
            markers: false
          },
        }
      );
    });
  }, []);

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
        <Head title="Services" />
            {/* ✅ Fixed hero background (not affected by ScrollSmoother) */}
            <div className="h-full bg-white left-64 fixed inset-0 overflow-hidden z-0">
                <HeroAnimation
                imageBaseUrl="/img/frame"
                totalFrames={100}
                scale={0.5}
                />
            </div>

            <AppLayout breadcrumbs={breadcrumbs}>
            <main className="relative z-10 flex flex-col w-full mb-6">
                {/* <div className="flex pt-8 justify-between">
                    <h1 className="text-[48px] px-10 pt-4 my-4 font-semibold text-black leading-[2rem]"> </h1>
                    <div className="p-14">
                    {hasActivePlan ? (
                        <button className="bg-gradient-to-tr shadow-xl shadow-white text-[15px] cursor-pointer mt-5 rounded-md flex items-center justify-center border font-semibold border-gray-300 px-5 py-2 from-gray-200 via-white to-gray-200">
                            <a href="/journal/create">Add Journal</a>
                            <Plus className="w-5 h-5 ml-2" />
                        </button>
                    ) : (
                        <div className="flex flex-col gap-1">
                            <button className="bg-yellow-400 px-2 text-white shadow-lg shadow-yellow-300 text-[15px] cursor-pointer mt-5 rounded-md flex items-center justify-center border font-semibold border-yellow-400 border-spacing-5 py-2">
                                <a href="/plans">Get your plan</a>
                                <Crown className="w-5 h-5 ml-2" />
                            </button>
                            <button className="bg-gradient-to-tr text-[15px] cursor-pointer mt-5 rounded-md flex items-center px-3 justify-center border font-semibold border-gray-300  py-2 from-gray-200 via-white to-gray-200">
                                <a href="/trial">Continue Free Trial</a>
                                <Gift className="w-5 h-5 ml-2" />
                            </button>
                        </div>
                    )}
                </div>
                </div> */}
            <section className="flex flex-col items-center justify-center px-6 md:px-10 py-10 gap-20">
                {/* Card 1 – Right */}
                <div className="w-full flex justify-end">
                    <div className="max-w-2xl w-full md:w-[70%] flex flex-col items-start rounded-3xl p-7 hover:scale-[1.03] transition-all duration-500 bg-white/50 shadow-lg">

                    <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-black to-cyan-300 text-[36px] md:text-[45px] font-bold mb-4">
                        Mood Detection
                    </h1>

                    <div className="w-full overflow-hidden rounded-2xl">
                        <img
                        src="./img/face-recognition-modif.png"
                        alt="Mood Detection"
                        className="w-full h-full object-cover"
                        />
                    </div>

                    <h2 className="text-xl md:text-2xl text-blackfont-semibold mt-6">
                        AI Emotion Recognition
                    </h2>
                    <p className="text-[16px] md:text-[18px] text-gray-600 mt-3 max-w-lg">
                        Understand your emotional tone from text, voice, and facial cues.
                    </p>

                    </div>
                </div>

                {/* Card 2 – Left */}
                <div className="w-full flex justify-start">
                    <div className="max-w-2xl w-full md:w-[70%] flex flex-col items-start rounded-3xl p-7 hover:scale-[1.03] transition-all duration-500 bg-white/50 shadow-lg">

                    <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-black to-cyan-300 text-[36px] md:text-[45px] font-bold mb-4">
                        Trend Analytics
                    </h1>

                    <div className="w-full overflow-hidden rounded-2xl">
                        <img
                        src="./img/robot-showing-low-results-statistics.jpg"
                        alt="Trend Analytics"
                        className="w-full h-full object-cover"
                        />
                    </div>

                    <h2 className="text-xl md:text-2xl text-black font-semibold mt-6">
                        Visualize Emotional Growth
                    </h2>
                    <p className="text-[16px] md:text-[18px] text-gray-600 mt-3 max-w-lg">
                        Track your progress over days, weeks and months through clean analytics.
                    </p>

                    </div>
                </div>

                {/* Card 3 – Right */}
                <div className="w-full flex justify-end">
                    <div className="max-w-2xl w-full md:w-[70%] flex flex-col items-start rounded-3xl p-7 hover:scale-[1.03] transition-all duration-500 bg-white/50 shadow-lg">

                    <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-black to-cyan-300 text-[36px] md:text-[45px] font-bold mb-4">
                        Personalized Guidance
                    </h1>

                    <div className="w-full overflow-hidden rounded-2xl">
                        <img
                        src="./img/call-center-worker-using-ai-tech-laptop-reply-customers-closeup.jpg"
                        alt="Personalized Guidance"
                        className="w-full h-full object-cover"
                        />
                    </div>

                    <h2 className="text-xl md:text-2xl text-black font-semibold mt-6">
                        Tailored Recommendations
                    </h2>
                    <p className="text-[16px] md:text-[18px] text-gray-600 mt-3 max-w-lg">
                        Receive music, meditation and self-care content matching your mood.
                    </p>

                    </div>
                </div>

                {/* Card 4 – Left */}
                <div className="w-full flex justify-start">
                    <div className="max-w-2xl w-full md:w-[70%] flex flex-col items-start rounded-3xl p-7 hover:scale-[1.03] transition-all duration-500 bg-white/50 shadow-lg">

                    <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-black to-cyan-300 text-[36px] md:text-[45px] font-bold mb-4">
                        Secure Storage
                    </h1>

                    <div className="w-full overflow-hidden rounded-2xl">
                        <img
                        src="./img/secured-file-folder-futuristic-data-network.jpg"
                        alt="Secure Storage"
                        className="w-full h-full object-cover"
                        />
                    </div>

                    <h2 className="text-xl md:text-2xl text-black font-semibold mt-6">
                        Your Data, Your Control
                    </h2>
                    <p className="text-[16px] md:text-[18px] text-gray-600 mt-3 max-w-lg">
                        All information is encrypted and stored with complete transparency.
                    </p>

                    </div>
                </div>

                </section>
                <section className="bg-white border-t py-5 px-10 border-black/25 flex gap-10">
                    <div className=" pb-7 rounded-[1.5rem] shadow-lg w-[70%] bg-[#f2f2f2] hover:scale-[1.03] transition-all duration-500">
                        <div className="mb-3">
                            <img className="rounded-t-[1.5rem]" src="/img/pay-sect-image.jpg" alt="pay-sect-image" />
                        </div>
                        <div className="flex px-7 justify-between">
                            <h1 className="text-2xl text-black font-semibold">Choose Your Wellness Plan</h1>
                            {hasActivePlan ? (
                                <p className="border px-2 py-1 rounded-xl bg-yellow-500 text-white font-semibold">
                                    Already in Plan
                                </p>
                            ) : (
                                <p className="border px-2 py-1 rounded-xl bg-yellow-500 text-white font-semibold">
                                    Pro Plan
                                </p>
                            )}
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
                                <button className="hover:scale-[1.09] hover:shadow-xl hover:shadow-indigo-600/40 hover:text-indigo-600 transition-all duration-500 bg-gradient-to-tr text-[15px] cursor-pointer mt-5 rounded-md flex items-center justify-center border font-semibold border-gray-300 px-5 py-2 from-gray-200 via-white to-gray-200">
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
                    {/* section2 */}
                    <div className="pb-7 rounded-[1.5rem] shadow-lg w-[70%] bg-[#f2f2f2] hover:scale-[1.03] transition-all duration-500">
                        <div className="mb-3">
                            <img className="rounded-t-[1.5rem]" src="/img/img2.jpg" alt="img2" />
                        </div>
                        <div className="flex px-7 justify-between">
                            <h1 className="text-2xl text-black font-semibold">Your Daily Wellness Stream</h1>
                            <p className="border px-2 py-1 rounded-xl bg-indigo-600 text-white font-semibold">
                                Feed
                            </p>
                        </div>
                        
                        <div className="flex border-b px-7 border-black/25 gap-[6rem] mt-4 w-full">
                            <ul className="list-disc my-5 pl-5">
                                <li className="max-w-2xl text-[16px] text-[#656565]">
                                    Motivational quotes
                                </li>
                                <li className="max-w-2xl text-[16px] text-[#656565]">
                                    Guided meditation videos
                                </li>
                            </ul>
                            <ul className="list-disc my-5 pl-5">
                                <li className="max-w-2xl text-[16px] text-[#656565]">
                                    Calming music
                                </li>
                                <li className="max-w-2xl text-[16px] text-[#656565]">
                                    Breathing exercises
                                </li>
                            </ul>
                        </div>
                        <div className="px-7">
                            <button className="hover:scale-[1.09] hover:shadow-xl hover:shadow-indigo-600/40 hover:text-indigo-600 transition-all duration-500 bg-gradient-to-tr text-[15px] cursor-pointer mt-5 rounded-md flex items-center justify-center border font-semibold border-gray-300 px-5 py-2 from-gray-200 via-white to-gray-200">
                                <a href="/feed">Feed</a>
                                <ArrowRightIcon className="w-5 h-5 ml-2" />
                            </button>
                        </div>
                    </div>
                </section>
        </main>
        </AppLayout>
        </>
    );
}
