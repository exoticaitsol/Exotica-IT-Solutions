import { useEffect, useState } from "react";

function Header() {
  const [header, setHeader] = useState(null);

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
      <div className="links">
        {(Array.isArray(header.menu) ? header.menu : []).map((item) => (
          <a key={item.id} href={item.url}>{item.title}</a>
        ))}
      </div>
      </div>
    </nav>
  );
}

export default Header;