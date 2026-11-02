import { useEffect, useState } from "react";

function Header() {
  const [header, setHeader] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

useEffect(() => {
  document.body.style.overflow = menuOpen ? "hidden" : "";

  return () => {
    document.body.style.overflow = "";
  };
}, [menuOpen]);

  useEffect(() => {
    const controller = new AbortController();
    fetch("https://app.exoticaitsolutions.com/wp-json/custom/v1/header", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }
        return response.json();
      })
      .then(setHeader)
      .catch((error) => {
        if (error.name !== "AbortError") console.error("HEADER API ERROR:", error);
      });
    return () => controller.abort();
  }, []);

  if (!header) return null;

  return (
    <nav>
      <div className="container">
        <a className="logo" href={header.site_url || "/"}>
          {header.logo?.url ? <img src={header.logo.url} alt="Exotica" /> : "Exotica"}
        </a>
        <button
          className="menu-toggle"
          aria-label="Toggle navigation"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
        <div className={`links ${menuOpen ? "menu-open" : ""}`}>
          {(Array.isArray(header.menu) ? header.menu : []).map((item) => {
            const isAboutLink = item.title?.trim().toLowerCase() === "about us";
            const isContactLink = item.title?.trim().toLowerCase().includes("contact");
            const isServicesLink = item.title?.trim().toLowerCase() === "services";
            const href = isServicesLink && (!item.url || item.url === "#")
              ? "/service"
              : isAboutLink && (!item.url || item.url === "#")
              ? "/about"
              : isContactLink && (!item.url || item.url === "#")
                ? "/contact"
                : item.url;

            return (
              <a key={item.id} href={href}>
                {item.title}
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export default Header;