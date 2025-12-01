import React, { useState } from "react";
import FloatingButton from "./FloatingButton";
import ChatWindow from "./ChatWindow";

export default function Chatbot() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {!open && <FloatingButton onClick={() => setOpen(true)} />}
      {open && <ChatWindow onClose={() => setOpen(false)} />}
    </>
  );
}