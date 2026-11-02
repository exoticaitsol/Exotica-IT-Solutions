/**
 * ROI Calculator page (single file). All content comes from the WordPress plugin
 * "Exotica ROI Calculator Page":  GET /wp-json/exotica/v1/roi  (or /roi/{slug}).
 *
 * Route example:  <Route path="/roi-calculator" element={<RoiCalculatorPage />} />
 * Specific page:  <RoiCalculatorPage slug="roi-calculator" />
 */
import { useEffect, useMemo, useState } from 'react';

/* ------------------------------------------------------------------ */
/* API setup. Uses your existing .env value (any of the names below).  */
/* Accepts either the site URL or the full .../wp-json/... URL.        */
/* ------------------------------------------------------------------ */

const ENV = (typeof import.meta !== 'undefined' && import.meta.env) || {};
const RAW_BASE =
  ENV.VITE_WP_API_URL ||
  ENV.VITE_API_URL ||
  ENV.VITE_WP_URL ||
  ENV.VITE_WORDPRESS_URL ||
  ENV.VITE_BACKEND_URL ||
  'https://app.exoticaitsolutions.com';

const WP_API = `${String(RAW_BASE).split('/wp-json')[0].replace(/\/+$/, '')}/wp-json/exotica/v1`;

/** CMS links are stored as typed (e.g. "exotica-home-green.html#how"). Map them to your React routes here. */
const LINK_MAP = {
  'exotica-home-green.html': '/',
  'roi-calculator-green.html': '/roi-calculator',
  'industry-construction-green.html': '/industries/construction',
  'industry-property-management-green.html': '/industries/property-management',
  'industry-real-estate-green.html': '/industries/real-estate',
  'industry-home-field-services-green.html': '/industries/home-field-services',
};

function resolveHref(url) {
  const raw = String(url || '').trim();
  if (!raw) return '#';
  if (/^(https?:|mailto:|tel:|\/)/i.test(raw) || raw.startsWith('#')) return raw;
  const [file, hash] = raw.split('#');
  const route = LINK_MAP[file];
  return route ? route + (hash ? `#${hash}` : '') : raw;
}

function useRoiPage(slug = '') {
  const [state, setState] = useState({ data: null, loading: true, error: null });

  useEffect(() => {
    const controller = new AbortController();
    setState((s) => ({ ...s, loading: true, error: null }));
    const url = `${WP_API}/roi${slug ? `/${encodeURIComponent(slug)}` : ''}`;

    fetch(url, { signal: controller.signal, headers: { Accept: 'application/json' } })
      .then((res) => {
        if (!res.ok) throw new Error(`ROI API responded with ${res.status}`);
        return res.json();
      })
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((error) => {
        if (error.name !== 'AbortError') setState({ data: null, loading: false, error });
      });

    return () => controller.abort();
  }, [slug]);

  return state;
}

/* ------------------------------------------------------------------ */
/* Styles (scoped under .rp, so nothing leaks into other pages)        */
/* ------------------------------------------------------------------ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

/* ROI calculator page. Every rule is scoped under .rp so it cannot leak into other pages. */
.rp{--bg:#070a07;--bg2:#0c110c;--card:#111811;--line:rgba(255,255,255,.10);--text:#f4f7f2;--muted:#a9b3a6;--lime:#9be22a;--ink:#0b1405;--r:22px;--gut:clamp(20px,5vw,64px);--max:1240px}
.rp *{box-sizing:border-box}
.rp{margin:0;background:var(--bg);color:var(--text);font-family:Inter,system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;line-height:1.55;-webkit-font-smoothing:antialiased}
.rp a{color:inherit;text-decoration:none}
.rp .wrap{max-width:var(--max);margin:0 auto;padding:0 var(--gut)}
.rp .sr-only{position:absolute;width:1px;height:1px;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.rp .eyebrow{display:inline-block;margin:0 0 16px;font-size:13px;font-weight:600;letter-spacing:.09em;text-transform:uppercase;color:var(--lime)}
.rp h1,.rp h2,.rp h3{margin:0;letter-spacing:-.03em;line-height:1.08}
.rp h2{font-size:clamp(30px,4vw,48px);font-weight:800}
.rp h3{font-size:20px;font-weight:700;letter-spacing:-.015em;line-height:1.25}
.rp .lead{margin:16px 0 0;max-width:62ch;font-size:clamp(16px,1.4vw,19px);color:var(--muted)}
.rp section{padding:clamp(64px,9vw,120px) 0}
.rp .btn{display:inline-flex;align-items:center;justify-content:center;padding:14px 22px;border-radius:999px;font-weight:600;font-size:15px;line-height:1;border:1.5px solid transparent;cursor:pointer;transition:transform .15s,box-shadow .15s,border-color .15s,color .15s}
.rp .btn:focus-visible,.rp a:focus-visible,.rp input:focus-visible,.rp button:focus-visible{outline:2px solid var(--lime);outline-offset:3px}
.rp .btn-p{background:var(--lime);color:var(--ink)}
.rp .btn-p:hover{transform:translateY(-1px);box-shadow:0 8px 28px -8px rgba(155,226,42,.55)}
.rp .btn-s{background:transparent;color:var(--text);border-color:rgba(255,255,255,.35)}
.rp .btn-s:hover{border-color:var(--lime);color:var(--lime)}
.rp header{position:sticky;top:0;z-index:50;background:rgba(7,10,7,.82);backdrop-filter:blur(12px);border-bottom:1px solid var(--line)}
.rp .nav{display:flex;align-items:center;gap:28px;height:72px}
.rp .logo{display:flex;flex-direction:column;line-height:1;font-weight:800;font-size:26px;letter-spacing:-.03em}
.rp .logo small{margin-top:5px;font-size:10.5px;font-weight:500;letter-spacing:.02em;color:var(--muted)}
.rp .logo i{font-style:normal;color:var(--lime)}
.rp nav{margin-left:auto;display:flex;gap:26px;font-size:14.5px;font-weight:500;color:#d9e0d6}
.rp nav a:hover{color:var(--lime)}
.rp .nav .btn{padding:11px 18px;font-size:14px}
@media(max-width:980px){.rp nav{display:none}
.rp .nav .btn{margin-left:auto}}
.rp .hero{padding-top:clamp(40px,6vw,84px);background:radial-gradient(900px 520px at 85% 30%,rgba(70,80,220,.28),transparent 62%),radial-gradient(700px 420px at 60% 5%,rgba(150,50,90,.16),transparent 60%),radial-gradient(900px 420px at 80% 0%,rgba(155,226,42,.07),transparent 60%),var(--bg)}
.rp .badge{height:auto;width:min(260px,70vw);border-radius:14px;background:#fff;padding:4px}
.rp .seal{margin:36px auto 0;display:flex;flex-direction:column;align-items:center;gap:12px;max-width:46ch;font-size:14px;color:var(--muted)}
.rp .seal p{margin:0}
.rp .dark2{background:var(--bg2);border-block:1px solid var(--line)}
.rp .roi{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,.95fr);gap:clamp(24px,4vw,56px);align-items:start;padding:clamp(24px,4vw,56px);border-radius:32px;border:1px solid var(--line);background:radial-gradient(600px 300px at 90% 0%,rgba(155,226,42,.14),transparent 60%),var(--card)}
.rp .roi h2{font-size:clamp(28px,3.4vw,42px)}
.rp .fg2{margin-top:22px;display:grid;gap:22px}
.rp .fgrp{display:grid;gap:12px}
.rp .fgrp>h3{font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--lime)}
.rp .hint{margin:-4px 0 0;font-size:13px;color:#7f897c}
.rp .row2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;align-items:end}
.rp .fl{display:grid;gap:6px;align-content:end;font-size:14px;font-weight:600;color:#d4dcd0}
.rp .fl input,.rp .fl select{width:100%;padding:12px 14px;border-radius:12px;border:1px solid var(--line);background:#0a0f0a;color:var(--text);font:500 16px Inter,sans-serif}
.rp .task{display:grid;grid-template-columns:1fr 92px;align-items:center;gap:12px;padding:10px 14px;border:1px solid var(--line);border-radius:14px;background:#0a0f0a}
.rp .task label{display:flex;align-items:center;gap:10px;font-size:14.5px;font-weight:600;color:#d9e0d6;cursor:pointer}
.rp .task input[type=checkbox]{width:18px;height:18px;accent-color:var(--lime);flex:none}
.rp .task input[type=number]{width:100%;padding:8px 10px;border-radius:10px;border:1px solid var(--line);background:#070a07;color:var(--text);font:600 15px Inter,sans-serif;text-align:right}
.rp .task.off{opacity:.45}
.rp .unit{font-size:12px;color:#7f897c;font-weight:500}
.rp .res{position:sticky;top:96px;padding:26px;border-radius:22px;background:#0a0f0a;border:1px solid var(--line)}
.rp .res small{display:block;font-size:12.5px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:var(--muted)}
.rp .big{margin:8px 0 4px;font-size:clamp(32px,4.2vw,50px);font-weight:800;letter-spacing:-.04em;line-height:1.05;color:var(--lime);font-variant-numeric:tabular-nums}
.rp .likely{margin:0;font-size:15px;color:#d4dcd0}
.rp .likely b{color:var(--text)}
.rp .bars{margin:20px 0 0;display:grid;gap:12px}
.rp .bar{display:grid;grid-template-columns:104px 1fr auto;align-items:center;gap:12px;font-size:13.5px;color:#d4dcd0}
.rp .bar i{display:block;height:10px;border-radius:6px;background:rgba(255,255,255,.07);overflow:hidden}
.rp .bar i span{display:block;height:100%;border-radius:6px;background:var(--lime);width:0;transition:width .35s ease}
.rp .bar.mid i span{background:#d4f08a}
.rp .bar b{font-variant-numeric:tabular-nums;font-weight:700;color:var(--text)}
.rp .facts{margin:18px 0 0;padding-top:16px;border-top:1px solid var(--line);display:grid;gap:8px;font-size:14.5px;color:#d4dcd0}
.rp .facts b{color:var(--text)}
.rp .rcta{margin-top:20px;display:grid;gap:10px}
.rp .rcta .btn{width:100%}
.rp .how{margin-top:16px;font-size:13.5px;color:#a9b3a6}
.rp .how summary{cursor:pointer;font-weight:600;color:#d9e0d6}
.rp .how ul{margin:10px 0 0;padding-left:18px;display:grid;gap:6px}
.rp .lead-form{margin-top:18px;padding-top:18px;border-top:1px solid var(--line);display:grid;gap:12px}
.rp .lead-form[hidden]{display:none}
.rp .lead-form h4{margin:0;font-size:16px}
.rp .lead-form p{margin:0;font-size:13px;color:#a9b3a6}
.rp .lead-form .ok{color:var(--lime);font-weight:600}
.rp .lead-form .dev{font-size:12px;color:#f5b83a}
@media(max-width:900px){.rp .roi{grid-template-columns:1fr}
.rp .res{position:static}}
@media(max-width:480px){.rp .row2{grid-template-columns:1fr}
.rp .bar{grid-template-columns:90px 1fr auto}}
.rp .final{text-align:center;background:radial-gradient(800px 380px at 50% 100%,rgba(155,226,42,.22),transparent 65%),var(--bg)}
.rp .final h2{max-width:20ch;margin:0 auto}
.rp .final .cta{justify-content:center}
.rp .more{padding:20px 0;text-align:center;border-top:1px solid var(--line);font-size:15px;color:var(--muted)}
.rp .more a{color:var(--lime);font-weight:600}
.rp footer{padding:48px 0 30px;border-top:1px solid var(--line);background:#050805;font-size:14.5px;color:var(--muted)}
.rp .fg{display:grid;grid-template-columns:1.4fr repeat(var(--cols,3),1fr);gap:32px}
.rp footer h4{margin:0 0 12px;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:var(--text)}
.rp footer ul{list-style:none;margin:0;padding:0;display:grid;gap:9px}
.rp footer a:hover{color:var(--lime)}
.rp .legal{margin-top:34px;padding-top:20px;border-top:1px solid var(--line);display:flex;flex-wrap:wrap;gap:10px 24px;justify-content:space-between;font-size:13px}
@media(max-width:800px){.rp .fg{grid-template-columns:1fr 1fr}}
.rp .pagehero{padding-block:clamp(48px,7vw,96px) clamp(36px,5vw,64px)}
.rp .pagehero h1{font-size:clamp(34px,4.6vw,60px);max-width:26ch}
.rp .crumb{margin:0 0 14px;font-size:13.5px;color:var(--muted)}
.rp .crumb a{color:var(--lime);font-weight:600}
/* ---- React specific ---- */
.rp{min-height:100vh}
.rp button{font-family:inherit}
.rp .rp-state{display:grid;place-items:center;min-height:60vh;padding:40px;text-align:center;color:var(--muted)}
.rp .logo img{height:38px;width:auto;margin-bottom:4px}
.rp .rp-hp{position:absolute;left:-9999px;width:1px;height:1px;opacity:0}
.rp .lead-form .err{color:#ef5350;font-weight:600}
.rp .btn[disabled]{opacity:.6;cursor:not-allowed}
.rp .fgrp>h3 .unit{text-transform:none;letter-spacing:0}
.rp .final .cta{display:flex;flex-wrap:wrap;gap:14px;margin-top:32px}
.rp .seal{margin:36px auto 0;display:flex;flex-direction:column;align-items:center;gap:12px;max-width:46ch;font-size:14px;color:var(--muted)}
@media(prefers-reduced-motion:reduce){.rp *{transition:none!important;scroll-behavior:auto}}

`;

/* ------------------------------------------------------------------ */
/* Small helpers                                                       */
/* ------------------------------------------------------------------ */

const num = (v) => Math.max(0, Number(v) || 0);

/** Replaces {tokens} in a CMS text with values. */
const fill = (tpl, vars) =>
  String(tpl || '').replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));

/** Same as fill(), but returns React nodes and makes the listed tokens bold. */
function Tpl({ text, vars, bold = [] }) {
  const parts = String(text || '').split(/(\{\w+\})/g);
  return (
    <>
      {parts.map((p, i) => {
        const m = p.match(/^\{(\w+)\}$/);
        if (!m || !(m[1] in vars)) return p;
        return bold.includes(m[1]) ? <b key={i}>{vars[m[1]]}</b> : vars[m[1]];
      })}
    </>
  );
}

function makeMoney(symbol, locale) {
  return (n) => {
    const rounded = Math.round(n);
    try {
      return `${symbol}${rounded.toLocaleString(locale || 'en-US')}`;
    } catch {
      return `${symbol}${rounded.toLocaleString('en-US')}`;
    }
  };
}

function setMeta(selector, create, content) {
  if (!content) return;
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    create(el);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/* ------------------------------------------------------------------ */
/* Page (loads data, then renders the view)                            */
/* ------------------------------------------------------------------ */

/**
 * Usage: <RoiCalculatorPage />            -> the page marked "main" in WP
 *        <RoiCalculatorPage slug="roi-calculator" />
 */
export default function RoiCalculatorPage({ slug = '' }) {
  const { data, loading, error } = useRoiPage(slug);

  let content;
  if (loading) {
    content = <div className="rp"><div className="rp-state">Loading…</div></div>;
  } else if (error || !data) {
    content = (
      <div className="rp">
        <div className="rp-state">
          This page could not be loaded right now. Please try again in a moment.
        </div>
      </div>
    );
  } else {
    content = <RoiView payload={data} />;
  }

  return (
    <>
      <style>{CSS}</style>
      {content}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* View                                                                */
/* ------------------------------------------------------------------ */

function RoiView({ payload }) {
  const { data: d, calculator: c, slug } = payload;
  const query = useMemo(() => new URLSearchParams(window.location.search), []);
  const industries = c.industries || [];
  const tasks = c.tasks || [];
  const scenarios = c.scenarios || [];
  const currencies = c.currencies || [];
  const symbol = c.currency_symbol || '$';
  const money = useMemo(() => makeMoney(symbol, c.number_locale), [symbol, c.number_locale]);

  /* ---------- initial state (URL params: ?i=industry  ?h=total hours  ?c=cost per hour) ---------- */
  const startIndustry = useMemo(() => {
    const keys = industries.map((i) => i.key);
    const q = query.get('i');
    if (q && keys.includes(q)) return q;
    return keys.includes(c.default_industry) ? c.default_industry : keys[0] || '';
  }, [industries, c.default_industry, query]);

  const presetsOf = (key) => (industries.find((i) => i.key === key) || {}).presets || {};

  const [industry, setIndustry] = useState(startIndustry);
  const [currency, setCurrency] = useState(
    currencies.includes(c.default_currency) ? c.default_currency : currencies[0] || ''
  );
  const [hours, setHours] = useState(() => {
    const p = presetsOf(startIndustry);
    const h = {};
    tasks.forEach((t) => {
      h[t.key] = Number(p[t.key]) || 0;
    });
    const qh = Number(query.get('h'));
    const total = Object.values(h).reduce((a, b) => a + b, 0);
    if (qh > 0 && total > 0) {
      Object.keys(h).forEach((k) => {
        h[k] = Math.round(((h[k] * qh) / total) * 10) / 10;
      });
    }
    return h;
  });
  const [checked, setChecked] = useState(() =>
    Object.fromEntries(tasks.map((t) => [t.key, !!t.checked]))
  );
  const [cost, setCost] = useState(() => {
    const qc = Number(query.get('c'));
    return String(qc > 0 ? qc : c.cost_default ?? 0);
  });
  const [leakN, setLeakN] = useState(String(c.leak_count_default ?? 0));
  const [leakC, setLeakC] = useState(String(c.leak_cost_default ?? 0));
  const [budget, setBudget] = useState('');

  const onIndustryChange = (key) => {
    setIndustry(key);
    const p = presetsOf(key);
    const h = {};
    tasks.forEach((t) => {
      h[t.key] = Number(p[t.key]) || 0;
    });
    setHours(h);
  };

  /* ---------- the maths ---------- */
  const hrs = tasks.reduce((sum, t) => (checked[t.key] ? sum + num(hours[t.key]) : sum), 0);
  const weeks = c.weeks_per_year || 52;
  const months = c.months_per_year || 12;
  const base = hrs * num(cost) * weeks + num(leakN) * num(leakC) * months;

  const values = scenarios.map((s) => (base * s.percent) / 100);
  const lo = values[0] ?? 0;
  const hi = values[values.length - 1] ?? 0;
  const likelyIndex = scenarios.some((s) => s.highlight)
    ? scenarios.findIndex((s) => s.highlight)
    : Math.floor((scenarios.length - 1) / 2);
  const likely = values[likelyIndex] ?? 0;
  const maxValue = Math.max(...values, 0) || 1;
  const hoursBack = Math.round(hrs * ((c.hours_back_pct || 0) / 100) * 10) / 10;

  const bud = num(budget);
  const showPayback = bud > 0 && base > 0 && lo > 0 && hi > 0;
  const paybackVars = showPayback
    ? {
        min: Math.max(1, Math.round(bud / (hi / months))),
        max: Math.max(1, Math.round(bud / (lo / months))),
        budget: money(bud),
      }
    : {};
  const paybackText = showPayback ? fill(d.payback_text, paybackVars) : d.payback_empty_text;
  const colon = paybackText.indexOf(':');

  const summary = {
    industry,
    currency,
    hoursPerWeek: hrs,
    costPerHour: num(cost),
    leaksPerMonth: num(leakN),
    costPerLeak: num(leakC),
    budget: bud || null,
    annualLow: Math.round(lo),
    annualLikely: Math.round(likely),
    annualHigh: Math.round(hi),
  };

  /* ---------- lead form ---------- */
  const [intent, setIntent] = useState(null); // 'audit' | 'email' | null
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState({ kind: '', text: '' });

  const openForm = (which) => {
    setIntent(which);
    setNotice({ kind: '', text: '' });
  };

  const submitLead = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      intent,
      name: fd.get('name'),
      email: fd.get('email'),
      company: fd.get('company'),
      website: fd.get('website') || '', // honeypot, must stay empty
      calculator: summary,
      source: c.lead_source || 'roi-calculator',
      page: slug,
    };
    setSending(true);
    fetch(c.lead_endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then((r) => {
        if (!r.ok) throw new Error('Request failed');
        setNotice({
          kind: 'ok',
          text: intent === 'audit' ? d.lead_done_audit : d.lead_done_email,
        });
        form.reset();
      })
      .catch(() => setNotice({ kind: 'err', text: d.lead_error }))
      .finally(() => setSending(false));
  };

  /* ---------- SEO ---------- */
  useEffect(() => {
    if (d.seo_title) document.title = d.seo_title;
    setMeta('meta[name="description"]', (el) => el.setAttribute('name', 'description'), d.seo_description);
    setMeta('meta[property="og:image"]', (el) => el.setAttribute('property', 'og:image'), d.seo_og_image);
  }, [d.seo_title, d.seo_description, d.seo_og_image]);

  /* ---------- render ---------- */
  const footerColumns = d.footer_columns || [];

  const renderLogo = () => (
    <>
      {d.logo_image ? (
        <img src={d.logo_image} alt={`${d.logo_text}${d.logo_accent}`} />
      ) : (
        <span>
          {d.logo_text}
          <i>{d.logo_accent}</i>
        </span>
      )}
      {d.logo_tagline && <small>{d.logo_tagline}</small>}
    </>
  );

  return (
    <div className="rp">
      {/* HEADER */}
      <header>
        <div className="wrap nav">
          <a className="logo" href={resolveHref(d.logo_url)} aria-label={`${d.logo_text}${d.logo_accent} home`}>
            {renderLogo()}
          </a>
          <nav aria-label="Main">
            {(d.nav || []).map((n, i) => (
              <a key={i} href={resolveHref(n.nav_url)}>
                {n.nav_label}
              </a>
            ))}
          </nav>
          {d.header_cta_label && (
            <a className="btn btn-p" href={resolveHref(d.header_cta_url)}>
              {d.header_cta_label}
            </a>
          )}
        </div>
      </header>

      <main id="top">
        {/* PAGE HERO */}
        <section className="hero pagehero">
          <div className="wrap">
            <p className="crumb">
              <a href={resolveHref(d.crumb_home_url)}>{d.crumb_home_label}</a> / {d.crumb_current}
            </p>
            <p className="eyebrow">{d.hero_eyebrow}</p>
            <h1>{d.hero_title}</h1>
            <p className="lead">{d.hero_lead}</p>
          </div>
        </section>

        {/* CALCULATOR */}
        <section className="dark2" id="calc">
          <div className="wrap">
            <div className="roi">
              {/* inputs */}
              <div>
                <p className="eyebrow">{d.calc_eyebrow}</p>
                <h2>{d.calc_title}</h2>
                <p className="lead">{d.calc_lead}</p>

                <form className="fg2" onSubmit={(e) => e.preventDefault()} aria-label="ROI calculator inputs">
                  <div className="fgrp">
                    <h3>{d.group_business_title}</h3>
                    <div className="row2">
                      <label className="fl">
                        {d.industry_label}
                        <select value={industry} onChange={(e) => onIndustryChange(e.target.value)}>
                          {industries.map((i) => (
                            <option key={i.key} value={i.key}>
                              {i.label}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="fl">
                        {d.currency_label}
                        <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                          {currencies.map((code) => (
                            <option key={code} value={code}>
                              {code}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                  </div>

                  <div className="fgrp">
                    <h3>{d.group_time_title}</h3>
                    {d.time_hint && <p className="hint">{d.time_hint}</p>}
                    {tasks.map((t) => (
                      <div key={t.key} className={`task${checked[t.key] ? '' : ' off'}`}>
                        <label>
                          <input
                            type="checkbox"
                            checked={!!checked[t.key]}
                            onChange={(e) => setChecked((s) => ({ ...s, [t.key]: e.target.checked }))}
                          />{' '}
                          {t.label}
                        </label>
                        <input
                          type="number"
                          min="0"
                          inputMode="decimal"
                          aria-label={t.aria_label || t.label}
                          value={hours[t.key] ?? ''}
                          onChange={(e) => setHours((s) => ({ ...s, [t.key]: e.target.value }))}
                        />
                      </div>
                    ))}
                    <label className="fl">
                      <span>
                        {d.cost_label} <span className="unit" style={{ display: 'inline' }}>({currency})</span>
                      </span>
                      <input
                        type="number"
                        min="0"
                        inputMode="decimal"
                        value={cost}
                        onChange={(e) => setCost(e.target.value)}
                      />
                    </label>
                  </div>

                  <div className="fgrp">
                    <h3>
                      {d.leaks_title} {d.optional_label && <span className="unit">{d.optional_label}</span>}
                    </h3>
                    <div className="row2">
                      <label className="fl">
                        {d.leak_count_label}
                        <input
                          type="number"
                          min="0"
                          inputMode="numeric"
                          value={leakN}
                          onChange={(e) => setLeakN(e.target.value)}
                        />
                      </label>
                      <label className="fl">
                        {d.leak_cost_label}
                        <input
                          type="number"
                          min="0"
                          inputMode="decimal"
                          value={leakC}
                          onChange={(e) => setLeakC(e.target.value)}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="fgrp">
                    <h3>
                      {d.budget_title} {d.optional_label && <span className="unit">{d.optional_label}</span>}
                    </h3>
                    <label className="fl">
                      {d.budget_label}
                      <input
                        type="number"
                        min="0"
                        inputMode="decimal"
                        placeholder={d.budget_placeholder}
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                      />
                    </label>
                  </div>
                </form>
              </div>

              {/* results */}
              <div className="res" aria-live="polite">
                <small>{d.result_label}</small>
                <div className="big">{base > 0 ? `${money(lo)} – ${money(hi)}` : money(0)}</div>
                <p className="likely">
                  <Tpl
                    text={d.result_likely_text}
                    vars={{ amount: money(likely), hours: hoursBack.toLocaleString('en-US') }}
                    bold={['amount', 'hours']}
                  />
                </p>

                <div className="bars" aria-label={d.bars_aria}>
                  {scenarios.map((s, i) => (
                    <div key={i} className={`bar${s.highlight ? ' mid' : ''}`}>
                      <span>
                        {s.label} <em className="unit">{s.percent}%</em>
                      </span>
                      <i>
                        <span style={{ width: `${(values[i] / maxValue) * 100}%` }} />
                      </i>
                      <b>{money(values[i])}</b>
                    </div>
                  ))}
                </div>

                <div className="facts">
                  <div>
                    {colon > -1 ? (
                      <>
                        <b>{paybackText.slice(0, colon + 1)}</b>
                        {paybackText.slice(colon + 1)}
                      </>
                    ) : (
                      paybackText
                    )}
                  </div>
                </div>

                <div className="rcta">
                  <button type="button" className="btn btn-p" onClick={() => openForm('audit')}>
                    {d.btn_audit_label}
                  </button>
                  <button type="button" className="btn btn-s" onClick={() => openForm('email')}>
                    {d.btn_email_label}
                  </button>
                </div>

                {intent && (
                  <form className="lead-form" onSubmit={submitLead}>
                    <h4>{intent === 'audit' ? d.lead_audit_title : d.lead_email_title}</h4>
                    <p>
                      {fill(d.lead_summary, {
                        currency,
                        low: money(lo),
                        high: money(hi),
                        likely: money(likely),
                      })}
                    </p>
                    <label className="fl">
                      {d.lead_name_label}
                      <input name="name" required autoComplete="name" autoFocus />
                    </label>
                    <label className="fl">
                      {d.lead_email_label}
                      <input name="email" type="email" required autoComplete="email" />
                    </label>
                    <label className="fl">
                      {d.lead_company_label}
                      <input name="company" autoComplete="organization" />
                    </label>
                    <input className="rp-hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
                    <button className="btn btn-p" type="submit" disabled={sending}>
                      {intent === 'audit' ? d.lead_audit_submit : d.lead_email_submit}
                    </button>
                    {notice.text && <p className={notice.kind === 'ok' ? 'ok' : 'err'}>{notice.text}</p>}
                  </form>
                )}

                {(d.how_items || []).length > 0 && (
                  <details className="how">
                    <summary>{d.how_title}</summary>
                    <ul>
                      {d.how_items.map((it, i) => (
                        <li key={i}>{it.how_item}</li>
                      ))}
                    </ul>
                  </details>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section id="audit" className="final">
          <div className="wrap">
            <h2>{d.cta_title}</h2>
            <p className="lead" style={{ marginInline: 'auto' }}>{d.cta_lead}</p>
            <div className="cta">
              {d.cta_primary_label && (
                <a className="btn btn-p" href={resolveHref(d.cta_primary_url)}>
                  {d.cta_primary_label}
                </a>
              )}
              {d.cta_secondary_label && (
                <a className="btn btn-s" href={resolveHref(d.cta_secondary_url)}>
                  {d.cta_secondary_label}
                </a>
              )}
            </div>
            {(d.cta_seal_image || d.cta_seal_text) && (
              <div className="seal">
                {d.cta_seal_image && (
                  <img className="badge" src={d.cta_seal_image} width="260" alt={d.cta_seal_alt} loading="lazy" />
                )}
                {d.cta_seal_text && <p>{d.cta_seal_text}</p>}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer id="contact">
        <div className="wrap">
          <div className="fg" style={{ '--cols': Math.max(footerColumns.length, 1) }}>
            <div>
              <div className="logo" style={{ marginBottom: 12 }}>
                {renderLogo()}
              </div>
              <p style={{ margin: 0, maxWidth: '34ch' }}>{d.footer_blurb}</p>
              {d.footer_badge_image && (
                <img
                  className="badge"
                  src={d.footer_badge_image}
                  width="200"
                  alt={d.footer_badge_alt}
                  loading="lazy"
                  style={{ marginTop: 18, width: 200 }}
                />
              )}
            </div>
            {footerColumns.map((col, i) => (
              <div key={i}>
                <h4>{col.column_title}</h4>
                <ul>
                  {(col.links || []).map((l, j) => (
                    <li key={j}>
                      <a href={resolveHref(l.url)}>{l.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="legal">
            <span>{d.footer_copyright}</span>
            <span>{d.footer_location}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
