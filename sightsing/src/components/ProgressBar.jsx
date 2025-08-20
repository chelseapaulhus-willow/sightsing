export default function ProgressBar({ value = 0 }) {
  return (
    <div className="h-2 w-full rounded-full bg-gray-200">
      <div
        className="h-2 rounded-full bg-gradient-to-r from-violet-500 to-blue-500 transition-all"
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  );
}
