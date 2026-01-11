import React from "react";
import { Head, usePage } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, User } from "@/types";
import { CheckIcon, CircleDollarSignIcon, Crown, GiftIcon,  GlobeLockIcon,LockKeyholeIcon, Plus,  ShieldOffIcon, XIcon } from "lucide-react";
import HeroAnimationthree from "@/components/HeroAnimationthree";
import { useTranslation } from "react-i18next";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Plan',
        href: '/plans',        
    },
];

export default function Plans({ plans }: { plans: any[] }) {

  const { t } = useTranslation();

  const handleSubscribe = (plan: string) => {
        window.location.href = `/checkout?plan=${plan}`;
    };

    const { props } = usePage<{ 
        auth: { user: User }, 
        userPlan?: string, 
        trialEndsAt?: string 
    }>();
    
        const userPlan = props.userPlan;
    
        const hasActivePlan = userPlan && userPlan !== "free";

  return (

    <>
      <Head title={t("plan.title")} />
      <div className="h-full bg-gradient-to-t from-[#BABABA] to-white fixed left-64 flex inset-0 items-end justify-end overflow-hidden z-0">
        <HeroAnimationthree
        imageBaseUrl="/img/fram3"
            totalFrames={200}
            scale={1}
        />
      </div>
      <AppLayout breadcrumbs={breadcrumbs}>
        <div className="relative min-h-screen my-[5rem] flex flex-col items-start justify-start p-6">
          <h1 className="text-3xl font-bold mb-7">{t("plan.header")}</h1>
          <p className="text-[16px] md:text-[18px] text-gray-600 mt-3 max-w-lg">
            {t("plan.description")}
          </p>
          <ul className="max-w-3xl  space-y-4 mt-10">
            <li className="hover:scale-[1.03] hover:shadow-xl hover:shadow-[#316EB5]/40 hover:text-indigo-600 transition-all duration-500 flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
              <span className="h-10 w-10 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 font-semibold">
                1
              </span>
              <p className="text-gray-700 font-medium">{t("plan.steps.createAccount")}</p>
            </li>

            <li className="hover:scale-[1.03] hover:shadow-xl hover:shadow-[#316EB5]/40 hover:text-indigo-600 transition-all duration-500 flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
              <span className="h-10 w-10 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 font-semibold">
                2
              </span>
              <p className="text-gray-700 font-medium">{t("plan.steps.choosePlan")}</p>
            </li>

            <li className="hover:scale-[1.03] hover:shadow-xl hover:shadow-[#316EB5]/40 hover:text-indigo-600 transition-all duration-500 flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
              <span className="h-10 w-10 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 font-semibold">
                3
              </span>
              <p className="text-gray-700 font-medium">{t("plan.steps.customizePreferences")}</p>
            </li>

            <li className="hover:scale-[1.03] hover:shadow-xl hover:shadow-[#316EB5]/40 hover:text-indigo-600 transition-all duration-500 flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
              <span className="h-10 w-10 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 font-semibold">
                4
              </span>
              <p className="text-gray-700 font-medium">{t("plan.steps.startUsing")}</p>
            </li>
          </ul>
          <h1 className="text-3xl font-bold mt-[10rem] mb-7">{t("plan.subheader")}</h1>
          <ul className="max-w-3xl  space-y-4 mt-10">
            <li className="hover:scale-[1.03] hover:shadow-xl hover:shadow-[#316EB5]/40 hover:text-indigo-600 transition-all duration-500 flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
              <LockKeyholeIcon className="mr-3 text-indigo-600"/>
              <p className="text-gray-700 font-medium">{t("plan.features.encryption")}</p>
            </li>

            <li className="hover:scale-[1.03] hover:shadow-xl hover:shadow-[#316EB5]/40 hover:text-indigo-600 transition-all duration-500 flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
              <CircleDollarSignIcon className="mr-3 text-indigo-600"/>
              <p className="text-gray-700 font-medium">{t("plan.features.payments")}</p>
            </li>

            <li className="hover:scale-[1.03] hover:shadow-xl hover:shadow-[#316EB5]/40 hover:text-indigo-600 transition-all duration-500 flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
              <ShieldOffIcon className="mr-3 text-indigo-600"/>
              <p className="text-gray-700 font-medium">{t("plan.features.cancelAnytime")}</p>
            </li>

            <li className="hover:scale-[1.03] hover:shadow-xl hover:shadow-[#316EB5]/40 hover:text-indigo-600 transition-all duration-500 flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
              <GlobeLockIcon className="mr-3 text-indigo-600"/>
              <p className="text-gray-700 font-medium">{t("plan.features.privacy")}</p>
            </li>
          </ul>

          <div className="grid md:grid-cols-2 mt-[9rem] gap-10">
            {plans.map((p) => (
              <div key={p.id} className={`${
                      p.price === 0 ? "p-6 bg-white shadow-md rounded-2xl text-center border" : "hover:scale-[1.1] hover:shadow-xl hover:shadow-yellow-600/40 scale-[1.07] hover:text-yellow-600 transition-all duration-500 p-6 bg-white shadow-2xl shadow-yellow-600 rounded-2xl text-center border"
                    }`}>
                  {p.price === 0 ? <p className="border mb-7 max-w-16 mx-auto px-2 py-1 text-xs rounded-xl bg-indigo-500 text-white font-semibold">
                                    {t("plan.free")}
                                    </p> : <p className="border mb-7 max-w-20 mx-auto text-xs px-2 py-1 rounded-xl bg-yellow-500 text-white font-semibold">
                                        {hasActivePlan ? (
                                            <p>
                                                {t("plan.alreadyPlan")}
                                            </p>
                                        ) : (
                                            <p>
                                                {t("plan.proPlan")}
                                            </p>
                                        )}
                                </p>}
                <h2 className="text-2xl font-semibold mb-3">{p.name}</h2>
                <p className="text-gray-600">{p.price === 0 ? t("plan.free") : `${p.price} ${t("plan.month")}`}</p>
                <div className="flex-col border-b px-7 border-black/25 items-start justify-start mt-4 w-full">
                    <div className="flex flex-col my-5 items-start ">
                        <p className="max-w-2xl flex items-center text-[16px] text-[#656565]">
                          <CheckIcon className="mr-3 text-yellow-400"/>
                            {p.price === 0 ? t("plan.feature1Free") : t("plan.feature1Pro")}
                        </p>
                        <p className="max-w-2xl flex items-center text-[16px] text-[#656565]">
                            <CheckIcon className="mr-3 text-yellow-400"/>
                            {p.price === 0 ? t("plan.feature2Free") : t("plan.feature2Pro")}
                        </p>
                        <p className="max-w-2xl flex items-center text-[16px] text-[#656565]">
                            <CheckIcon className="mr-3 text-yellow-400"/>
                            {p.price === 0 ? t("plan.feature3Free") : t("plan.feature3Pro")}
                        </p>
                        <p className="max-w-2xl flex items-center text-[16px] text-[#656565]">
                            <CheckIcon className="mr-3 text-yellow-400"/>
                            {p.price === 0 ? t("plan.feature4Free") : t("plan.feature4Pro")}
                        </p>
                        <p className="max-w-2xl flex items-center text-[16px] text-[#656565]">
                            {p.price === 0 ? <XIcon className=" mr-2" /> : <CheckIcon className="mr-3 text-yellow-400" />} {t("plan.feature5")}
                        </p>
                        <p className="max-w-2xl flex items-center text-[16px] text-[#656565]">
                            {p.price === 0 ? <XIcon className=" mr-2" /> : <CheckIcon className="mr-3 text-yellow-400" />} {t("plan.feature6")}
                        </p>
                        <p className="max-w-2xl flex items-center text-[16px] text-[#656565]">
                            {p.price === 0 ? <XIcon className=" mr-2" /> : <CheckIcon className="mr-3 text-yellow-400" />} {t("plan.feature7")}
                        </p>
                    </div>                    
                </div>
                <form method="POST" action="/checkout">
                  <input type="hidden" name="plan" value={p.id} />
                  <input type="hidden" name="_token" value={(document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement).content} />
                  {hasActivePlan ? (
                    // If user already has plan → Show "Add Journal"
                    <a
                        href="/journal/create"
                        className="
                            group mt-5 flex items-center justify-center 
                            px-5 py-2 rounded-md border font-semibold 
                            bg-gradient-to-tr from-gray-200 via-white to-gray-200 
                            text-black shadow-lg 
                            transition-all duration-300

                            hover:scale-[1.05] 
                            hover:bg-gradient-to-tl hover:from-black hover:via-indigo-900 hover:to-indigo-600 
                            hover:text-white hover:border-indigo-400 hover:shadow-indigo-500/40
                        "
                    >
                        {t("plan.addJournal")}
                        <Plus className="w-5 h-5 ml-2 group-hover:text-white" />
                    </a>
                ) : (
                    // If plan NOT active → Show subscription button
                    <button
                        type="submit"
                        className="
                            mt-5 flex items-center justify-center 
                            px-5 py-2 rounded-md border font-semibold 
                            bg-gradient-to-tr from-gray-200 via-white to-gray-200 
                            text-black shadow-md 
                            transition-all duration-300

                            hover:scale-[1.05] 
                            hover:shadow-xl 
                            hover:text-indigo-600
                        "
                    >
                        {p.price === 0 ? (
                            <GiftIcon className="w-5 h-5 mr-2" />
                        ) : (
                            <Crown className="w-5 h-5 mr-2 text-yellow-500" />
                        )}

                        {p.price === 0 ? t("plan.continueFree") : t("plan.getPro")}
                    </button>
                )}
                </form>
              </div>
    ))}
          </div>
        </div>
      </AppLayout>
    </>
  );
}
