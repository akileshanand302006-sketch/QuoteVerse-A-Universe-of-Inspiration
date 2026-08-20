import { useState, useRef } from 'react';
import { Palette, Download, RotateCcw, Save, Sparkles, Check } from 'lucide-react';
import { formatQuoteForSharing } from '../utils/quoteUtils';

/**
 * QuoteStudio — Visual Quote Card Studio for designing and customizing quote images.
 */
function QuoteStudio({ quote, quotes, onShowToast }) {
  const currentQuote = quote || quotes[0];

  // Customization Options State
  const [design, setDesign] = useState({
    bgType: 'gradient-cosmic', // gradient-cosmic, gradient-sunset, nature, dark, light
    fontSize: 22,
    fontStyle: 'Playfair Display', // Playfair Display, Inter, monospace
    textAlign: 'center',
    borderStyle: 'glass-glow', // glass-glow, double, solid, minimal
    overlayOpacity: 0.3,
    cardTheme: 'dark',
    quoteMarkStyle: 'classic' // classic, modern, none
  });

  const [isSaved, setIsSaved] = useState(false);

  const backgrounds = {
    'gradient-cosmic': 'linear-gradient(135deg, #0a0a1a 0%, #1e1b4b 50%, #311042 100%)',
    'gradient-sunset': 'linear-gradient(135deg, #451254 0%, #901a1e 50%, #d97706 100%)',
    'nature': 'url(https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80) center/cover',
    'dark': '#0a0a1a',
    'light': '#f8f6ff'
  };

  const handleReset = () => {
    setDesign({
      bgType: 'gradient-cosmic',
      fontSize: 22,
      fontStyle: 'Playfair Display',
      textAlign: 'center',
      borderStyle: 'glass-glow',
      overlayOpacity: 0.3,
      cardTheme: 'dark',
      quoteMarkStyle: 'classic'
    });
    if (onShowToast) onShowToast('Design reset to default settings', 'info');
  };

  const handleSave = () => {
    setIsSaved(true);
    if (onShowToast) onShowToast('Quote Card Design saved! 🎨', 'success');
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleDownload = () => {
    // Copy quote card text or simulate download
    navigator.clipboard.writeText(formatQuoteForSharing(currentQuote));
    if (onShowToast) onShowToast('Quote Card text copied to clipboard for export!', 'success');
  };

  return (
    <div className="page-enter" style={{ padding: '2rem 0' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Palette size={36} style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem' }} />
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700 }}>
            Quote Card Studio
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Transform your quote into a beautiful visual card preview
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }}>

          {/* Live Card Preview Box */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div
              id="quote-studio-card"
              style={{
                width: '100%',
                maxWidth: '520px',
                minHeight: '360px',
                padding: '3rem 2.5rem',
                borderRadius: 'var(--radius-xl)',
                background: backgrounds[design.bgType],
                color: design.cardTheme === 'dark' || design.bgType !== 'light' ? '#fff' : '#0f172a',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: design.textAlign === 'center' ? 'center' : design.textAlign === 'right' ? 'flex-end' : 'flex-start',
                textAlign: design.textAlign,
                position: 'relative',
                boxShadow: design.borderStyle === 'glass-glow' ? '0 12px 40px var(--accent-glow)' : 'var(--shadow-lg)',
                border: design.borderStyle === 'double' ? '4px double var(--border-accent)' : design.borderStyle === 'solid' ? '2px solid var(--border-accent)' : '1px solid var(--border-color)',
                transition: 'all 0.4s ease',
                overflow: 'hidden'
              }}
            >
              {/* Overlay */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: `rgba(0, 0, 0, ${design.overlayOpacity})`,
                pointerEvents: 'none'
              }} />

              {/* Quote Mark */}
              {design.quoteMarkStyle === 'classic' && (
                <span style={{ fontSize: '4rem', fontFamily: 'serif', opacity: 0.3, lineHeight: 1, position: 'relative', zIndex: 1 }}>
                  &ldquo;
                </span>
              )}

              {/* Text */}
              <p style={{
                fontFamily: design.fontStyle,
                fontSize: `${design.fontSize}px`,
                lineHeight: 1.6,
                marginBottom: '1.5rem',
                position: 'relative',
                zIndex: 1
              }}>
                {currentQuote.text}
              </p>

              {/* Author */}
              <p style={{
                fontSize: '0.95rem',
                fontWeight: 600,
                opacity: 0.85,
                position: 'relative',
                zIndex: 1
              }}>
                — {currentQuote.author}
              </p>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button className="btn-glass" onClick={handleReset}>
                <RotateCcw size={16} /> Reset
              </button>
              <button className="btn-glass" onClick={handleSave}>
                {isSaved ? <Check size={16} style={{ color: '#22c55e' }} /> : <Save size={16} />}
                {isSaved ? 'Saved!' : 'Save Design'}
              </button>
              <button className="btn-accent" onClick={handleDownload}>
                <Download size={16} /> Download Card
              </button>
            </div>
          </div>

          {/* Controls Panel */}
          <div className="glass-card-static" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              Customization Panel
            </h3>

            {/* Background Selector */}
            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>Background Style</label>
              <select
                className="input-glass"
                value={design.bgType}
                onChange={(e) => setDesign({ ...design, bgType: e.target.value })}
              >
                <option value="gradient-cosmic">Cosmic Nebula</option>
                <option value="gradient-sunset">Sunset Warmth</option>
                <option value="nature">Nature Mountain</option>
                <option value="dark">Solid Dark</option>
                <option value="light">Solid Light</option>
              </select>
            </div>

            {/* Font Style */}
            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>Typography</label>
              <select
                className="input-glass"
                value={design.fontStyle}
                onChange={(e) => setDesign({ ...design, fontStyle: e.target.value })}
              >
                <option value="Playfair Display">Serif (Playfair Display)</option>
                <option value="Inter">Sans-Serif (Inter)</option>
                <option value="monospace">Monospace</option>
              </select>
            </div>

            {/* Font Size Slider */}
            <div style={{ marginBottom: '1.2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                <span>Font Size</span>
                <span>{design.fontSize}px</span>
              </div>
              <input
                type="range"
                min="16"
                max="32"
                value={design.fontSize}
                onChange={(e) => setDesign({ ...design, fontSize: parseInt(e.target.value) })}
                style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
              />
            </div>

            {/* Overlay Opacity Slider */}
            <div style={{ marginBottom: '1.2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                <span>Overlay Opacity</span>
                <span>{Math.round(design.overlayOpacity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="0.8"
                step="0.05"
                value={design.overlayOpacity}
                onChange={(e) => setDesign({ ...design, overlayOpacity: parseFloat(e.target.value) })}
                style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
              />
            </div>

            {/* Text Alignment */}
            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>Text Alignment</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {['left', 'center', 'right'].map((align) => (
                  <button
                    key={align}
                    className={`chip ${design.textAlign === align ? 'active' : ''}`}
                    onClick={() => setDesign({ ...design, textAlign: align })}
                    style={{ flex: 1, justifyContent: 'center', textTransform: 'capitalize' }}
                  >
                    {align}
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default QuoteStudio;
