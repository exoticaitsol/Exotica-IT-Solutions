import { useState } from "react";
import { sendAboutContact } from "../api/about";
import "./ContactSection.css";

const EMPTY_FORM = {
  name: "",
  email: "",
  timeline: "",
  project: "",
  website: "",
};

function Eyebrow({ children }) {
  return children ? <p className="ab-eyebrow">{children}</p> : null;
}

export default function ContactSection({
  data,
  sectionId = "contact",
  variant = "about",
  onSubmitContact = sendAboutContact,
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const timelineOptions =
    variant === "home"
      ? String(data.contact_launch_options || "")
          .split("\n")
          .map((option) => option.trim())
          .filter(Boolean)
      : data.timeline_options || [];

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    if (status === "sending") return;

    if (!form.name.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) {
      setStatus("error");
      setError("Please enter your name and a valid email.");
      return;
    }

    setStatus("sending");
    setError("");
    try {
      await onSubmitContact(form);
      setStatus("success");
      setForm(EMPTY_FORM);
    } catch (submitError) {
      setStatus("error");
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong. Please try again.",
      );
    }
  };

  return (
    <section
      className={
        variant === "home"
          ? "ct"
          : "ab-section ab-dark ab-contact contact-section"
      }
      id={sectionId}
    >
      <div
        className={
          variant === "home"
            ? "wrap ctg"
            : "ab-container ab-contact__grid"
        }
      >
        <div>
          {variant === "home" ? (
            <>
              {data.contact_eyebrow && (
                <span className="eye">{data.contact_eyebrow}</span>
              )}
              <h2 data-reveal style={{ marginTop: 14 }}>
                {data.contact_title}
              </h2>
              <div className="lets" aria-label={data.contact_big}>
                {[...(data.contact_big || "")].map((character, index) =>
                  character === " " ? (
                    " "
                  ) : (
                    <span key={index}>{character}</span>
                  ),
                )}
              </div>
              {data.contact_text && (
                <p data-reveal className="lede">
                  {data.contact_text}
                </p>
              )}
            </>
          ) : (
            <>
              <Eyebrow>{data.contact_eyebrow}</Eyebrow>
              <h2 className="ab-contact__title">{data.contact_title}</h2>
              {/* <p className="ab-contact__big new-addition-text">{data.contact_big}</p> */}
              <div class="lets" aria-label="Let's Talk!" bis_skin_checked="1"><span>L</span><span>e</span><span>t</span><span>'</span><span>s</span> <span>T</span><span>a</span><span>l</span><span>k</span><span>!</span></div>
              <p className="ab-contact__text">{data.contact_text}</p>
            </>
          )}
        </div>
        <div>
          {status === "success" && variant === "home" ? (
            <h3 style={{ fontSize: 30, color: "var(--lime)" }}>
              Thank you — we&apos;ll be in touch within 24 hours.
            </h3>
          ) : status === "success" ? (
            <p className="ab-msg ab-msg--ok" role="status">
              {data.contact_success || "Thank you! We will contact you shortly."}
            </p>
          ) : (
            <form
              className={variant === "home" ? undefined : "ab-form"}
              onSubmit={submit}
              noValidate={variant !== "home"}
            >
              <label className={variant === "home" ? undefined : "ab-field"}>
                {variant === "home" ? "Full name" : <span>{data.f_name_label}</span>}
                <input
                  type="text"
                  name="name"
                  placeholder={
                    variant === "home"
                      ? "Your full name"
                      : data.f_name_placeholder
                  }
                  value={form.name}
                  onChange={updateField("name")}
                  required
                />
              </label>
              <label className={variant === "home" ? undefined : "ab-field"}>
                {variant === "home" ? (
                  "Business email"
                ) : (
                  <span>{data.f_email_label}</span>
                )}
                <input
                  type="email"
                  name="email"
                  placeholder={
                    variant === "home"
                      ? "you@company.com"
                      : data.f_email_placeholder
                  }
                  value={form.email}
                  onChange={updateField("email")}
                  required
                />
              </label>
              {(variant !== "home" || timelineOptions.length > 0) && (
                <label className={variant === "home" ? undefined : "ab-field"}>
                  {variant === "home" ? (
                    "When do you want to launch a solution?"
                  ) : (
                    <span>{data.f_timeline_label}</span>
                  )}
                  <select
                    name={variant === "home" ? "launch" : "timeline"}
                    value={form.timeline}
                    onChange={updateField("timeline")}
                  >
                    <option value="">
                      {variant === "home"
                        ? "Select a timeline"
                        : data.f_timeline_placeholder}
                    </option>
                    {timelineOptions.map((option, index) => {
                      const label =
                        typeof option === "string"
                          ? option
                          : option.option_label;
                      return (
                        <option key={index} value={label}>
                          {label}
                        </option>
                      );
                    })}
                  </select>
                </label>
              )}
              <label className={variant === "home" ? undefined : "ab-field"}>
                {variant === "home" ? "About project" : <span>{data.f_project_label}</span>}
                <textarea
                  name={variant === "home" ? "message" : "project"}
                  rows="2"
                  placeholder={
                    variant === "home"
                      ? "Tell us about the opportunity"
                      : data.f_project_placeholder
                  }
                  value={form.project}
                  onChange={updateField("project")}
                />
              </label>
              <input
                type="text"
                name="website"
                tabIndex="-1"
                autoComplete="off"
                className={variant === "home" ? undefined : "ab-hp"}
                style={variant === "home" ? { display: "none" } : undefined}
                value={form.website}
                onChange={updateField("website")}
                aria-hidden="true"
              />
              <button
                className={variant === "home" ? "pill" : "ab-btn"}
                disabled={status === "sending"}
              >
                {status === "sending"
                  ? variant === "home"
                    ? "Sending..."
                    : "Sending…"
                  : variant === "home"
                    ? data.contact_submit_label || "Submit"
                    : data.contact_button || "Submit"}
              </button>
              {status === "error" && (
                <p
                  className={variant === "home" ? "err" : "ab-msg ab-msg--err"}
                  role="alert"
                >
                  {variant === "home"
                    ? "Could not send. Please try again or email us directly."
                    : error}
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
