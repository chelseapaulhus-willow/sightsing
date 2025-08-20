// src/pages/Dashboard.jsx
import { Link } from "react-router-dom";
import { useUserStore } from "../store/useUserStore.js";
import { lessons, lessonGroups } from "../music/lessonData.js";

export default function Dashboard() {
  const { streak, progress } = useUserStore();

  return (
    <div className="mx-auto max-w-3xl px-4">
      <header className="card p-5 mb-6 flex items-center justify-between bg-gradient-to-r from-teal-500 to-blue-500 text-white">
        <div>
          <div className="text-lg">Hi, Sarah!</div>
          <div className="text-sm opacity-90">Ready to practice sight-singing?</div>
        </div>
        <div className="rounded-full bg-white/20 px-3 py-1 text-sm">🔥 {streak} day streak</div>
      </header>

     {["Beginner", "Intermediate", "Advanced"].map((level, gi) => (
  <section key={level} className="mb-8">
    <h2 className="text-xl font-semibold mb-3">{level}</h2>
    <div className="space-y-4">
      {lessonGroups[level].map((id, idx) => {
        const l = lessons[id];
        const p = progress[id]; // {correct, total, accuracy}
        const pct = p?.accuracy ?? 0;
        const started = p?.total > 0;
        return (
          <LessonTile
            key={id}
            color={colorByIndex(gi * 10 + idx)}
            title={l.title}
            subtitle={l.subtitle}
            level={level}
            to={`/lesson/${id}`}
            progress={pct}
            cta={started ? "Continue" : "Start"}
          />
        );
      })}
    </div>
  </section>
))}
    </div>
  );
}

function LessonTile({ title, subtitle, level, to, progress, color, cta = "Continue" }) {
  return (
    <div className="card p-4">
      <div className={`h-20 w-full rounded-xl ${color} mb-4`} />
      <div className="flex items-center justify-between">
        <div>
          <div className="text-lg font-semibold">{title}</div>
          {subtitle && <div className="text-xs text-gray-500">{subtitle}</div>}
          <div className="text-xs text-gray-500 mt-1">{level}</div>
        </div>
        <Link to={to} className="btn btn-primary">{cta}</Link>
      </div>
      <div className="mt-3 h-2 w-full rounded-full bg-gray-200">
        <div
          className="h-2 rounded-full bg-black transition-all"
          style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
        />
      </div>
      <div className="mt-1 text-right text-xs text-gray-600">{Math.round(progress)}%</div>
    </div>
  );
}

function colorByIndex(i) {
  const palette = ["bg-green-500", "bg-purple-500", "bg-rose-500", "bg-amber-500", "bg-sky-500"];
  return palette[i % palette.length];
}
