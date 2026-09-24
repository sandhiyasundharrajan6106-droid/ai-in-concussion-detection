import { useState } from 'react';
import Disclaimer from '../components/Disclaimer';

const initialForm = {
  name: '',
  age: '',
  athlete_status: 'Athlete',
  sport_activity: '',
  assessment_date: new Date().toISOString().slice(0, 16),
};

export default function ProfilePage({ session, updateSession, navigate }) {
  const [form, setForm] = useState({
    ...initialForm,
    ...session.profile,
  });
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setError('Please enter your name.');
      return;
    }

    if (!form.age || Number(form.age) < 1 || Number(form.age) > 120) {
      setError('Age must be between 1 and 120.');
      return;
    }

    if (!form.sport_activity.trim()) {
      setError('Please enter your sport or activity.');
      return;
    }

    updateSession({ profile: { ...form, age: Number(form.age) } });
    navigate('/symptoms');
  };

  return (
    <div className="page">
      <div className="form-card">
        <div className="section-header">
          <div>
            <h2>User profile</h2>
            <p className="muted">Minimal information to personalize the screening flow.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="name">Name</label>
              <input id="name" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Alex Smith" />
            </div>

            <div className="field">
              <label htmlFor="age">Age</label>
              <input id="age" name="age" type="number" min="1" max="120" value={form.age} onChange={handleChange} />
            </div>

            <div className="field">
              <label htmlFor="athlete_status">Status</label>
              <select id="athlete_status" name="athlete_status" value={form.athlete_status} onChange={handleChange}>
                <option value="Athlete">Athlete</option>
                <option value="Non-athlete">Non-athlete</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="sport_activity">Sport or activity</label>
              <input
                id="sport_activity"
                name="sport_activity"
                value={form.sport_activity}
                onChange={handleChange}
                placeholder="e.g. Soccer, running, cycling"
              />
            </div>

            <div className="field">
              <label htmlFor="assessment_date">Date and time</label>
              <input id="assessment_date" name="assessment_date" type="datetime-local" value={form.assessment_date} onChange={handleChange} />
            </div>
          </div>

          {error && <p className="muted" style={{ color: '#fca5a5', marginTop: 16 }}>{error}</p>}

          <div className="form-actions">
            <button type="button" className="ghost-btn" onClick={() => navigate('/')}>
              Back
            </button>
            <button type="submit" className="primary-btn">
              Continue
            </button>
          </div>
        </form>

        <Disclaimer />
      </div>
    </div>
  );
}
