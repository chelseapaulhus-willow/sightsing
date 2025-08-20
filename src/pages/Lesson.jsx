import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import ProgressBar from "../components/ProgressBar.jsx";
import MusicStaff from "../components/MusicStaff.jsx";
import LessonControls from "../components/LessonControls.jsx";
import PitchAccuracy from "../components/PitchAccuracy.jsx";
import { lessons } from "../music/lessonData.js";
import { useUserStore } from "../store/useUserStore.js";

export default function Lesson() {
  const { lessonId } = useParams();
  const nav = useNavigate();
  const lesson = lessons[lessonId];

  const [results, setResults] = useState([]);
  const { setProgress } = useUserStore();

  if (!lesson) {
    return <div className="p-6 text-red-600">Lesson not found.</div>;
  }

  const correct = results.filter((r) => r.correct).length;
  const total = results.length;
  const pct = total ? Math.round((correct / total) * 100) : 0;

  function handleFinish() {
    setProgress(lessonId, { correct, total });
    nav(`/results/${lessonId}`);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 space-y-6">
      {/* Header with title + progress */}
      <div className="card p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-semibold">{lesson.title}</div>
            <div className="text-sm text-gray-500">{lesson.subtitle}</div>
          </div>
          <div className="text-xs bg-blue-100 text-blue-700 rounded-full px-2 py-1">
            Exercise 1 of 5
          </div>
        </div>
        <div className="mt-3">
          <ProgressBar value={pct} />
        </div>
      </div>

      {/* Melody to sing */}
      <div className="card p-4">
        <div className="mb-3 text-center font-medium">Sing this melody</div>
        <p className="text-center text-sm text-gray-600 mb-4">
          Listen first, then record yourself singing
        </p>
        <MusicStaff midi={lesson.targetMidi} />
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4">
        <LessonControls targetMidi={lesson.targetMidi} onResult={setResults} />
      </div>

      {/* Pitch Accuracy */}
      {results.length > 0 && (
        <PitchAccuracy results={results} />
      )}

      {/* Finish Button */}
      {results.length > 0 && (
        <div className="flex justify-center">
          <button
            onClick={handleFinish}
            className="btn btn-primary px-6"
          >
            Finish Lesson
          </button>
        </div>
      )}
    </div>
  );
}
