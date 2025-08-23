import { create } from "zustand";
import { curriculum } from "../music/curriculum.js";

// rank thresholds (tweak freely)
const RANKS = [
  { name: "Busker", minXp: 0 },
  { name: "Chorister", minXp: 200 },
  { name: "Soloist", minXp: 600 },
  { name: "Virtuoso", minXp: 1200 },
  { name: "Maestro", minXp: 2400 },
];

const rankForXp = (xp) => {
  let r = RANKS[0].name;
  for (const k of RANKS) if (xp >= k.minXp) r = k.name;
  return r;
};

const subThemeKey = (themeId, subId) => `${themeId}:${subId}`;

const flattenLessons = () => {
  const map = {};
  curriculum.themes.forEach((t) =>
    t.subThemes.forEach((s) =>
      s.lessons.forEach((L) => (map[L.id] = { themeId: t.id, subId: s.id }))
    )
  );
  return map;
};
const LESSON_TO_PARENT = flattenLessons();

export const useUserStore = create((set, get) => ({
  streak: 7,
  xp: 0,
  progress: {
    // lessons: { [lessonId]: { correct, total, passed } }
    lessons: {},
    // subThemes: { [themeId:subId]: { complete: boolean } }
    subThemes: {},
  },

  // --- derived helpers ---
  getRank() {
    return rankForXp(get().xp);
  },

  isSubThemeUnlocked(themeId, subId) {
    const theme = curriculum.themes.find((t) => t.id === themeId);
    if (!theme) return false;
    const idx = theme.subThemes.findIndex((s) => s.id === subId);
    if (idx === -1) return false;
    if (idx === 0) return true; // first sub-theme always unlocked
    const prev = subThemeKey(themeId, theme.subThemes[idx - 1].id);
    return !!get().progress.subThemes[prev]?.complete;
  },

  isLessonUnlocked(lessonId) {
    const parent = LESSON_TO_PARENT[lessonId];
    if (!parent) return false;
    return get().isSubThemeUnlocked(parent.themeId, parent.subId);
  },

  // --- record results + auto-complete sub-theme + grant XP ---
  // call with e.g. recordResult("pitch-maj3", { correct: 3, total: 3, passCutoff: 0.6 })
  recordResult(lessonId, { correct, total, passCutoff = 0.6 }) {
    const passed = total > 0 && correct / total >= passCutoff;

    set((s) => ({
      progress: {
        ...s.progress,
        lessons: {
          ...s.progress.lessons,
          [lessonId]: { correct, total, passed },
        },
      },
      xp: s.xp + correct * 10 + (passed ? 20 : 0), // simple XP formula
    }));

    // check if sub-theme is now complete (all lessons passed)
    const parent = LESSON_TO_PARENT[lessonId];
    if (!parent) return;

    const theme = curriculum.themes.find((t) => t.id === parent.themeId);
    const sub = theme?.subThemes.find((st) => st.id === parent.subId);
    if (!sub) return;

    const allPassed = sub.lessons.every((L) => get().progress.lessons[L.id]?.passed);
    if (allPassed) {
      const key = subThemeKey(parent.themeId, parent.subId);
      set((s) => ({
        progress: {
          ...s.progress,
          subThemes: { ...s.progress.subThemes, [key]: { complete: true } },
        },
        xp: s.xp + 50, // bonus XP for completing a sub-theme
      }));
    }
  },
}));
