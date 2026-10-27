import { Link } from "react-router-dom";

function About() {
    return (
         <main>
            <section className="inner hero_sec">
                <div className="hero_content">
                    <h1 className="section_title">About Us</h1>
                </div>
            </section>
            <section className="about-section">
                <div className="container">

                    <div className="about-image">
                        <img src="https://images.unsplash.com/photo-1497366754035-f200968a6e72"
                            alt="Our office"
                        />
                    </div>

                    <div className="about-content">
                        <span>About Us</span>
                        <h2>We Create Digital Experiences</h2>

                        <p>
                            Lorem ipsum dolor sit amet consectetur
                            adipisicing elit. Quisquam, voluptatum.
                        </p>

                    </div>

                </div>
            </section>

        </main>
    );
}
export default About;