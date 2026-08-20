import { Sparkles, Code2, Heart, Zap, Globe, Palette, Shield, Keyboard } from 'lucide-react';

/**
 * About Page — Information about QuoteVerse.
 * Showcases features, technologies, and React concepts.
 */
function About() {
  const features = [
    { icon: <Sparkles size={22} />, title: 'Random Quote Generator', desc: 'Discover new quotes with every click' },
    { icon: <Heart size={22} />, title: 'Favorites', desc: 'Save and manage your favorite quotes' },
    { icon: <Zap size={22} />, title: 'Quick Quote', desc: 'Instant quote generation floating button' },
    { icon: <Globe size={22} />, title: 'Share', desc: 'Share quotes via Web Share API' },
    { icon: <Palette size={22} />, title: 'Theme Switching', desc: 'Light and dark mode with persistence' },
    { icon: <Shield size={22} />, title: 'Inspiration Mode', desc: 'Distraction-free reading experience' },
    { icon: <Keyboard size={22} />, title: 'Keyboard Shortcuts', desc: 'Navigate quickly with hotkeys' },
    { icon: <Code2 size={22} />, title: 'Modern Stack', desc: 'React, Vite, Bootstrap, Axios' }
  ];

  const concepts = [
    'Functional Components', 'Props', 'useState', 'useEffect',
    'Custom Hooks', 'React Router', 'Conditional Rendering',
    'map()', 'LocalStorage', 'Axios', 'Responsive Design'
  ];

  return (
    <div className="page-enter" style={{ padding: '2rem 0' }}>
      <div className="container" style={{ maxWidth: 'var(--container-max)' }}>

        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <Sparkles size={48} style={{ color: 'var(--accent-primary)', marginBottom: '1rem' }} />
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
            fontWeight: 700,
            marginBottom: '0.5rem'
          }}>
            <span className="gradient-text">QuoteVerse</span>
          </h1>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            color: 'var(--text-muted)',
            fontSize: '1.1rem',
            marginBottom: '1rem'
          }}>
            &ldquo;A thought worth discovering.&rdquo;
          </p>
          <p style={{
            color: 'var(--text-secondary)',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: 1.7,
            fontSize: '0.95rem'
          }}>
            QuoteVerse is a premium quote discovery platform built with React.js.
            Explore inspirational, motivational, and thought-provoking quotes from
            legendary thinkers, with a beautiful modern interface.
          </p>
        </div>

        {/* Features Grid */}
        <div style={{ marginBottom: '3rem' }}>
          <h2 className="section-title" style={{ justifyContent: 'center' }}>
            ✨ Features
          </h2>
          <div className="about-feature-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1rem'
          }}>
            {features.map((feature) => (
              <div key={feature.title} className="glass-card" style={{
                padding: '1.5rem',
                textAlign: 'center'
              }}>
                <div style={{ color: 'var(--accent-primary)', marginBottom: '0.75rem', display: 'flex', justifyContent: 'center' }}>
                  {feature.icon}
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-primary)',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginBottom: '0.35rem'
                }}>
                  {feature.title}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* React Concepts */}
        <div style={{ marginBottom: '3rem' }}>
          <h2 className="section-title" style={{ justifyContent: 'center' }}>
            ⚛️ React Concepts Demonstrated
          </h2>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '0.5rem'
          }}>
            {concepts.map((concept) => (
              <span key={concept} className="chip active" style={{
                fontSize: '0.8rem',
                padding: '0.35rem 0.85rem',
                cursor: 'default'
              }}>
                {concept}
              </span>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="glass-card-static" style={{
          padding: '2rem',
          textAlign: 'center',
          maxWidth: '500px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.2rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: '1rem'
          }}>
            🛠️ Built With
          </h2>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '0.5rem'
          }}>
            {['React 19', 'Vite', 'JavaScript', 'Bootstrap 5', 'React Router', 'Axios', 'Lucide Icons', 'CSS3'].map((tech) => (
              <span key={tech} className="chip" style={{ cursor: 'default' }}>{tech}</span>
            ))}
          </div>
        </div>

        {/* Footer Note */}
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            Made with 💜 and React
          </p>
        </div>

      </div>
    </div>
  );
}

export default About;
