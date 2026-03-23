import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  subscribeClipboard,
  writeClipboard,
  getClipboardDoc,
  createRoom,
} from "./firebase.js";
import toast from "react-hot-toast";

export default function Clipboard() {
  const { key } = useParams();

  const [text, setText] = useState("");
  const [ready, setReady] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const [roomExists, setRoomExists] = useState(null);

  const isTypingRef = useRef(false);
  const debounceRef = useRef(null);

  // 🔐 Check room
  useEffect(() => {
    const checkRoom = async () => {
      const data = await getClipboardDoc(key);
      setRoomExists(!!data);
    };
    checkRoom();
  }, [key]);

  // 🔓 Auth handler
  const handleAuth = async () => {
    if (!password.trim()) {
      toast.error("Password cannot be empty");
      return;
    }

    const data = await getClipboardDoc(key);

    if (!data) {
      await createRoom(key, password);
      toast.success("Room created!");
      setAuthorized(true);
      setReady(true);
    } else {
      if (data.password === password) {
        toast.success("Access granted");
        setAuthorized(true);
      } else {
        toast.error("Wrong password");
      }
    }
  };

  // 🔄 Subscribe
  useEffect(() => {
    if (!authorized) return;

    const unsubscribe = subscribeClipboard(key, (remoteText) => {
      if (!isTypingRef.current) {
        setText(remoteText);
        setReady(true);
      }
    });

    return unsubscribe;
  }, [authorized, key]);

  // ✍️ Write
  useEffect(() => {
    if (!ready || !authorized) return;

    clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      await writeClipboard(key, text);
      isTypingRef.current = false;
    }, 800);

    return () => clearTimeout(debounceRef.current);
  }, [text, ready, authorized, key]);

  // 🔐 AUTH UI (FIXED)
  if (!authorized) {
    return (
      <div className="home-wrapper">
        <div className="home-card">
          <h2>
            {roomExists ? "🔐 Enter Password" : "🆕 Create Room Password"}
          </h2>

          <p className="subtitle">
            {roomExists
              ? "Enter the password to access this room"
              : "Set a password for your new room"}
          </p>

          <input
            className="room-input"
            type="password"
            placeholder="Enter password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="primary-btn" onClick={handleAuth}>
            Continue
          </button>
        </div>
      </div>
    );
  }

  // ✅ MAIN UI
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