import React from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import { type SharedData } from "@/types";
import { useTranslation } from "react-i18next";
import LangSwitcher from "@/components/LangSwitcher";
import AppTop from "@/components/app-top-welcome";

// ✅ Manual route helpers (no Ziggy needed)
const routes = {
  dashboard: "/dashboard",
  adminDashboard: "/adminDash",
  login: "/login",
  register: "/register",
};


export default function Welcome({ canRegister = true }: { canRegister?: boolean }) {
  const { auth } = usePage<SharedData>().props;
  const { t } = useTranslation();

  return (
    <>
    {/*LangSwitcher*/}
          <div className="fixed top-14 right-6 z-50 p-4 rounded-full shadow-xl
            transition-all duration-300">
            <LangSwitcher />
          </div>
      <Head title="Welcome">
        <link rel="preconnect" href="https://fonts.bunny.net" />
        <link
          href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
          rel="stylesheet"
        />
      </Head>

{/* ✅ Background container with controlled layering */}
            <div className="h-full fixed flex inset-0 items-end justify-end overflow-hidden z-0">
            <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full fixed h-full object-cover"
            >
                <source src="/videos/welc-video-comp.mp4" type="video/mp4" />
            </video>
            </div>
      <div className="flex min-h-screen relative z-10 flex-col items-center p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
        {/* 🧭 Header / Navbar */}
        
          <AppTop />

                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <main className="flex w-full max-w-[335px] flex-col-reverse lg:max-w-4xl lg:flex-row">
                        
                    </main>
                </div>
                <div className="hidden h-14.5 lg:block"></div>
            </div>
        </>
    );
}
