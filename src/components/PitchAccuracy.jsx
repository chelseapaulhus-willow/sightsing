// components/PitchAccuracy.jsx
export default function PitchAccuracy({ results }) {
  if (!results?.length) return null;

  const correctCount = results.filter(r => r.correct).length;
  const total = results.length;

  return (
    <div className="p-4 border rounded-xl bg-white shadow flex flex-col items-center gap-3">
      <h2 className="font-semibold">Pitch Accuracy</h2>

      <div className="flex gap-2">
        {results.map((r, idx) => (
          <div
            key={idx}
            className={`px-3 py-2 rounded-lg border text-sm ${
              r.correct ? "border-green-600 text-green-600" : "border-red-600 text-red-600"
            }`}
          >
            {r.heardHz} Hz<br />
            <span className="text-gray-500 text-xs">→ {r.targetHz} Hz</span>
          </div>
        ))}
      </div>

      <div className="text-sm text-gray-700">
        {Math.round((correctCount / total) * 100)}% accurate ({correctCount}/{total}) within ±5%
      </div>
    </div>
  );
}
