import { useEffect, useState } from "react";
import { fetchAbout } from "../api/about";
import ContactSection from "../components/ContactSection";
import "./About.css";

const ICONS = [
  <>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </>,
  <>
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
    <path d="M9 18h6" />
    <path d="M10 22h4" />
  </>,
  <>
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    <path d="m9 12 2 2 4-4" />
  </>,
  <>
    <circle cx="12" cy="8" r="6" />
    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
  </>,
  <>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </>,
];

function DefaultIcon({ index }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICONS[index % ICONS.length]}
    </svg>
  );
}

function Eyebrow({ children }) {
  return children ? <p className="ab-eyebrow">{children}</p> : null;
}

function Highlight({ children }) {
  return children ? <span className="ab-green">{children}</span> : null;
}

function useSeo(data) {
  useEffect(() => {
    if (!data) return;
    if (data.seo_title) document.title = data.seo_title;

    const setMeta = (attribute, key, content) => {
      if (!content) return;
      let element = document.head.querySelector(`meta[${attribute}="${key}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    setMeta("name", "description", data.seo_description);
    setMeta("property", "og:title", data.seo_title);
    setMeta("property", "og:description", data.seo_description);
    setMeta("property", "og:image", data.seo_og_image);
  }, [data]);
}

function Hero({ data }) {
  return (
    <section className="ab-hero new-abtsec">
      <div className="ab-container ab-hero__top">
        <Eyebrow>{data.hero_eyebrow}</Eyebrow>
        <h1 className="ab-h1">
          {data.hero_title_before} <Highlight>{data.hero_highlight}</Highlight>{" "}
          {data.hero_title_after}
        </h1>
      </div>
      <div className="ab-hero__media">
        <div className="ab-container">
          {data.hero_image ? (
            <img
              className="ab-hero__img"
              src={data.hero_image}
              alt="Exotica IT Solutions team"
            />
          ) : (
            <div className="ab-hero__img ab-placeholder" />
          )}
        </div>
      </div>
      {data.hero_text && (
        <div className="ab-hero__text newly-sec-ad">
          <p>{data.hero_text}</p>
        </div>
      )}
    </section>
  );
}

function Mission({ data }) {
  return (
    <section className="ab-section ab-light">
      <div className="ab-container">
        <Eyebrow>{data.mission_eyebrow}</Eyebrow>
        <h2 className="ab-h2">
          {data.mission_title_before}{" "}
          <Highlight>{data.mission_highlight_1}</Highlight>{" "}
          {data.mission_title_middle}{" "}
          <Highlight>{data.mission_highlight_2}</Highlight>
        </h2>
        <div className="ab-split ab-split--mission">
          <div className="ab-split__media">
            {data.mission_image ? (
              <img src={data.mission_image} alt="" />
            ) : (
              <div className="ab-placeholder" />
            )}
          </div>
          <div className="ab-mission__copy">
            <p className="ab-lead">{data.mission_lead}</p>
            <p className="ab-muted">{data.mission_text}</p>
            {data.mission_quote && (
              <blockquote className="ab-quote">
                {data.mission_quote}
              </blockquote>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Values({ data }) {
  const stats = data.values_stats || [];
  const cards = data.values_cards || [];

  return (
    <section className="ab-section ab-dark">
      <div className="ab-container">
        <Eyebrow>{data.values_eyebrow}</Eyebrow>
        <h2 className="ab-h2">
          {data.values_title} <Highlight>{data.values_highlight}</Highlight>
        </h2>
        <div className="ab-values__banner">
          {data.values_image ? (
            <img src={data.values_image} alt="" />
          ) : (
            <div className="ab-placeholder" />
          )}
          {stats.length > 0 && (
            <div className="ab-stats">
              {stats.map((stat, index) => (
                <div className="ab-stats__item" key={index}>
                  <strong>{stat.vstat_number}</strong>
                  <span>{stat.vstat_label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="ab-cards">
          {cards.map((card, index) => (
            <article className="ab-card" key={index}>
              <span className="ab-card__icon">
                {card.vcard_icon ? (
                  <img src={card.vcard_icon} alt="" />
                ) : (
                  <DefaultIcon index={index} />
                )}
              </span>
              <h3>{card.vcard_title}</h3>
              <p>{card.vcard_text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Beliefs({ data }) {
  const items = data.beliefs_items || [];

  return (
    <section className="ab-section ab-light">
      <div className="ab-container ab-split ab-split--beliefs">
        <div className="ab-split__media ab-split__media--tall">
          {data.beliefs_image ? (
            <img src={data.beliefs_image} alt="" />
          ) : (
            <div className="ab-placeholder" />
          )}
        </div>
        <div>
          <Eyebrow>{data.beliefs_eyebrow}</Eyebrow>
          <h2 className="ab-h2">
            {data.beliefs_title} <Highlight>{data.beliefs_highlight}</Highlight>
          </h2>
          <ol className="ab-beliefs">
            {items.map((belief, index) => (
              <li key={index}>
                <span className="ab-beliefs__no">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3>{belief.belief_title}</h3>
                  <p>{belief.belief_text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function Leadership({ data }) {
  const [open, setOpen] = useState(null);
  const members = data.lead_members || [];

  useEffect(() => {
    if (open === null) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setOpen(null);
    };
    const previousOverflow = document.body.style.overflow;
    document.addEventListener("keydown", closeOnEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const member = open !== null ? members[open] : null;

  return (
    <section className="ab-section ab-dark">
      <div className="ab-container">
        <div className="ab-lead-head">
          <div>
            <Eyebrow>{data.lead_eyebrow}</Eyebrow>
            <h2 className="ab-h2">
              {data.lead_title} <Highlight>{data.lead_highlight}</Highlight>
            </h2>
          </div>
          {data.lead_subtitle && (
            <p className="ab-lead-head__sub">{data.lead_subtitle}</p>
          )}
        </div>
        <div className="ab-team">
          {members.map((person, index) => (
            <article className="ab-member" key={index}>
              <div className="ab-member__photo">
                {person.member_photo ? (
                  <img src={person.member_photo} alt={person.member_name} />
                ) : (
                  <div className="ab-placeholder" />
                )}
              </div>
              <div className="ab-member__body">
                <h3>{person.member_name}</h3>
                <p className="ab-member__role">{person.member_role}</p>
                <p className="ab-member__bio">{person.member_bio}</p>
                <button
                  type="button"
                  className="ab-link"
                  onClick={() => setOpen(index)}
                >
                  {data.lead_readmore_label || "Read more +"}
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
      {member && (
        <div
          className="ab-modal"
          role="dialog"
          aria-modal="true"
          aria-label={member.member_name}
          onClick={() => setOpen(null)}
        >
          <div className="ab-modal__box" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="ab-modal__close"
              aria-label="Close"
              onClick={() => setOpen(null)}
            >
              ×
            </button>
            {member.member_photo && (
              <img
                className="ab-modal__photo"
                src={member.member_photo}
                alt={member.member_name}
              />
            )}
            <div className="ab-modal__content">
              <h3>{member.member_name}</h3>
              <p className="ab-member__role">{member.member_role}</p>
              <p className="ab-modal__bio">{member.member_bio}</p>
              {member.member_linkedin && (
                <a
                  className="ab-link"
                  href={member.member_linkedin}
                  target="_blank"
                  rel="noreferrer"
                >
                  View profile →
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default function About() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    fetchAbout(controller.signal)
      .then(setData)
      .catch((fetchError) => {
        if (fetchError.name !== "AbortError") setError(fetchError.message);
      });
    return () => controller.abort();
  }, []);

  useSeo(data);

  if (error) {
    return (
      <main className="ab-page ab-state">
        <p role="alert">{error}</p>
      </main>
    );
  }
  if (!data) {
    return (
      <main className="ab-page ab-state" aria-busy="true">
        <p>Loading…</p>
      </main>
    );
  }

  return (
    <main className="ab-page">
      <Hero data={data} />
      <Mission data={data} />
      <Values data={data} />
      <Beliefs data={data} />
      <Leadership data={data} />
      <ContactSection data={data} />
    </main>
  );
}
