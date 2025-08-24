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

    const baseFill = "#111827";   // slate-900
    const baseStroke = "#111827";
    const listenFill = "#10b981"; // emerald-500
    const recordFill = "#3b82f6"; // blue-500
    const highlightStroke = "#111827";

    // Set up SVG
    const width = 560; // Keep it wide to force scroll
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

    const names = ["c", "c#", "d", "d#", "e", "f", "f#", "g", "g#", "a", "a#", "b"];
    const keyOf = (m) => `${names[m % 12]}/${Math.floor(m / 12) - 1}`;

    const notes = midi.map((m, i) => {
      const n = new StaveNote({ keys: [keyOf(m)], duration: "q" });
      n.setStyle({ fillStyle: baseFill, strokeStyle: baseStroke });

      if (i === activeIndex) {
        const fillStyle = phase === "record" ? recordFill : listenFill;
        n.setStyle({ fillStyle, strokeStyle: highlightStroke });
        n.setRenderStyle({ shadowBlur: 6, shadowColor: fillStyle });
      }

      return n;
    });

    const voice = new Voice({ time });
    voice.setMode(Voice.Mode.SOFT);
    voice.addTickables(notes);

    new Formatter().joinVoices([voice]).format([voice], width - 60);
    voice.draw(context, stave);

    return () => {
      try {
        host.innerHTML = "";
      } catch {
        /* ignore */
      }
    };
  }, [midi, activeIndex, phase]);

  return (
    <div style={{ overflowX: "auto", width: "100%" }}>
      <div ref={ref} style={{ width: "560px" }} />
    </div>
  );
}
