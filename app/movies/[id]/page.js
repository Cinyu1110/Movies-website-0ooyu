'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import PixelTicketBox from '../../../components/PixelTicketBox';
import PixelProjector from '../../../components/PixelProjector';

const P = ['#d4a0a0','#a0c4a8','#a0b8d4','#b8a0d4','#a0d4c4','#d4b8a0','#d4c8a0'];

function ReelIcon({ size = 16, spinning = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" style={{
      display: 'inline-block',
      verticalAlign: 'middle',
      animation: spinning ? 'reelSpin 4s linear infinite' : 'none',
    }}>
      <rect x="2" y="2" width="12" height="12" fill="var(--border)" opacity="0.15" />
      <rect x="3" y="3" width="10" height="10" fill="var(--bg)" />
      <rect x="6" y="6" width="4" height="4" fill="var(--border)" opacity="0.15" />
      <rect x="4" y="7" width="2" height="2" fill="var(--border)" opacity="0.1" />
      <rect x="10" y="7" width="2" height="2" fill="var(--border)" opacity="0.1" />
    </svg>
  );
}

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

function FallbackPosterLarge({ title }) {
  const [dataUrl, setDataUrl] = useState(null);
  useEffect(() => {
    setDataUrl(generateFallbackPoster(title, 400, 600));
  }, [title]);
  if (!dataUrl) return null;
  return (
    <div className="poster-wrap-lg">
      <img src={dataUrl} alt={title} className="poster-img-lg" />
      <div className="poster-pixel-border-lg" />
    </div>
  );
}

function proxyUrl(url) {
  return url ? '/api/poster?url=' + encodeURIComponent(url) : null;
}

function MoviePosterLarge({ title, posterUrl }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  if (!posterUrl || error) return <FallbackPosterLarge title={title} />;
  return (
    <div className="poster-wrap-lg">
      {!loaded && (
        <div style={{ width: '100%', aspectRatio: '2/3', background: 'var(--surface-alt)' }} />
      )}
      <img
        src={proxyUrl(posterUrl)}
        alt={title}
        className="poster-img-lg"
        style={{ display: loaded ? 'block' : 'none' }}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />
      <div className="poster-pixel-border-lg" />
    </div>
  );
}

function PixelFilmBanner({ title }) {
  return (
    <div className="film-banner">
      <div className="banner-perf top">
        {Array.from({ length: 36 }, (_, i) => (
          <div key={i} className="hole" />
        ))}
      </div>
      <div className="banner-perf bottom">
        {Array.from({ length: 36 }, (_, i) => (
          <div key={i} className="hole" />
        ))}
      </div>

      <div className="banner-inner">
        <div className="banner-left">
          <div className="banner-label">FILM</div>
          <div className="banner-title">{title}</div>
        </div>
        <div className="banner-right">
          <div className="banner-reel">
            <svg width="48" height="48" viewBox="0 0 48 48">
              <rect x="4" y="4" width="40" height="40" fill="var(--border)" opacity="0.1" />
              <rect x="10" y="10" width="28" height="28" fill="var(--bg)" />
              <rect x="20" y="20" width="8" height="8" fill="var(--border)" opacity="0.1" />
              <rect x="12" y="22" width="4" height="4" fill="var(--border)" opacity="0.08" />
              <rect x="32" y="22" width="4" height="4" fill="var(--border)" opacity="0.08" />
              <rect x="22" y="12" width="4" height="4" fill="var(--border)" opacity="0.08" />
              <rect x="22" y="32" width="4" height="4" fill="var(--border)" opacity="0.08" />
            </svg>
          </div>
        </div>
      </div>

      <div className="banner-colors">
        {P.map((c, i) => (
          <div key={i} className="color-block" style={{ background: c }} />
        ))}
      </div>

      <style jsx>{`
        .film-banner {
          position: relative;
          border: 2px solid var(--border);
          background: var(--surface);
          box-shadow: var(--pixel-shadow-lg);
          padding: 28px 40px;
          margin-bottom: 16px;
          overflow: hidden;
        }

        .banner-perf {
          position: absolute;
          left: 8px;
          right: 8px;
          display: flex;
          justify-content: space-around;
        }
        .banner-perf.top { top: 6px; }
        .banner-perf.bottom { bottom: 6px; }
        .hole {
          width: 6px;
          height: 6px;
          background: var(--bg);
          border: 1px solid var(--border-soft);
        }

        .banner-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 0;
        }
        .banner-left {
          flex: 1;
        }
        .banner-label {
          font-family: var(--font-pixel);
          font-size: 10px;
          letter-spacing: 4px;
          color: var(--muted);
          margin-bottom: 6px;
        }
        .banner-title {
          font-family: var(--font-pixel);
          font-size: 14px;
          color: var(--text);
          letter-spacing: 2px;
          word-break: break-all;
        }
        .banner-right {
          flex-shrink: 0;
          margin-left: 16px;
        }
        .banner-reel {
          opacity: 0.4;
          animation: reelSpin 6s linear infinite;
        }

        .banner-colors {
          display: flex;
          gap: 4px;
          margin-top: 16px;
          padding-top: 14px;
          border-top: 2px dashed var(--border-soft);
        }
        .color-block {
          width: 10px;
          height: 10px;
        }

        @media (max-width: 640px) {
          .film-banner { padding: 20px 16px; }
          .banner-title { font-size: 12px; }
          .banner-reel { display: none; }
        }
      `}</style>
    </div>
  );
}

export default function MovieDetailPage() {
  const params = useParams();
  const title = decodeURIComponent(params.id);
  const [movie, setMovie] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/movies.json')
      .then((r) => r.json())
      .then((data) => {
        const found = data.movies.find((m) => m.title === title);
        setMovie(found || null);
        setLoaded(true);
      });
  }, [title]);

  if (!loaded) {
    return (
      <div className="loading">
        <div className="loading-reel">
          <ReelIcon size={40} spinning />
        </div>
        <div className="loading-bar">
          <div className="loading-fill" />
        </div>
        <span>LOADING FILM REEL...</span>
        <style jsx>{`
          .loading {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            gap: 20px;
          }
          .loading-reel {
          }
          .loading-bar {
            width: 160px;
            height: 10px;
            border: 2px solid var(--border);
            background: var(--bg);
            overflow: hidden;
          }
          .loading-fill {
            width: 60%;
            height: 100%;
            background: var(--sage);
            animation: loadingProgress 1.5s steps(4) infinite;
          }
          @keyframes loadingProgress {
            0% { width: 20%; }
            50% { width: 80%; }
            100% { width: 20%; }
          }
          .loading span {
            font-family: var(--font-pixel);
            font-size: 12px;
            color: var(--muted);
            letter-spacing: 3px;
          }
        `}</style>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="not-found">
        <div className="nf-icon"><ReelIcon size={48} /></div>
        <p className="nf-title">FILM NOT FOUND</p>
        <p className="nf-hint">这部影片不在我们的档案馆中</p>
        <Link href="/" className="pixel-btn pixel-btn-primary" style={{ marginTop: 28 }}>
          &lt; BACK TO LOBBY
        </Link>
        <style jsx>{`
          .not-found {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            gap: 14px;
            text-align: center;
          }
          .nf-icon { opacity: 0.3; margin-bottom: 10px; }
          .nf-title {
            font-family: var(--font-pixel);
            font-size: 16px;
            color: var(--muted);
            letter-spacing: 4px;
          }
          .nf-hint {
            font-family: var(--font-pixel);
            font-size: 12px;
            color: var(--border-soft);
            letter-spacing: 2px;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="detail">
      <PixelProjector position="top-left" />
      <PixelProjector position="bottom-right" />

      <Link href="/" className="back-link">
        <span className="back-arrow">&lt;</span>
        <span>BACK TO LOBBY</span>
        <span className="back-deco">
          {P.slice(0, 3).map((c, i) => (
            <span key={i} className="back-dot" style={{ background: c }} />
          ))}
        </span>
      </Link>

      <div className="now-showing">
        <div className="ns-strip">
          {Array.from({ length: 36 }, (_, i) => (
            <span key={i} className="ns-hole" />
          ))}
        </div>
        <div className="ns-content">
          <ReelIcon size={16} spinning />
          <span className="ns-label">NOW SHOWING</span>
          <ReelIcon size={16} spinning />
        </div>
        <div className="ns-strip">
          {Array.from({ length: 36 }, (_, i) => (
            <span key={i} className="ns-hole" />
          ))}
        </div>
      </div>

      <PixelFilmBanner title={title} />

      <div className="detail-layout">
        <div className="detail-poster">
          <MoviePosterLarge title={movie.title} posterUrl={movie.poster_url} />
        </div>
        <div className="detail-ticket">
          <PixelTicketBox movie={movie} />
        </div>
      </div>

      <div className="bottom-strip">
        {Array.from({ length: 36 }, (_, i) => (
          <span key={i} className="bs-hole" style={{ background: i % 4 === 0 ? P[i % P.length] : 'var(--border-soft)' }} />
        ))}
      </div>

      <div className="bottom-nav">
        <Link href="/" className="pixel-btn pixel-btn-primary">
          BROWSE MORE FILMS
        </Link>
      </div>

      <style jsx>{`
        .detail {
          max-width: 860px;
          margin: 0 auto;
          padding: 0 24px 64px;
          position: relative;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 32px 0 20px;
          font-family: var(--font-pixel);
          font-size: 13px;
          color: var(--muted);
          letter-spacing: 3px;
          transition: color 0.15s;
        }
        .back-link:hover {
          color: var(--text);
        }
        .back-arrow {
          font-size: 18px;
        }
        .back-deco {
          display: flex;
          gap: 4px;
          margin-left: 6px;
        }
        .back-dot {
          width: 4px;
          height: 4px;
          opacity: 0.5;
        }

        .now-showing {
          margin-bottom: 16px;
        }
        .ns-strip {
          display: flex;
          justify-content: space-around;
          padding: 4px 0;
        }
        .ns-hole {
          width: 6px;
          height: 6px;
          background: var(--border-soft);
        }
        .ns-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 10px 0;
          border-top: 2px solid var(--border);
          border-bottom: 2px solid var(--border);
        }
        .ns-label {
          font-family: var(--font-pixel);
          font-size: 14px;
          letter-spacing: 8px;
          color: var(--text);
        }

        .detail-layout {
          display: flex;
          gap: 24px;
          align-items: flex-start;
        }
        .detail-poster {
          flex-shrink: 0;
          width: 280px;
          position: sticky;
          top: 24px;
        }
        :global(.poster-wrap-lg) {
          width: 100%;
          position: relative;
          border: 2px solid var(--border);
          overflow: hidden;
        }
        :global(.poster-img-lg) {
          width: 100%;
          height: auto;
          display: block;
        }
        :global(.poster-pixel-border-lg) {
          position: absolute;
          inset: 0;
          border: 2px solid var(--border);
          pointer-events: none;
        }
        .detail-ticket {
          flex: 1;
          min-width: 0;
        }

        .bottom-strip {
          display: flex;
          justify-content: space-around;
          padding: 4px 0;
          margin-top: 16px;
        }
        .bs-hole {
          width: 6px;
          height: 6px;
        }

        .bottom-nav {
          text-align: center;
          padding-top: 44px;
        }

        @media (max-width: 820px) {
          .detail-layout { flex-direction: column; }
          .detail-poster { width: 200px; position: static; margin: 0 auto; }
        }
        @media (max-width: 640px) {
          .detail { padding: 0 16px 48px; }
          .back-link { padding: 24px 0 16px; font-size: 11px; }
          .back-deco { display: none; }
          .detail-poster { width: 160px; }
        }
      `}</style>
    </div>
  );
}
