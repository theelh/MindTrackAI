import React from "react";
import { Head } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { ArrowRightToLineIcon, BadgeDollarSignIcon, BadgeHelpIcon, ChartNoAxesCombinedIcon, CheckCheckIcon, CodeXmlIcon, ContactIcon, WandSparklesIcon } from "lucide-react";

interface AboutProps {
  userCount: number;
  quoteCount: number;
  happyUsers: number;
  capital: number;
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "About us",
    href: "/about",
  },
];

const About: React.FC<AboutProps> = ({ userCount, quoteCount, happyUsers, capital }) => {
  const data = [
    { name: "Users", value: userCount },
    { name: "Quotes", value: quoteCount },
    { name: "Happy Users", value: happyUsers },
    { name: "Capital ($)", value: capital },
  ];

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

  return (
    <>
      <Head title="About" />
      <AppLayout breadcrumbs={breadcrumbs}>
        <div className="w-full mx-auto py-16 px-6">
          <h1 className="text-4xl md:text-4xl font-bold mb-10 text-center">
            Emotional Well-Being for Everyone
          </h1>
        <p className="text-[16px] md:text-[18px] text-gray-600 mt-3 text-center max-w-lg mx-auto">
            We combine psychology, design, and AI to help people understand themselves.
        </p>
        <div className="mt-8 mx-auto items-center justify-center w-full flex gap-4">
            <a href="#mission" className="bg-gradient-to-tr text-[15px] rounded-md flex items-center justify-center border font-semibold border-spacing-5 border-gray-300 px-5 py-2 from-gray-200 via-white to-gray-200">
                Learn More About Our Mission
                <ArrowRightToLineIcon className="w-5 h-5 ml-2"/>
            </a>
            <a
                href="Contact"
                className="bg-gradient-to-tr text-[15px] rounded-md flex items-center justify-center border font-semibold px-5 py-2 from-gray-200 via-white to-gray-200"
                >
                {/* :*------------------            Fix contact route ------------------*: */}
                Meet the Team
                <ContactIcon className="w-5 h-5 ml-2" />
            </a>
        </div>
        <section className="grid grid-cols-2 my-[5rem] items-center gap-5 w-full">
          {/* Bar Chart */}
          <div className="hover:scale-[1.03] hover:shadow-xl hover:shadow-indigo-600/40 hover:text-indigo-600 transition-all duration-500 bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-center">Platform Metrics</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#82ca9d">
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-md hover:scale-[1.03] hover:shadow-xl hover:shadow-indigo-600/40 hover:text-indigo-600 transition-all duration-500">
            <h2 className="text-2xl font-semibold mb-4 text-center">Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center md:text-left mb-16">
            <div className="p-6 hover:scale-[1.03] hover:shadow-xl hover:shadow-indigo-600/40 hover:text-indigo-600 transition-all duration-500 bg-white rounded-2xl shadow-md">
              <h2 className="text-2xl font-semibold mb-2">Total Users</h2>
              <p className="text-gray-700 text-xl">{userCount}</p>
            </div>

            <div className="p-6 hover:scale-[1.03] hover:shadow-xl hover:shadow-indigo-600/40 hover:text-indigo-600 transition-all duration-500 bg-white rounded-2xl shadow-md">
              <h2 className="text-2xl font-semibold mb-2">Total Quotes</h2>
              <p className="text-gray-700 text-xl">{quoteCount}</p>
            </div>

            <div className="p-6 hover:scale-[1.03] hover:shadow-xl hover:shadow-indigo-600/40 hover:text-indigo-600 transition-all duration-500 bg-white rounded-2xl shadow-md">
              <h2 className="text-2xl font-semibold mb-2">Happy Users</h2>
              <p className="text-gray-700 text-xl">{happyUsers}</p>
            </div>

            <div className="p-6 hover:scale-[1.03] hover:shadow-xl hover:shadow-indigo-600/40 hover:text-indigo-600 transition-all duration-500 bg-white rounded-2xl shadow-md">
              <h2 className="text-2xl font-semibold mb-2">Platform Capital</h2>
              <p className="text-gray-700 text-xl">{capital} $</p>
            </div>
          </div>
            <section id="mission">
                <div className="flex gap-[8rem]">
                    <div className="mt-10">
                        <h1 className="text-4xl md:text-4xl font-bold mb-5">
                            Mission:
                        </h1>
                        <p className="text-[16px] md:text-[18px] text-gray-600 mt-3 max-w-lg">
                            We aim to provide intuitive and high-quality digital tools that are accessible to everyone — from beginners to professionals.
                        </p>
                        <h1 className="text-4xl mt-8 md:text-4xl font-bold mb-5">
                            How it all started
                        </h1>
                        <p className="text-[16px] md:text-[18px] text-gray-600 mt-3 max-w-lg">
                            Our journey began with a simple idea: create a modern tool that solves real-life problems without unnecessary complexity.
                            What started as a small project quickly grew into a platform used by people worldwide.
                            We combined design, technology, and listening to user feedback to build something meaningful — and we’re just getting started.
                        </p>
                    </div>
                    <div className="items-start justify-start">
                        <ul className="max-w-5xl space-y-4 mt-10">
                            <li className="hover:scale-[1.03] hover:shadow-xl hover:shadow-[#316EB5]/40 hover:text-indigo-600 transition-all duration-500 flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                            <span className="h-10 w-10 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 font-semibold">
                                <CheckCheckIcon/>
                            </span>
                            <div>
                                <h2 className="text-lg text-black font-bold">Innovation:</h2>
                                <p className="text-gray-700 flex-col font-medium">We constantly explore new ideas to enhance our solutions.</p>
                            </div>
                            </li>
                            <li className="hover:scale-[1.03] hover:shadow-xl hover:shadow-[#316EB5]/40 hover:text-indigo-600 transition-all duration-500 flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                            <span className="h-10 w-10 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 font-semibold">
                                <CheckCheckIcon/>
                            </span>
                            <div>
                                <h2 className="text-lg text-black font-bold">Quality:</h2>
                                <p className="text-gray-700 flex-col font-medium">We focus on stability, performance, and excellence.</p>
                            </div>
                            </li>
                            <li className="hover:scale-[1.03] hover:shadow-xl hover:shadow-[#316EB5]/40 hover:text-indigo-600 transition-all duration-500 flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                            <span className="h-10 w-10 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 font-semibold">
                                <CheckCheckIcon/>
                            </span>
                            <div>
                                <h2 className="text-lg text-black font-bold">Transparency:</h2>
                                <p className="text-gray-700 flex-col font-medium">Honest pricing, clear communication, and user-first decisions.</p>
                            </div>
                            </li>
                            <li className="hover:scale-[1.03] hover:shadow-xl hover:shadow-[#316EB5]/40 hover:text-indigo-600 transition-all duration-500 flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                            <span className="h-10 w-10 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 font-semibold">
                                <CheckCheckIcon/>
                            </span>
                            <div>
                                <h2 className="text-lg text-black font-bold">Community:</h2>
                                <p className="text-gray-700 flex-col font-medium">We grow by listening to our users.</p>
                            </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
            <section id="team" className="py-20 px-6">
                <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
                    Meet the Team
                </h2>

                <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-10">
                    
                    {/* Card 1 */}
                    <div className="bg-white/40 backdrop-blur-lg py-[4rem] shadow-lg rounded-2xl p-6 border border-white/20 
                                    hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-20 flex items-center justify-center h-20 rounded-full bg-gradient-to-tr from-cyan-200 to-cyan-400 mb-4">
                            <CodeXmlIcon/>
                        </div>
                        <h3 className="text-xl font-semibold">Marwane — Founder & Developer</h3>
                        <p className="text-gray-600 max-w-md mx-auto mt-2 text-sm">
                        Passionate about building reliable digital experiences.  
                        Leads development, architecture, and product direction.
                        </p>
                    </div>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white/40 backdrop-blur-lg py-[4rem] shadow-lg rounded-2xl p-6 border border-white/20 
                                    hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-20 flex items-center justify-center h-20 rounded-full bg-gradient-to-tr from-cyan-200 to-cyan-400 mb-4">
                            <WandSparklesIcon/>
                        </div>
                        <h3 className="text-xl font-semibold">Marwane — UI/UX Designer</h3>
                        <p className="text-gray-600 mt-2 max-w-md mx-auto text-sm">
                        Creates modern, human-centered interfaces  
                        with accessible and scalable design systems.
                        </p>
                    </div>
                    </div>

                </div>
                </section>
        </div>
      </AppLayout>
    </>
  );
};

export default About;