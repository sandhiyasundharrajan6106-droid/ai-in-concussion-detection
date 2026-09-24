import { useState } from 'react';
import Disclaimer from '../components/Disclaimer';

const symbols = [
  { id: 'circle-1', label: '○', type: 'circle' },
  { id: 'triangle-1', label: '△', type: 'triangle' },
  { id: 'square-1', label: '□', type: 'square' },
  { id: 'circle-2', label: '○', type: 'circle' },
  { id: 'star-1', label: '☆', type: 'star' },
  { id: 'circle-3', label: '○', type: 'circle' },
  { id: 'triangle-2', label: '△', type: 'triangle' },
  { id: 'square-2', label: '□', type: 'square' },
  { id: 'circle-4', label: '○', type: 'circle' },
  { id: 'star-2', label: '☆', type: 'star' },
  { id: 'circle-5', label: '○', type: 'circle' },
  { id: 'triangle-3', label: '△', type: 'triangle' },
];

export default function AttentionPage({ session, updateSession, navigate }) {
  const [selected, setSelected] = useState([]);

  const toggleItem = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id]));
  };

  const completeTest = () => {
    const correctTargets = symbols.filter((symbol) => symbol.type === 'circle').map((item) => item.id);
    const correct = selected.filter((value) => correctTargets.includes(value)).length;
    const incorrect = selected.filter((value) => !correctTargets.includes(value)).length;
    const missed = correctTargets.filter((value) => !selected.includes(value)).length;
    const attentionScore = (correct / correctTargets.length) * 100;

    updateSession({
      attention: {
        correct,
        incorrect,
        missed,
        attention_score: Number(attentionScore.toFixed(2)),
        selected_targets: selected,
        correct_targets: correctTargets,
      },
    });
    navigate('/analysis');
  };

  return (
    <div className="page">
      <div className="test-card">
        <div className="section-header">
          <div>
            <h2>Attention test</h2>
            <p className="muted">Select every circle.</p>
          </div>
        </div>

        <div className="attention-grid">
          {symbols.map((symbol) => (
            <button
              type="button"
              key={symbol.id}
              className={`attention-item ${selected.includes(symbol.id) ? 'selected' : ''}`}
              onClick={() => toggleItem(symbol.id)}
            >
              {symbol.label}
            </button>
          ))}
        </div>

        <div className="test-actions">
          <button type="button" className="ghost-btn" onClick={() => navigate('/memory-test')}>
            Back
          </button>
          <button type="button" className="primary-btn" onClick={completeTest}>
            Finish assessment
          </button>
        </div>

        <Disclaimer />
      </div>
    </div>
  );
}
