import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

/**
 * LiveClock — Real-time date & time display component.
 * Updates every second using useState and useEffect.
 */
function LiveClock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    // Cleanup on unmount
    return () => clearInterval(timer);
  }, []);

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const dayName = dayNames[now.getDay()];
  const date = now.getDate();
  const month = monthNames[now.getMonth()];
  const year = now.getFullYear();

  const hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHour = hours % 12 || 12;

  return (
    <div className="live-clock-container text-center mb-3" style={{
      color: 'var(--text-secondary)',
      fontSize: '0.9rem',
      fontWeight: 400,
      letterSpacing: '0.5px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
        <Clock size={14} style={{ opacity: 0.6 }} />
        <span style={{ fontWeight: 500 }}>{dayName}</span>
      </div>
      <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>
        {date} {month} {year} &bull; {displayHour}:{minutes} {ampm}
      </div>
    </div>
  );
}

export default LiveClock;
