import { useEffect, useRef, useState } from "react";
import { submitEnquiry } from "./contactApi";

const EMPTY = { message: "", name: "", email: "", phone: "" };

function CloseIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 3l12 12M15 3L3 15"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function EnquiryDrawer({ open, type, data, onClose }) {
  const [values, setValues] = useState(EMPTY);
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [formError, setFormError] = useState("");
  const [doneMessage, setDoneMessage] = useState("");
  const fileRef = useRef(null);
  const panelRef = useRef(null);

  const t = (key) => data?.[`${type}_${key}`] || "";
  const rules = data?.form_rules?.[type] || { accept: "", max_bytes: 0 };
  const hasFile = Boolean(rules.accept);
  const required = data?.required_label || "Important";

  useEffect(() => {
    if (!open) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.addEventListener("keydown", closeOnEscape);
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  const setField = (name) => (event) => {
    setValues((current) => ({ ...current, [name]: event.target.value }));
    if (errors[name]) {
      setErrors((current) => ({ ...current, [name]: undefined }));
    }
  };

  const onFile = (event) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    const allowed = rules.accept
      .split(",")
      .map((extension) => extension.trim().toLowerCase());
    const extension = `.${selectedFile.name.split(".").pop().toLowerCase()}`;
    let message = "";
    if (!allowed.includes(extension)) {
      message = `Allowed file types: ${allowed.join(", ").toUpperCase().replace(/\./g, "")}`;
    } else if (rules.max_bytes && selectedFile.size > rules.max_bytes) {
      message = "File size must not be more than 2 MB.";
    }

    if (message) {
      event.target.value = "";
      setFile(null);
      setErrors((current) => ({ ...current, file: message }));
      return;
    }

    setFile(selectedFile);
    setErrors((current) => ({ ...current, file: undefined }));
  };

  const clearFile = () => {
    setFile(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const validate = () => {
    const nextErrors = {};
    if (!values.message.trim()) {
      nextErrors.message = "Please tell us how we can help.";
    }
    if (!values.name.trim()) {
      nextErrors.name = "Please enter your full name.";
    }
    if (!/^\S+@\S+\.\S+$/.test(values.email.trim())) {
      nextErrors.email = "Please enter a valid email address.";
    }
    const digits = values.phone.replace(/\D/g, "");
    if (digits.length < 6 || digits.length > 15) {
      nextErrors.phone = "Please enter a valid phone number.";
    }
    return nextErrors;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    setFormError("");
    if (Object.keys(nextErrors).length > 0) return;

    setStatus("sending");
    try {
      const response = await submitEnquiry({ type, values, file });
      setDoneMessage(response.message || t("success"));
      setStatus("done");
    } catch (error) {
      const fieldErrors = error.fields || {};
      setErrors(fieldErrors);
      setFormError(
        Object.keys(fieldErrors).length > 0
          ? ""
          : error.message || data.error_generic || "Something went wrong.",
      );
      setStatus("idle");
    }
  };

  const field = (name, placeholder, props = {}) => (
    <div className={`ct-field${errors[name] ? " has-error" : ""}`}>
      <input
        className="ct-input"
        name={name}
        value={values[name]}
        onChange={setField(name)}
        placeholder={placeholder}
        aria-invalid={Boolean(errors[name])}
        {...props}
      />
      <span className="ct-req">{errors[name] || required}</span>
    </div>
  );

  return (
    <div
      className={`ct-drawer-root${open ? " is-open" : ""}`}
      aria-hidden={!open}
      inert={!open}
    >
      <button
        type="button"
        className="ct-overlay"
        onClick={onClose}
        aria-label="Close enquiry form"
        tabIndex={-1}
      />
      <aside
        className="ct-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={t("title")}
        tabIndex={-1}
        ref={panelRef}
      >
        <button
          type="button"
          className="ct-close"
          onClick={onClose}
          aria-label="Close form"
        >
          <CloseIcon />
        </button>

        {status === "done" ? (
          <div className="ct-done">
            <p className="ct-eyebrow">{t("eyebrow")}</p>
            <h2 className="ct-drawer-title">{t("title")}</h2>
            <p className="ct-done-msg" role="status">
              {doneMessage}
            </p>
            <button type="button" className="ct-btn-dark" onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate>
            <p className="ct-eyebrow">{t("eyebrow")}</p>
            <h2 className="ct-drawer-title">{t("title")}</h2>
            <p className="ct-drawer-sub">{t("subtitle")}</p>

            <h3 className="ct-block-title">{t("msg_heading")}</h3>
            <p className="ct-block-text">{t("msg_text")}</p>
            <div className={`ct-field ct-field-area${errors.message ? " has-error" : ""}`}>
              <textarea
                className="ct-input"
                name="message"
                rows={4}
                value={values.message}
                onChange={setField("message")}
                placeholder={t("msg_placeholder")}
                aria-invalid={Boolean(errors.message)}
              />
              <span className="ct-req">{errors.message || required}</span>
            </div>

            {hasFile && (
              <div className="ct-file">
                <p className="ct-block-text">{t("file_text")}</p>
                <div className="ct-file-row">
                  <input
                    ref={fileRef}
                    id={`ct-file-${type}`}
                    type="file"
                    accept={rules.accept}
                    onChange={onFile}
                    hidden
                  />
                  <label htmlFor={`ct-file-${type}`} className="ct-btn-green">
                    {file ? "Change file" : t("file_button")}
                  </label>
                  <span className="ct-file-note">{t("file_note")}</span>
                </div>
                {file && (
                  <p className="ct-file-name">
                    {file.name}{" "}
                    <button type="button" className="ct-link" onClick={clearFile}>
                      Remove
                    </button>
                  </p>
                )}
                {errors.file && <p className="ct-error-text">{errors.file}</p>}
                {t("file_warning") && (
                  <p className="ct-file-warning">{t("file_warning")}</p>
                )}
              </div>
            )}

            <h3 className="ct-block-title">{t("details_heading")}</h3>
            <p className="ct-block-text">{t("details_text")}</p>
            {field("name", t("name_ph"), { autoComplete: "name" })}
            {field("email", t("email_ph"), {
              type: "email",
              autoComplete: "email",
            })}
            {field("phone", t("phone_ph"), {
              type: "tel",
              autoComplete: "tel",
            })}

            {formError && (
              <p className="ct-error-text" role="alert">
                {formError}
              </p>
            )}

            <button
              type="submit"
              className="ct-btn-dark"
              disabled={status === "sending"}
            >
              {status === "sending"
                ? data.sending_label || "Sending..."
                : t("button")}
            </button>
          </form>
        )}
      </aside>
    </div>
  );
}
