import { useParams, Link, useNavigate } from "react-router-dom";
import { lessons } from "../music/lessonData.js";
import { useUserStore } from "../store/useUserStore.js";

function Stars({ percent = 0 }) {
  const filled = Math.min(3, Math.max(0, Math.round(percent / 33.34)));
  return (
    <div className="flex items-center justify-center gap-2 text-2xl">
      {Array.from({ length: 3 }).map((_, i) => (
        <span
          key={i}
          className={i < filled ? "opacity-100" : "opacity-20"}
          role="img"
          aria-label={i < filled ? "star filled" : "star empty"}
        >
          ⭐
        </span>
      ))}
    </div>
  );
}

export default function Results() {
  const { lessonId } = useParams();
  const nav = useNavigate();
  const lesson = lessons[lessonId];

  const { progress } = useUserStore.getState(); // read once for this render
  const stats = progress[lessonId];

  if (!lesson) {
    return (
      <div className="mx-auto max-w-2xl p-6">
        <div className="card p-6 text-red-600">Lesson not found.</div>
        <div className="mt-4">
          <Link className="btn btn-ghost" to="/home">Back to Home</Link>
        </div>
      </div>
    );
  }

  if (!stats || !stats.total) {
    return (
      <div className="mx-auto max-w-2xl p-6">
        <div className="card p-6">
          <h1 className="text-2xl font-semibold mb-2">No results yet</h1>
          <p className="text-gray-600">Complete the lesson to see your summary.</p>
        </div>
        <div className="mt-4 flex gap-3">
          <button className="btn btn-primary" onClick={() => nav(`/lesson/${lessonId}`)}>
            Go to Lesson
          </button>
          <Link className="btn btn-ghost" to="/home">Back to Home</Link>
        </div>
      </div>
    );
  }

  const { correct, total } = stats;
  const percent = Math.round((correct / total) * 100);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="card p-6 text-center">
        <div className="text-5xl mb-2">🎉</div>
        <h1 className="text-2xl font-bold">Lesson Complete</h1>
        <p className="text-gray-600">{lesson.title}</p>

        <div className="mt-6">
          <div className="text-5xl font-extrabold">{percent}%</div>
          <div className="text-sm text-gray-600">Pitch accuracy</div>
        </div>

        <div className="mt-4">
          <Stars percent={percent} />
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3 text-sm">
          <div className="card p-4">
            <div className="text-gray-500">Correct Notes</div>
            <div className="text-xl font-semibold">{correct}</div>
          </div>
          <div className="card p-4">
            <div className="text-gray-500">Total Notes</div>
            <div className="text-xl font-semibold">{total}</div>
          </div>
          <div className="card p-4">
            <div className="text-gray-500">Score</div>
            <div className="text-xl font-semibold">{percent}</div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button className="btn btn-primary" onClick={() => nav(`/lesson/${lessonId}`)}>
            Review Lesson
          </button>
          <Link className="btn btn-ghost" to="/home">
            Back to Home
          </Link>
        </div>
      </div>

      <div className="mt-6 text-center text-xs text-gray-500">
        Tip: Aim for a steady tone on each note. Use “Listen” before recording.
      </div>
    </div>
  );
}
