import { useEffect, useState } from 'react';
import { GemSmoke } from '@paper-design/shaders-react';
import { useTheme } from '../hooks/useTheme';

// The header CTA's living fill: Paper's GemSmoke with no gem (`shape: none`),
// so only the smoke is left drifting across the pill. The tones follow the
// copper tokens, which flip at night: a deep copper under a white label by day,
// a light copper under a navy one at night. The label has to read on colors[0],
// the tone that covers most of the pill; colors[1] is the drift passing over it.
// Loaded lazily from Header — the WebGL code stays out of the entry chunk and
// the button's CSS gradient stands in until (or unless) this mounts.
const REDUCED = '(prefers-reduced-motion: reduce)';

const DAY = { colorBack: '#c58b66', colorInner: '#8f552f', colors: ['#8f552f', '#e2b08c'] };
const NIGHT = { colorBack: '#d29c78', colorInner: '#d29c78', colors: ['#d29c78', '#f6e2d0'] };

export default function SmokeFill({ className = '' }) {
  const tones = useTheme() === 'dark' ? NIGHT : DAY;
  const [still, setStill] = useState(() => window.matchMedia(REDUCED).matches);

  useEffect(() => {
    const mq = window.matchMedia(REDUCED);
    const sync = (e) => setStill(e.matches);
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  return (
    <GemSmoke
      className={className}
      colorBack={tones.colorBack}
      colorInner={tones.colorInner}
      colors={tones.colors}
      shape="none"
      innerDistortion={0.9}
      outerDistortion={0.8}
      outerGlow={0.8}
      innerGlow={1}
      offset={0}
      angle={212}
      size={0.3}
      speed={still ? 0 : 1}
      scale={1.1}
      fit="cover"
    />
  );
}
