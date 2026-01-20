import { useEffect, useRef, useState } from "react";
import { subscribeClipboard, writeClipboard } from "./firebase";
import "./App.css";

export default function App() {
  const key = window.location.pathname.replace("/", "") || "default";

  const [text, setText] = useState("");
  const [ready, setReady] = useState(false);

  const isTypingRef = useRef(false);
  const debounceRef = useRef(null);

  // 🔄 Real-time sync (READ)
  useEffect(() => {
    const unsubscribe = subscribeClipboard(key, (remoteText) => {
      if (!isTypingRef.current) {
        setText(remoteText);
        setReady(true);
      }
    });

    return unsubscribe;
  }, [key]);

  // ✍️ Debounced WRITE
  useEffect(() => {
    if (!ready) return;

    clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      await writeClipboard(key, text);
      isTypingRef.current = false;
    }, 800);

    return () => clearTimeout(debounceRef.current);
  }, [text, ready, key]);

  return (
    <div className="app-container">
      <div className="header">
        <button onClick={() => navigator.clipboard.writeText(text)}>
          Copy
        </button>
      </div>

      <textarea
        disabled={!ready}
        value={text}
        onChange={(e) => {
          isTypingRef.current = true;
          setText(e.target.value);
        }}
        placeholder="Type or paste text here..."
      />
    </div>
  );
}