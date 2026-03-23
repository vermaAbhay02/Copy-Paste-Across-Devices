import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getClipboardDoc } from "../firebase";
import toast from "react-hot-toast";
import "../App.css";

function Home() {
  const [room, setRoom] = useState("");
  const [mode, setMode] = useState("join");
  const navigate = useNavigate();

  const exampleRoom = "demo123";

  const goToRoom = async () => {
    if (!room.trim()) {
      toast.error("Please enter a room name");
      return;
    }

    const data = await getClipboardDoc(room);

    if (mode === "create" && data) {
      toast.error("Room already exists. Try another name.");
      return;
    }

    if (mode === "join" && !data) {
      toast.error("Room does not exist.");
      return;
    }

    toast.success("Entering room...");
    navigate(`/${room}`);
  };

  const copyExample = async () => {
    await navigator.clipboard.writeText(exampleRoom);
    toast.success("Copied demo room!");
  };

  return (
    <div className="home-wrapper">
      <div className="home-card">
        <h1>📋 Easy Clipboard</h1>

        <p className="subtitle">
          Share text instantly across devices in real-time.
        </p>

        {/* Toggle */}
        <div className="toggle">
          <button
            className={mode === "join" ? "active" : ""}
            onClick={() => setMode("join")}
          >
            Join Room
          </button>
          <button
            className={mode === "create" ? "active" : ""}
            onClick={() => setMode("create")}
          >
            Create Room
          </button>
        </div>

        {/* Instructions */}
        <div className="instructions-box">
          {mode === "join" ? (
            <>
              <h3>🔑 Join a Room</h3>
              <p>Enter the room name and password shared with you.</p>
            </>
          ) : (
            <>
              <h3>🆕 Create a Room</h3>
              <p>Pick a unique name and set a password.</p>
            </>
          )}
        </div>

        {/* Input */}
        <input
          className="room-input"
          placeholder="Enter room name..."
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />

        <button className="primary-btn" onClick={goToRoom}>
          Continue
        </button>

        {/* Example */}
        <div className="example">
          <span>Try demo:</span>
          <code>{exampleRoom}</code>
          <button className="copy-btn" onClick={copyExample}>
            Copy
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;