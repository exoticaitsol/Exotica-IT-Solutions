import { useEffect, useRef, useState } from "react";
import "./ContactUs.css";

const WP_ROOT = String(
  import.meta.env.VITE_WP_URL || "https://app.exoticaitsolutions.com",
).replace(/\/+$/, "");
const API_ROOT = String(
  import.meta.env.VITE_API_URL || `${WP_ROOT}/wp-json/exotica/v1`,
).replace(/\/+$/, "");
const API_BASE = String(
  import.meta.env.VITE_WP_URL ||
    API_ROOT.replace(/\/wp-json\/exotica\/v1$/, "") ||
    WP_ROOT,
).replace(/\/+$/, "");

const DEFAULTS = {
  hero_title: "Contact Us",
  hero_text: "Contact us for any query !",
  hero_btn_text: "Book A Free Call",
  hero_btn_url: "",
  hero_image: "",
  form_title: "Ready to get started? let's chat.",
  form_subtitle: "Envision. design. build",
  ph_name: "Name",
  ph_email: "Email",
  ph_phone: "Number",
  ph_message: "Message",
  consent_text:
    "I agree to receive marketing emails from Exotica IT Solutions about its products, services, updates and offers. I understand I can unsubscribe at any time.",
  consent_required: false,
  privacy_label: "Privacy Policy",
  privacy_url: "/privacy-policy",
  terms_label: "Terms & Conditions",
  terms_url: "/terms-and-conditions",
  btn_label: "Send Message",
  btn_sending: "Sending...",
  msg_success:
    "Thank you! We've received your message and will get back to you shortly.",
  msg_error: "Something went wrong. Please try again.",
  mail_title: "Write To Us",
  mail_email: "info@exoticaitsolutions.com",
  map_embed:
    "https://www.google.com/maps?q=Exotica+IT+Solutions+Private+Limited+Sector+82+Mohali&t=k&z=16&output=embed",
  map_height: 530,
  recaptcha_site: "",
  offices: [
    {
      country: "India",
      address:
        "Plot No, 1433, Sector 82, IT Park, Mohali, Sahibzada Ajit Singh Nagar, Punjab 140306",
      phone: "+91 7018 152390",
      flag: "",
    },
    {
      country: "Canada",
      address: "385 Edgevalley Rd, London, Ontario",
      phone: "+1 (431) 600-3626",
      flag: "",
    },
  ],
};

function MailIcon() {
  return (
    <svg
      viewBox="0 0 32 32"
      width="34"
      height="34"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="3" y="6" width="26" height="20" rx="3" fill="#0f1b35" />
      <path
        d="M4 8l12 10L28 8M4 25l9-9M28 25l-9-9"
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Flag({ office }) {
  if (office.flag) {
    return <img className="exctu-flag-img" src={office.flag} alt="" />;
  }

  const country = (office.country || "").toLowerCase();
  if (country.includes("india")) {
    return (
      <svg viewBox="0 0 40 40" width="40" height="40" aria-hidden="true">
        <defs>
          <clipPath id="exctu-in">
            <circle cx="20" cy="20" r="20" />
          </clipPath>
        </defs>
        <g clipPath="url(#exctu-in)">
          <rect width="40" height="14" fill="#f4872b" />
          <rect y="13" width="40" height="14" fill="#fff" />
          <rect y="26" width="40" height="14" fill="#1e8a3a" />
          <circle
            cx="20"
            cy="20"
            r="4.6"
            fill="none"
            stroke="#2a3a8c"
            strokeWidth="1.4"
          />
          <circle cx="20" cy="20" r="1" fill="#2a3a8c" />
        </g>
      </svg>
    );
  }

  if (country.includes("canada")) {
    return (
      <svg viewBox="0 0 40 40" width="40" height="40" aria-hidden="true">
        <defs>
          <clipPath id="exctu-ca">
            <circle cx="20" cy="20" r="20" />
          </clipPath>
        </defs>
        <g clipPath="url(#exctu-ca)">
          <rect width="40" height="40" fill="#fff" />
          <rect width="10" height="40" fill="#d62828" />
          <rect x="30" width="10" height="40" fill="#d62828" />
          <path
            d="M20 8l2 5 3-1-1 6 4-3 1 2-3 3 1 1-6-.5V32h-2v-6.5L13 26l1-1-3-3 1-2 4 3-1-6 3 1z"
            fill="#d62828"
          />
        </g>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 40 40" width="40" height="40" aria-hidden="true">
      <circle cx="20" cy="20" r="20" fill="#e9eef5" />
      <path
        d="M20 9a8 8 0 0 0-8 8c0 6 8 14 8 14s8-8 8-14a8 8 0 0 0-8-8zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"
        fill="#0f1b35"
      />
    </svg>
  );
}

function Recaptcha({ siteKey, widgetRef }) {
  const box = useRef(null);

  useEffect(() => {
    if (!siteKey) return undefined;
    let active = true;
    const renderCaptcha = () => {
      if (
        !active ||
        !box.current ||
        !window.grecaptcha?.render ||
        widgetRef.current !== null
      ) {
        return;
      }

      widgetRef.current = window.grecaptcha.render(box.current, {
        sitekey: siteKey,
      });
    };

    if (window.grecaptcha?.render) {
      renderCaptcha();
    } else {
      window.__exctuCaptchaReady = renderCaptcha;
      if (!document.getElementById("exctu-recaptcha")) {
        const script = document.createElement("script");
        script.id = "exctu-recaptcha";
        script.src =
          "https://www.google.com/recaptcha/api.js?onload=__exctuCaptchaReady&render=explicit";
        script.async = true;
        document.head.appendChild(script);
      }
    }

    return () => {
      active = false;
    };
  }, [siteKey, widgetRef]);

  return siteKey ? <div ref={box} className="g-recaptcha" /> : null;
}

function getErrorMessage(error, fallback) {
  return error instanceof Error && error.message ? error.message : fallback;
}

function FieldError({ message }) {
  return message ? (
    <span className="exctu-err is-on">{message}</span>
  ) : null;
}

export default function ContactUs({ apiBase = API_BASE, heroImage = "", fullWidth = false }) {
  const base = String(apiBase || "").replace(/\/+$/, "");
  const [data, setData] = useState(DEFAULTS);
  const [loadError, setLoadError] = useState("");
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    consent: false,
    website: "",
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: "", text: "" });
  const [sending, setSending] = useState(false);
  const captchaId = useRef(null);

  useEffect(() => {
    if (!base) return undefined;
    const controller = new AbortController();

    fetch(`${base}/wp-json/exotica/v1/contact-us`, {
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Contact details could not be loaded (${response.status}).`);
        }
        return response.json();
      })
      .then((content) => setData((current) => ({ ...current, ...content })))
      .catch((error) => {
        if (error.name !== "AbortError") {
          console.error("Unable to load contact page content.", error);
          setLoadError(
            "Live contact details could not be loaded. Showing the default information.",
          );
        }
      });

    return () => controller.abort();
  }, [base]);

  const setField = (field) => (event) => {
    const value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;
    setValues((current) => ({ ...current, [field]: value }));
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  };

  const validate = () => {
    const nextErrors = {};
    if (!values.name.trim()) nextErrors.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      nextErrors.email = "Please enter a valid email address.";
    }
    const digits = values.phone.replace(/\D/g, "");
    if (digits.length < 6 || digits.length > 15) {
      nextErrors.phone = "Please enter a valid number.";
    }
    if (!values.message.trim()) {
      nextErrors.message = "Please write your message.";
    }
    if (data.consent_required && !values.consent) {
      nextErrors.consent = "Please tick the checkbox to continue.";
    }
    return nextErrors;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: "", text: "" });
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const formData = new FormData();
    formData.append("name", values.name.trim());
    formData.append("email", values.email.trim());
    formData.append("phone", values.phone.trim());
    formData.append("message", values.message.trim());
    formData.append("consent", values.consent ? "1" : "0");
    formData.append("website", values.website);
    if (data.recaptcha_site && window.grecaptcha && captchaId.current !== null) {
      formData.append(
        "g-recaptcha-response",
        window.grecaptcha.getResponse(captchaId.current),
      );
    }

    setSending(true);
    try {
      const response = await fetch(
        `${base}/wp-json/exotica/v1/contact-us-submit`,
        { method: "POST", body: formData },
      );
      let result;
      try {
        result = await response.json();
      } catch {
        throw new Error("The server returned an invalid response. Please try again.");
      }

      if (!result || typeof result !== "object") {
        throw new Error("The server returned an invalid response. Please try again.");
      }

      if (!response.ok || !result.success) {
        setErrors(result.data?.fields || {});
        throw new Error(result.message || data.msg_error);
      }

      setValues({
        name: "",
        email: "",
        phone: "",
        message: "",
        consent: false,
        website: "",
      });
      setErrors({});
      setStatus({
        type: "ok",
        text: result.message || data.msg_success,
      });
      if (window.grecaptcha && captchaId.current !== null) {
        window.grecaptcha.reset(captchaId.current);
      }
    } catch (error) {
      console.error("Unable to submit contact form.", error);
      setStatus({
        type: "fail",
        text: getErrorMessage(error, data.msg_error),
      });
    } finally {
      setSending(false);
    }
  };

  const heroImg = data.hero_image || heroImage;
  const buttonHref = data.hero_btn_url || "#exctu-form-card";
  const invalidClass = (field) => (errors[field] ? " is-bad" : "");

  return (
    <div className={`exctu${fullWidth ? " exctu--full" : ""}`}>
      <section className="exctu-hero">
        <div className="exctu-wrap exctu-hero__grid">
          <div className="exctu-hero__text">
            <h1 className="exctu-hero__title">{data.hero_title}</h1>
            <p className="exctu-hero__sub">{data.hero_text}</p>
            {data.hero_btn_text && (
              <a className="exctu-btn-green" href={buttonHref}>
                {data.hero_btn_text}
              </a>
            )}
          </div>
          <div className="exctu-hero__media">
            <span className="exctu-hero__frame" aria-hidden="true" />
            {heroImg ? (
              <img
                className="exctu-hero__img"
                src={heroImg}
                alt={data.hero_title}
              />
            ) : (
              <span className="exctu-hero__img exctu-hero__img--empty" />
            )}
          </div>
        </div>
      </section>

      {loadError && (
        <p className="exctu-load-error" role="status">
          {loadError}
        </p>
      )}

      <section className="exctu-main">
        <div className="exctu-wrap exctu-main__grid">
          <div className="exctu-card-form" id="exctu-form-card">
            <h2 className="exctu-card-form__title">{data.form_title}</h2>
            <p className="exctu-card-form__sub">{data.form_subtitle}</p>

            <form className="exctu-form" onSubmit={onSubmit} noValidate>
              <div className="exctu-form__row">
                <div className="exctu-field">
                  <input
                    className={`exctu-input${invalidClass("name")}`}
                    type="text"
                    name="name"
                    autoComplete="name"
                    maxLength={120}
                    placeholder={data.ph_name}
                    aria-label={data.ph_name}
                    aria-invalid={Boolean(errors.name)}
                    value={values.name}
                    onChange={setField("name")}
                  />
                  <FieldError message={errors.name} />
                </div>
                <div className="exctu-field">
                  <input
                    className={`exctu-input${invalidClass("email")}`}
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder={data.ph_email}
                    aria-label={data.ph_email}
                    aria-invalid={Boolean(errors.email)}
                    value={values.email}
                    onChange={setField("email")}
                  />
                  <FieldError message={errors.email} />
                </div>
              </div>

              <div className="exctu-field">
                <input
                  className={`exctu-input${invalidClass("phone")}`}
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  placeholder={data.ph_phone}
                  aria-label={data.ph_phone}
                  aria-invalid={Boolean(errors.phone)}
                  value={values.phone}
                  onChange={setField("phone")}
                />
                <FieldError message={errors.phone} />
              </div>

              <div className="exctu-field">
                <textarea
                  className={`exctu-input exctu-textarea${invalidClass("message")}`}
                  name="message"
                  rows={5}
                  maxLength={5000}
                  placeholder={data.ph_message}
                  aria-label={data.ph_message}
                  aria-invalid={Boolean(errors.message)}
                  value={values.message}
                  onChange={setField("message")}
                />
                <FieldError message={errors.message} />
              </div>

              <div className="exctu-field exctu-consent">
                <label className="exctu-consent__label">
                  <input
                    className="exctu-consent__box"
                    type="checkbox"
                    name="consent"
                    checked={values.consent}
                    onChange={setField("consent")}
                  />
                  <span>{data.consent_text}</span>
                </label>
                <FieldError message={errors.consent} />
                <p className="exctu-consent__links">
                  <a
                    href={data.privacy_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {data.privacy_label}
                  </a>
                  <span className="exctu-consent__sep" aria-hidden="true" />
                  <a
                    href={data.terms_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {data.terms_label}
                  </a>
                </p>
              </div>

              {data.recaptcha_site && (
                <div className="exctu-field">
                  <Recaptcha siteKey={data.recaptcha_site} widgetRef={captchaId} />
                  <FieldError message={errors.captcha} />
                </div>
              )}

              <div className="exctu-hp" aria-hidden="true">
                <label>
                  Website
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={values.website}
                    onChange={setField("website")}
                  />
                </label>
              </div>

              <div
                className={`exctu-status${status.type === "ok" ? " is-ok" : status.type === "fail" ? " is-fail" : ""}`}
                role="status"
                aria-live="polite"
              >
                {status.text}
              </div>
              <button
                className="exctu-submit"
                type="submit"
                disabled={sending}
              >
                {sending ? data.btn_sending : data.btn_label}
              </button>
            </form>
          </div>

          <div className="exctu-info">
            {data.mail_email && (
              <div className="exctu-info__card">
                <span className="exctu-info__icon">
                  <MailIcon />
                </span>
                <h3 className="exctu-info__title">{data.mail_title}</h3>
                <p className="exctu-info__text">
                  <a href={`mailto:${data.mail_email}`}>{data.mail_email}</a>
                </p>
              </div>
            )}
            {(data.offices || []).map((office, index) => (
              <div
                className="exctu-info__card"
                key={`${office.country}-${index}`}
              >
                <span className="exctu-info__icon">
                  <Flag office={office} />
                </span>
                <h3 className="exctu-info__title">{office.country}</h3>
                {office.address && (
                  <p className="exctu-info__text">{office.address}</p>
                )}
                {office.phone && (
                  <p className="exctu-info__phone">
                    <strong>Phone :</strong>
                    <a href={`tel:${office.phone.replace(/[^0-9+]/g, "")}`}>
                      {office.phone}
                    </a>
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {data.map_embed && (
        <section className="exctu-map">
          <iframe
            className="exctu-map__frame"
            title="Map"
            src={data.map_embed}
            style={{ height: `${Number(data.map_height) || 530}px` }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </section>
      )}
    </div>
  );
}
