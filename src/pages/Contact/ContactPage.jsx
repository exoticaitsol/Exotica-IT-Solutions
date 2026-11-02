import { useCallback, useEffect, useState } from "react";
import { fetchContact } from "./contactApi";
import EnquiryDrawer from "./EnquiryDrawer";
import "./contact.css";

function Arrow({ up }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
    >
      {up ? (
        <path
          d="M4 10l6-6M5 4h5v5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M2.5 7h9M8 3.5L11.5 7 8 10.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

function OfficeMap({ office }) {
  if (office.office_map_embed) {
    return (
      <div className="ct-map">
        <iframe
          title={`${office.office_country} office map`}
          src={office.office_map_embed}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    );
  }

  if (!office.office_map_image) return null;

  const image = (
    <img
      src={office.office_map_image}
      alt={`${office.office_country} office map`}
      loading="lazy"
    />
  );

  return office.office_map_link ? (
    <a
      className="ct-map"
      href={office.office_map_link}
      target="_blank"
      rel="noopener noreferrer"
    >
      {image}
    </a>
  ) : (
    <div className="ct-map">{image}</div>
  );
}

export default function ContactPage() {
  const [page, setPage] = useState({ status: "loading", data: null });
  const [retry, setRetry] = useState(0);
  const [form, setForm] = useState(null);
  const [lastForm, setLastForm] = useState("project");
  const [formSession, setFormSession] = useState(0);
  const data = page.data;

  useEffect(() => {
    const controller = new AbortController();

    fetchContact(controller.signal)
      .then((response) => setPage({ status: "ready", data: response }))
      .catch((error) => {
        if (error.name !== "AbortError") {
          setPage({ status: "error", data: null });
        }
      });

    return () => controller.abort();
  }, [retry]);

  useEffect(() => {
    if (!data) return;
    if (data.seo_title) document.title = data.seo_title;
    if (!data.seo_description) return;

    let description = document.querySelector('meta[name="description"]');
    if (!description) {
      description = document.createElement("meta");
      description.name = "description";
      document.head.appendChild(description);
    }
    description.content = data.seo_description;
  }, [data]);

  const openForm = (type) => {
    const formType = ["project", "career", "general"].includes(type)
      ? type
      : "project";
    setLastForm(formType);
    setFormSession((session) => session + 1);
    setForm(formType);
  };
  const closeForm = useCallback(() => setForm(null), []);

  if (page.status === "error") {
    return (
      <main className="ct-page ct-state">
        <p>We couldn&apos;t load this page.</p>
        <button
          type="button"
          className="ct-btn-green"
          onClick={() => {
            setPage({ status: "loading", data: null });
            setRetry((attempt) => attempt + 1);
          }}
        >
          Try again
        </button>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="ct-page ct-state" aria-busy="true">
        <p>Loading…</p>
      </main>
    );
  }

  return (
    <main className="ct-page">
      <section className="ct-hero">
        <p className="ct-eyebrow ct-center">{data.hero_eyebrow}</p>
        <h1 className="ct-h1">{data.hero_title}</h1>
        <p className="ct-hero-text">{data.hero_text}</p>

        <div className="ct-cards">
          {(data.cards || []).map((card, index) => (
            <button
              type="button"
              key={index}
              className={`ct-card${card.card_featured ? " is-featured" : ""}`}
              onClick={() => openForm(card.card_form)}
            >
              <span className="ct-eyebrow">{card.card_eyebrow}</span>
              <span className="ct-card-title">{card.card_title}</span>
              <span className="ct-card-cta">
                {card.card_button}
                <span className="ct-circle">
                  <Arrow up={card.card_featured} />
                </span>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="ct-offices">
        <div className="ct-offices-inner">
          <p className="ct-eyebrow">{data.offices_eyebrow}</p>
          <h2 className="ct-h2">
            {data.offices_title}
            <br />
            <span className="ct-green">{data.offices_highlight}</span>
          </h2>
          <div className="ct-office-list">
            {(data.offices || []).map((office, index) => (
              <div className="ct-office" key={index}>
                <div className="ct-office-info">
                  <h3 className="ct-country">{office.office_country}</h3>
                  <div>
                    <p className="ct-region">{office.office_region}</p>
                    <p className="ct-address">{office.office_address}</p>
                    {office.office_phone && (
                      <a
                        className="ct-phone"
                        href={`tel:${office.office_phone.replace(/[^\d+]/g, "")}`}
                      >
                        {office.office_phone}
                      </a>
                    )}
                  </div>
                </div>
                <OfficeMap office={office} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ct-cta-wrap">
        <div className="ct-cta">
          <p className="ct-eyebrow ct-eyebrow-dark">{data.cta_eyebrow}</p>
          <h2 className="ct-h2 ct-cta-title">{data.cta_title}</h2>
          <button
            type="button"
            className="ct-btn-dark"
            onClick={() => openForm(data.cta_form || "project")}
          >
            {data.cta_button}
          </button>
        </div>
      </section>

      {(data.social_links || []).length > 0 && (
        <section className="ct-social">
          <p className="ct-eyebrow ct-center">{data.social_eyebrow}</p>
          <div className="ct-social-row">
            {data.social_links.map((social, index) => (
              <a
                key={index}
                href={social.social_url || "#"}
                target="_blank"
                rel="noopener noreferrer"
              >
                {social.social_label}
              </a>
            ))}
          </div>
        </section>
      )}

      <EnquiryDrawer
        key={`${form || lastForm}-${formSession}`}
        open={Boolean(form)}
        type={form || lastForm}
        data={data}
        onClose={closeForm}
      />
    </main>
  );
}
