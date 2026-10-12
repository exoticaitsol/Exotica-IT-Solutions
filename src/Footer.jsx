
import { useEffect, useState } from "react";
import "./App.css";

function Footer() {
    const [footer, setFooter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchFooter() {
            try {
                const response = await fetch(
                    "https://app.exoticaitsolutions.com/wp-json/exotica/v1/footer"
                );

                if (!response.ok) {
                    throw new Error(`HTTP Error: ${response.status}`);
                }

                const data = await response.json();

                console.log("Footer API Data:", data);
                setFooter(data);
            } catch (error) {
                console.error("Footer API Error:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        fetchFooter();
    }, []);

    if (loading) return <footer>Loading footer...</footer>;
    if (error) return <footer>Footer error: {error}</footer>;
    if (!footer) return null;

    return (
        <footer className="footer bg-[#080b08] text-white px-6 py-12 lg:px-12">
            <div className="container">
                <div className="footer-top flex flex-col gap-6 lg:flex-row lg:justify-between lg:gap-10">

                    {/* Logo and Description */}
                    <div className="footer-brand">
                        <a href="https://app.exoticaitsolutions.com/">
                            <img
                                src={footer.logo}
                                alt="Exotica IT Solutions"
                                className="footer-logo"
                            />
                        </a>

                        <p className="mt-4 max-w-sm text-sm leading-6 text-gray-300">
                            {footer.description}
                        </p>
                    </div>

                    {/* Footer Link Columns */}
                   <div className="footer-columns grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
                        {footer.columns?.map((column) => (
                            <div key={column.title} className="footer-column">
                                <h4 className="mb-4 font-bold">
                                    {column.title}
                                </h4>

                                <ul className="space-y-3">
                                    {column.links?.map((link) => (
                                        <li key={link.label}>
                                            <a
                                                href={
                                                    link.url.startsWith("http")
                                                        ? link.url
                                                        : `https://app.exoticaitsolutions.com${link.url}`
                                                }
                                                className="text-sm text-gray-300 transition-colors hover:text-lime-400"
                                            >
                                                {link.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Certifications */}
                {footer.certifications?.some((item) => item.image) && (
                    <div className="footer-certifications mt-10 flex flex-wrap gap-4">
                        {footer.certifications
                            .filter((item) => item.image)
                            .map((item) => (
                                <img
                                    key={item.alt}
                                    src={item.image}
                                    alt={item.alt}
                                    className="footer-certification-image"
                                />
                            ))}
                    </div>
                )}

                {/* Copyright */}
                <div className="footer-bottom mt-10 border-t border-white/15 pt-6">
                    <p className="text-sm text-gray-400">
                        {footer.copyright}
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
