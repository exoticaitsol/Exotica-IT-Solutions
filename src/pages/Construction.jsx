import { useEffect, useMemo, useState } from "react";
import "../App.css"; // same CSS as the original HTML (Inter font link: add to index.html)

const API = "https://app.exoticaitsolutions.com/wp-json/exotica/v1/construction";
const LEAD_ENDPOINT = ""; // TODO: webhook (GHL, n8n...). Empty = demo mode, nothing is sent.
const CASES_KEYS = ["roi_low_pct", "roi_likely_pct", "roi_high_pct"];
const money = (n) => "$" + Math.round(n).toLocaleString("en-US");
const lines = (s) => (s || "").split("\n").map((l) => l.trim()).filter(Boolean).map((l) => l.split("|"));
const dotClass = { amber: "a", red: "r", ok: "" };

const Check = () => (
  <svg viewBox="0 0 24 24"><path d="m5 12 5 5 9-10" /></svg>
);

function Dashboard({ roles, note }) {
  const [i, setI] = useState(0);
  const role = roles[i];
  if (!role) return null;
  return (
    <div className="dash" aria-label="Example dashboard with role-based views">
      <div className="tabs" role="tablist" aria-label="Role view">
        {roles.map((r, idx) => (
          <button key={idx} role="tab" aria-selected={idx === i} onClick={() => setI(idx)}>{r.role_label}</button>
        ))}
      </div>
      <div className="kpis">
        {lines(role.role_kpis).map(([l, v], k) => (
          <div className="kpi" key={k}><small>{l}</small><b>{v}</b></div>
        ))}
      </div>
      <div className="rows">
        {lines(role.role_rows).map(([d, t, s], k) => (
          <div className="rw" key={k}>
            <span className={"dot " + (dotClass[d] ?? "")}></span><span>{t}</span><span>{s}</span>
          </div>
        ))}
      </div>
      {note && <p className="note">{note}</p>}
    </div>
  );
}

function Roi({ d }) {
  const [on, setOn] = useState({});
  const [hours, setHours] = useState({});
  const [cur, setCur] = useState((d.roi_currencies || "CAD,USD").split(",")[0].trim());
  const [cost, setCost] = useState(d.roi_cost_default || 35);
  const [leakN, setLeakN] = useState(0);
  const [leakC, setLeakC] = useState(0);
  const [budget, setBudget] = useState("");
  const [intent, setIntent] = useState(null);
  const [status, setStatus] = useState(null); // 'ok' | 'err' | 'dev'

  const tasks = d.roi_tasks || [];
  const hrsOf = (t) => (hours[t.task_key] ?? t.task_hours);
  const isOn = (t) => on[t.task_key] !== false;

  const r = useMemo(() => {
    const hrs = tasks.reduce((s, t) => s + (isOn(t) ? Math.max(0, +hrsOf(t) || 0) : 0), 0);
    const base = hrs * Math.max(0, +cost || 0) * 52 + Math.max(0, +leakN || 0) * Math.max(0, +leakC || 0) * 12;
    const pct = CASES_KEYS.map((k) => (+d[k] || 0) / 100);
    const [lo, mid, hi] = pct.map((p) => base * p);
    const bud = Math.max(0, +budget || 0);
    return { hrs, base, lo, mid, hi, pct, bud };
    // eslint-disable-next-line
  }, [on, hours, cost, leakN, leakC, budget, d]);

  const mx = r.hi || 1;
  const payback = r.bud > 0 && r.base > 0
    ? `about ${Math.max(1, Math.round(r.bud / (r.hi / 12)))} to ${Math.max(1, Math.round(r.bud / (r.lo / 12)))} months on a ${money(r.bud)} budget.`
    : null;
  const likely = (d.roi_likely_text || "")
    .replace("{amount}", money(r.mid))
    .replace("{hours}", (Math.round(r.hrs * r.pct[1] * 10) / 10).toLocaleString("en-US"));
  const [lbl0, lbl1, lbl2] = [["Conservative", 0], ["Likely", 1], ["Strong", 2]];

  const submit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const payload = {
      intent, name: fd.get("name"), email: fd.get("email"), company: fd.get("company"),
      calculator: { industry: d.roi_industry, currency: cur, hoursPerWeek: r.hrs, costPerHour: +cost, leaksPerMonth: +leakN, costPerLeak: +leakC, budget: r.bud || null, annualLow: Math.round(r.lo), annualLikely: Math.round(r.mid), annualHigh: Math.round(r.hi) },
      source: "construction-roi-calculator",
    };
    if (!LEAD_ENDPOINT) { console.log("ROI lead (demo, not sent):", payload); setStatus("dev"); return; }
    fetch(LEAD_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      .then((res) => { if (!res.ok) throw 0; setStatus("ok"); e.target.reset(); })
      .catch(() => setStatus("err"));
  };

  return (
    <section id="roi">
      <div className="wrap"><div className="roi">
        <div>
          <p className="eyebrow">{d.roi_eyebrow}</p>
          <h2>{d.roi_title}</h2>
          <p className="lead">{d.roi_lead}</p>
          <form className="fg2" onSubmit={(e) => e.preventDefault()} aria-label="ROI calculator inputs">
            <div className="fgrp">
              <h3>Your business</h3>
              <div className="row2">
                <label className="fl">Currency
                  <select value={cur} onChange={(e) => setCur(e.target.value)}>
                    {(d.roi_currencies || "CAD,USD").split(",").map((c) => <option key={c.trim()}>{c.trim()}</option>)}
                  </select></label>
              </div>
            </div>
            <div className="fgrp">
              <h3>{d.roi_time_heading}</h3>
              <p className="hint">{d.roi_time_hint}</p>
              {tasks.map((t) => (
                <div className={"task" + (isOn(t) ? "" : " off")} key={t.task_key}>
                  <label>
                    <input type="checkbox" checked={isOn(t)} onChange={(e) => setOn({ ...on, [t.task_key]: e.target.checked })} /> {t.task_label}
                  </label>
                  <input type="number" min="0" inputMode="decimal" aria-label={"Hours per week: " + t.task_label}
                    value={hrsOf(t)} onChange={(e) => setHours({ ...hours, [t.task_key]: e.target.value })} />
                </div>
              ))}
              <label className="fl">{d.roi_cost_label} <span className="unit" style={{ display: "inline" }}>({cur})</span>
                <input type="number" min="0" inputMode="decimal" value={cost} onChange={(e) => setCost(e.target.value)} /></label>
            </div>
            <div className="fgrp">
              <h3>{d.roi_leaks_heading}</h3>
              <div className="row2">
                <label className="fl">{d.roi_leak_n_label}
                  <input type="number" min="0" inputMode="numeric" value={leakN} onChange={(e) => setLeakN(e.target.value)} /></label>
                <label className="fl">{d.roi_leak_c_label}
                  <input type="number" min="0" inputMode="decimal" value={leakC} onChange={(e) => setLeakC(e.target.value)} /></label>
              </div>
            </div>
            <div className="fgrp">
              <h3>{d.roi_budget_heading}</h3>
              <label className="fl">{d.roi_budget_label}
                <input type="number" min="0" inputMode="decimal" placeholder="Leave blank to skip" value={budget} onChange={(e) => setBudget(e.target.value)} /></label>
            </div>
          </form>
        </div>

        <div className="res" aria-live="polite">
          <small>{d.roi_result_label}</small>
          <div className="big">{r.base > 0 ? `${money(r.lo)} – ${money(r.hi)}` : "$0"}</div>
          <p className="likely" dangerouslySetInnerHTML={{ __html: likely.replace(/(\$[\d,]+|[\d.,]+ hours)/g, "<b>$1</b>") }} />
          <div className="bars" aria-label="Estimate by how much gets automated">
            {[[lbl0, r.lo], [lbl1, r.mid], [lbl2, r.hi]].map(([[name, idx], v]) => (
              <div className={"bar" + (idx === 1 ? " mid" : "")} key={name}>
                <span>{name} <em className="unit">{Math.round(r.pct[idx] * 100)}%</em></span>
                <i><span style={{ width: (v / mx) * 100 + "%" }}></span></i><b>{money(v)}</b>
              </div>
            ))}
          </div>
          <div className="facts">
            <div>{payback ? <><b>Payback range:</b> {payback}</> : <b>{d.roi_payback_none}</b>}</div>
          </div>
          <div className="rcta">
            <button type="button" className="btn btn-p" onClick={() => { setIntent("audit"); setStatus(null); }}>{d.roi_btn_audit}</button>
            <button type="button" className="btn btn-s" onClick={() => { setIntent("email"); setStatus(null); }}>{d.roi_btn_email}</button>
          </div>

          {intent && (
            <form className="lead-form" onSubmit={submit}>
              <h4>{intent === "audit" ? "Book your audit" : "Email me this breakdown"}</h4>
              <p>Your numbers ({cur}): {money(r.lo)} to {money(r.hi)} a year, most likely {money(r.mid)}. They are sent with this request.</p>
              <label className="fl">Name<input name="name" required autoComplete="name" autoFocus /></label>
              <label className="fl">Work email<input name="email" type="email" required autoComplete="email" /></label>
              <label className="fl">Company<input name="company" autoComplete="organization" /></label>
              <button className="btn btn-p" type="submit">{intent === "audit" ? "Request my audit" : "Send me the breakdown"}</button>
              {status === "ok" && <p className="ok">{intent === "audit" ? "Thanks. We will be in touch to book your audit." : "Thanks. Your breakdown is on its way."}</p>}
              {status === "err" && <p className="ok">Something went wrong. Please try again, or email us directly.</p>}
              {status === "dev" && <p className="dev">Demo mode: no endpoint is connected yet, so nothing was sent. Set LEAD_ENDPOINT.</p>}
            </form>
          )}

          <details className="how">
            <summary>{d.roi_how_title}</summary>
            <ul>{(d.roi_how_items || []).map((h, i) => <li key={i}>{h.how_text}</li>)}</ul>
          </details>
        </div>
      </div></div>
    </section>
  );
}

export default function ConstructionPage() {
  const [d, setD] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    const ctrl = new AbortController();
    fetch(API, { signal: ctrl.signal })
      .then((r) => { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
      .then(setD)
      .catch((e) => { if (e.name !== "AbortError") setErr(e.message); });
    return () => ctrl.abort();
  }, []);

  useEffect(() => {
    if (!d) return;
    document.title = d.seo_title || document.title;
    let m = document.querySelector('meta[name="description"]');
    if (!m) { m = document.createElement("meta"); m.name = "description"; document.head.appendChild(m); }
    m.content = d.seo_description || "";
  }, [d]);

  if (err) return <div className="wrap" style={{ padding: "80px 0", color: "var(--text)" }}>Could not load this page ({err}).</div>;
  if (!d) return <div className="wrap" style={{ padding: "80px 0", color: "var(--muted)" }}>Loading…</div>;

  const faqSchema = {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: (d.faq_items || []).map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      
      <main id="top">
        {/* HERO */}
        <section className="hero pagehero">
          <div className="wrap hero-grid">
            <div>
              <p className="crumb"><a href="/">Home</a> / <a href="/#industries">Industries</a> / {d.hero_crumb_label}</p>
              <p className="eyebrow">{d.hero_eyebrow}</p>
              <h1>{d.hero_title}</h1>
              <p className="sub2" style={{ fontSize: "clamp(16px,1.5vw,19px)", maxWidth: "54ch" }}>{d.hero_sub}</p>
              <div className="cta">
                <a className="btn btn-p" href={d.hero_cta_url}>{d.hero_cta_label}</a>
                <a className="btn btn-s" href={d.hero_secondary_url}>{d.hero_secondary_label}</a>
              </div>
            </div>
            {(d.hero_video_webm || d.hero_video_mp4) && (
              <div className="media">
                <video muted loop playsInline autoPlay aria-hidden="true" poster={d.hero_poster || undefined}>
                  {d.hero_video_webm && <source src={d.hero_video_webm} type="video/webm" />}
                  {d.hero_video_mp4 && <source src={d.hero_video_mp4} type="video/mp4" />}
                </video>
              </div>
            )}
          </div>
        </section>

        {/* LEAKS */}
        <section id="leaks">
          <div className="wrap">
            <p className="eyebrow">{d.leaks_eyebrow}</p>
            <h2>{d.leaks_title}</h2>
            <p className="lead">{d.leaks_lead}</p>
            <ul className="ticks sym">
              {(d.leaks_ticks || []).map((t, i) => <li key={i}><Check /><span>{t.tick_text}</span></li>)}
            </ul>
          </div>
        </section>

        {/* BOTTLENECKS */}
        <section id="bottlenecks" className="dark2">
          <div className="wrap">
            <p className="eyebrow">{d.bn_eyebrow}</p>
            <h2>{d.bn_title}</h2>
            <div className="grid3">
              {(d.bn_cards || []).map((c, i) => (
                <article className="leak" key={i}>
                  <span className="num">{String(i + 1).padStart(2, "0")}</span>
                  <h3>{c.card_title}</h3>
                  <p>{c.card_text}</p>
                  <div className="fix"><span>{d.bn_fix_label}</span>{c.card_fix}</div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* BUILD */}
        <section id="build">
          <div className="wrap">
            <p className="eyebrow">{d.build_eyebrow}</p>
            <h2>{d.build_title}</h2>
            <p className="lead">{d.build_lead}</p>
            <div className="uc">
              {(d.build_items || []).map((b, i) => <div key={i}><b>{b.item_title}</b><span>{b.item_text}</span></div>)}
            </div>
          </div>
        </section>

        {/* SYSTEM */}
        <section id="system" className="dark2">
          <div className="wrap split">
            <div>
              <p className="eyebrow">{d.system_eyebrow}</p>
              <h2>{d.system_title}</h2>
              <p className="lead">{d.system_lead}</p>
              <ul className="ticks">
                {(d.system_ticks || []).map((t, i) => <li key={i}><Check /><span>{t.tick_text}</span></li>)}
              </ul>
            </div>
            <Dashboard roles={d.dash_roles || []} note={d.dash_note} />
          </div>
        </section>

        {/* DEMO */}
        <section id="demo">
          <div className="wrap">
            <p className="eyebrow">{d.demo_eyebrow}</p>
            <h2>{d.demo_title}</h2>
            <p className="lead">{d.demo_lead}</p>
            <div className="steps flow">
              {(d.demo_steps || []).map((s, i) => <div className="step" key={i}><h3>{s.step_title}</h3><p>{s.step_text}</p></div>)}
            </div>
            {d.demo_note && <p className="note2">{d.demo_note}</p>}
            {d.demo_shot && (
              <div className="shots" style={{ gridTemplateColumns: "1fr" }}>
                <img src={d.demo_shot} alt="" style={{ width: "100%", borderRadius: 20 }} />
              </div>
            )}
            {d.demo_quote && (
              <p className="quote">{d.demo_quote}{d.demo_quote_author && <><br /><small>{d.demo_quote_author}</small></>}</p>
            )}
            <div className="cta"><a className="btn btn-p" href={d.demo_cta_url}>{d.demo_cta_label}</a></div>
          </div>
        </section>

        {/* ENGAGEMENT */}
        <section id="engage" className="dark2">
          <div className="wrap">
            <p className="eyebrow">{d.eng_eyebrow}</p>
            <h2>{d.eng_title}</h2>
            <div className="steps">
              {(d.eng_steps || []).map((s, i) => <div className="step" key={i}><h3>{s.step_title}</h3><p>{s.step_text}</p></div>)}
            </div>
            <p className="quote">{d.eng_quote}</p>
          </div>
        </section>

        <Roi d={d} />

        {/* FAQ */}
        <section id="faq" className="dark2">
          <div className="wrap">
            <p className="eyebrow">{d.faq_eyebrow}</p>
            <h2>{d.faq_title}</h2>
            <div className="faq">
              {(d.faq_items || []).map((f, i) => <details key={i}><summary>{f.q}</summary><p>{f.a}</p></details>)}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section id="audit" className="final">
          <div className="wrap">
            <h2>{d.cta_title}</h2>
            <p className="lead" style={{ marginInline: "auto" }}>{d.cta_lead}</p>
            <div className="cta">
              <a className="btn btn-p" href={d.cta_primary_url}>{d.cta_primary_label}</a>
              <a className="btn btn-s" href={d.cta_secondary_url}>{d.cta_secondary_label}</a>
            </div>
            {d.cta_seal_image && (
              <div className="seal">
                <img className="badge" src={d.cta_seal_image} width="260" height="74" alt={d.cta_seal_alt} loading="lazy" />
                <p>{d.cta_seal_text}</p>
              </div>
            )}
          </div>
        </section>
      </main>

      
    </>
  );
}
