import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, Square } from 'lucide-react';
import { speechService } from '../utils/speechUtils';

/**
 * ReadAloudButton — Web Speech API Component with Sound-Wave Animation.
 */
function ReadAloudButton({ quote, onShowToast }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    // Stop speech when quote changes or component unmounts
    return () => {
      speechService.stop();
      setIsPlaying(false);
      setIsPaused(false);
    };
  }, [quote?.id]);

  const handleSpeak = () => {
    if (!quote) return;

    if (isPaused) {
      speechService.resume();
      setIsPlaying(true);
      setIsPaused(false);
      return;
    }

    const textToRead = `"${quote.text}". By ${quote.author}.`;

    speechService.speak(
      textToRead,
      () => {
        setIsPlaying(true);
        setIsPaused(false);
      },
      () => {
        setIsPlaying(false);
        setIsPaused(false);
      },
      (err) => {
        setIsPlaying(false);
        setIsPaused(false);
        if (onShowToast) onShowToast(typeof err === 'string' ? err : 'Speech error', 'error');
      }
    );
  };

  const handlePause = () => {
    speechService.pause();
    setIsPlaying(false);
    setIsPaused(true);
  };

  const handleStop = () => {
    speechService.stop();
    setIsPlaying(false);
    setIsPaused(false);
  };

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
      {!isPlaying && !isPaused ? (
        <button
          className="btn-glass"
          onClick={handleSpeak}
          aria-label="Read quote aloud"
          title="Read Quote Aloud (R)"
          style={{ fontSize: '0.85rem' }}
        >
          <Volume2 size={16} />
          <span>Read Aloud</span>
        </button>
      ) : (
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          background: 'var(--accent-gradient-subtle)',
          padding: '0.3rem 0.6rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-accent)'
        }}>
          {isPlaying && (
            <button
              className="btn-icon"
              onClick={handlePause}
              aria-label="Pause speech"
              style={{ width: '32px', height: '32px', color: 'var(--text-accent)' }}
            >
              <Pause size={15} />
            </button>
          )}

          {isPaused && (
            <button
              className="btn-icon"
              onClick={handleSpeak}
              aria-label="Resume speech"
              style={{ width: '32px', height: '32px', color: '#22c55e' }}
            >
              <Play size={15} />
            </button>
          )}

          <button
            className="btn-icon"
            onClick={handleStop}
            aria-label="Stop speech"
            style={{ width: '32px', height: '32px', color: '#ef4444' }}
          >
            <Square size={14} />
          </button>

          {/* Sound-Wave Equalizer Animation */}
          {isPlaying && (
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '16px', padding: '0 4px' }}>
              <span className="soundwave-bar" style={{ animationDelay: '0s' }} />
              <span className="soundwave-bar" style={{ animationDelay: '0.2s' }} />
              <span className="soundwave-bar" style={{ animationDelay: '0.4s' }} />
              <span className="soundwave-bar" style={{ animationDelay: '0.1s' }} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ReadAloudButton;
