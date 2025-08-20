import { Link } from "react-router-dom";
import { useUserStore } from "../store/useUserStore.js";

export default function Dashboard() {
  const { streak } = useUserStore();
  return (
    <div className="mx-auto max-w-3xl px-4">
      <header className="card p-5 mb-6 flex items-center justify-between bg-gradient-to-r from-teal-500 to-blue-500 text-white">
        <div>
          <div className="text-lg">Hi, Sarah!</div>
          <div className="text-sm opacity-90">Ready to practice sight-singing?</div>
        </div>
        <div className="rounded-full bg-white/20 px-3 py-1 text-sm">🔥 {streak} day streak</div>
      </header>

      <section className="space-y-4">
        <LessonTile
          color="bg-green-500"
          title="Interval Recognition"
          level="Beginner"
          to="/lesson/major-scale-c"
          progress={0}
        />
      </section>
    </div>
  );
}

function LessonTile({ title, level, to, progress, color }) {
  return (
    <div className="card p-4">
      <div className={`h-20 w-full rounded-xl ${color} mb-4`} />
      <div className="flex items-center justify-between">
        <div>
          <div className="text-lg font-semibold">{title}</div>
          <div className="text-xs text-gray-500">{level}</div>
        </div>
        <Link to={to} className="btn btn-primary">Continue</Link>
      </div>
      <div className="mt-3 h-2 w-full rounded-full bg-gray-200">
        <div className="h-2 rounded-full bg-black" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
