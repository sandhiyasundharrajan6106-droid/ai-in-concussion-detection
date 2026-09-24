import { useEffect, useRef, useState } from 'react';
import Disclaimer from '../components/Disclaimer';

const totalRounds = 3;

function calculateMetrics(roundTimes) {
  if (!roundTimes.length) {
    return {
      average_reaction_ms: 0,
      fastest_reaction_ms: 0,
      slowest_reaction_ms: 0,
      consistency: 0,
      reaction_score: 0,
    };
  }

  const avg = roundTimes.reduce((sum, time) => sum + time, 0) / roundTimes.length;
  const fastest = Math.min(...roundTimes);
  const slowest = Math.max(...roundTimes);
  const consistency = Math.max(0, 100 - ((slowest - fastest) / Math.max(1, avg)) * 100);
  const reactionScore = Math.max(0, Math.min(100, 100 - avg / 10));

  return {
    average_reaction_ms: Math.round(avg),
    fastest_reaction_ms: Math.round(fastest),
    slowest_reaction_ms: Math.round(slowest),
    consistency: Number(consistency.toFixed(2)),
    reaction_score: Number(reactionScore.toFixed(2)),
  };
}

export default function ReactionPage({ session, updateSession, navigate }) {
  const [roundIndex, setRoundIndex] = useState(0);
  const [roundTimes, setRoundTimes] = useState([]);
  const [phase, setPhase] = useState('ready');
  const [targetVisible, setTargetVisible] = useState(false);
  const [timeStamp, setTimeStamp] = useState(null);
  const [message, setMessage] = useState('READY');
  const timeoutRef = useRef(null);

  const resetRound = () => {
    setTargetVisible(false);
    setPhase('ready');
    setTimeStamp(null);
    setMessage('READY');
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const startRound = () => {
    if (roundIndex >= totalRounds) {
      const metrics = calculateMetrics(roundTimes);
      updateSession({ reaction: { ...metrics, rounds: roundTimes } });
      navigate('/memory-test');
      return;
    }

    resetRound();
    setMessage('WAIT');
    setPhase('waiting');
    const delay = 800 + Math.random() * 1800;
    timeoutRef.current = setTimeout(() => {
      setTargetVisible(true);
      setMessage('CLICK');
      setPhase('go');
      setTimeStamp(Date.now());
    }, delay);
  };

  useEffect(() => {
    if (roundIndex === 0 && phase === 'ready') {
      startRound();
    }
  }, []);

  const handleTargetClick = () => {
    if (!timeStamp) return;

    const reactionTime = Date.now() - timeStamp;
    const nextTimes = [...roundTimes, reactionTime];
    setRoundTimes(nextTimes);
    setTargetVisible(false);
    setMessage('GREAT');

    if (roundIndex + 1 >= totalRounds) {
      const metrics = calculateMetrics(nextTimes);
      setTimeout(() => {
        updateSession({ reaction: { ...metrics, rounds: nextTimes } });
        navigate('/memory-test');
      }, 600);
      return;
    }

    setTimeout(() => {
      setRoundIndex((prev) => prev + 1);
      setPhase('ready');
      setMessage('READY');
      setTimeStamp(null);
      startRound();
    }, 700);
  };

  const currentDisplay = targetVisible ? 'TARGET' : message;

  return (
    <div className="page">
      <div className="test-card">
        <div className="section-header">
          <div>
            <h2>Reaction time test</h2>
            <p className="muted">Wait for the target, then click as quickly as possible.</p>
          </div>
          <span className="status-chip">Round {Math.min(roundIndex + 1, totalRounds)} / {totalRounds}</span>
        </div>

        <div className="reaction-box" onClick={handleTargetClick}>
          {currentDisplay}
        </div>

        <div className="test-actions">
          <button type="button" className="ghost-btn" onClick={() => navigate('/eye-test')}>
            Back
          </button>
          <button type="button" className="primary-btn" onClick={startRound}>
            Start next round
          </button>
        </div>

        <Disclaimer />
      </div>
    </div>
  );
}
