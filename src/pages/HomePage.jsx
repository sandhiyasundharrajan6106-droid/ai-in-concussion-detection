import Disclaimer from '../components/Disclaimer';

const featureCards = [
  {
    title: 'Why rapid screening matters',
    description: 'Fast preliminary screening can help identify when further evaluation may be appropriate after a head impact.',
  },
  {
    title: 'Eye movement analysis',
    description: 'Prototype gaze tracking and motion consistency provide an early educational signal for visual processing patterns.',
  },
  {
    title: 'Cognitive analysis',
    description: 'Reaction, memory, and attention tasks offer a quick snapshot of processing performance.',
  },
  {
    title: 'AI-powered feature analysis',
    description: 'Feature extraction combines signals into a structured prototype score for demonstration use.',
  },
];

export default function HomePage({ navigate }) {
  return (
    <div className="page">
      <section className="hero">
        <div className="hero-copy">
          <h1>NEUROGUARD AI</h1>
          <p className="subtitle">AI-Based Rapid Concussion Screening System</p>
          <p className="subtitle">Rapid preliminary screening through eye movement and cognitive analysis.</p>

          <div className="hero-actions">
            <button className="primary-btn" onClick={() => navigate('/profile')}>
              START SCREENING
            </button>
            <button className="secondary-btn" onClick={() => navigate('/history')}>
              LEARN HOW IT WORKS
            </button>
          </div>

          <Disclaimer />
        </div>

        <div className="hero-panel">
          <div className="section-header">
            <h2>Prototype overview</h2>
          </div>
          <div className="hero-stat-grid">
            <div className="stat-box">
              <small>Screening focus</small>
              <strong>Eye + cognition</strong>
            </div>
            <div className="stat-box">
              <small>Approach</small>
              <strong>Feature-based</strong>
            </div>
            <div className="stat-box">
              <small>Model status</small>
              <strong>Prototype</strong>
            </div>
            <div className="stat-box">
              <small>Safety</small>
              <strong>Educational</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="section-header">
          <h2>How it works</h2>
        </div>
        <div className="feature-grid">
          {featureCards.map((card) => (
            <article key={card.title} className="info-card">
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
