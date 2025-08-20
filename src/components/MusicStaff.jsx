// components/MusicStaff.jsx
import { useEffect, useRef } from "react";
import { Renderer, Stave, StaveNote, Formatter, Voice } from "vexflow";

export default function MusicStaff({ midi = [], activeIndex = -1, phase = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;

    host.innerHTML = "";

    if (!midi || midi.length === 0) {
      host.innerHTML =
        '<div style="padding:8px;color:#64748b;font-size:14px">No notes</div>';
      return;
    }

    // --- visual styles ---
    const baseFill = "#111827";   // slate-900
    const baseStroke = "#111827";
    const listenFill = "#10b981"; // emerald-500
    const recordFill = "#3b82f6"; // blue-500
    const highlightStroke = "#111827";

    // Set up SVG
    const width = 560;
    const height = 160;
    const renderer = new Renderer(host, Renderer.Backends.SVG);
    renderer.resize(width, height);
    const context = renderer.getContext();

    // Staff
    const stave = new Stave(10, 40, width - 20);
    stave.addClef("treble");
    const time = `${midi.length}/4`;
    stave.addTimeSignature(time);
    stave.setContext(context).draw();

    // MIDI -> "c/4"
    const names = ["c", "c#", "d", "d#", "e", "f", "f#", "g", "g#", "a", "a#", "b"];
    const keyOf = (m) => `${names[m % 12]}/${Math.floor(m / 12) - 1}`;

    // Build notes (quarter notes) + per-note style
    const notes = midi.map((m, i) => {
      const n = new StaveNote({ keys: [keyOf(m)], duration: "q" });

      // default style
      n.setStyle({ fillStyle: baseFill, strokeStyle: baseStroke });

      // highlight the active note
      if (i === activeIndex) {
        const fillStyle = phase === "record" ? recordFill : listenFill;
        n.setStyle({ fillStyle, strokeStyle: highlightStroke });
        // make it pop a little
        n.setRenderStyle({ shadowBlur: 6, shadowColor: fillStyle });
      }

      return n;
    });

    // Voice (SOFT mode)
    const voice = new Voice({ time });
    voice.setMode(Voice.Mode.SOFT);
    voice.addTickables(notes);

    new Formatter().joinVoices([voice]).format([voice], width - 60);
    voice.draw(context, stave);

    return () => {
      try {
        host.innerHTML = "";
      } catch {}
    };
  }, [midi, activeIndex, phase]); // <-- re-render when index/phase changes

  return <div ref={ref} />;
}
