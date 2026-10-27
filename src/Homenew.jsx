import { useEffect, useMemo, useRef, useState } from 'react'
import './Homenew.css'

// Same .env as the old home page:
// VITE_API_URL=https://app.exoticaitsolutions.com/wp-json/exotica/v1
const API = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')
const ENDPOINT = `${API}/homes`

const rows = (t = '') => t.split('\n').map((l) => l.trim()).filter(Boolean)
const money = (n) => '$' + Math.round(n).toLocaleString('en-US')

const Tick = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 5 5 9-10" /></svg>

/* ---------- hero: typing line ---------- */
function Typing({ prefix, phrases }) {
  const [typed, setTyped] = useState('')
  const [on, setOn] = useState(false)
  useEffect(() => {
    if (!phrases.length) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setTyped(phrases[0]); return }
    let i = 0, n = 0, tm
    const step = () => {
      const p = phrases[i]
      if (n < p.length) { n++; setTyped(p.slice(0, n)); setOn(true); tm = setTimeout(step, 55) }
      else { setOn(false); tm = setTimeout(erase, 2200) }
    }
    const erase = () => {
      if (n > 0) { n--; setTyped(phrases[i].slice(0, n)); setOn(true); tm = setTimeout(erase, 22) }
      else { i = (i + 1) % phrases.length; setOn(false); tm = setTimeout(step, 350) }
    }
    step()
    return () => clearTimeout(tm)
  }, [phrases])
  if (!phrases.length) return null
  return (
    <div className="hn-rot">
      <p aria-hidden="true" style={{ margin: 0, display: 'grid' }}>
        <span style={{ gridArea: '1/1' }}>
          <span>{prefix}{' '}</span><span className="hn-ty">{typed}</span><span className={'hn-caret' + (on ? ' on' : '')} />
        </span>
        {phrases.map((p, k) => <span key={k} className="hn-sz" style={{ gridArea: '1/1' }}>{prefix + p}</span>)}
      </p>
      <ul className="hn-sr-only">{phrases.map((p, k) => <li key={k}>{p}</li>)}</ul>
    </div>
  )
}

/* ---------- hero: video (poster first, load when idle, pause off-screen) ---------- */
function HeroMedia({ webm, mp4, poster }) {
  const ref = useRef(null)
  const hasVideo = !!(webm || mp4)
  useEffect(() => {
    const v = ref.current
    if (!v || !hasVideo) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (navigator.connection && navigator.connection.saveData) return
    const safari = /^((?!chrome|chromium|android|crios|fxios).)*safari/i.test(navigator.userAgent)
    const src = safari ? (mp4 || webm) : (webm || mp4)
    let started = false
    const start = () => {
      if (started) return
      started = true
      v.src = src
      v.addEventListener('canplay', () => { v.play().catch(() => { }) }, { once: true })
      v.load()
    }
    const t = setTimeout(start, 400)
    const io = new IntersectionObserver((e) => {
      if (!started) return
      e[0].isIntersecting ? v.play().catch(() => { }) : v.pause()
    })
    io.observe(v)
    return () => { clearTimeout(t); io.disconnect() }
  }, [webm, mp4, hasVideo])
  if (!hasVideo && !poster) return null
  return (
    <div className="hn-media">
      {hasVideo
        ? <video ref={ref} muted loop playsInline preload="none" poster={poster || undefined} aria-hidden="true" />
        : <img src={poster} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain' }} />}
    </div>
  )
}

/* ---------- connected system: role dashboard ---------- */
function Dashboard({ roles, note }) {
  const [a, setA] = useState(0)
  if (!roles.length) return null
  const r = roles[a] || roles[0]
  const dot = { amber: 'hn-a', red: 'hn-r' }
  return (
    <div className="hn-dash hn-rv" aria-label="Example dashboard with role-based views">
      <div className="hn-tabs" role="tablist" aria-label="Role view">
        {roles.map((x, k) => (
          <button key={k} type="button" role="tab" aria-selected={k === a} onClick={() => setA(k)}>{x.role_label}</button>
        ))}
      </div>
      <div className="hn-kpis">
        {rows(r.role_kpis).map((l, k) => {
          const [label, value] = l.split('|')
          return <div className="hn-kpi" key={k}><small>{label}</small><b>{value}</b></div>
        })}
      </div>
      <div className="hn-rows">
        {rows(r.role_rows).map((l, k) => {
          const [st, text, side] = l.split('|')
          return (
            <div className="hn-rw" key={k}>
              <span className={'hn-dot ' + (dot[(st || '').trim()] || '')} />
              <span>{text}</span><span>{side}</span>
            </div>
          )
        })}
      </div>
      {note && <p className="hn-note">{note}</p>}
    </div>
  )
}

/* ---------- ROI teaser ---------- */
function Roi({ d }) {
  const [h, setH] = useState(d.roi_hours_default ?? '20')
  const [c, setC] = useState(d.roi_cost_default ?? '35')
  const hh = Math.max(0, +h || 0)
  const cc = Math.max(0, +c || 0)
  const base = hh * cc * 52
  const pct = (k, f) => (Number(d[k]) || f) / 100
  const cur = d.roi_currency || '$'
  const fmt = (n) => cur + Math.round(n).toLocaleString('en-US')
  const likely = (d.roi_likely_text || 'Most likely about {amount} a year.').split('{amount}')
  const sep = (d.roi_button_url || '').includes('?') ? '&' : '?'
  return (
    <div className="hn-roi hn-rv" style={{ alignItems: 'center' }}>
      <div>
        {d.roi_eyebrow && <p className="hn-eyebrow">{d.roi_eyebrow}</p>}
        <h2>{d.roi_title}</h2>
        {d.roi_lead && <p className="hn-lead">{d.roi_lead}</p>}
      </div>
      <div className="hn-res" style={{ position: 'static' }} aria-live="polite">
        <div className="hn-row2">
          <label className="hn-fl">{d.roi_hours_label}
            <input type="number" min="0" inputMode="decimal" value={h} onChange={(e) => setH(e.target.value)} />
          </label>
          <label className="hn-fl">{d.roi_cost_label}
            <input type="number" min="0" inputMode="decimal" value={c} onChange={(e) => setC(e.target.value)} />
          </label>
        </div>
        <small style={{ marginTop: 20 }}>{d.roi_result_label}</small>
        <div className="hn-big">{base > 0 ? `${fmt(base * pct('roi_low_pct', 40))} – ${fmt(base * pct('roi_high_pct', 75))}` : cur + '0'}</div>
        <p className="hn-likely">
          {likely[0]}<b>{fmt(base * pct('roi_likely_pct', 60))}</b>{likely[1]}
        </p>
        {d.roi_button_label && (
          <div className="hn-rcta">
            <a className="hn-btn hn-btn-p" href={`${d.roi_button_url || '#'}${sep}h=${encodeURIComponent(hh)}&c=${encodeURIComponent(cc)}`}>{d.roi_button_label}</a>
          </div>
        )}
        {d.roi_fineprint && <p className="hn-how" style={{ marginTop: 14 }}>{d.roi_fineprint}</p>}
      </div>
    </div>
  )
}

/* ---------- page ---------- */
function Page({ d }) {
  const root = useRef(null)
  const [js, setJs] = useState(false)
  const phrases = useMemo(() => (d.hero_phrases || []).map((x) => x.phrase).filter(Boolean), [d])
  const hasMedia = !!(d.hero_video_webm || d.hero_video_mp4 || d.hero_poster)

  useEffect(() => {
    if (d.seo_title) document.title = d.seo_title
    const m = document.querySelector('meta[name="description"]')
    if (m && d.seo_description) m.setAttribute('content', d.seo_description)
  }, [d])

  // reveal on scroll (content stays visible if JS / IntersectionObserver fails)
  useEffect(() => {
    setJs(true)
    const els = [...root.current.querySelectorAll('.hn-rv')]
    if (!('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('hn-in')); return }
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('hn-in'); io.unobserve(e.target) }
    }), { rootMargin: '0px 0px -6% 0px', threshold: 0.05 })
    els.forEach((e) => io.observe(e))
    const t = setTimeout(() => els.forEach((e) => e.classList.add('hn-in')), 2500)
    return () => { io.disconnect(); clearTimeout(t) }
  }, [])

  return (
    <main className={'hn' + (js ? ' hn-js' : '')} id="top" ref={root}>
      {/* HERO */}
      <section className="hn-hero">
        <div className={'hn-wrap hn-hero-grid' + (hasMedia ? '' : ' hn-single')}>
          <div className='hero-content'>
            {d.hero_eyebrow && <p className="hn-eyebrow">{d.hero_eyebrow}</p>}
            <h1>{d.hero_title}</h1>
            {d.hero_sub && <p className="hn-sub">{d.hero_sub}</p>}
            {d.hero_sub2 && <p className="hn-sub2">{d.hero_sub2}</p>}
            <Typing prefix={d.hero_rot_prefix || ''} phrases={phrases} />
            <div className="hn-cta">
              {d.hero_cta_label && <a className="hn-btn hn-btn-p" href={d.hero_cta_url}>{d.hero_cta_label}</a>}
              {d.hero_secondary_label && <a className="hn-btn hn-btn-s" href={d.hero_secondary_url}>{d.hero_secondary_label}</a>}
            </div>
          </div>
          <div className='hero-video'>
            <HeroMedia webm={d.hero_video_webm} mp4={d.hero_video_mp4} poster={d.hero_poster} />
          </div>
        </div>
      </section>

      {/* BOTTLENECKS */}
      {(d.bn_cards || []).length > 0 && (
        <section id="services">
          <div className="hn-wrap">
            {d.bn_eyebrow && <p className="hn-eyebrow hn-rv">{d.bn_eyebrow}</p>}
            <h2 className="hn-rv">{d.bn_title}</h2>
            {d.bn_lead && <p className="hn-lead hn-rv">{d.bn_lead}</p>}
            <div className="hn-grid3">
              {d.bn_cards.map((c, k) => (
                <article className="hn-leak hn-rv" key={k}>
                  <span className="hn-num">{String(k + 1).padStart(2, '0')}</span>
                  <h3>{c.card_title}</h3>
                  <p>{c.card_text}</p>
                  {c.card_fix && <div className="hn-fix"><span>{d.bn_fix_label}</span>{c.card_fix}</div>}
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CONNECTED SYSTEM */}
      {(d.system_title || (d.dash_roles || []).length > 0) && (
        <section className="hn-dark2" id="system">
          <div className="hn-wrap hn-split">
            <div>
              {d.system_eyebrow && <p className="hn-eyebrow hn-rv">{d.system_eyebrow}</p>}
              <h2 className="hn-rv">{d.system_title}</h2>
              {d.system_lead && <p className="hn-lead hn-rv">{d.system_lead}</p>}
              <ul className="hn-ticks hn-rv">
                {(d.system_ticks || []).map((t, k) => <li key={k}><Tick /><span>{t.tick_text}</span></li>)}
              </ul>
            </div>
            <Dashboard roles={d.dash_roles || []} note={d.dash_note} />
          </div>
        </section>
      )}

      {/* HOW WE WORK */}
      {(d.how_steps || []).length > 0 && (
        <section id="how">
          <div className="hn-wrap">
            {d.how_eyebrow && <p className="hn-eyebrow hn-rv">{d.how_eyebrow}</p>}
            <h2 className="hn-rv">{d.how_title}</h2>
            <div className="hn-steps">
              {d.how_steps.map((s, k) => (
                <div className="hn-step hn-rv" key={k}><h3>{s.step_title}</h3><p>{s.step_text}</p></div>
              ))}
            </div>
            {d.how_quote && <p className="hn-quote hn-rv">{d.how_quote}</p>}
          </div>
        </section>
      )}

      {/* INDUSTRIES */}
      {(d.ind_tiles || []).length > 0 && (
        <section className="hn-dark2" id="industries">
          <div className="hn-wrap">
            {d.ind_eyebrow && <p className="hn-eyebrow hn-rv">{d.ind_eyebrow}</p>}
            <h2 className="hn-rv">{d.ind_title}</h2>
            <div className="hn-ind">
              {d.ind_tiles.map((t, k) => {
                const Tag = t.tile_link_url ? 'a' : 'div'
                return (
                  <Tag className="hn-tile hn-rv" key={k} href={t.tile_link_url || undefined}>
                    {t.tile_image && <img className="hn-tile-img" src={t.tile_image} alt="" loading="lazy" />}
                    <h3>{t.tile_name}</h3>
                    {t.tile_badge && <span className="hn-bn">{t.tile_badge}</span>}
                    <p>{t.tile_text}</p>
                    {t.tile_build && <p className="hn-wb"><b>We build:</b> {t.tile_build}</p>}
                    {t.tile_link_label && <span className="hn-go">{t.tile_link_label}</span>}
                  </Tag>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* OUR WORK */}
      {(d.work_cases || []).length > 0 && (
        <section id="work">
          <div className="hn-wrap">
            {d.work_eyebrow && <p className="hn-eyebrow hn-rv">{d.work_eyebrow}</p>}
            <h2 className="hn-rv">{d.work_title}</h2>
            <div className="hn-grid3">
              {d.work_cases.map((c, k) => {
                const Tag = c.case_url ? 'a' : 'article'
                return (
                  <Tag className="hn-case hn-rv" key={k} href={c.case_url || undefined}>
                    {c.case_image && <img className="hn-case-img" src={c.case_image} alt="" loading="lazy" />}
                    <span className="hn-tag">{c.case_tag}</span>
                    <h3>{c.case_client}</h3>
                    <dl>
                      <div><dt>Problem</dt><dd>{c.case_problem}</dd></div>
                      <div><dt>What we built</dt><dd>{c.case_built}</dd></div>
                      <div><dt>Result</dt><dd>{c.case_result}</dd></div>
                    </dl>
                  </Tag>
                )
              })}
            </div>
            {d.work_note && <p className="hn-todo">{d.work_note}</p>}
          </div>
        </section>
      )}

      {/* ROI */}
      {d.roi_title && (
        <section className="hn-dark2" id="roi">
          <div className="hn-wrap"><Roi d={d} /></div>
        </section>
      )}

      {/* FINAL CTA */}
      {d.cta_title && (
        <section id="audit" className="hn-final">
          <div className="hn-wrap">
            <h2 className="hn-rv">{d.cta_title}</h2>
            {d.cta_lead && <p className="hn-lead hn-rv" style={{ marginInline: 'auto' }}>{d.cta_lead}</p>}
            <div className="hn-cta hn-rv">
              {d.cta_primary_label && <a className="hn-btn hn-btn-p" href={d.cta_primary_url}>{d.cta_primary_label}</a>}
              {d.cta_secondary_label && <a className="hn-btn hn-btn-s" href={d.cta_secondary_url}>{d.cta_secondary_label}</a>}
            </div>
            {d.cta_seal_image && (
              <div className="hn-seal hn-rv">
                <img className="hn-badge" src={d.cta_seal_image} width="260" alt={d.cta_seal_alt || ''} loading="lazy" />
                {d.cta_seal_text && <p>{d.cta_seal_text}</p>}
              </div>
            )}
          </div>
        </section>
      )}

      {/* SERVICES STRIP */}
      {d.more_text && (
        <div className="hn-more" id="contact">
          {d.more_text} <a href={d.more_url || '#'}>{d.more_label}</a>
        </div>
      )}
    </main>
  )
}

export default function Homenew() {
  const [d, setD] = useState(null)
  const [err, setErr] = useState(false)
  useEffect(() => {
    fetch(ENDPOINT)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setD)
      .catch(() => setErr(true))
  }, [])
  if (err) return <p className="hn hn-state">Could not load the page. Check VITE_API_URL in .env and the WordPress plugin.</p>
  if (!d) return <p className="hn hn-state">Loading…</p>
  return <Page d={d} />
}