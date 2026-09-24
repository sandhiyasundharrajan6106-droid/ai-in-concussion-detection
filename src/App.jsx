import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { getJson, postJson } from './services/api';
import { defaultSession, loadSession, saveSession } from './utils/storage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import SymptomsPage from './pages/SymptomsPage';
import EyeMovementPage from './pages/EyeMovementPage';
import ReactionPage from './pages/ReactionPage';
import MemoryPage from './pages/MemoryPage';
import AttentionPage from './pages/AttentionPage';
import AnalysisPage from './pages/AnalysisPage';
import ResultsPage from './pages/ResultsPage';
import HistoryPage from './pages/HistoryPage';

function AppContent() {
  const [session, setSession] = useState(() => loadSession());
  const navigate = useNavigate();

  useEffect(() => {
    saveSession(session);
  }, [session]);

  const updateSession = (patch) => {
    setSession((prev) => ({ ...prev, ...patch }));
  };

  const resetSession = () => {
    setSession({ ...defaultSession });
    navigate('/');
  };

  return (
    <Routes>
      <Route path="/" element={<HomePage navigate={navigate} />} />
      <Route
        path="/profile"
        element={<ProfilePage session={session} updateSession={updateSession} navigate={navigate} />}
      />
      <Route
        path="/symptoms"
        element={<SymptomsPage session={session} updateSession={updateSession} navigate={navigate} />}
      />
      <Route
        path="/eye-test"
        element={<EyeMovementPage session={session} updateSession={updateSession} navigate={navigate} />}
      />
      <Route
        path="/reaction-test"
        element={<ReactionPage session={session} updateSession={updateSession} navigate={navigate} />}
      />
      <Route
        path="/memory-test"
        element={<MemoryPage session={session} updateSession={updateSession} navigate={navigate} />}
      />
      <Route
        path="/attention-test"
        element={<AttentionPage session={session} updateSession={updateSession} navigate={navigate} />}
      />
      <Route
        path="/analysis"
        element={
          <AnalysisPage session={session} updateSession={updateSession} navigate={navigate} resetSession={resetSession} />
        }
      />
      <Route
        path="/results"
        element={<ResultsPage session={session} updateSession={updateSession} navigate={navigate} />}
      />
      <Route path="/history" element={<HistoryPage navigate={navigate} />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
