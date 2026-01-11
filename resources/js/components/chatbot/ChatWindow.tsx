import React, { useState } from "react";
import { X, History } from "lucide-react";

interface Message {
  sender: "user" | "bot";
  message: string;
}

interface Props {
  onClose: () => void;
}

export default function ChatWindow({ onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<Message[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // -----------------------------
  // 🔵 Load history on demand
  // -----------------------------
  const loadHistory = async () => {
    setHistoryLoading(true);

    try {
      const res = await fetch("/chatbot/history");
      const data = await res.json();

      if (Array.isArray(data.history)) {
        setHistory(data.history);
      }
    } catch (err) {
      console.error("Failed to load chat history:", err);
    }

    setHistoryLoading(false);
  };

  const toggleHistory = () => {
    const newState = !showHistory;
    setShowHistory(newState);

    if (newState) loadHistory();
  };

  // -----------------------------
  // 🔵 Send Message
  // -----------------------------
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages((prev) => [...prev, { sender: "user", message: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/chatbot/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement).content,
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { sender: "bot", message: data.reply || "Server error." },
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", message: "Unable to reach the assistant." },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="fixed bottom-24 right-6 w-96 h-80 bg-white shadow-2xl rounded-xl border flex z-50 animate-fadeIn">

      {/* --------------------
          🔵 History Side Panel 
      -------------------- */}
      {showHistory && (
  <div className="absolute left-0 top-0 w-64 h-full bg-gray-50 border-r shadow-lg z-40 p-3 animate-fadeIn">

    {/* Header with Close Button */}
    <div className="flex justify-between items-center mb-3">
      <h3 className="font-semibold text-gray-700">Recent Chats</h3>

      <button
        onClick={() => setShowHistory(false)}
        className="p-1 hover:bg-gray-200 rounded"
        title="Close history"
      >
        <X size={18} />
      </button>
    </div>

    {historyLoading ? (
      <p className="text-sm text-gray-500">Loading...</p>
    ) : history.length === 0 ? (
      <p className="text-sm text-gray-500">No history.</p>
    ) : (
      <div className="space-y-2 overflow-y-auto h-[90%] pr-1">
        {history.map((item, idx) => (
          <div
            key={idx}
            className={`p-2 text-sm rounded-lg ${
              item.sender === "user"
                ? "bg-blue-100 text-blue-900"
                : "bg-gray-200 text-gray-900"
            }`}
          >
            <strong>{item.sender === "user" ? "You" : "Bot"}:</strong>{" "}
            {item.message}
          </div>
        ))}
      </div>
    )}
  </div>
)}


      {/* --------------------
          🔵 Main Chat Window
      -------------------- */}
      <div className="flex flex-col flex-1">

        {/* Header */}
        <div className="p-4 bg-blue-600 text-white rounded-t-xl flex justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Assistant</span>

            {/* History Button */}
            <button
              onClick={toggleHistory}
              className="ml-2 p-1 hover:bg-blue-500 rounded"
              title="Show chat history"
            >
              <History size={20} />
            </button>
          </div>

          <button onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-2 rounded-lg max-w-[75%] ${
                msg.sender === "user"
                  ? "ml-auto bg-blue-100 text-blue-900"
                  : "mr-auto bg-gray-200 text-gray-900"
              }`}
            >
              {msg.message}
            </div>
          ))}

          {loading && (
            <div className="mr-auto bg-gray-200 text-gray-600 p-2 rounded-lg">
              Assistant is typing...
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-3 border-t mx-auto flex gap-2">
          <input
            className="flex-1 border rounded-lg px-3 py-2 text-sm"
            placeholder="Write a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700"
          >
            Send
          </button>
        </div>

      </div>
    </div>
  );
}
