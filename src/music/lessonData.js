// src/music/lessonData.js
export const lessons = {
  // Beginner (1–12)
  "major-scale-c": {
    id: "major-scale-c",
    title: "Major Pentachord – C",
    subtitle: "Do–Re–Mi–Fa–Sol (C pentachord)",
    targetMidi: [60, 62, 64, 65, 67],
    level: "Beginner",
  },
  "minor-scale-c": {
    id: "minor-scale-c",
    title: "Natural Minor – C",
    subtitle: "Do–Re–Me–Fa–Sol–Le–Te–Do (asc.)",
    targetMidi: [60, 62, 63, 65, 67, 68, 70, 72],
    level: "Beginner",
  },
  "int-major-third": {
    id: "int-major-third",
    title: "Interval: Major Third",
    subtitle: "Do–Mi–Do",
    targetMidi: [60, 64, 60],
    level: "Beginner",
  },
  "major-c-full": {
    id: "major-c-full",
    title: "Major Scale – C (Up/Down)",
    subtitle: "Full scale ascending and descending",
    targetMidi: [60,62,64,65,67,69,71,72,71,69,67,65,64,62,60],
    level: "Beginner",
  },
  "harmonic-minor-c": {
    id: "harmonic-minor-c",
    title: "Harmonic Minor – C",
    subtitle: "Raised leading tone (Ti) in minor",
    targetMidi: [60,62,63,65,67,68,71,72],
    level: "Beginner",
  },
  "melodic-minor-c": {
    id: "melodic-minor-c",
    title: "Melodic Minor – C (Up/Down)",
    subtitle: "Asc: raised 6 & 7; Desc: natural minor",
    targetMidi: [60,62,63,65,67,69,71,72,71,69,67,65,63,62,60],
    level: "Beginner",
  },
  "pentachord-g": {
    id: "pentachord-g",
    title: "Major Pentachord – G",
    subtitle: "Solfege in G",
    targetMidi: [67,69,71,72,74],
    level: "Beginner",
  },
  "pentachord-f": {
    id: "pentachord-f",
    title: "Major Pentachord – F",
    subtitle: "Fa key center",
    targetMidi: [65,67,69,70,72],
    level: "Beginner",
  },
  "int-minor-third": {
    id: "int-minor-third",
    title: "Interval: Minor Third",
    subtitle: "Do–Me–Do",
    targetMidi: [60,63,60],
    level: "Beginner",
  },
  "int-perfect-fourth": {
    id: "int-perfect-fourth",
    title: "Interval: Perfect Fourth",
    subtitle: "Do–Fa–Do",
    targetMidi: [60,65,60],
    level: "Beginner",
  },
  "int-perfect-fifth": {
    id: "int-perfect-fifth",
    title: "Interval: Perfect Fifth",
    subtitle: "Do–Sol–Do",
    targetMidi: [60,67,60],
    level: "Beginner",
  },
  "int-major-sixth": {
    id: "int-major-sixth",
    title: "Interval: Major Sixth",
    subtitle: "Do–La–Do",
    targetMidi: [60,69,60],
    level: "Beginner",
  },

  // Intermediate (13–24)
  "int-octave": {
    id: "int-octave",
    title: "Interval: Octave",
    subtitle: "Do–Do",
    targetMidi: [60,72,60],
    level: "Intermediate",
  },
  "arp-c-major": {
    id: "arp-c-major",
    title: "Arpeggio: C Major",
    subtitle: "Do–Mi–Sol–Do",
    targetMidi: [60,64,67,72,67,64,60],
    level: "Intermediate",
  },
  "arp-a-minor": {
    id: "arp-a-minor",
    title: "Arpeggio: A Minor",
    subtitle: "La–Do–Mi–La",
    targetMidi: [69,72,76,81,76,72,69],
    level: "Intermediate",
  },
  "roots-i-iv-v-i-c": {
    id: "roots-i-iv-v-i-c",
    title: "Roots: I–IV–V–I in C",
    subtitle: "C–F–G–C",
    targetMidi: [60,65,67,60],
    level: "Intermediate",
  },
  "pattern-domisolmido": {
    id: "pattern-domisolmido",
    title: "Pattern: Do–Mi–Sol–Mi–Do",
    subtitle: "Triad outline",
    targetMidi: [60,64,67,64,60],
    level: "Intermediate",
  },
  "melody-step-skip": {
    id: "melody-step-skip",
    title: "Melody: Steps then Skip",
    subtitle: "Ascending steps, descending skip",
    targetMidi: [60,62,64,67,65,64,62,60],
    level: "Intermediate",
  },
  "desc-tetrachord-c": {
    id: "desc-tetrachord-c",
    title: "Descending Tetrachord – C",
    subtitle: "C5–B–A–G",
    targetMidi: [72,71,69,67],
    level: "Intermediate",
  },
  "chromatic-neighbors-e": {
    id: "chromatic-neighbors-e",
    title: "Chromatic Neighbors around E",
    subtitle: "Lower & upper neighbor tones",
    targetMidi: [64,63,64,65,64,63,64],
    level: "Intermediate",
  },
  "major-d-full": {
    id: "major-d-full",
    title: "Major Scale – D (Up/Down)",
    subtitle: "Comfortable treble range",
    targetMidi: [62,64,66,67,69,71,73,74,73,71,69,67,66,64,62],
    level: "Intermediate",
  },
  "major-f-full": {
    id: "major-f-full",
    title: "Major Scale – F (Up/Down)",
    subtitle: "One flat (Bb)",
    targetMidi: [65,67,69,70,72,74,76,77,76,74,72,70,69,67,65],
    level: "Intermediate",
  },
  "arp-g-major": {
    id: "arp-g-major",
    title: "Arpeggio: G Major",
    subtitle: "Sol triad",
    targetMidi: [67,71,74,79,74,71,67],
    level: "Intermediate",
  },
  "minor-a-full": {
    id: "minor-a-full",
    title: "Natural Minor – A (Up/Down)",
    subtitle: "Relative minor of C",
    targetMidi: [69,71,72,74,76,77,79,81,79,77,76,74,72,71,69],
    level: "Intermediate",
  },

  // Advanced (25–30)
  "melody-simple-1": {
    id: "melody-simple-1",
    title: "Melody: Simple Steps in C",
    subtitle: "Do–Ti–La–Ti–Do motif",
    targetMidi: [64,62,60,62,64,64,64,62,62,62,64,67,67],
    level: "Advanced",
  },
  "int-minor-second": {
    id: "int-minor-second",
    title: "Interval: Minor Second",
    subtitle: "Do–Di♭–Do (chromatic)",
    targetMidi: [60,61,60],
    level: "Advanced",
  },
  "int-tritone": {
    id: "int-tritone",
    title: "Interval: Tritone",
    subtitle: "Do–Fi/Se–Do",
    targetMidi: [60,66,60],
    level: "Advanced",
  },
  "int-major-seventh": {
    id: "int-major-seventh",
    title: "Interval: Major Seventh",
    subtitle: "Do–Ti–Do",
    targetMidi: [60,71,60],
    level: "Advanced",
  },
  "pattern-doredodo": {
    id: "pattern-doredodo",
    title: "Pattern: Do–Re–Mi–Re–Do",
    subtitle: "Stepwise contour",
    targetMidi: [60,62,64,62,60],
    level: "Advanced",
  },
  "melody-call-response": {
    id: "melody-call-response",
    title: "Melody: Call & Response in C",
    subtitle: "Two short phrases",
    targetMidi: [60,64,62,65,64,67,65,69,67],
    level: "Advanced",
  },
};

// Order within each level (for consistent display)
export const lessonGroups = {
  Beginner: [
    "major-scale-c",
    "minor-scale-c",
    "int-major-third",
    "major-c-full",
    "harmonic-minor-c",
    "melodic-minor-c",
    "pentachord-g",
    "pentachord-f",
    "int-minor-third",
    "int-perfect-fourth",
    "int-perfect-fifth",
    "int-major-sixth",
  ],
  Intermediate: [
    "int-octave",
    "arp-c-major",
    "arp-a-minor",
    "roots-i-iv-v-i-c",
    "pattern-domisolmido",
    "melody-step-skip",
    "desc-tetrachord-c",
    "chromatic-neighbors-e",
    "major-d-full",
    "major-f-full",
    "arp-g-major",
    "minor-a-full",
  ],
  Advanced: [
    "melody-simple-1",
    "int-minor-second",
    "int-tritone",
    "int-major-seventh",
    "pattern-doredodo",
    "melody-call-response",
  ],
};
export const themes = [
  {
    id: "pitch-path",
    title: "Pitch Path",
    color: "from-indigo-500 to-blue-500",
    subThemes: [
      {
        id: "foundations",
        title: "Foundations",
        lessonIds: [
          "major-scale-c",
          "minor-scale-c",
          "major-c-full",
          "harmonic-minor-c",
          "melodic-minor-c",
          "pentachord-g",
          "pentachord-f",
        ],
      },
      {
        id: "intervals",
        title: "Intervals",
        lessonIds: [
          "int-major-third",
          "int-minor-third",
          "int-perfect-fourth",
          "int-perfect-fifth",
          "int-major-sixth",
          "int-octave",
          "int-minor-second",
          "int-tritone",
          "int-major-seventh",
        ],
      },
      {
        id: "patterns-melodies",
        title: "Patterns & Melodies",
        lessonIds: [
          "pattern-domisolmido",
          "pattern-doredodo",
          "melody-step-skip",
          "melody-simple-1",
          "melody-call-response",
        ],
      },
      {
        id: "arpeggios-keys",
        title: "Arpeggios & Key Centers",
        lessonIds: [
          "arp-c-major",
          "arp-a-minor",
          "arp-g-major",
          "roots-i-iv-v-i-c",
          "major-d-full",
          "major-f-full",
          "minor-a-full",
          "desc-tetrachord-c",
          "chromatic-neighbors-e",
        ],
      },
    ],
  },

  {
    id: "rhythm-road",
    title: "Rhythm Road",
    color: "from-emerald-500 to-teal-500",
    locked: true,
    subThemes: [
      {
        id: "note-values",
        title: "Note Values",
        lessonIds: [], // e.g. quarter, half, eighth, sixteenth
      },
      {
        id: "syncopation-rests",
        title: "Syncopation & Rests",
        lessonIds: [],
      },
    ],
  },

  {
    id: "harmony-trail",
    title: "Harmony Trail",
    color: "from-fuchsia-500 to-purple-500",
    locked: true,
    subThemes: [
      {
        id: "combined-patterns",
        title: "Pitch + Rhythm",
        lessonIds: [],
      },
      {
        id: "sight-reading",
        title: "Sight-Reading Challenges",
        lessonIds: [],
      },
    ],
  },
];

// If you still need a flat order for “Next Lesson”
export const lessonOrder = [
  ...lessonGroups.Beginner,
  ...lessonGroups.Intermediate,
  ...lessonGroups.Advanced,
];
export function getNextLessonId(currentId) {
  const idx = lessonOrder.indexOf(currentId);
  return idx >= 0 && idx < lessonOrder.length - 1 ? lessonOrder[idx + 1] : null;
}
