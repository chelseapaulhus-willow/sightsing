// components/LivePitch.jsx
export default function LivePitch({ hz, targetHz, targetLabel = "" }) {
  const live = Math.round(hz || 0);
  const tgt = Math.round(targetHz || 0);

  // percent difference (fallback to 0 if no pitch)
  const diffPct = hz && targetHz ? Math.abs(((hz - targetHz) / targetHz) * 100) : 9999;

  // decide color classes based on closeness
  let colorClass = "bg-gray-800 text-gray-100"; // default
  if (diffPct < 1) {
    colorClass = "bg-green-600 text-white"; // very close
  } else if (diffPct < 3) {
    colorClass = "bg-yellow-500 text-black"; // somewhat close
  } else if (diffPct < 8) {
    colorClass = "bg-orange-500 text-white"; // off
  } else if (hz) {
    colorClass = "bg-red-600 text-white"; // way off
  }

  return (
    <div
      className={`px-3 py-1 rounded-full text-sm flex items-center gap-2 transition-colors ${colorClass}`}
    >
      <span>🎤 Live</span>
      <span>{live} Hz</span>
      <span>—</span>
      <span>{targetLabel || `${tgt} Hz`}</span>
      
    </div>
  );
}
