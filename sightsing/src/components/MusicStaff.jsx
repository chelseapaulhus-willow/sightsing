import { useEffect, useRef } from "react";
import { Renderer, Stave, StaveNote, Formatter, Voice } from "vexflow";

export default function MusicStaff({ midi = [60, 62, 64, 65, 67] }) {
  const ref = useRef(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;

    // Clear previous render
    host.innerHTML = "";

    // Guard: no notes
    if (!midi || midi.length === 0) {
      host.innerHTML = '<div style="padding:8px;color:#64748b;font-size:14px">No notes</div>';
      return;
    }

    // Set up SVG renderer
    const width = 560;
    const height = 160;
    const renderer = new Renderer(host, Renderer.Backends.SVG);
    renderer.resize(width, height);
    const context = renderer.getContext();

    // Staff
    const stave = new Stave(10, 40, width - 20);
    stave.addClef("treble");
    const time = `${midi.length}/4`; // e.g., 5 notes => 5/4
    stave.addTimeSignature(time);
    stave.setContext(context).draw();

    // MIDI -> "c/4" etc.
    const names = ["c", "c#", "d", "d#", "e", "f", "f#", "g", "g#", "a", "a#", "b"];
    const keyOf = (m) => {
      const pc = names[m % 12];
      const oct = Math.floor(m / 12) - 1;
      return `${pc}/${oct}`;
    };

    // Build notes (quarter notes)
    const notes = midi.map((m) => new StaveNote({ keys: [keyOf(m)], duration: "q" }));

    // Voice in SOFT mode so we don't require exact total ticks
    const voice = new Voice({ time });
    voice.setMode(Voice.Mode.SOFT);
    voice.addTickables(notes);

    // Format and draw
    new Formatter().joinVoices([voice]).format([voice], width - 60);
    voice.draw(context, stave);

    // Cleanup on re-render
    return () => {
      try { host.innerHTML = ""; } catch {}
    };
  }, [midi]);

  return <div ref={ref} />;
}
