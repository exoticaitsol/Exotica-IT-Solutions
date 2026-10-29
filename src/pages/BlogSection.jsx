import { useEffect, useState } from "react";

export default function BlogSection() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchPosts() {
            try {
                const response = await fetch(
                    "https://app.exoticaitsolutions.com/wp-json/wp/v2/posts?_embed"
                );

                if (!response.ok) {
                    throw new Error(`HTTP Error: ${response.status}`);
                }

                const data = await response.json();

                setPosts(data.slice(0, 3));
            } catch (err) {
                console.error("Blog API Error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchPosts();
    }, []);

    return (
        <section className="blog-section bg-[#080b08] px-5 py-16 text-white md:px-8 lg:px-12">
            <div className="container">

                {/* Heading */}
                <div className="blog-title mb-8 flex items-end justify-between gap-4">
                    <div>
                        <p className="mb-3 text-xs uppercase tracking-[0.2em] text-lime-400">
                            Blogs
                        </p>

                        <h2 className="text-3xl font-bold md:text-4xl lg:text-5xl">
                            Latest{" "}
                            <span className="text-lime-500">
                                highlights &amp; updates
                            </span>
                        </h2>
                    </div>

                    <a
                        href="https://app.exoticaitsolutions.com/blog/"
                        className="shrink-0 rounded-full border border-white/40 px-4 py-2 text-xs text-white transition hover:border-lime-400 hover:text-lime-400"
                    >
                        View All Stories
                    </a>
                </div>

                {/* Loading */}
                {loading && (
                    <p className="py-10 text-gray-400">Loading blogs...</p>
                )}

                {/* Error */}
                {error && (
                    <p className="py-10 text-red-400">
                        Unable to load blogs: {error}
                    </p>
                )}

                {/* Blog Cards */}
                {!loading && !error && (
                    <>
                        {posts.length > 0 ? (
                            <div className="grid grid-cols-1 gap-3 md:grid-cols-5">

                                {posts.map((post, index) => {
                                    const media =
                                        post._embedded?.["wp:featuredmedia"]?.[0];

                                    const image = media?.source_url;

                                    const title = post.title?.rendered || "Untitled Blog";

                                    const excerpt = post.excerpt?.rendered || "";

                                    const postUrl = post.link;

                                    return (
                                        <article
                                            key={post.id}
                                            className={`blog-feature-card group relative overflow-hidden rounded-lg border border-white/10 ${index === 0
                                                    ? "md:col-span-3 md:row-span-2"
                                                    : "md:col-span-2"
                                                }`}
                                        >
                                            {/* Background Image */}
                                            {image && (
                                                <a
                                                    href={postUrl}
                                                    className="blog-feature-image-link"
                                                    aria-label={`Read ${title.replace(/<[^>]*>/g, "")}`}
                                                >
                                                    <img
                                                        src={image}
                                                        alt={media?.alt_text || ""}
                                                        loading="lazy"
                                                        className="blog-feature-image"
                                                    />
                                                </a>
                                            )}

                                            {/* Background Overlay */}
                                            <div className="blog-feature-overlay" />

                                            {/* Card Content */}
                                            <div className="blog-feature-content">

                                                {index === 0 && (
                                                    <p className="mb-2 text-xs uppercase tracking-wider text-lime-400">
                                                        Featured Article
                                                    </p>
                                                )}

                                                {/* Clickable Title */}
                                                <a
                                                    href={postUrl}
                                                    className="blog-feature-title-link"
                                                >
                                                    <h3
                                                        className={
                                                            index === 0
                                                                ? "text-2xl font-bold leading-tight md:text-3xl"
                                                                : "text-lg font-bold leading-tight"
                                                        }
                                                        dangerouslySetInnerHTML={{
                                                            __html: title,
                                                        }}
                                                    />
                                                </a>

                                                <div className="excerpt_txt">

                                                    {/* Featured Card Excerpt */}
                                                    {index === 0 && (
                                                        <div
                                                            className="mt-3 line-clamp-3 text-sm leading-5 text-gray-300"
                                                            dangerouslySetInnerHTML={{
                                                                __html: excerpt,
                                                            }}
                                                        />
                                                    )}

                                                    {/* Clickable Arrow */}
                                                    <a
                                                        href={postUrl}
                                                        className="blog-feature-arrow"
                                                        aria-label={`Read ${title.replace(/<[^>]*>/g, "")}`}
                                                    >
                                                        <span aria-hidden="true">→</span>
                                                    </a>
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })}

                            </div>
                        ) : (
                            <p className="py-10 text-gray-400">
                                No blog posts found.
                            </p>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}
