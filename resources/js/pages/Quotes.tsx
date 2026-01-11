import React from "react";
import { router } from "@inertiajs/react";

interface Quote {
    id: number;
    text: string;
    created_at: string;
}

interface Props {
    quotes: Quote[];
}

export default function Quotes({ quotes }: Props) {
    const handleGenerate = () => {
        router.post("/quotes/generate");
    };
    
    return (
        <div>
            <h1>Latest Quotes</h1>
            <ul>
                {quotes.map(q => (
                    <li key={q.id}>{q.text}</li>
                ))}
            </ul>

     <button
                onClick={handleGenerate}
                className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
                🔄 Generate a new Quote
            </button>
        </div>
    );
}
