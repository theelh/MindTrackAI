// /resources/js/components/FlashMessage.tsx
import React, { useEffect, useState } from "react";

interface FlashProps {
  message?: string;
  type?: "success" | "error";
  duration?: number; // in ms
}

const FlashMessage: React.FC<FlashProps> = ({ message, type = "success", duration = 5000 }) => {
  const [visible, setVisible] = useState(!!message);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration]);

  if (!visible || !message) return null;

  const bgColor = type === "success" ? "bg-green-100" : "bg-red-100";
  const textColor = type === "success" ? "text-green-800" : "text-red-800";

  return (
    <div className={`fixed top-6 right-6 z-50 px-6 py-3 rounded shadow-lg ${bgColor} ${textColor}`}>
      {message}
    </div>
  );
};

export default FlashMessage;
