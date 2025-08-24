import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LessonControls from "../components/LessonControls.jsx";
import PitchAccuracy from "../components/PitchAccuracy.jsx";
import MusicStaff from "../components/MusicStaff.jsx";
import { lessons, getNextLessonId } from "../music/lessonData.js";
import { useUserStore } from "../store/useUserStore.js";

export default function Lesson() {
  
  const { lessonId } = useParams(); // route like /lesson/:lessonId
  const navigate = useNavigate();

  const currentLessonId = lessonId || "major-scale-c";
  const lesson = useMemo(() => lessons[currentLessonId], [currentLessonId]);

  // hold results here
    const [results, setResults] = useState([]);
    const recordResult = useUserStore((s) => s.recordResult);

  // Save accuracy to Zustand whenever results arrive
  useEffect(() => {
    if (!results.length || !lesson) return;
    const correct = results.filter((r) => r.correct).length;
    const total = results.length;
    recordResult(lesson.id, { correct, total }); // e.g. {correct:3,total:5,accuracy:60}
  }, [results, lesson, recordResult]);

// Next lesson id (null if last)
  const nextId = getNextLessonId(currentLessonId);

  if (!lesson) return <div className="p-6">Lesson not found.</div>;



  return (
    <div className="p-6 flex flex-col gap-6 items-center">
      <h1 className="text-2xl font-bold">{lesson.title}</h1>
      {lesson.subtitle && <p className="text-gray-600">{lesson.subtitle}</p>}

   
      <MusicStaff midi={lesson.targetMidi} />

      {/* Controls trigger listen/record and pass results up */}
      <LessonControls
        targetMidi={lesson.targetMidi}
        onResult={setResults}
      />

      {results.length > 0 && (
        <>
          <PitchAccuracy results={results} />
          <div className="flex gap-3">
            <button
              className="btn btn-ghost"
              onClick={() => setResults([])}
              title="Try again"
            >
              ↺ Try Again
            </button>

            <button
              className="btn bg-blue-600 text-white disabled:opacity-50"
              disabled={!nextId}
              onClick={() => {
                setResults([]);
                if (nextId) navigate(`/lesson/${nextId}`);
              }}
              title={nextId ? "Go to next lesson" : "You're on the last lesson"}
            >
              ➜ Next Lesson
            </button>
            <button
            className="btn bg-gray-600 text-white"
            onClick={() => navigate("/home")}
            >
            ⬅ Return Home
            </button>
        </div>
        </>
      )}
    </div>
  );
}