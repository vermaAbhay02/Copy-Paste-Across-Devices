import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Clipboard from "./Clipboard.jsx";
import Home from "./components/Home.jsx";

export default function App() {
  return (
    <>
      <Toaster position="top-center" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:key" element={<Clipboard />} />
        </Routes>
      </BrowserRouter></>
  );
}