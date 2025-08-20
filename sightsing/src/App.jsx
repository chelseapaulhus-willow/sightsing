import { Routes, Route, Navigate, Link } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Lesson from "./pages/Lesson.jsx";
import Results from "./pages/Results.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200">
      <nav className="mx-auto max-w-3xl px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-semibold">🎵 SightSing</Link>
        <div className="text-sm text-gray-600">Beta</div>
      </nav>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Dashboard />} />
        <Route path="/lesson/:lessonId" element={<Lesson />} />
        <Route path="/results/:lessonId" element={<Results />} />
      </Routes>
    </div>
  );
}
