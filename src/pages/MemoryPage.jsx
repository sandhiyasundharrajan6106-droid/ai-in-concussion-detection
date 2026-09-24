import { useEffect, useState } from 'react';
import Disclaimer from '../components/Disclaimer';

const targetItems = ['APPLE', 'CAR', 'BALL', 'TREE', 'PHONE'];
const optionSet = ['APPLE', 'CAR', 'BALL', 'TREE', 'PHONE', 'BOOK', 'LAMP', 'GARDEN', 'RIVER', 'CLOCK'];

export default function MemoryPage({ session, updateSession, navigate }) {
  const [showWords, setShowWords] = useState(true);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => setShowWords(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  const toggleItem = (item) => {
    setSelected((prev) => (prev.includes(item) ? prev.filter((value) => value !== item) : [...prev, item]));
  };

  const finishTest = () => {
    const correct = selected.filter((item) => targetItems.includes(item)).length;
    const incorrect = selected.length - correct;
    const memoryScore = (correct / targetItems.length) * 100;

    updateSession({
      memory: {
        correct,
        incorrect,
        memory_score: Number(memoryScore.toFixed(2)),
        selected_items: selected,
        target_items: targetItems,
      },
    });
    navigate('/attention-test');
  };

  return (
    <div className="page">
      <div className="test-card">
        <div className="section-header">
          <div>
            <h2>Memory test</h2>
            <p className="muted">Memorize the items, then select what you remember.</p>
          </div>
        </div>

        <div className="reaction-box" style={{ minHeight: 220 }}>
          {showWords ? targetItems.join('   ') : 'MEMORY TEST'}
        </div>

        {!showWords && (
          <>
            <div className="memory-grid">
              {optionSet.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`memory-item ${selected.includes(item) ? 'selected' : ''}`}
                  onClick={() => toggleItem(item)}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="test-actions">
              <button type="button" className="ghost-btn" onClick={() => navigate('/reaction-test')}>
                Back
              </button>
              <button type="button" className="primary-btn" onClick={finishTest}>
                Submit memory result
              </button>
            </div>
          </>
        )}

        <Disclaimer />
      </div>
    </div>
  );
}
