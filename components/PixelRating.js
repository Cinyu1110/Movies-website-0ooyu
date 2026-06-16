export default function PixelRating({ rating, max = 10 }) {
  const filled = Math.round((rating / 10) * max);

  const PopcornIcon = ({ isFilled, index }) => {
    const bkt = isFilled ? '#d4b8a0' : '#cdc7bc';
    const bktDark = isFilled ? '#c49880' : '#bfbab2';
    const kernel = isFilled ? '#e8dcc8' : '#ddd7cb';
    const kernelHi = isFilled ? '#f2ece2' : '#e8e1d5';
    const steam = isFilled ? 'rgba(160,196,168,0.35)' : 'transparent';

    return (
      <svg
        key={index}
        width="22"
        height="28"
        viewBox="0 0 22 28"
        style={{ display: 'block' }}
      >
        <rect x="6" y="0" width="3" height="3" fill={steam} />
        <rect x="11" y="1" width="3" height="3" fill={steam} />
        <rect x="16" y="0" width="3" height="3" fill={steam} />
        <rect x="6" y="4" width="5" height="5" fill={kernel} />
        <rect x="11" y="3" width="5" height="5" fill={kernel} />
        <rect x="8" y="7" width="5" height="4" fill={kernelHi} />
        <rect x="5" y="7" width="4" height="4" fill={kernel} />
        <rect x="13" y="5" width="4" height="4" fill={kernel} />
        <rect x="7" y="5" width="3" height="3" fill={kernelHi} />
        <rect x="12" y="4" width="3" height="3" fill={kernelHi} />
        <rect x="2" y="11" width="18" height="3" fill={bkt} />
        <rect x="3" y="14" width="16" height="12" fill={bkt} />
        <rect x="2" y="14" width="1" height="10" fill={bkt} />
        <rect x="19" y="14" width="1" height="10" fill={bkt} />
        <rect x="3" y="17" width="16" height="3" fill={bktDark} />
        <rect x="3" y="23" width="16" height="3" fill={bktDark} />
        <rect x="5" y="26" width="12" height="2" fill={bkt} />
        <rect x="2" y="11" width="18" height="3" fill="none" stroke="#3a3834" strokeWidth="0.5" opacity="0.2" />
      </svg>
    );
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-end',
      gap: '3px',
      padding: '6px 12px',
      border: '2px solid var(--border)',
      background: 'var(--bg)',
      boxShadow: '3px 3px 0 0 var(--border)',
    }}>
      {Array.from({ length: max }, (_, i) => (
        <PopcornIcon key={i} isFilled={i < filled} index={i} />
      ))}
      <span
        style={{
          fontFamily: 'var(--font-pixel)',
          fontSize: '15px',
          color: 'var(--text)',
          marginLeft: '10px',
          lineHeight: '28px',
          fontWeight: 'bold',
        }}
      >
        {rating.toFixed(1)}
      </span>
    </div>
  );
}
