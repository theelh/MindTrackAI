import React from "react";
import { MessageCircle } from "lucide-react";

interface Props {
  onClick: () => void;
}

export default function FloatingButton({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="
        fixed bottom-6 right-6 z-50
        bg-blue-600 hover:bg-blue-700 
        text-white p-4 rounded-full shadow-xl
        transition-all duration-300
      "
    >
      <MessageCircle size={26} />
    </button>
  );
}
