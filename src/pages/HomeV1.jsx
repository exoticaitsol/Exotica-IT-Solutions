import { useEffect, useRef, useState } from 'react'
import '../HomeV1.css'
import { API } from '../useHome'
import HeroCanvas from '../HeroCanvas'
import BlogSection from "./BlogSection";





/* ---------- helpers ---------- */
const lines = (s) => (s || '').split('\n').map((x) => x.trim()).filter(Boolean)
const pairs = (s) =>
  lines(s).map((l) => {
    const i = l.indexOf('|')
    return i < 0 ? [l, ''] : [l.slice(0, i).trim(), l.slice(i + 1).trim()]
  })
const pad = (n) => String(n).padStart(2, '0')
// Stats: supports "4.8|Client rating" lines OR value / label on separate lines
const statPairs = (s) => {
  const ls = lines(s)
  if (ls.some((l) => l.includes('|'))) return pairs(s).filter(([v, l]) => v && l)
  const out = []
  for (let i = 0; i + 1 < ls.length; i += 2) out.push([ls[i], ls[i + 1]])
  return out
}
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// Title with a highlighted (green) word
function Hl({ text = '', hl = '' }) {
  if (!hl) return text
  const m = new RegExp(`\\b${esc(hl)}\\b`).exec(text)
  if (!m) return <>{text} <em>{hl}</em></>
  return <>{text.slice(0, m.index)}<em>{hl}</em>{text.slice(m.index + hl.length)}</>
}

// Animated counter: "50+" counts up to 50 and keeps the "+"
function Num({ value }) {
  const m = String(value).match(/^(\d+)(.*)$/)
  const ref = useRef(null)
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!m) return
    const target = +m[1]
    let timer
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      let c = 0
      timer = setInterval(() => {
        c += Math.ceil(target / 40)
        if (c >= target) { c = target; clearInterval(timer) }
        setN(c)
      }, 30)
    })
    io.observe(ref.current)
    return () => { io.disconnect(); clearInterval(timer) }
  }, [value])
  if (!m) return <b>{value}</b>
  return <b ref={ref}><i>{n}</i>{m[2]}</b>
}

function Marquee({ items }) {
  if (!items.length) return null
  const row = [...items, ...items, ...items, ...items]
  return (
    <div className="logos">
      <div>
        {row.map((l, i) =>
          l.logo_file ? <img key={i} src={l.logo_file} alt={l.logo_name || ''} /> : <span key={i}>{l.logo_name}</span>
        )}
      </div>
    </div>
  )
}

const IND_BG = [
  'radial-gradient(circle at 30% 30%,#70aa26,#0d1a06 65%)',
  'radial-gradient(circle at 60% 20%,#8aa6c8,#131c26 65%)',
  'radial-gradient(circle at 50% 70%,#b0892a,#17120a 65%)',
  'radial-gradient(circle at 70% 60%,#4d7d16,#0a1005 65%)',
]
const bgImg = (url, fallback) => (url ? `center/cover url(${url})` : fallback)
function IndPanel({ p, i, active, onEnter }) {
  const vref = useRef(null)

  useEffect(() => {

    const v = vref.current
    if (!v) return
    if (active) {
      v.play().catch(() => { })
    } else {
      v.pause()
      v.currentTime = 0
    }
  }, [active])


  return (
    <div className={'pan' + (active ? ' on' : '')} onMouseEnter={onEnter}>
      <i style={{ background: bgImg(p.industry_image, IND_BG[i % IND_BG.length]) }} />
      {p.industry_video && (
        <video
          ref={vref}
          className="pvid"
          src={p.industry_video}
          poster={p.industry_image || undefined}
          muted
          loop
          playsInline
          preload="none"
        />
      )}
      <span className="n">{pad(i + 1)}</span>
      <div><h4>{p.industry_name}</h4></div>
    </div>
  )
}


/* ---------- page-wide effects: reveal, cursor, 3D tilt ---------- */
const REVEAL = 'section h2,.ecard,.lc,.band,.tile,details,.audit,.sc,.panel,.tabs,.ind,.lede,.stats,.wrap,.blog-section,.hero,.cta,.ctg,.mos,.cs-wrap,.cs-panel,.cs-tabs,.cs-body,.cs-img,.cs-stats,.cs-btn,.why .tile,form,footer'

function usePageEffects(content) {
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }),
      { threshold: 0.15 }
    )
    document.querySelectorAll(REVEAL).forEach((el, i) => {
      if (el.classList.contains('in')) return
      el.classList.add('rv')
      el.style.transitionDelay = (i % 3) * 90 + 'ms'
      io.observe(el)
    })
    return () => io.disconnect()
  }, [content])

  useEffect(() => {
    const cur = document.getElementById('cur')
    const HOVER = 'a,button,.lc,.pan,.ecard,summary'
    const move = (e) => {
      cur.style.left = e.clientX + 'px'
      cur.style.top = e.clientY + 'px'
      const card = e.target.closest?.('.ecard,.lc')
      if (card) {
        const r = card.getBoundingClientRect()
        const x = (e.clientX - r.left) / r.width - 0.5
        const y = (e.clientY - r.top) / r.height - 0.5
        card.style.transform = `perspective(900px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg)`
      }
    }
    const over = (e) => { if (e.target.closest?.(HOVER)) cur.classList.add('big') }
    const out = (e) => {
      if (e.target.closest?.(HOVER)) cur.classList.remove('big')
      const card = e.target.closest?.('.ecard,.lc')
      if (card && !card.contains(e.relatedTarget)) card.style.transform = ''
    }
    document.addEventListener('mousemove', move)
    document.addEventListener('mouseover', over)
    document.addEventListener('mouseout', out)
    return () => {
      document.removeEventListener('mousemove', move)
      document.removeEventListener('mouseover', over)
      document.removeEventListener('mouseout', out)
    }
  }, [])
}

/* ---------- page ---------- */
// export default function App() {
//   const { status, data, error } = useHome()
//   if (status === 'loading') return <div className="state"><p>Loading...</p></div>
//   if (status === 'error')
//     return (
//       <div className="state">
//         <p>Could not load content.</p>
//         <small>{error}</small>
//       </div>
//     )
//   return <Page c={data} />
// }

export default function HomeV1({ c, hideNav = false }) {

  const [activeLeak, setActiveLeak] = useState(null);

  usePageEffects(c)

  const [ready, setReady] = useState(false)
  useEffect(() => { const t = setTimeout(() => setReady(true), 200); return () => clearTimeout(t) }, [])

  const [typedCount, setTypedCount] = useState(0)

  const [pan, setPan] = useState(1)
  const [ci, setCi] = useState(0)
  const [form, setForm] = useState({ name: '', email: '', launch: '', message: '', website: '' })
  const [status, setStatus] = useState('idle')

  const heroLines = c.hero_title ? c.hero_title.split('|') : []


  const heroCharacters = heroLines.map((line) =>
    Array.from(line.trim())
  )

  const totalHeroLetters = heroCharacters.reduce(
    (total, line) => total + line.length,
    0
  )


useEffect(() => {
  if (totalHeroLetters === 0) return
  if (typedCount >= totalHeroLetters) return

  const timer = setTimeout(() => {
    setTypedCount((count) =>
      Math.min(count + 1, totalHeroLetters)
    )
  }, 65)

  return () => clearTimeout(timer)
}, [typedCount, totalHeroLetters])




  const activePan = pan < c.industries.length ? pan : 0
  const cs = c.cases.length ? c.cases[Math.min(ci, c.cases.length - 1)] : null
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  async function submit(e) {
    e.preventDefault()
    setStatus('sending')
    try {
      const r = await fetch(`${API}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!r.ok) throw new Error()
      setStatus('ok')
    } catch {
      setStatus('error')
    }


  }

  return (
    <>
      <div id="cur" />

      {!hideNav && (c.logo_text || c.logo_image || c.nav.length > 0) && (
        <nav>
          <a className="logo" href="#">
            {c.logo_image ? <img src={c.logo_image} alt={c.logo_text} /> : <>{c.logo_text}{c.logo_tagline && <small>{c.logo_tagline}</small>}</>}
          </a>
          <div className="links">
            {c.nav.map((n, i) => <a key={i} href={n.nav_url}>{n.nav_label}</a>)}
            {c.header_cta_label && <a className="pill" href={c.header_cta_url}>{c.header_cta_label}</a>}
          </div>
        </nav>
      )}

      {(c.hero_title || c.hero_subtitle || c.hero_eyebrow) && (
        <header className="hero">
          <div className="wrap hero-wrap">
            <div className="hero-content">
              {c.hero_eyebrow && <span className="eye">{c.hero_eyebrow}</span>}


             
<h1>
  {(() => {
    let charIndex = 0;

    return heroLines.map((line, lineIndex) => (
      <span
        key={lineIndex}
        className={"ln" + (ready ? " in" : "")}
      >
        {line.trim().split(/(\s+)/).map((token, tokenIndex) => {
          const isSpace = /^\s+$/.test(token);

          const renderLetters = (text) =>
            Array.from(text).map((letter, letterIndex) => {
              const currentIndex = charIndex++;
              const isVisible = currentIndex < typedCount;

              return (
                <span
                  key={letterIndex}
                  className={
                    "hero-letter" + (isVisible ? " is-visible" : "")
                  }
                >
                  {letter}
                </span>
              );
            });

          return (
            <span
              key={tokenIndex}
              className="hero-word"
            >
              {isSpace
                ? "\u00A0".repeat(token.length)
                : renderLetters(token)}
            </span>
          );
        })}
      </span>
    ));
  })()}
</h1>


              {c.hero_subtitle && <p>{c.hero_subtitle}</p>}
              <div className="cta">
                {c.hero_cta_label && <a className="pill" href={c.hero_cta_url}>{c.hero_cta_label}</a>}
                {c.hero_secondary_label && <a className="ghost" href={c.hero_secondary_url}>{c.hero_secondary_label}</a>}
              </div>
            </div>
            <div className="hero-vedio">
              {c.hero_video ? (
                <video src={c.hero_video} poster={c.hero_poster || undefined} autoPlay muted loop playsInline />
              ) : (
                <HeroCanvas />
              )}
            </div>
          </div>
        </header>
      )}

      <Marquee items={c.trusted_logos} />

      {c.stats.length > 0 && (
        <div className="stats">
          <div className="wrap" style={{ gridTemplateColumns: `1.4fr repeat(${c.stats.length},1fr)` }}>
            <h4>{c.stats_heading} <span>{c.stats_subheading}</span></h4>
            {c.stats.map((s, i) => (
              <div key={i}><Num value={s.stat_number} /><small>{s.stat_label}</small></div>
            ))}
          </div>
        </div>
      )}

      {(c.ai_title || c.ai_cards.length > 0) && (
        <section id="eng">
          <div className="wrap">
            <div className="head">
              <div>
                {c.ai_eyebrow && <span className="eye">{c.ai_eyebrow}</span>}
                <h2 data-reveal style={{ marginTop: 14 }}><Hl text={c.ai_title} hl={c.ai_highlight} /></h2>
              </div>
              {c.ai_text && <p data-reveal className="lede">{c.ai_text}</p>}
            </div>
            <div className="eng">
              {c.ai_cards.map((k, i) => (
                <article className="ecard" key={i}>
                  <div className="tx">
                    <span className="eye">{k.card_kicker}</span>
                    <h3>{k.card_title}</h3>
                    <p>{k.card_text}</p>
                    <div className="chips">
                      {(k.card_tags || '').split(',').map((t) => t.trim()).filter(Boolean).map((t) => <span key={t}>{t}</span>)}
                    </div>
                  </div>
                  <div className="img" style={k.card_image ? { background: `linear-gradient(transparent 40%,#0D110A),center/cover url(${k.card_image})` } : undefined} />
                </article>
              ))}
            </div>
          </div>
        </section>
      )}




      <section className="overservices">
        <div className="container">
          <div className="leaks-heading">
            {c.leaks_eyebrow && (
              <span className="eye">{c.leaks_eyebrow}</span>
            )}

            <h2 data-reveal>
              <Hl
                text={c.leaks_title}
                hl={c.leaks_highlight}
              />
            </h2>
          </div>

          <div className="lgrid">
            {c.leaks.map((l, i) => {
              const isOpen = activeLeak === i;

              const toggleLeak = () => {
                setActiveLeak(isOpen ? null : i);
              };

              return (
                <div
                  key={i}
                  className={`lc${isOpen ? " is-open" : ""}`}
                >
                  <div className="ic" />

                  <span className="nm">{pad(i + 1)}</span>

                  <h3>{l.leak_title}</h3>

                  <div className={`leak-description ${isOpen ? "expanded" : ""}`}>
                    <p>{l.leak_text}</p>
                  </div>

                  {l.leak_link_label && (
                    <div className="lk">
                      <button
                        type="button"
                        className="leak-toggle-label"
                        onClick={toggleLeak}
                        aria-expanded={isOpen}
                      >
                        {isOpen ? "Tap to close" : l.leak_link_label}
                      </button>

                      <button
                        type="button"
                        className="leak-toggle-icon"
                        onClick={toggleLeak}
                        aria-label={isOpen ? "Close details" : "Open details"}
                        aria-expanded={isOpen}
                      >
                        {isOpen ? "−" : "+"}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>



      {c.industries.length > 0 && (
        <section id="ind">
          <div className="wrap">
            {c.industries_eyebrow && <span className="eye">{c.industries_eyebrow}</span>}
            <h2 data-reveal style={{ margin: '14px 0 50px' }}><Hl text={c.industries_title} hl={c.industries_highlight} /></h2>
            <div className="ind">
              {c.industries.map((p, i) => (
                <IndPanel
                  key={i}
                  p={p}
                  i={i}
                  active={i === activePan}
                  onEnter={() => setPan(i)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {cs && (
        <section id="work" style={{ background: 'var(--bg2)' }}>
          <div className="wrap">
            {c.cases_eyebrow && <span className="eye">{c.cases_eyebrow}</span>}
            <h2 style={{ marginTop: 14 }}><Hl text={c.cases_title} hl={c.cases_highlight} /></h2>
            <div className="cs-wrap">
              <div className="cs-tabs">
                {c.cases.map((k, i) => (
                  <button key={i} type="button" className={'cs-tab' + (i === ci ? ' on' : '')} onClick={() => setCi(i)}>
                    {k.case_tab}
                  </button>
                ))}
              </div>

              <div className="cs-panel">
                {cs.case_image && <div className="cs-img" style={{ backgroundImage: `url(${cs.case_image})` }} />}
                <div className="cs-body">
                  {cs.case_kicker && <span className="cs-kicker">{cs.case_kicker}</span>}
                  <h3>{cs.case_heading}</h3>
                  <p>{cs.case_text}</p>
                  <div className="cs-stats">
                    {statPairs(cs.case_stats).map(([v, l], i) => (
                      <div className="cs-stat" key={i}>
                        <strong>{v}</strong>
                        <em>{l}</em>
                      </div>
                    ))}
                  </div>
                  {cs.case_button_label && (
                    <a className="cs-btn" href={cs.case_button_url || '#talk'}>{cs.case_button_label} →</a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {(c.why_title || c.why_cards.length > 0) && (
        <section id="why" className="why">
          <div className="wrap">
            {c.why_eyebrow && <span className="eye">{c.why_eyebrow}</span>}
            <h2 data-reveal style={{ margin: '14px 0' }}>{c.why_title}</h2>
            {c.why_text && <p data-reveal className="lede">{c.why_text}</p>}
            <div className="mos">
              {c.why_cards.map((w, i) => (
                <div className={'tile t' + ((i % 4) + 1)} key={i}>
                  <span className="big">{pad(i + 1)}</span>
                  <h4>{w.why_card_title}</h4>
                  <p>{w.why_card_text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {(c.faq_title || c.faqs.length > 0) && (
        <section id="faq">
          <div className="wrap faq">
            <div>
              {c.faq_eyebrow && <span className="eye">{c.faq_eyebrow}</span>}
              <h2 data-reveal style={{ marginTop: 14 }}>{c.faq_title}</h2>
              {c.faq_card_title && (
                <div className="audit">
                  <h4>{c.faq_card_title}</h4>
                  <p>{c.faq_card_text}</p>
                  {c.faq_card_label && <a href={c.faq_card_url}>{c.faq_card_label}</a>}
                </div>
              )}
            </div>
            <div>
              {c.faqs.map((f, i) => (
                <details key={i} open={i === 0}>
                  <summary>{f.faq_question}</summary>
                  <p>{f.faq_answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      <BlogSection />


      {(c.contact_title || c.contact_big) && (
        <section id="talk" className="ct">
          <div className="wrap ctg">
            <div>
              {c.contact_eyebrow && <span className="eye">{c.contact_eyebrow}</span>}
              <h2 data-reveal style={{ marginTop: 14 }}>{c.contact_title}</h2>
              <div className="lets" aria-label={c.contact_big}>
                {[...c.contact_big].map((ch, i) => (ch === ' ' ? ' ' : <span key={i}>{ch}</span>))}
              </div>
              {c.contact_text && <p data-reveal className="lede">{c.contact_text}</p>}
            </div>
            <div>
              {status === 'ok' ? (
                <h3 style={{ fontSize: 30, color: 'var(--lime)' }}>Thank you — we'll be in touch within 24 hours.</h3>
              ) : (
                <form onSubmit={submit}>
                  <label>Full name
                    <input name="name" required placeholder="Your full name" value={form.name} onChange={onChange} />
                  </label>
                  <label>Business email
                    <input name="email" type="email" required placeholder="you@company.com" value={form.email} onChange={onChange} />
                  </label>
                  {lines(c.contact_launch_options).length > 0 && (
                    <label>When do you want to launch a solution?
                      <select name="launch" value={form.launch} onChange={onChange}>
                        <option value="">Select a timeline</option>
                        {lines(c.contact_launch_options).map((o) => <option key={o}>{o}</option>)}
                      </select>
                    </label>
                  )}
                  <label>About project
                    <textarea name="message" rows="2" placeholder="Tell us about the opportunity" value={form.message} onChange={onChange} />
                  </label>
                  {/* honeypot: hidden from real users */}
                  <input name="website" value={form.website} onChange={onChange} tabIndex={-1} autoComplete="off" style={{ display: 'none' }} />
                  <button className="pill" disabled={status === 'sending'}>
                    {status === 'sending' ? 'Sending...' : c.contact_submit_label || 'Submit'}
                  </button>
                  {status === 'error' && <p className="err">Could not send. Please try again or email us directly.</p>}
                </form>
              )}
            </div>
          </div>
        </section>
      )}
    </>
  )
  useEffect(() => {
    const elements = document.querySelectorAll("[data-reveal]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);
}
