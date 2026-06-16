'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import PixelProjector from '../components/PixelProjector';

const PER_PAGE = 12;
const P = ['#d4a0a0','#a0c4a8','#a0b8d4','#b8a0d4','#a0d4c4','#d4b8a0','#d4c8a0','#d4a898','#d4d0a0'];

function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function generateFallbackPoster(title, w = 300, h = 450) {
  const seed = hashStr(title);
  const rng = ((s) => () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  })(seed);

  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const x = c.getContext('2d');

  const bg = P[Math.floor(rng() * P.length)];
  x.fillStyle = bg;
  x.fillRect(0, 0, w, h);

  for (let i = 0; i < 12; i++) {
    const bx = Math.floor(rng() * w);
    const by = Math.floor(rng() * h);
    const bw = Math.floor(rng() * 60) + 20;
    const bh = Math.floor(rng() * 60) + 20;
    x.fillStyle = P[Math.floor(rng() * P.length)];
    x.globalAlpha = 0.15;
    x.fillRect(bx, by, bw, bh);
  }
  x.globalAlpha = 1;

  x.fillStyle = 'rgba(242,236,226,0.92)';
  x.fillRect(20, h - 80, w - 40, 60);
  x.strokeStyle = '#3a3834';
  x.lineWidth = 2;
  x.strokeRect(20, h - 80, w - 40, 60);

  x.fillStyle = '#3a3834';
  x.font = 'bold 16px Karla, sans-serif';
  x.textAlign = 'center';
  x.textBaseline = 'middle';
  const display = title.length > 8 ? title.slice(0, 8) + '…' : title;
  x.fillText(display, w / 2, h - 50);

  return c.toDataURL();
}

function proxyUrl(url) {
  return url ? '/api/poster?url=' + encodeURIComponent(url) : null;
}

function MoviePoster({ title, posterUrl }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  if (!posterUrl || error) {
    return <FallbackPoster title={title} />;
  }
  return (
    <div className="poster-wrap">
      {!loaded && (
        <div className="poster-skeleton">
          <div className="skeleton-pulse" />
        </div>
      )}
      <img
        src={proxyUrl(posterUrl)}
        alt={title}
        className="poster-img"
        style={{ display: loaded ? 'block' : 'none' }}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />
      <div className="poster-pixel-border" />
    </div>
  );
}

function FallbackPoster({ title }) {
  const [dataUrl, setDataUrl] = useState(null);
  useEffect(() => {
    setDataUrl(generateFallbackPoster(title));
  }, [title]);
  if (!dataUrl) return <div className="poster-skeleton"><div className="skeleton-pulse" /></div>;
  return (
    <div className="poster-wrap">
      <img src={dataUrl} alt={title} className="poster-img" />
      <div className="poster-pixel-border" />
    </div>
  );
}

function ReelIcon({ size = 20, spinning = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" style={{
      animation: spinning ? 'reelSpin 4s linear infinite' : 'none',
      display: 'block',
    }}>
      <rect x="2" y="2" width="16" height="16" fill="var(--border)" opacity="0.15" />
      <rect x="4" y="4" width="12" height="12" fill="var(--bg)" />
      <rect x="8" y="8" width="4" height="4" fill="var(--border)" opacity="0.15" />
      <rect x="5" y="9" width="2" height="2" fill="var(--border)" opacity="0.1" />
      <rect x="13" y="9" width="2" height="2" fill="var(--border)" opacity="0.1" />
      <rect x="9" y="5" width="2" height="2" fill="var(--border)" opacity="0.1" />
      <rect x="9" y="13" width="2" height="2" fill="var(--border)" opacity="0.1" />
    </svg>
  );
}

function PixelStar({ x, y, color, delay, size = 4 }) {
  return (
    <div
      className="pixel-star"
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        background: color,
        opacity: 0.3,
        animation: `starTwinkle ${2 + delay * 0.5}s ease-in-out ${delay}s infinite`,
        pointerEvents: 'none',
      }}
    />
  );
}

function MovieCard({ movie, index }) {
  const [hover, setHover] = useState(false);

  return (
    <Link
      href={`/movies/${encodeURIComponent(movie.title)}`}
      className={`card ${hover ? 'card-hover' : ''}`}
      style={{ animationDelay: `${index * 0.05}s` }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="poster-container">
        <MoviePoster title={movie.title} posterUrl={movie.poster_url} />
      </div>
      <div className="card-body">
        <h2 className="card-title">{movie.title}</h2>
        <span className="card-year">{movie.year}</span>
      </div>

      {hover && <div className="pixel-glow" />}

      <style jsx>{`
        .card {
          position: relative;
          display: flex;
          flex-direction: column;
          border: 2px solid var(--border);
          background: var(--surface);
          box-shadow: 4px 4px 0 0 var(--border);
          transition: transform 0.06s steps(3), box-shadow 0.06s steps(3);
          opacity: 0;
          animation: filmLoad 0.4s ease-out forwards;
          overflow: hidden;
        }
        .card-hover {
          transform: translate(-4px, -4px);
          box-shadow: 8px 8px 0 0 var(--border);
          animation: pixelJitter 0.3s steps(4) infinite;
        }

        .poster-container {
          width: 100%;
          aspect-ratio: 2 / 3;
          overflow: hidden;
          border-bottom: 2px solid var(--border);
          position: relative;
        }
        :global(.poster-wrap) {
          width: 100%;
          height: 100%;
          position: relative;
        }
        :global(.poster-img) {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        :global(.poster-pixel-border) {
          position: absolute;
          inset: 0;
          border: 2px solid var(--border);
          pointer-events: none;
        }
        :global(.poster-skeleton) {
          width: 100%;
          height: 100%;
          background: var(--surface-alt);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        :global(.skeleton-pulse) {
          width: 24px;
          height: 24px;
          border: 2px solid var(--border-soft);
          animation: reelSpin 0.8s steps(4) infinite;
        }

        .card-body {
          padding: 16px 14px 18px;
          text-align: center;
        }
        .card-title {
          font-family: var(--font-pixel);
          font-size: 18px;
          font-weight: 700;
          color: var(--text);
          line-height: 1.4;
          margin-bottom: 6px;
        }
        .card-year {
          font-family: var(--font-body);
          font-size: 15px;
          color: var(--text-secondary);
        }

        .pixel-glow {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: repeating-linear-gradient(
            90deg,
            transparent,
            transparent 3px,
            rgba(160,196,168,0.03) 3px,
            rgba(160,196,168,0.03) 4px
          );
          animation: pixelGlow 1.2s ease-in-out infinite;
        }

        @media (max-width: 640px) {
          .card-title { font-size: 15px; }
          .card-year { font-size: 13px; }
          .card-body { padding: 12px 10px 14px; }
        }
      `}</style>
    </Link>
  );
}

function FilmStripPagination({ current, total, onPageChange }) {
  if (total <= 1) return null;

  return (
    <div className="film-strip">
      <div className="strip-perf top-perf">
        {Array.from({ length: 28 }, (_, i) => (
          <div key={i} className="perf-hole" />
        ))}
      </div>
      <div className="strip-perf bottom-perf">
        {Array.from({ length: 28 }, (_, i) => (
          <div key={i} className="perf-hole" />
        ))}
      </div>

      <div className="strip-inner">
        <div className="strip-counter">
          <ReelIcon size={16} spinning />
          <span>FR. {String(current).padStart(2, '0')}/{String(total).padStart(2, '0')}</span>
        </div>
        <button
          className="pixel-btn strip-nav-btn"
          disabled={current === 1}
          onClick={() => onPageChange(current - 1)}
        >
          &lt; PREV
        </button>
        <div className="strip-pages">
          {Array.from({ length: total }, (_, i) => (
            <button
              key={i}
              className={`strip-page ${i + 1 === current ? 'active' : ''}`}
              onClick={() => onPageChange(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <button
          className="pixel-btn strip-nav-btn"
          disabled={current === total}
          onClick={() => onPageChange(current + 1)}
        >
          NEXT &gt;
        </button>
      </div>

      <style jsx>{`
        .film-strip {
          position: relative;
          border: 2px solid var(--border);
          background: var(--surface);
          box-shadow: var(--pixel-shadow);
          padding: 32px 16px 24px;
          margin-top: 12px;
        }

        .strip-perf {
          position: absolute;
          left: 8px;
          right: 8px;
          display: flex;
          justify-content: space-around;
        }
        .top-perf { top: 10px; }
        .bottom-perf { bottom: 10px; }
        .perf-hole {
          width: 6px;
          height: 6px;
          background: var(--bg);
          border: 1px solid var(--border-soft);
        }

        .strip-inner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .strip-counter {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-pixel);
          font-size: 10px;
          color: var(--muted);
          letter-spacing: 1px;
          margin-right: 16px;
        }

        .strip-nav-btn {
          font-size: 11px;
          padding: 10px 16px;
        }
        .strip-nav-btn:disabled {
          opacity: 0.3;
          cursor: default;
          box-shadow: none;
        }
        .strip-nav-btn:disabled:hover {
          transform: none;
          background: var(--surface);
          color: var(--text);
        }

        .strip-pages {
          display: flex;
          gap: 4px;
        }
        .strip-page {
          font-family: var(--font-pixel);
          font-size: 13px;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid var(--border);
          background: var(--bg);
          color: var(--text);
          cursor: pointer;
          transition: transform 0.06s steps(2), box-shadow 0.06s steps(2), background 0.06s steps(2);
          box-shadow: 2px 2px 0 0 var(--border);
        }
        .strip-page:hover {
          transform: translate(-1px, -1px);
          box-shadow: 3px 3px 0 0 var(--border);
          background: var(--sky);
        }
        .strip-page.active {
          background: var(--text);
          color: var(--bg);
          box-shadow: none;
          transform: translate(1px, 1px);
        }

        @media (max-width: 640px) {
          .strip-inner { flex-wrap: wrap; gap: 6px; }
          .strip-counter { margin-right: 0; width: 100%; justify-content: center; margin-bottom: 4px; }
          .strip-nav-btn { font-size: 10px; padding: 8px 12px; }
          .strip-page { width: 30px; height: 30px; font-size: 11px; }
        }
      `}</style>
    </div>
  );
}

function MarqueeStrip() {
  const text = 'NOW SHOWING  *  PIXEL CINEMA  *  CLASSIC FILMS  *  ADMIT ONE  *  ';
  return (
    <div className="marquee">
      <div className="marquee-track">
        <span>{text.repeat(6)}</span>
        <span>{text.repeat(6)}</span>
      </div>
      <style jsx>{`
        .marquee {
          overflow: hidden;
          border-top: 2px solid var(--border);
          border-bottom: 2px solid var(--border);
          padding: 8px 0;
          margin-bottom: 28px;
        }
        .marquee-track {
          display: flex;
          white-space: nowrap;
          animation: tickerScroll 40s linear infinite;
        }
        .marquee-track span {
          font-family: var(--font-pixel);
          font-size: 10px;
          letter-spacing: 4px;
          color: var(--text);
          opacity: 0.25;
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
}

function PixelCornerDeco({ position }) {
  const styles = {
    'top-left': { top: 0, left: 0 },
    'top-right': { top: 0, right: 0, transform: 'scaleX(-1)' },
    'bottom-left': { bottom: 0, left: 0, transform: 'scaleY(-1)' },
    'bottom-right': { bottom: 0, right: 0, transform: 'scale(-1,-1)' },
  };
  return (
    <div style={{ position: 'absolute', pointerEvents: 'none', ...styles[position] }}>
      <svg width="28" height="28" viewBox="0 0 28 28">
        <rect x="0" y="0" width="4" height="28" fill="var(--border)" opacity="0.15" />
        <rect x="0" y="0" width="28" height="4" fill="var(--border)" opacity="0.15" />
        <rect x="0" y="0" width="10" height="10" fill="var(--border)" opacity="0.1" />
      </svg>
    </div>
  );
}

export default function HomePage() {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch('/movies.json')
      .then((r) => r.json())
      .then((data) => setMovies(data.movies));
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return movies;
    const q = query.toLowerCase();
    return movies.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.director.name.toLowerCase().includes(q) ||
        m.genre.some((g) => g.toLowerCase().includes(q))
    );
  }, [movies, query]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleSearch = (val) => {
    setQuery(val);
    setPage(1);
  };

  return (
    <div className="home">
      <PixelProjector position="top-right" />
      <PixelProjector position="bottom-left" />

      <header className="header">
        <div className="header-top-deco">
          <div className="deco-line" />
          <div className="deco-blocks">
            {P.slice(0, 7).map((c, i) => (
              <div key={i} className="deco-block" style={{ background: c }} />
            ))}
          </div>
          <div className="deco-line" />
        </div>

        <div className="header-reels">
          <ReelIcon size={28} spinning />
          <ReelIcon size={20} />
          <ReelIcon size={20} spinning />
        </div>
        <h1 className="header-title">PIXEL CINEMA</h1>
        <p className="header-sub">像素放映厅 &middot; 私人录像馆</p>
        <div className="header-rule">
          <span className="rule-end" />
          <ReelIcon size={14} />
          <span className="rule-end" />
        </div>

        <div className="header-stars">
          <PixelStar x="8%" y="20%" color="var(--rose)" delay={0} size={6} />
          <PixelStar x="92%" y="15%" color="var(--sage)" delay={0.5} size={4} />
          <PixelStar x="15%" y="75%" color="var(--sky)" delay={1} size={5} />
          <PixelStar x="85%" y="70%" color="var(--lavender)" delay={0.7} size={4} />
          <PixelStar x="50%" y="5%" color="var(--gold)" delay={0.3} size={6} />
        </div>
      </header>

      <MarqueeStrip />

      <div className="search-wrap">
        <PixelCornerDeco position="top-left" />
        <PixelCornerDeco position="top-right" />
        <PixelCornerDeco position="bottom-left" />
        <PixelCornerDeco position="bottom-right" />
        <span className="search-prompt">&gt;_</span>
        <input
          className="search-input"
          type="text"
          placeholder="搜索片名 / 导演 / 类型..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
        />
        {query ? (
          <button className="search-clear" onClick={() => handleSearch('')}>
            [CLR]
          </button>
        ) : (
          <span className="search-cursor" />
        )}
      </div>

      <div className="result-bar">
        <span className="result-info">
          <span className="result-arrow">&gt;</span>
          FOUND <span className="accent">{filtered.length}</span> FILMS
        </span>
        <div className="result-strip">
          {Array.from({ length: 16 }, (_, i) => (
            <span key={i} className="rs-dot" style={{ background: i < Math.min(filtered.length, 16) ? P[i % P.length] : 'var(--border-soft)' }} />
          ))}
        </div>
      </div>

      <main className="movie-grid">
        {paged.length === 0 && (
          <div className="empty-state">
            <div className="empty-reel"><ReelIcon size={40} /></div>
            <p className="empty-title">NO FILMS FOUND</p>
            <p className="empty-hint">试试其他关键词</p>
            <div className="empty-deco">
              {P.slice(0, 5).map((c, i) => (
                <div key={i} className="empty-dot" style={{ background: c }} />
              ))}
            </div>
          </div>
        )}
        {paged.map((movie, i) => (
          <MovieCard key={movie.title} movie={movie} index={i} />
        ))}
      </main>

      <FilmStripPagination
        current={page}
        total={totalPages}
        onPageChange={setPage}
      />

      <footer className="footer">
        <div className="footer-strip">
          {Array.from({ length: 24 }, (_, i) => (
            <span key={i} className="fs-hole" style={{ background: i % 3 === 0 ? P[i % P.length] : 'var(--border-soft)' }} />
          ))}
        </div>
        <p className="footer-text">PIXEL CINEMA &middot; 像素小人的私人录像厅</p>
        <p className="footer-copy">EST. 2024 &middot; ALL FILMS ARE CLASSICS</p>
      </footer>

      <style jsx>{`
        .home {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          position: relative;
        }

        .header {
          padding: 56px 0 20px;
          text-align: center;
          position: relative;
        }

        .header-top-deco {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
        }
        .deco-line {
          flex: 1;
          height: 2px;
          background: var(--border);
          opacity: 0.15;
        }
        .deco-blocks {
          display: flex;
          gap: 4px;
        }
        .deco-block {
          width: 10px;
          height: 10px;
        }

        .header-reels {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
        }
        .header-title {
          font-family: var(--font-pixel);
          font-size: 44px;
          font-weight: 700;
          letter-spacing: 12px;
          color: var(--text);
          text-shadow: 4px 4px 0 var(--border-soft);
        }
        .header-sub {
          font-family: var(--font-pixel);
          font-size: 12px;
          letter-spacing: 8px;
          color: var(--muted);
          margin-top: 10px;
        }
        .header-rule {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-top: 24px;
        }
        .rule-end {
          width: 80px;
          height: 2px;
          background: var(--border);
          opacity: 0.2;
        }
        .header-stars {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .search-wrap {
          display: flex;
          align-items: center;
          border: 2px solid var(--border);
          background: var(--surface);
          box-shadow: var(--pixel-shadow);
          padding: 0 16px;
          margin-bottom: 8px;
          position: relative;
        }
        .search-prompt {
          font-family: var(--font-pixel);
          font-size: 14px;
          color: var(--sage);
          margin-right: 14px;
          flex-shrink: 0;
        }
        .search-input {
          flex: 1;
          padding: 16px 0;
          background: transparent;
          color: var(--text);
          font-size: 16px;
          font-family: var(--font-pixel);
        }
        .search-input::placeholder {
          color: var(--muted);
          font-family: var(--font-body);
        }
        .search-clear {
          font-family: var(--font-pixel);
          font-size: 11px;
          color: var(--bg);
          background: var(--rose);
          border: 2px solid var(--border);
          padding: 5px 12px;
          cursor: pointer;
          letter-spacing: 1px;
          box-shadow: 2px 2px 0 0 var(--border);
          transition: transform 0.06s steps(2);
        }
        .search-clear:hover {
          transform: translate(-1px, -1px);
        }
        .search-cursor {
          width: 10px;
          height: 16px;
          background: var(--sage);
          animation: cursorBlink 1s step-end infinite;
          flex-shrink: 0;
        }

        .result-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
          padding: 10px 0;
        }
        .result-info {
          font-family: var(--font-pixel);
          font-size: 12px;
          color: var(--muted);
          letter-spacing: 2px;
        }
        .result-arrow {
          color: var(--sage);
          margin-right: 4px;
        }
        .result-info .accent {
          color: var(--sage);
        }
        .result-strip {
          display: flex;
          gap: 4px;
        }
        .rs-dot {
          width: 4px;
          height: 4px;
        }

        .movie-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 20px;
          padding-bottom: 28px;
        }

        .empty-state {
          grid-column: 1 / -1;
          text-align: center;
          padding: 80px 0;
        }
        .empty-reel {
          opacity: 0.3;
          margin-bottom: 20px;
        }
        .empty-title {
          font-family: var(--font-pixel);
          font-size: 14px;
          color: var(--muted);
          letter-spacing: 3px;
        }
        .empty-hint {
          font-family: var(--font-pixel);
          font-size: 11px;
          color: var(--border-soft);
          letter-spacing: 2px;
          margin-top: 10px;
        }
        .empty-deco {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-top: 24px;
        }
        .empty-dot {
          width: 8px;
          height: 8px;
          opacity: 0.4;
        }

        .footer {
          padding: 48px 0 64px;
          text-align: center;
        }
        .footer-strip {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-bottom: 20px;
        }
        .fs-hole {
          width: 6px;
          height: 6px;
        }
        .footer-text {
          font-family: var(--font-pixel);
          font-size: 11px;
          color: var(--muted);
          letter-spacing: 4px;
        }
        .footer-copy {
          font-family: var(--font-pixel);
          font-size: 9px;
          color: var(--border-soft);
          letter-spacing: 3px;
          margin-top: 8px;
        }

        @media (max-width: 820px) {
          .home { max-width: 100%; padding: 0 16px; }
          .movie-grid { grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; }
        }
        @media (max-width: 640px) {
          .header { padding: 36px 0 16px; }
          .header-title { font-size: 28px; letter-spacing: 6px; text-shadow: 2px 2px 0 var(--border-soft); }
          .header-sub { font-size: 10px; letter-spacing: 4px; }
          .rule-end { width: 40px; }
          .deco-block { width: 6px; height: 6px; }
          .movie-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
        }
      `}</style>
    </div>
  );
}
