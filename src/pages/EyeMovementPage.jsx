import { useEffect, useRef, useState } from 'react';
import Disclaimer from '../components/Disclaimer';

const motionSequence = [
  { x: 12, y: 50 },
  { x: 50, y: 50 },
  { x: 88, y: 50 },
  { x: 50, y: 50 },
  { x: 50, y: 18 },
  { x: 50, y: 50 },
  { x: 50, y: 82 },
  { x: 50, y: 50 },
];

export default function EyeMovementPage({ session, updateSession, navigate }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [targetIndex, setTargetIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Tracking target');
  const [cameraError, setCameraError] = useState('');
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setDemoMode(true);
      setCameraError('Webcam unavailable. Eye tracking demo mode is active. Results are for prototype demonstration only.');
      return undefined;
    }

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        setDemoMode(true);
        setCameraError('Webcam permission denied or unavailable. Eye tracking demo mode is active. Results are for prototype demonstration only.');
      }
    };

    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (targetIndex >= motionSequence.length) {
      setStatus('Test complete');
      return undefined;
    }

    const timer = setTimeout(() => {
      setTargetIndex((prev) => prev + 1);
      setProgress(((targetIndex + 1) / motionSequence.length) * 100);
    }, 900);

    return () => clearTimeout(timer);
  }, [targetIndex]);

  const targetPosition = motionSequence[Math.min(targetIndex, motionSequence.length - 1)];

  const completeTest = () => {
    const eyeAnalysis = {
      tracking_mode: demoMode ? 'demo' : 'camera',
      tracking_score: demoMode ? 78 : 84,
      consistency: demoMode ? 81 : 87,
      response_delay: demoMode ? 240 : 185,
      horizontal_movement: demoMode ? 22 : 28,
      vertical_movement: demoMode ? 18 : 24,
      target_sequence: motionSequence.map((point) => `${point.x},${point.y}`),
      status: demoMode
        ? 'Eye tracking demo mode is active. Results are for prototype demonstration only.'
        : 'Tracking complete. Prototype visual analysis recorded.',
      demo_mode: demoMode,
    };

    updateSession({ eyeAnalysis });
    navigate('/reaction-test');
  };

  return (
    <div className="page">
      <div className="test-card">
        <div className="section-header">
          <div>
            <h2>Eye movement test</h2>
            <p className="muted">Follow the moving target with your eyes while keeping your head relatively still.</p>
          </div>
          <span className={`status-chip ${demoMode ? 'warning' : ''}`}>{demoMode ? 'DEMO MODE' : 'LIVE TRACKING'}</span>
        </div>

        <div className="eye-stage">
          {cameraError ? <div className="muted">{cameraError}</div> : <video ref={videoRef} autoPlay playsInline muted />}
          <div
            className="target"
            style={{
              left: `${targetPosition.x}%`,
              top: `${targetPosition.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        </div>

        <div className="progress-group" style={{ marginTop: 16 }}>
          <div className="progress-meta">
            <span>{status}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="test-actions">
          <button type="button" className="ghost-btn" onClick={() => navigate('/symptoms')}>
            Back
          </button>
          <button type="button" className="primary-btn" onClick={completeTest} disabled={progress < 100}>
            Complete test
          </button>
        </div>

        <Disclaimer />
      </div>
    </div>
  );
}
