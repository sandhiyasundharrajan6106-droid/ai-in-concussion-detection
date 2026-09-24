export default function ProgressBar({ value, label }) {
  return (
    <div className="progress-group">
      <div className="progress-meta">
        <span>{label}</span>
        <span>{Math.round(value)}%</span>
      </div>
      <div className="progress-bar-track">
        <div className="progress-bar-fill" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
      </div>
    </div>
  );
}
