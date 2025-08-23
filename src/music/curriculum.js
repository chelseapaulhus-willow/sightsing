// Curriculum: 3 Themes → Sub-Themes → Lessons
export const curriculum = {
  themes: [
    {
      id: "pitch-path",
      title: "Pitch Path",
      color: "from-indigo-500 to-blue-500",
      subThemes: [
        {
          id: "foundations",
          title: "Foundations",
          lessons: [
            { id: "pitch-c-penta", title: "C Major Pentachord", targetMidi: [60,62,64,65,67] },
            { id: "pitch-c-scale", title: "C Major (1 Octave)", targetMidi: [60,62,64,65,67,69,71,72] },
          ],
        },
        {
          id: "intervals",
          title: "Intervals",
          lessons: [
            { id: "pitch-maj3", title: "Major 3rd (Do–Mi–Do)", targetMidi: [60,64,60] },
            { id: "pitch-perf5", title: "Perfect 5th (Do–Sol–Do)", targetMidi: [60,67,60] },
          ],
        },
      ],
    },

    {
      id: "rhythm-road",
      title: "Rhythm Road",
      color: "from-emerald-500 to-teal-500",
      subThemes: [
        {
          id: "pulse-values",
          title: "Pulse & Note Values",
          lessons: [
            { id: "rhythm-quarters", title: "Quarter Notes in 4/4", pattern: "q q q q" },
            { id: "rhythm-halves", title: "Half & Whole Notes", pattern: "h h | w" },
          ],
        },
        {
          id: "rests-sync",
          title: "Rests & Syncopation",
          lessons: [
            { id: "rhythm-rests", title: "Rests in 4/4", pattern: "q r q r | q q q q" },
            { id: "rhythm-sync", title: "Syncopation Intro", pattern: "e( q )e | q e( q )e" },
          ],
        },
      ],
    },

    {
      id: "harmony-trail",
      title: "Harmony Trail",
      color: "from-fuchsia-500 to-purple-500",
      subThemes: [
        {
          id: "simple-phrases",
          title: "Simple Phrases",
          lessons: [
            { id: "hrm-c-phrase-1", title: "C Phrase (4 bars)", targetMidi: [60,62,64,65,67,65,64,62] },
            { id: "hrm-c-phrase-2", title: "Steps & Skips", targetMidi: [60,64,62,65,64,67,65,60] },
          ],
        },
        {
          id: "sight-reading",
          title: "Sight-Reading",
          lessons: [
            { id: "hrm-read-1", title: "Read in 4/4", targetMidi: [60,62,64,62,60,62,64,65] },
            { id: "hrm-read-2", title: "Leaps + Rhythm", targetMidi: [60,67,65,64,62,60,64,67] },
          ],
        },
      ],
    },
  ],
};
