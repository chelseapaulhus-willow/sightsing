// src/pages/Dashboard.jsx
import { Link } from "react-router-dom";
import { useUserStore } from "../store/useUserStore.js";
import { lessons, themes } from "../music/lessonData.js";

const PASS_CUTOFF = 60; // percent needed to count a lesson as "passed"

export default function Dashboard() {
  // assuming your store returns the whole object
  const { streak, progress = { lessons: {}, subThemes: {} } } = useUserStore();

  return (
    <div className="mx-auto max-w-4xl px-4">
      <header className="card p-5 mb-6 flex items-center justify-between bg-gradient-to-r from-teal-500 to-blue-500 text-white">
        <div>
          <div className="text-lg">Hi, Sarah!</div>
          <div className="text-sm opacity-90">Ready to practice sight‑singing?</div>
        </div>
        <div className="rounded-full bg-white/20 px-3 py-1 text-sm">🔥 {streak} day streak</div>
      </header>

      {themes.map((theme) => (
        <section key={theme.id} className="mb-8">
          <h2 className="text-xl font-semibold mb-3">{theme.title}</h2>

          <div className="grid md:grid-cols-2 gap-4">
            {theme.subThemes.map((sub, subIdx) => {
              const unlocked = isSubThemeUnlocked(theme, subIdx, progress);
              const complete = isSubThemeComplete(sub, progress);

              // compute aggregate progress across lessons in this sub-theme
              const pct = subProgress(sub, progress);

              // first lesson to enter
              const firstLessonId = sub.lessonIds[0];
              const firstLesson = firstLessonId ? lessons[firstLessonId] : null;

              return (
                <div key={sub.id} className={`card p-4 ${!unlocked ? "opacity-60" : ""}`}>
                  <div className={`h-16 w-full rounded-xl bg-gradient-to-r ${theme.color} mb-3`} />
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{sub.title}</div>
                      <div className="text-xs text-gray-500">
                        {complete ? "Complete ✅" : unlocked ? "Unlocked" : "Locked 🔒"}
                      </div>
                    </div>

                    {unlocked && firstLesson ? (
                      <Link to={`/lesson/${firstLessonId}`} className="btn btn-primary">
                        {complete ? "Review" : "Start"}
                      </Link>
                    ) : (
                      <button className="btn btn-ghost" disabled>🔒</button>
                    )}
                  </div>

                  {/* progress bar for this sub-theme */}
                  <div className="mt-3 h-2 w-full rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-black transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="mt-1 text-right text-xs text-gray-600">{Math.round(pct)}%</div>

                  {/* lesson list */}
                  {!!sub.lessonIds.length && (
                    <ul className="mt-3 text-sm text-gray-700 space-y-1">
                      {sub.lessonIds.map((id) => {
                        const l = lessons[id];
                        const acc = lessonAccuracy(progress, id);
                        const passed = acc >= PASS_CUTOFF;
                        return (
                          <li key={id} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span>{passed ? "✅" : "•"}</span>
                              <span>{l?.title ?? id}</span>
                            </div>
                            <span className="text-xs text-gray-500">{acc || 0}%</span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

/** A sub-theme is unlocked if it's the first one, or the previous sub-theme is complete. */
function isSubThemeUnlocked(theme, subIdx, progress) {
  if (subIdx === 0) return true;
  const prev = theme.subThemes[subIdx - 1];
  return isSubThemeComplete(prev, progress);
}

/** A sub-theme is complete if ALL its lessons have accuracy >= PASS_CUTOFF. */
function isSubThemeComplete(sub, progress) {
  if (!sub.lessonIds.length) return false;
  return sub.lessonIds.every((id) => lessonAccuracy(progress, id) >= PASS_CUTOFF);
}

/** Average percent across lessons in a sub-theme (0 if empty). */
function subProgress(sub, progress) {
  if (!sub.lessonIds.length) return 0;
  const vals = sub.lessonIds.map((id) => lessonAccuracy(progress, id));
  const sum = vals.reduce((a, b) => a + b, 0);
  return Math.max(0, Math.min(100, sum / vals.length));
}

function lessonAccuracy(progress, id) {
  const stats = progress?.lessons?.[id];
  if (!stats || !stats.total) return 0;
  return stats.accuracy ?? Math.round((stats.correct / stats.total) * 100);
}
