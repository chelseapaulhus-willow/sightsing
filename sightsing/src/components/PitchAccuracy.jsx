export default function PitchAccuracy({ results = [] }) {
  const correct = results.filter((r) => r.correct).length;
  const total = results.length || 0;

  return (
    <div className="card p-4">
      <div className="mb-2 text-sm font-medium text-gray-700">Pitch Accuracy</div>
      <div className="flex gap-3">
        {results.map((r, i) => (
          <div
            key={i}
            className={`h-10 w-10 rounded-full ring-2 flex items-center justify-center ${
              r.correct ? "bg-green-500/10 ring-green-500" : "bg-red-500/10 ring-red-500"
            }`}
            title={`Target ${r.target} • Heard ${r.heard}`}
          >
            {r.correct ? "✓" : "•"}
          </div>
        ))}
      </div>
      <div className="mt-3 text-sm text-gray-600">
        {total ? Math.round((correct / total) * 100) : 0}% accurate ({correct}/{total})
      </div>
    </div>
  );
}
