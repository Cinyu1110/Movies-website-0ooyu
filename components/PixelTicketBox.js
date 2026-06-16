import PixelRating from './PixelRating';

function ClapperboardIcon() {
  return (
    <svg width="36" height="30" viewBox="0 0 36 30" style={{ display: 'block' }}>
      <rect x="2" y="12" width="32" height="16" fill="var(--text)" opacity="0.12" />
      <rect x="2" y="5" width="32" height="10" fill="var(--text)" opacity="0.15" />
      <rect x="5" y="6" width="5" height="8" fill="var(--bg)" />
      <rect x="16" y="6" width="5" height="8" fill="var(--bg)" />
      <rect x="27" y="6" width="5" height="8" fill="var(--bg)" />
      <rect x="6" y="17" width="18" height="3" fill="var(--text)" opacity="0.08" />
      <rect x="6" y="23" width="14" height="3" fill="var(--text)" opacity="0.08" />
    </svg>
  );
}

function PixelCorner({ position }) {
  const styles = {
    tl: { top: 8, left: 8 },
    tr: { top: 8, right: 8, transform: 'scaleX(-1)' },
    bl: { bottom: 8, left: 8, transform: 'scaleY(-1)' },
    br: { bottom: 8, right: 8, transform: 'scale(-1,-1)' },
  };
  return (
    <div style={{ position: 'absolute', pointerEvents: 'none', ...styles[position] }}>
      <svg width="20" height="20" viewBox="0 0 20 20">
        <rect x="0" y="0" width="4" height="20" fill="var(--border)" opacity="0.12" />
        <rect x="0" y="0" width="20" height="4" fill="var(--border)" opacity="0.12" />
        <rect x="0" y="0" width="10" height="10" fill="var(--border)" opacity="0.06" />
      </svg>
    </div>
  );
}

export default function PixelTicketBox({ movie }) {
  const holes = Array.from({ length: 16 }, (_, i) => i);

  return (
    <div className="ticket">
      <PixelCorner position="tl" />
      <PixelCorner position="tr" />
      <PixelCorner position="bl" />
      <PixelCorner position="br" />

      <div className="perforations top">
        {holes.map((i) => (
          <div key={i} className="hole" />
        ))}
      </div>
      <div className="perforations bottom">
        {holes.map((i) => (
          <div key={i} className="hole" />
        ))}
      </div>

      <div className="ticket-header">
        <div className="ticket-badge">ADMIT ONE</div>
        <div className="ticket-no">
          NO. {String(movie.year).slice(-2)}{movie.rating.toString().replace('.', '')}
        </div>
      </div>

      <div className="divider">
        {Array.from({ length: 48 }, (_, i) => (
          <div key={i} className="dash" />
        ))}
      </div>

      <div className="title-section">
        <div className="title-row">
          <ClapperboardIcon />
          <div className="title-text">
            <h1 className="ticket-title">{movie.title}</h1>
            <div className="ticket-subtitle">
              {movie.director.name} &middot; {movie.year}
            </div>
          </div>
        </div>
      </div>

      <div className="rating-section">
        <PixelRating rating={movie.rating} />
      </div>

      <div className="divider">
        {Array.from({ length: 48 }, (_, i) => (
          <div key={i} className="dash" />
        ))}
      </div>

      <div className="ticket-info">
        <div className="info-item">
          <span className="info-label">DIRECTOR</span>
          <span className="info-value">{movie.director.name}</span>
          <span className="info-sub">{movie.director.region}</span>
        </div>
        <div className="info-item">
          <span className="info-label">GENRE</span>
          <div className="info-tags">
            {movie.genre.map((g) => (
              <span key={g} className="tag">
                <span className="tag-dot" />
                {g}
              </span>
            ))}
          </div>
        </div>
        <div className="info-item">
          <span className="info-label">YEAR</span>
          <span className="info-value">{movie.year}</span>
        </div>
        <div className="info-item">
          <span className="info-label">DURATION</span>
          <span className="info-value">
            {Math.floor(movie.duration / 60) > 0 && `${Math.floor(movie.duration / 60)}h `}
            {movie.duration % 60 > 0 && `${movie.duration % 60}min`}
          </span>
        </div>
        <div className="info-item full-width">
          <span className="info-label">REGION</span>
          <span className="info-value">{movie.region.join(' / ')}</span>
        </div>
      </div>

      <div className="divider">
        {Array.from({ length: 48 }, (_, i) => (
          <div key={i} className="dash" />
        ))}
      </div>

      <div className="ticket-summary">
        <span className="summary-label">SYNOPSIS</span>
        <p className="summary-text">{movie.summary}</p>
      </div>

      <div className="ticket-footer">
        <div className="footer-reels">
          {Array.from({ length: 9 }, (_, i) => (
            <span key={i} className="reel-dot" />
          ))}
        </div>
        <span className="footer-text">CLASSIC FILM ARCHIVE &middot; PIXEL CINEMA</span>
      </div>

      <style jsx>{`
        .ticket {
          position: relative;
          border: 2px solid var(--border);
          background: var(--surface);
          box-shadow: var(--pixel-shadow-lg);
          padding: 60px 40px 52px;
        }

        .perforations {
          position: absolute;
          left: 0;
          right: 0;
          display: flex;
          justify-content: space-around;
          padding: 0 24px;
        }
        .perforations.top { top: 18px; }
        .perforations.bottom { bottom: 18px; }
        .hole {
          width: 8px;
          height: 8px;
          background: var(--bg);
          border: 2px solid var(--border-soft);
        }

        .ticket-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .ticket-badge {
          font-family: var(--font-pixel);
          font-size: 12px;
          letter-spacing: 3px;
          color: var(--bg);
          background: var(--text);
          padding: 6px 18px;
          border: 2px solid var(--border);
          box-shadow: 3px 3px 0 0 var(--border);
        }
        .ticket-no {
          font-family: var(--font-pixel);
          font-size: 12px;
          color: var(--muted);
          letter-spacing: 2px;
        }

        .divider {
          display: flex;
          gap: 5px;
          padding: 12px 0;
          overflow: hidden;
        }
        .dash {
          width: 8px;
          height: 2px;
          background: var(--border-soft);
          flex-shrink: 0;
        }

        .title-section {
          padding: 12px 0;
        }
        .title-row {
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }
        .title-text {
          flex: 1;
        }
        .ticket-title {
          font-family: var(--font-pixel);
          font-size: 32px;
          font-weight: 700;
          line-height: 1.3;
          color: var(--text);
          text-shadow: 3px 3px 0 var(--border-soft);
        }
        .ticket-subtitle {
          font-family: var(--font-pixel);
          font-size: 14px;
          color: var(--muted);
          margin-top: 8px;
          letter-spacing: 2px;
        }

        .rating-section {
          padding: 16px 0 8px;
        }

        .ticket-info {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px 40px;
          padding: 16px 0;
        }
        .info-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .info-item.full-width {
          grid-column: 1 / -1;
        }
        .info-label {
          font-family: var(--font-pixel);
          font-size: 11px;
          letter-spacing: 3px;
          color: var(--muted);
        }
        .info-value {
          font-family: var(--font-pixel);
          font-size: 16px;
          color: var(--text);
        }
        .info-sub {
          font-family: var(--font-body);
          font-size: 14px;
          color: var(--text-secondary);
        }
        .info-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .tag {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-family: var(--font-pixel);
          font-size: 12px;
          padding: 4px 12px;
          border: 2px solid var(--border);
          color: var(--text-secondary);
          background: var(--bg);
          box-shadow: 2px 2px 0 0 var(--border);
        }
        .tag-dot {
          width: 4px;
          height: 4px;
          background: var(--sage);
          flex-shrink: 0;
        }

        .ticket-summary {
          padding: 16px 0;
        }
        .summary-label {
          font-family: var(--font-pixel);
          font-size: 11px;
          letter-spacing: 3px;
          color: var(--muted);
          display: block;
          margin-bottom: 14px;
        }
        .summary-text {
          font-size: 16px;
          line-height: 2;
          color: var(--text-secondary);
          border-left: 3px solid var(--sage);
          padding-left: 18px;
        }

        .ticket-footer {
          padding-top: 20px;
          text-align: center;
        }
        .footer-reels {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-bottom: 10px;
        }
        .reel-dot {
          width: 6px;
          height: 6px;
          background: var(--border-soft);
        }
        .footer-text {
          font-family: var(--font-pixel);
          font-size: 10px;
          letter-spacing: 4px;
          color: var(--muted);
        }

        @media (max-width: 640px) {
          .ticket { padding: 48px 18px 40px; box-shadow: 3px 3px 0 0 var(--border); }
          .ticket-title { font-size: 22px; text-shadow: 2px 2px 0 var(--border-soft); }
          .title-row { flex-direction: column; }
          .ticket-info { grid-template-columns: 1fr; gap: 18px; }
          .ticket-badge { font-size: 10px; padding: 4px 12px; }
        }
      `}</style>
    </div>
  );
}
