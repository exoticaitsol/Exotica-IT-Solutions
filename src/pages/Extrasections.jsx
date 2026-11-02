import { useState } from 'react'
import './Extrasections.css'

/* =========================================================================
 * Sections added from the plugin (exotica-headless v3.2):
 *   ConnectedSection  -> connected_*   (One connected system + role dashboard)
 *   HowSection        -> how_*         (Audit / Build / Measure + quote)
 *   RoiSection        -> roi_*         (ROI teaser calculator)
 *   AuditSection      -> audit_*       (Final CTA + ISO badge)
 *   SiteFooter        -> footer_*      (Footer)
 * All CSS classes are prefixed with "ex-" so they never clash with HomeV1.css
 * ====================================================================== */

/* ---------- helpers ---------- */
const arr = (v) => (Array.isArray(v) ? v : [])
const lines = (s) => (s || '').split('\n').map((x) => x.trim()).filter(Boolean)
const bar = (l) => l.split('|').map((x) => x.trim())
const pad = (n) => String(n).padStart(2, '0')
const numOr = (v, d) => {
  const n = parseFloat(v)
  return Number.isFinite(n) ? n : d
}
// React's contact section has id="talk"; plugin defaults use "#contact"
const fixHref = (u) => (!u ? '#' : u === '#contact' ? '#talk' : u)

const Check = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 5 5 9-10" /></svg>
)

/* ---------- 1. One connected system ---------- */
export function ConnectedSection({ c }) {
  const roles = arr(c.connected_roles)
  const points = arr(c.connected_points)
  const [ri, setRi] = useState(0)

  if (!c.connected_title && !roles.length && !points.length) return null

  const role = roles.length ? roles[Math.min(ri, roles.length - 1)] : null
  const kpis = role ? lines(role.role_kpis).map(bar) : []
  const rows = role ? lines(role.role_rows).map(bar) : []
  const dot = (s) => ({ amber: ' a', red: ' r' }[(s || '').toLowerCase()] || '')

  return (
    <section id="connected" className="ex-sec ex-dark">
      <div className="wrap ex-split">
        <div>
          {c.connected_eyebrow && <span className="eye">{c.connected_eyebrow}</span>}
          <h2 style={{ marginTop: 14 }}>{c.connected_title}</h2>
          {c.connected_text && <p className="ex-lead">{c.connected_text}</p>}
          {points.length > 0 && (
            <ul className="ex-ticks">
              {points.map((p, i) => (
                <li key={i}><Check /><span>{p.point_text}</span></li>
              ))}
            </ul>
          )}
        </div>

        {role && (
          <div className="ex-dash ex-reveal" aria-label="Example dashboard with role-based views">
            <div className="ex-tabs" role="tablist" aria-label="Role view">
              {roles.map((r, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === ri}
                  onClick={() => setRi(i)}
                >
                  {r.role_name}
                </button>
              ))}
            </div>

            {kpis.length > 0 && (
              <div className="ex-kpis">
                {kpis.map(([label, value], i) => (
                  <div className="ex-kpi" key={i}>
                    <small>{label}</small>
                    <b>{value}</b>
                  </div>
                ))}
              </div>
            )}

            {rows.length > 0 && (
              <div className="ex-rows">
                {rows.map(([status, text, tag], i) => (
                  <div className="ex-rw" key={i}>
                    <span className={'ex-dot' + dot(status)} />
                    <span>{text}</span>
                    <span>{tag}</span>
                  </div>
                ))}
              </div>
            )}

            {c.connected_note && <p className="ex-note">{c.connected_note}</p>}
          </div>
        )}
      </div>
    </section>
  )
}

/* ---------- 2. How we work ---------- */
export function HowSection({ c }) {
  const steps = arr(c.how_steps)
  if (!c.how_title && !steps.length) return null

  return (
    <section id="how" className="ex-sec">
      <div className="wrap">
        {c.how_eyebrow && <span className="eye">{c.how_eyebrow}</span>}
        <h2 style={{ marginTop: 14 }}>{c.how_title}</h2>

        {steps.length > 0 && (
          <div className="ex-steps">
            {steps.map((s, i) => (
              <div className="ex-step ex-reveal" key={i}>
                <span className="ex-step-n">{pad(i + 1)}</span>
                <h3 className="ex-h3">{s.how_step_title}</h3>
                <p>{s.how_step_text}</p>
              </div>
            ))}
          </div>
        )}

        {c.how_quote && <p className="ex-quote ex-reveal">{c.how_quote}</p>}
      </div>
    </section>
  )
}

/* ---------- 3. ROI calculator (teaser) ---------- */
export function RoiSection({ c }) {
  const [hours, setHours] = useState(String(numOr(c.roi_hours_default, 20)))
  const [cost, setCost] = useState(String(numOr(c.roi_cost_default, 35)))

  if (!c.roi_title && !c.roi_eyebrow) return null

  const cur = c.roi_currency || '$'
  const low = numOr(c.roi_low_pct, 40)
  const high = numOr(c.roi_high_pct, 75)
  const likely = numOr(c.roi_likely_pct, 60)

  const h = Math.max(0, parseFloat(hours) || 0)
  const k = Math.max(0, parseFloat(cost) || 0)
  const base = h * k * 52 // hours/week x cost/hour x 52 weeks

  const money = (n) => cur + Math.round(n).toLocaleString('en-US')
  const range = base > 0 ? `${money((base * low) / 100)} ? ${money((base * high) / 100)}` : money(0)

  const tpl = c.roi_likely_text || 'Most likely about {amount} a year.'
  const [before, after] = tpl.split('{amount}')
  const likelyLine =
    after === undefined ? tpl : <>{before}<b>{money((base * likely) / 100)}</b>{after}</>

  const url = c.roi_button_url
  const btnHref = url
    ? `${url}${url.includes('?') ? '&' : '?'}h=${encodeURIComponent(h)}&c=${encodeURIComponent(k)}`
    : ''

  return (
    <section id="roi" className="ex-sec ex-dark">
      <div className="wrap">
        <div className="ex-roi ex-reveal">
          <div>
            {c.roi_eyebrow && <span className="eye">{c.roi_eyebrow}</span>}
            <h2 style={{ marginTop: 14 }}>{c.roi_title}</h2>
            {c.roi_text && <p className="ex-lead">{c.roi_text}</p>}
          </div>

          <div className="ex-res" aria-live="polite">
            <div className="ex-row2">
              <label className="ex-fl">
                {c.roi_hours_label || 'Hours a week on manual work'}
                <input
                  type="number"
                  min="0"
                  inputMode="decimal"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                />
              </label>
              <label className="ex-fl">
                {c.roi_cost_label || 'Cost per hour'}
                <input
                  type="number"
                  min="0"
                  inputMode="decimal"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                />
              </label>
            </div>

            <small className="ex-res-label">
              {c.roi_result_label || 'Estimated yearly value of time freed'}
            </small>
            <div className="ex-big">{range}</div>
            <p className="ex-likely">{likelyLine}</p>

            {btnHref && c.roi_button_label && (
              <div className="ex-rcta">
                <a className="pill" href={btnHref}>{c.roi_button_label}</a>
              </div>
            )}

            {c.roi_note && <p className="ex-small">{c.roi_note}</p>}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------- 4. Final CTA (Audit) ---------- */
export function AuditSection({ c }) {
  if (!c.audit_title) return null

  return (
    <section id="audit" className="ex-sec ex-final">
      <div className="wrap">
        <h2>{c.audit_title}</h2>
        {c.audit_text && <p className="ex-lead" style={{ marginInline: 'auto' }}>{c.audit_text}</p>}

        {(c.audit_primary_label || c.audit_secondary_label) && (
          <div className="ex-cta ex-reveal">
            {c.audit_primary_label && (
              <a className="pill" href={fixHref(c.audit_primary_url)}>{c.audit_primary_label}</a>
            )}
            {c.audit_secondary_label && (
              <a className="ghost" href={fixHref(c.audit_secondary_url)}>{c.audit_secondary_label}</a>
            )}
          </div>
        )}

        {(c.audit_seal_image || c.audit_seal_text) && (
          <div className="ex-seal ex-reveal">
            {c.audit_seal_image && (
              <img
                className="ex-badge"
                src={c.audit_seal_image}
                alt={c.audit_seal_alt || ''}
                width="260"
                loading="lazy"
              />
            )}
            {c.audit_seal_text && <p>{c.audit_seal_text}</p>}
          </div>
        )}
      </div>
    </section>
  )
}

/* ---------- 5. Footer ---------- */
export function SiteFooter({ c }) {
  const cols = arr(c.footer_columns)
  const badges = arr(c.footer_badges).filter((b) => b.badge_image)

  if (!c.footer_text && !cols.length && !badges.length && !c.footer_copyright) return null

  return (
    <footer id="contact" className="ex-footer">
      <div className="wrap">
        <div className="ex-fg" style={{ '--ex-fcols': cols.length || 1 }}>
          <div>
            {(c.logo_image || c.logo_text) && (
              <a className="ex-flogo" href="#">
                {c.logo_image ? (
                  <img src={c.logo_image} alt={c.logo_text || ''} />
                ) : (
                  <>
                    <span>{c.logo_text}</span>
                    {c.logo_tagline && <small>{c.logo_tagline}</small>}
                  </>
                )}
              </a>
            )}
            {c.footer_text && <p className="ex-fblurb">{c.footer_text}</p>}
            {badges.length > 0 && (
              <div className="ex-fbadges">
                {badges.map((b, i) => (
                  <img key={i} className="ex-badge" src={b.badge_image} alt="Certification badge" loading="lazy" />
                ))}
              </div>
            )}
          </div>

          {cols.map((col, i) => (
            <div key={i}>
              <h4>{col.column_title}</h4>
              <ul>
                {lines(col.column_links).map((l, j) => {
                  const [label, href] = bar(l)
                  return (
                    <li key={j}>
                      <a href={fixHref(href)}>{label}</a>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>

        {c.footer_copyright && (
          <div className="ex-legal">
            <span>{c.footer_copyright}</span>
          </div>
        )}
      </div>
    </footer>
  )
}
