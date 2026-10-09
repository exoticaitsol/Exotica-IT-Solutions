import {Link} from 'react-router-dom';

function Contact() {
    return (
         <main>
            <section className="inner hero_sec">
                <div className="hero_content">
                    <h1 className="section_title">Contact Us</h1>
                </div>
            </section>

            <section className="cta-section">
                <div className="container">

                    <div className="cta-content">
                        <h2>Ready To Start Your Project?</h2>
                        <p>
                            Let's create something amazing together.
                        </p>

                        <Link to="/about" className="common-btn">
                            Learn More
                        </Link>
                    </div>

                </div>
            </section>
        </main>
    )
}

export default Contact;