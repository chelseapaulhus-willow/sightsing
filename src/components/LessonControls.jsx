import { useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import { PitchDetector } from "pitchy";
import LivePitch from "./LivePitch.jsx";
import { midiToHz, hzToMidi, percentDiff } from "../music/pitchUtils.js";
import { Capacitor } from "@capacitor/core";
import { SpeakerRoute } from "../capacitor/SpeakerRoute";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const median = (arr) => {
  if (!arr.length) return 0;
  const s = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
};

const isSecure =
  typeof location !== "undefined" &&
  (location.protocol === "https:" ||
    location.hostname === "localhost" ||
    location.protocol === "capacitor:");

export default function LessonControls({ targetMidi = [], onResult }) {
  const [recording, setRecording] = useState(false);
  const recordingRef = useRef(false); // mirrors state during async loops
  const [liveHz, setLiveHz] = useState(0);
  const [guideTone, setGuideTone] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);

  // Audio resources
  const acRef = useRef(null);
  const streamRef = useRef(null);
  const synthRef = useRef(null);      // lesson playback synth
  const clickRef = useRef(null);      // count-in click
  const guideRef = useRef(null);      // guide tone during count-in

  // Create Tone synths once
  useEffect(() => {
    synthRef.current = new Tone.Synth({
      oscillator: { type: "sine" },
      envelope: { attack: 0.01, decay: 0.05, sustain: 0.4, release: 0.2 },
    }).toDestination();

    clickRef.current = new Tone.MembraneSynth().toDestination();
    guideRef.current = new Tone.Synth().toDestination();

    // Slightly louder than default; tweak to taste
    Tone.Destination.volume.value = -6;

    return () => {
      synthRef.current?.dispose();
      clickRef.current?.dispose();
      guideRef.current?.dispose();
      synthRef.current = null;
      clickRef.current = null;
      guideRef.current = null;
    };
  }, []);

  function setRecordingSafe(val) {
    recordingRef.current = val;
    setRecording(val);
  }

  async function maybeApplySpeakerRoute() {
    // Only call native plugin on iOS builds where it exists
    if (Capacitor.getPlatform() === "ios" && SpeakerRoute?.applyPreferredRoute) {
      try {
        await SpeakerRoute.applyPreferredRoute();
      } catch (e) {
        // If the plugin isn't compiled/registered, avoid noisy logs in dev
        if (e?.code !== "UNIMPLEMENTED") {
          console.warn("Route apply failed", e);
        }
      }
    }
  }

  async function handleListen() {
    await maybeApplySpeakerRoute();
    await Tone.start();
    await Tone.getContext().resume();
    Tone.Destination.mute = false;

    const synth = synthRef.current;
    for (let i = 0; i < targetMidi.length; i++) {
      setCurrentIdx(i);
      const freq = Tone.Frequency(targetMidi[i], "midi").toFrequency();
      synth.triggerAttackRelease(freq, 0.5); // a bit longer than "8n"
      await sleep(600);
    }
  }

  async function playCountInAndNote(hz, dur = 0.45) {
    await Tone.start();
    const click = clickRef.current;
    const guide = guideRef.current;

    // simple 1-beat count-in
    click.triggerAttackRelease("A3", "16n");
    await sleep(250);

    if (guideTone) {
      guide.triggerAttackRelease(hz, dur);
    }

    await sleep(dur * 1000 + 100);
  }

  async function handleRecord() {
    if (!isSecure) {
      alert("Recording requires HTTPS (or localhost). Open the HTTPS URL.");
      return;
    }

    try {
      await maybeApplySpeakerRoute();
      await Tone.start();

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false },
        video: false,
      });
      streamRef.current = stream;

      // Separate context is fine; alternatively use Tone.getContext().rawContext
      const ac = new (window.AudioContext || window.webkitAudioContext)();
      acRef.current = ac;

      const source = ac.createMediaStreamSource(stream);
      const analyser = ac.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);

      const detector = PitchDetector.forFloat32Array(analyser.fftSize);
      const buf = new Float32Array(detector.inputLength);
      const sr = ac.sampleRate;

      const results = [];
      setRecordingSafe(true);

      for (let i = 0; i < targetMidi.length && recordingRef.current; i++) {
        setCurrentIdx(i);

        const targetHz = midiToHz(targetMidi[i]);
        await playCountInAndNote(targetHz);

        const frames = [];
        const start = performance.now();

        // ~450ms capture window
        while (performance.now() - start < 450 && recordingRef.current) {
          analyser.getFloatTimeDomainData(buf);
          const [hz, clarity] = detector.findPitch(buf, sr);

          if (clarity > 0.95 && hz > 50 && hz < 2000) {
            frames.push(hz);
            setLiveHz(hz);
          }
          await new Promise((r) => requestAnimationFrame(r));
        }

        const hz = median(frames);
        const heardMidi = hz ? Math.round(hzToMidi(hz)) : 0;
        const percent = hz ? percentDiff(hz, targetHz) : 9999;
        const within = Math.abs(percent) <= 5;

        results.push({
          target: targetMidi[i],
          targetHz: Math.round(targetHz),
          heardHz: Math.round(hz || 0),
          heard: heardMidi,
          percent: Math.round(percent * 100) / 100,
          correct: !!hz && within,
        });

        await sleep(120);
      }

      setRecordingSafe(false);
      setLiveHz(0);

      stream.getTracks().forEach((t) => t.stop());
      await ac.close();

      onResult?.(results);
    } catch (err) {
      console.error(err);
      setRecordingSafe(false);
      setLiveHz(0);

      try {
        streamRef.current?.getTracks().forEach((t) => t.stop());
      } catch {}
      try {
        await acRef.current?.close();
      } catch {}

      let msg = "Could not access microphone.";
      if (err?.name === "NotAllowedError") msg = "Microphone permission denied.";
      if (err?.name === "NotFoundError") msg = "No microphone found.";
      if (/secure|https/i.test(err?.message || "")) msg = "Recording requires HTTPS (or localhost).";
      alert(msg);
    }
  }

  function handleReset() {
    setRecordingSafe(false);
    setLiveHz(0);
    try {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    } catch {}
    try {
      acRef.current?.close();
    } catch {}
    onResult?.([]);
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setRecordingSafe(false);
      try {
        streamRef.current?.getTracks().forEach((t) => t.stop());
      } catch {}
      try {
        acRef.current?.close();
      } catch {}
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-3">
        <button className="btn bg-blue-600 text-white" onClick={handleListen}>
          ▶︎ Listen
        </button>

        <button
          className="btn bg-green-600 text-white"
          onClick={handleRecord}
          disabled={recording || !isSecure}
          title={!isSecure ? "Requires HTTPS or localhost" : ""}
        >
          🎙️ {recording ? "Recording…" : "Record"}
        </button>

        <button className="btn btn-ghost" onClick={handleReset}>
          ⟲ Reset
        </button>

        <button
          className={`btn ${guideTone ? "bg-purple-600 text-white" : "btn-ghost"}`}
          onClick={() => setGuideTone(!guideTone)}
        >
          🎵 Guide Tone {guideTone ? "On" : "Off"}
        </button>
      </div>

      <LivePitch
        hz={liveHz}
        targetHz={targetMidi.length ? midiToHz(targetMidi[currentIdx]) : 0}
        targetLabel={
          targetMidi.length ? Tone.Frequency(targetMidi[currentIdx], "midi").toNote() : ""
        }
      />

      {!isSecure && (
        <div className="text-xs text-red-600">
          Recording disabled: open the HTTPS URL to enable the mic.
        </div>
      )}
    </div>
  );
}
