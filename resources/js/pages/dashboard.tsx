import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import {  type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { type User } from '@/types';
import { UserInfoName } from '@/components/UserInfoName';
import {BadgeHelpIcon, Plus, ChartNoAxesCombinedIcon, Quote, BadgePlusIcon, Crown, Gift, ArrowRightIcon} from "lucide-react";
import LineChart from '@/components/LineChart';
import { useTranslation } from 'react-i18next';

interface Quote {
    id: number;
    text: string;
    created_at: string;
}

interface Props {
    quotes: Quote[];
}


interface Quote {
    id: number;
    text: string;
}

export default function Dashboard({ quotes }: Props) {  
    const { t } = useTranslation();
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t("Home"),
            href: dashboard().url,        
        },
    ];
    const handleGenerate = () => {
        router.post("/quotes/generate");
    };

    const { props } = usePage<{ 
        auth: { user: User }, 
        userPlan?: string, 
        trialEndsAt?: string 
    }>();

    const userPlan = props.userPlan;

    const hasActivePlan = userPlan && userPlan !== "free";


    const { i18n } = useTranslation();
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
        <Head title={t("Home")} />

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
            </div>

            {/* ✅ Actual page content above it */}
            <AppLayout breadcrumbs={breadcrumbs}>
            <main className="relative z-10 flex flex-col w-full mb-6">
            <section className="flex gap-6 flex-col md:flex-row items-start justify-between p-6">
                <div className={`p-14 ${
                        i18n.language === "ar" ? "max-w-5xl" : "max-w-8xl"
                    }`}>
                    <h2 className="text-2xl  font-bold">{t("Welcome")}, <span className="text-[#4556FE]"><UserInfoName user={props.auth.user} /></span></h2>
                    <h1 className="text-[48px] my-4 font-semibold leading-[3rem]"> <span className="bg-clip-text text-transparent bg-gradient-to-r from-black to-[#4556FE]">{t("desc")}</span></h1>
                    <p className="max-w-2xl text-[18px] text-[#656565]">
                        {t("desc2")}
                    </p>
                    <div className="mt-3 flex gap-4">
                        <button className="hover:scale-[1.09] hover:border-indigo-400 hover:shadow-xl hover:bg-gradient-to-tl hover:from-black hover:via-indigo-950 hover:to-indigo-600 hover:shadow-black/40 hover:text-white transition-all duration-500 bg-gradient-to-tr shadow-lg shadow-white text-[15px] cursor-pointer mt-5 rounded-md flex items-center justify-center border font-semibold border-gray-300 px-5 py-2 from-gray-200 via-white to-gray-200">
                            <a  href="/about">{t("about")} </a>
                            <BadgeHelpIcon className="w-5 h-5 ml-2"/>
                        </button>
                        <a
                            href="/emotion/analytics"
                            className="hover:scale-[1.09] hover:border-indigo-400 hover:shadow-xl hover:bg-gradient-to-tl hover:from-black hover:via-indigo-950 hover:to-indigo-600 hover:shadow-black/40 hover:text-white transition-all duration-500 bg-gradient-to-tr shadow-lg shadow-white text-[15px] cursor-pointer mt-5 rounded-md flex items-center justify-center border font-semibold border-gray-300 px-5 py-2 from-gray-200 via-white to-gray-200">
                            {t("analytics")}
                            <ChartNoAxesCombinedIcon className="w-5 h-5 ml-2" />
                        </a>
                    </div>
                </div>
                <div className="p-14 w-[50%] items-start">
                    {hasActivePlan ? (
                        <button className="hover:scale-[1.09] hover:border-indigo-400 hover:shadow-xl hover:bg-gradient-to-tl hover:from-black hover:via-indigo-950 hover:to-indigo-600 hover:shadow-black/40 hover:text-white transition-all duration-500 bg-gradient-to-tr shadow-lg shadow-white text-[15px] cursor-pointer mt-5 rounded-md flex items-center justify-center border font-semibold border-gray-300 px-5 py-2 from-gray-200 via-white to-gray-200">
                            <a href="/journal/create">{t("addJournal")}</a>
                            <Plus className="w-5 h-5 ml-2" />
                        </button>
                    ) : (
                        <div className="flex flex-col gap-1">
                            <button className="hover:scale-[1.03] hover:shadow-xl hover:shadow-yellow-300/40 hover:text-white transition-all duration-500 bg-yellow-400 text-white shadow-lg shadow-yellow-100 text-[15px] cursor-pointer mt-5 rounded-md flex items-center justify-center border font-semibold border-yellow-200 border-spacing-5 py-2">
                                <a href="/plans">{t("GetYourPlan")}</a>
                                <Crown className="w-5 h-5 ml-2" />
                            </button>
                            <button className="hover:scale-[1.03] hover:shadow-xl hover:border-indigo-400 hover:shadow-white/60 hover:bg-gradient-to-tr hover:from-black hover:via-indigo-600 hover:to-indigo-200 hover:text-white transition-all duration-500 bg-gradient-to-tr text-[15px] cursor-pointer mt-5 rounded-md flex items-center justify-center border font-semibold border-gray-300  py-2 from-gray-200 via-white to-gray-200">
                                <a href="/trial">{t("ContinueFreeTrial")}</a>
                                <Gift className="w-5 h-5 ml-2" />
                            </button>
                        </div>
                    )}
                </div>
            </section>
            <section className="flex gap-6 flex-col md:flex-row items-start justify-between p-6">
                <div className="px-14 w-full">
                    <h1 className="text-2xl my-4 text-black font-semibold">{t("TodayQuote")}</h1>

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
                                <p className="font-semibold text-xl my-5">{t("Author")}: MindTrack AI</p>
                                </li>
                            ))}
                            </ul>
                        </div>

                    <button
                        onClick={handleGenerate}
                        className="hover:scale-[1.09] hover:border-indigo-400 hover:shadow-xl hover:bg-gradient-to-tl hover:from-black hover:via-indigo-950 hover:to-indigo-600 hover:shadow-black/40 hover:text-white transition-all duration-500 bg-gradient-to-tr shadow-lg shadow-white text-[15px] cursor-pointer mt-5 rounded-md flex items-center justify-center border font-semibold border-gray-300 px-5 py-2 from-gray-200 via-white to-gray-200"
                    >
                        <BadgePlusIcon className="w-5 h-5 mr-2" />
                        {t("GenerateANewQuote")}
                    </button>
                    </div>
                </div>
                </section>

                {/* chart section */}
                <section className="flex gap-6 flex-col md:flex-row my-[6rem] items-start justify-between p-6">
                    <div className="px-14 max-w-5xl">
                        <h1 className="text-2xl my-4 text-black font-semibold">{t("MoodEvolutionOverTime")}</h1>
                        <p className="max-w-2xl text-[18px] text-[#656565]">
                            {t("desc3")}
                        </p>
                        <div className="my-3 bg-white/60 backdrop-blur-sm p-6 rounded-xl border border-white shadow-lg">
                            <LineChart
                                labels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
                                happyUsers={[12, 19, 7, 14, 22, 29, 40]}
                                emotions={[10, 15, 12, 20, 18, 25, 30]}
                            />
                        </div>
                        <button
                            className="hover:scale-[1.09] hover:border-indigo-400 hover:shadow-xl hover:bg-gradient-to-tl hover:from-black hover:via-indigo-950 hover:to-indigo-600 hover:shadow-black/40 hover:text-white transition-all duration-500 bg-gradient-to-tr shadow-lg shadow-white text-[15px] cursor-pointer mt-5 rounded-md flex items-center justify-center border font-semibold border-gray-300 px-5 py-2 from-gray-200 via-white to-gray-200"
                        >
                            <a href="/emotion/analytics">
                                {t("analytics")}
                            </a>
                            <ChartNoAxesCombinedIcon className="w-5 h-5 ml-2" />
                        </button>
                    </div>
                </section>
                {/* Feed section */}
                <section className="flex gap-6 max-w-3xl flex-col md:flex-row items-start justify-between p-6">
                    <div className="px-14 w-full">
                        <h1 className="text-2xl my-4 text-black font-semibold">
                            {t("feed_title")}
                        </h1>

                        <p className="max-w-2xl text-[18px] text-[#656565]">
                            {t("feed_description")}
                        </p>

                        <div className="my-3">
                            <img
                                className="backdrop-blur-sm rounded-xl border border-black/20 shadow-lg"
                                src="/img/feedPage-capture.png"
                                alt="feedPage-capture"
                            />
                        </div>

                        <button
                            className="hover:scale-[1.09] hover:border-indigo-400 hover:shadow-xl hover:bg-gradient-to-tl hover:from-black hover:via-indigo-950 hover:to-indigo-600 hover:shadow-black/40 hover:text-white transition-all duration-500 bg-gradient-to-tr shadow-lg shadow-white text-[15px] cursor-pointer mt-5 rounded-md flex items-center justify-center border font-semibold border-gray-300 px-5 py-2 from-gray-200 via-white to-gray-200"
                        >
                            <ArrowRightIcon className="w-5 h-5 mr-2" />
                            <a href="/feed">{t("feed_button")}</a>
                        </button>
                    </div>
                </section>

                {/* Payment section */}
                <section className="flex max-w-3xl gap-6 flex-col md:flex-row items-start justify-between p-6">
                    <div className="mx-14 pb-7 rounded-[1.5rem] w-full bg-white">

                        <div className="mb-3">
                            <img
                                className="rounded-t-[1.5rem]"
                                src="/img/pay-sect-image.jpg"
                                alt="pay-sect-image"
                            />
                        </div>

                        <div className="flex px-7 justify-between">
                            <h1 className="text-2xl text-black font-semibold">
                                {t("plan_title")}
                            </h1>

                            {hasActivePlan ? (
                                <p className="border px-2 py-1 rounded-xl bg-yellow-500 text-white font-semibold">
                                    {t("in_plan")}
                                </p>
                            ) : (
                                <p className="border px-2 py-1 rounded-xl bg-yellow-500 text-white font-semibold">
                                    {t("pro_plan")}
                                </p>
                            )}
                        </div>

                        <div className="flex border-b px-7 border-black/25 gap-[6rem] mt-4 w-full">
                            <ul className="list-disc my-5 pl-5">
                                <li className="max-w-2xl text-[16px] text-[#656565]">
                                    {t("feature_all")}
                                </li>
                                <li className="max-w-2xl text-[16px] text-[#656565]">
                                    {t("feature_mood")}
                                </li>
                            </ul>

                            <ul className="list-disc my-5 pl-5">
                                <li className="max-w-2xl text-[16px] text-[#656565]">
                                    {t("feature_personalized")}
                                </li>
                                <li className="max-w-2xl text-[16px] text-[#656565]">
                                    {t("feature_priority_support")}
                                </li>
                            </ul>
                        </div>

                        <div className="px-7">
                            {hasActivePlan ? (
                                <button className="hover:scale-[1.09] hover:border-indigo-400 hover:shadow-xl hover:bg-gradient-to-tl hover:from-black hover:via-indigo-950 hover:to-indigo-600 hover:shadow-black/40 hover:text-white transition-all duration-500 bg-gradient-to-tr shadow-lg shadow-white text-[15px] cursor-pointer mt-5 rounded-md flex items-center justify-center border font-semibold border-gray-300 px-5 py-2 from-gray-200 via-white to-gray-200">
                                    <a href="/journal/create">{t("addJournal")}</a>
                                    <Plus className="w-5 h-5 ml-2" />
                                </button>
                            ) : (
                                <button className="hover:scale-[1.09] hover:shadow-xl hover:shadow-yellow-600/40 hover:text-yellow-600 transition-all duration-500 bg-gradient-to-tr text-[15px] cursor-pointer mt-5 rounded-md flex items-center justify-center border font-semibold border-gray-300 px-5 py-2 from-gray-200 via-white to-gray-200">
                                    <a href="/plans">{t("GetYourPlan")}</a>
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
