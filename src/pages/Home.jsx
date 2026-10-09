import { useEffect, useState } from "react";

function Home() {
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchHero() {
      try {
        const response = await fetch(
          "https://app.exoticaitsolutions.com/wp-json/custom/v1/heroes"
        );

        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();

        console.log("Hero API Data:", data);

        // API array return kar rahi hai
        setHero(data[0]);
      } catch (error) {
        console.error("Hero API Error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchHero();
  }, []);

  // Loading
  if (loading) {
    return <h2>Loading Hero...</h2>;
  }

  // Error
  if (error) {
    return <h2>Error: {error}</h2>;
  }

  // No data
  if (!hero) {
    return <h2>No Hero Data Found</h2>;
  }

  return (
    <section className="hero">

      <div className="container">

        {/* Eyebrow */}
        <p className="hero-eyebrow">
          {hero.eyebrow}
        </p>

        {/* Heading */}
        <h1 className="hero-heading text-5xl font-bold text-white">
          {hero.heading}
        </h1>

        {/* Description */}
        <div
          className="hero-description"
          dangerouslySetInnerHTML={{
            __html: hero.description,
          }}
        />

        {/* Buttons */}
        <div className="hero-buttons">

          {hero.buttons.map((button, index) => (
            <a
              key={index}
              href={button.url}
              className={`hero-button ${button.style}`}
              target={button.new_tab ? "_blank" : "_self"}
              rel={button.new_tab ? "noopener noreferrer" : undefined}
            >
              {button.text}
            </a>
          ))}

        </div>

        </div>

    </section>
  );
}

export default Home;