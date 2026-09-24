export default function MetricCard({ label, value, tone = 'default' }) {
  return (
    <div className={`metric-card ${tone}`}>
      <span className="metric-label">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
