import { useEffect, useState } from "react";

function Header() {
  const [header, setHeader] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://app.exoticaitsolutions.com/wp-json/custom/v1/header")
      .then((response) => {
        console.log("Response status:", response.status);

        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }

        return response.json();
      })
      .then((data) => {
        console.log("HEADER DATA:", data);
        setHeader(data);
      })
      .catch((error) => {
        console.error("HEADER API ERROR:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <header>Loading header...</header>;
  }

  if (!header) {
    return <header>Header failed to load.</header>;
  }

  return (
    <header className="header">

      <div className="container">

        <div className="header-inner flex items-center justify-between">

          <div className="logo">
            <a href={header.site_url}>
              <img src={header.logo.url} alt="Website Logo" />
            </a>
          </div>

          <nav>
            <ul className="navbar flex">
              {header.menu.map((item) => (
                <li key={item.id}>
                  <a href={item.url}>
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

        </div>

      </div>

    </header>
  );
}

export default Header;