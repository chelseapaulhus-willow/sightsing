import { useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import { PitchDetector } from "pitchy";

const midiToHz = (m) => 440 * Math.pow(2, (m - 69) / 12);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function LessonControls({ targetMidi = [], onResult }) {
  const [recording, setRecording] = useState(false);
  const micRef = useRef(null);

  async function handleListen() {
    await Tone.start();
    const synth = new Tone.Synth().toDestination();
    for (const m of targetMidi) {
      synth.triggerAttackRelease(midiToHz(m), "8n");
      await sleep(450);
    }
  }

  async function handleRecord() {
    // super-simple reference implementation (captures steady pitch snapshots)
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    source.connect(analyser);

    const detector = PitchDetector.forFloat32Array(analyser.fftSize);
    const input = new Float32Array(detector.inputLength);
    const sampleRate = audioContext.sampleRate;

    setRecording(true);
    const detected = [];

    let noteIdx = 0;
    const collectFor = async (ms) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    // naive loop: listen ~400ms per expected note
    while (recording && noteIdx < targetMidi.length) {
      const start = performance.now();
      const buckets = [];
      while (performance.now() - start < 380) {
        analyser.getFloatTimeDomainData(input);
        const [pitch, clarity] = detector.findPitch(input, sampleRate);
        if (clarity > 0.95 && pitch > 50 && pitch < 2000) {
          buckets.push(pitch);
        }
        await collectFor(16);
      }
      const avg =
        buckets.reduce((a, b) => a + b, 0) / Math.max(buckets.length, 1);
      detected.push(avg || 0);
      noteIdx += 1;
      await collectFor(40);
    }

    setRecording(false);
    stream.getTracks().forEach((t) => t.stop());
    audioContext.close();

    const toMidi = (hz) => (hz ? Math.round(69 + 12 * Math.log2(hz / 440)) : 0);
    const sungMidi = detected.map(toMidi);

    const results = targetMidi.map((m, i) => ({
      target: m,
      heard: sungMidi[i] || 0,
      correct: Math.abs((sungMidi[i] || 0) - m) <= 0, // exact match; relax if you like
    }));
    onResult?.(results);
  }

  function handleReset() {
    setRecording(false);
    onResult?.([]);
  }

  useEffect(() => () => setRecording(false), []);

  return (
    <div className="flex gap-3">
      <button className="btn bg-blue-600 text-white" onClick={handleListen}>
        ▶︎ Listen
      </button>
      <button
        className="btn bg-green-600 text-white"
        onClick={handleRecord}
        disabled={recording}
      >
        🎙️ Record
      </button>
      <button className="btn btn-ghost" onClick={handleReset}>
        ⟲ Reset
      </button>
    </div>
  );
}
