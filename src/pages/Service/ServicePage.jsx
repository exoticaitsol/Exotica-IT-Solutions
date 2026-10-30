import { useEffect, useState } from 'react';
import { fetchService } from './serviceApi';
import './service.css';

/**
 * Plain <a> that works with '#anchor', '/internal-path' and 'https://external' links.
 * (If you use React Router and want client-side navigation, swap internal links for <Link>.)
 */
function Link({ url, className, children, ...rest }) {
  if (!url) return <span className={className} {...rest}>{children}</span>;
  const external = /^https?:\/\//i.test(url) && typeof window !== 'undefined' && !url.startsWith(window.location.origin);
  return (
    <a
      href={url}
      className={className}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...rest}
    >
      {children}
    </a>
  );
}

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Title({ before, highlight, block }) {
  return (
    <>
      {before}
      {highlight && (
        <>
          {block ? <br /> : ' '}
          <span className="sv-hl growth-new">{highlight}</span>
        </>
      )}
    </>
  );
}

export default function ServicePage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const ctrl = new AbortController();
    fetchService(ctrl.signal)
      .then(setData)
      .catch((e) => e.name !== 'AbortError' && setError(true));
    return () => ctrl.abort();
  }, [retry]);

  // SEO from the CMS.
  useEffect(() => {
    if (!data) return;
    if (data.seo_title) document.title = data.seo_title;
    if (data.seo_description) {
      let m = document.querySelector('meta[name="description"]');
      if (!m) {
        m = document.createElement('meta');
        m.name = 'description';
        document.head.appendChild(m);
      }
      m.content = data.seo_description;
    }
  }, [data]);

  if (error) {
    return (
      <main className="sv-page sv-state">
        <p>We couldn't load this page.</p>
        <button
          type="button"
          className="sv-btn sv-btn-green"
          onClick={() => {
            setData(null);
            setError(false);
            setRetry((attempt) => attempt + 1);
          }}
        >
          Try again
        </button>
      </main>
    );
  }
  if (!data) {
    return <main className="sv-page sv-state" aria-busy="true"><p>Loading…</p></main>;
  }

  const proof = data.hero_proof || [];
  const steps = data.process_steps || [];
  const cards = data.cap_cards || [];
  const sStats = data.strategic_stats || [];
  const tStats = data.track_stats || [];

  return (
    <main className="sv-page">
      {/* ================= HERO ================= */}
      <section className="sv-hero" id="top">
        {data.hero_bg_image && (
          <div className="sv-hero-bg" style={{ backgroundImage: `url(${data.hero_bg_image})` }} aria-hidden="true" />
        )}
        {data.hero_bg_video && (
          <video className="sv-hero-video" src={data.hero_bg_video} autoPlay muted loop playsInline aria-hidden="true" />
        )}
        <div className="sv-glow" aria-hidden="true" />
        <div className="sv-wrap sv-hero-inner">
          <p className="sv-eyebrow sv-eyebrow-dot">{String(data.hero_eyebrow || '').replace(/^[●•]\s*/, '')}</p>
          <h1 className="sv-h1">{data.hero_title}</h1>
          <p className="sv-lead">{data.hero_subtitle}</p>
          <div className="sv-btn-row">
            {data.hero_cta_label && (
              <Link url={data.hero_cta_url} className="sv-btn sv-btn-green sv-btn-glow">{data.hero_cta_label}</Link>
            )}
            {data.hero_secondary_label && (
              <Link url={data.hero_secondary_url} className="sv-btn sv-btn-outline">{data.hero_secondary_label}</Link>
            )}
          </div>
          {proof.length > 0 && (
            <ul className="sv-proof">
              {proof.map((p, i) => (
                <li key={i}>
                  <strong>{p.proof_text}</strong>
                  {p.proof_note && <span> {p.proof_note}</span>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* ================= STRATEGIC ENGINEERING ================= */}
      <section className="sv-dark sv-strategic">
        <div className="sv-wrap sv-split">
          <div className="sv-photo">
            {data.strategic_image ? <img src={data.strategic_image} alt="" loading="lazy" /> : <div className="sv-photo-empty" />}
            {(data.strategic_badge_strong || data.strategic_badge_text) && (
              <span className="sv-badge">
                <i className="sv-dot" />
                <strong>{data.strategic_badge_strong}</strong> {data.strategic_badge_text}
              </span>
            )}
          </div>
          <div>
            <p className="sv-eyebrow">{data.strategic_eyebrow}</p>
            <h2 className="sv-h2"><Title before={data.strategic_title} highlight={data.strategic_highlight} block /></h2>
            <p className="sv-text">{data.strategic_text}</p>
            <div className="sv-stats sv-stats-2">
              {sStats.map((s, i) => (
                <div className="sv-stat sv-stat-line" key={i}>
                  <b>{s.stat_number}</b>
                  <span>{s.stat_label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= PROCESS ================= */}
      <section className="sv-light sv-process" id="process">
        <div className="sv-wrap">
          <p className="sv-eyebrow">{data.process_eyebrow}</p>
          <h2 className="sv-h2 sv-h2-light"><Title before={data.process_title} highlight={data.process_highlight} /></h2>
          <ol className="sv-steps">
            {steps.map((s, i) => (
              <li className="sv-step" key={i}>
                <span className="sv-step-no">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="sv-step-title">{s.step_title}</h3>
                <p className="sv-step-text">{s.step_text}</p>
                <Link url={s.step_url} className="sv-circle" aria-label={s.step_title}><ArrowRight /></Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ================= CAPABILITIES ================= */}
      <section className="sv-dark sv-caps">
        <div className="sv-wrap">
          <p className="sv-eyebrow">{data.cap_eyebrow}</p>
          <h2 className="sv-h2"><Title before={data.cap_title} highlight={data.cap_highlight} block /></h2>
          <p className="sv-text sv-text-narrow">{data.cap_text}</p>
          <div className="sv-cap-grid">
            {cards.map((c, i) => (
              <article className="sv-cap" key={i}>
                <span className="sv-cap-icon">{c.cap_icon && <img src={c.cap_icon} alt="" loading="lazy" />}</span>
                <h3>{c.cap_card_title}</h3>
                <p>{c.cap_card_text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================= BANNER + TRACK RECORD ================= */}
      <section className="sv-dark sv-closing" id="contact">
        <div className="sv-wrap">
          <div className="sv-banner">
            <p className="sv-eyebrow sv-eyebrow-ink">{data.banner_eyebrow}</p>
            <h2 className="sv-banner-title">{data.banner_title}</h2>
            <p className="sv-banner-text">{data.banner_text}</p>
            {data.banner_label && (
              <Link url={data.banner_url} className="sv-btn sv-btn-dark">{data.banner_label}</Link>
            )}
          </div>

          <div className="sv-split sv-track">
            <div>
              <p className="sv-eyebrow sv-eyebrow-bright">{data.track_eyebrow}</p>
              <h2 className="sv-h2 sv-h2-bright"><Title before={data.track_title} highlight={data.track_highlight} /></h2>
              <p className="sv-text">{data.track_text}</p>
              <div className="sv-stats sv-stats-4">
                {tStats.map((s, i) => (
                  <div className="sv-stat" key={i}>
                    <b>{s.tstat_number}</b>
                    <span>{s.tstat_label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="sv-photo sv-photo-track">
              {data.track_image ? <img src={data.track_image} alt="" loading="lazy" /> : <div className="sv-photo-empty" />}
              {data.track_badge && (
                <span className="sv-badge"><i className="sv-dot" />{data.track_badge}</span>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
