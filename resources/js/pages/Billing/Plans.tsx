import React from "react";
import { router } from "@inertiajs/react";

export default function Plans({ plans }: { plans: any[] }) {

  const handleSubscribe = (plan: string) => {
        window.location.href = `/checkout?plan=${plan}`;
    };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-8">Choose Your Plan</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {plans.map((p) => (
  <div key={p.id} className="p-6 bg-white shadow-md rounded-2xl text-center border">
    <h2 className="text-2xl font-semibold mb-3">{p.name}</h2>
    <p className="text-gray-600">{p.price === 0 ? "Free" : `${p.price} €/month`}</p>

    <form method="POST" action="/checkout">
      <input type="hidden" name="plan" value={p.id} />
      <input type="hidden" name="_token" value={(document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement).content} />
      <button
        type="submit"
        className={`mt-5 px-5 py-2 rounded-lg text-white ${
          p.price === 0 ? "bg-gray-400 hover:bg-gray-500" : "bg-indigo-600 hover:bg-indigo-700"
        }`}
      >
        {p.price === 0 ? "Use Free Plan" : "Subscribe"}
      </button>
    </form>
  </div>
))}
      </div>
    </div>
  );
}
