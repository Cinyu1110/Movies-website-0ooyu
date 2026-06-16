export default function PixelProjector({ position = 'top-right' }) {
  const posMap = {
    'top-right': { top: 20, right: 20 },
    'top-left': { top: 20, left: 20 },
    'bottom-right': { bottom: 20, right: 20 },
    'bottom-left': { bottom: 20, left: 20 },
  };

  return (
    <div
      style={{
        position: 'fixed',
        opacity: 0.06,
        pointerEvents: 'none',
        zIndex: 1,
        ...posMap[position],
      }}
    >
      <svg width="52" height="44" viewBox="0 0 52 44" fill="none">
        <rect x="6" y="18" width="28" height="16" fill="var(--border)" />
        <rect x="10" y="20" width="8" height="1" fill="var(--bg)" opacity="0.5" />
        <rect x="10" y="23" width="8" height="1" fill="var(--bg)" opacity="0.5" />
        <rect x="10" y="26" width="8" height="1" fill="var(--bg)" opacity="0.5" />
        <rect x="34" y="22" width="14" height="8" fill="var(--border)" />
        <rect x="36" y="24" width="10" height="4" fill="var(--bg)" />
        <rect x="48" y="23" width="2" height="6" fill="var(--border)" />
        <rect x="50" y="24" width="2" height="4" fill="var(--border)" />
        <rect x="10" y="2" width="20" height="20" fill="var(--border)" />
        <rect x="12" y="4" width="16" height="16" fill="var(--bg)" />
        <rect x="18" y="10" width="4" height="4" fill="var(--border)" />
        <rect x="14" y="11" width="2" height="2" fill="var(--border)" />
        <rect x="24" y="11" width="2" height="2" fill="var(--border)" />
        <rect x="19" y="6" width="2" height="2" fill="var(--border)" />
        <rect x="19" y="16" width="2" height="2" fill="var(--border)" />
        <rect x="15" y="7" width="2" height="2" fill="var(--border)" />
        <rect x="23" y="7" width="2" height="2" fill="var(--border)" />
        <rect x="15" y="15" width="2" height="2" fill="var(--border)" />
        <rect x="23" y="15" width="2" height="2" fill="var(--border)" />
        <rect x="4" y="34" width="32" height="4" fill="var(--border)" />
        <rect x="6" y="38" width="6" height="6" fill="var(--border)" />
        <rect x="28" y="38" width="6" height="6" fill="var(--border)" />
        <rect x="26" y="30" width="4" height="2" fill="var(--sage)" opacity="0.6" />
        <rect x="50" y="22" width="2" height="8" fill="var(--sage)" opacity="0.15" />
        <rect x="52" y="24" width="2" height="4" fill="var(--gold)" opacity="0.1" />
      </svg>
    </div>
  );
}
