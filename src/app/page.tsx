// RadarGas Blog — Listing Page
import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts } from '@/lib/nocodb';

export const metadata: Metadata = {
    title: 'Blog RadarGas — Noticias sobre Gasolina en España',
    description:
        'Las últimas noticias sobre precios de gasolina y diésel en España. Análisis de tendencias, consejos de ahorro y novedades del sector energético.',
    keywords: [
        'noticias gasolina',
        'precio gasolina españa',
        'blog gasolina',
        'noticias combustible',
        'ahorro gasolina',
        'precio diésel',
    ],
    alternates: {
        canonical: 'https://radargas.com/blog',
    },
    openGraph: {
        title: 'Blog RadarGas — Noticias sobre Gasolina',
        description:
            'Noticias, análisis y consejos sobre precios de gasolina y diésel en España.',
        type: 'website',
        siteName: 'RadarGas',
        url: 'https://radargas.com/blog',
        locale: 'es_ES',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Blog RadarGas — Noticias sobre Gasolina',
        description:
            'Noticias, análisis y consejos sobre precios de gasolina y diésel en España.',
    },
};

function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

const CATEGORY_EMOJIS: Record<string, string> = {
    Precios: '📊',
    Consejos: '💡',
    Análisis: '🔬',
    Regulación: '🏛️',
};

export default async function BlogPage() {
    const posts = await getAllPosts();

    return (
        <div className="rg-landing">
            {/* ---- Navbar ---- */}
            <nav className="rg-navbar">
                <div className="rg-navbar-inner">
                    <Link href="/" className="rg-nav-logo">
                        ⛽ <span>Radar</span>Gas
                    </Link>
                    <div className="rg-nav-links">
                        <Link href="/">Blog</Link>
                        <a href="https://app.radargas.com" className="rg-nav-cta">
                            Abrir App →
                        </a>
                    </div>
                </div>
            </nav>

            {/* ---- Hero ---- */}
            <section className="blog-hero">
                <div className="rg-container">
                    <div className="rg-hero-badge">
                        <span className="dot" />
                        Noticias actualizadas
                    </div>
                    <h1>
                        Blog <span className="green">RadarGas</span>
                    </h1>
                    <p className="blog-hero-sub">
                        Las últimas noticias sobre precios de gasolina y diésel en España.
                        Análisis, tendencias y consejos para ahorrar en cada repostaje.
                    </p>
                </div>
            </section>

            {/* ---- Posts Grid ---- */}
            <section className="blog-grid-section">
                <div className="rg-container">
                    {posts.length === 0 ? (
                        <div className="blog-empty">
                            <p>No hay artículos publicados todavía. ¡Vuelve pronto!</p>
                        </div>
                    ) : (
                        <div className="blog-grid">
                            {posts.map((post) => (
                                <Link
                                    key={post.Slug}
                                    href={`/blog/${post.Slug}`}
                                    className="blog-card"
                                >
                                    {post.CoverImage && (
                                        <div className="blog-card-img">
                                            <img
                                                src={post.CoverImage}
                                                alt={post.Title}
                                                loading="lazy"
                                            />
                                        </div>
                                    )}
                                    <div className="blog-card-body">
                                        <div className="blog-card-meta">
                                            <span className="blog-card-category">
                                                {CATEGORY_EMOJIS[post.Category] || '📰'}{' '}
                                                {post.Category}
                                            </span>
                                            <span className="blog-card-date">
                                                {formatDate(post.PublishedAt)}
                                            </span>
                                        </div>
                                        <h2 className="blog-card-title">{post.Title}</h2>
                                        <p className="blog-card-excerpt">{post.Excerpt}</p>
                                        <span className="blog-card-link">
                                            Leer más →
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* ---- CTA ---- */}
            <section className="blog-cta">
                <div className="rg-container">
                    <h2>¿Quieres encontrar la gasolina más barata?</h2>
                    <p>
                        Usa RadarGas para comparar precios en tiempo real y ahorrar en cada
                        repostaje.
                    </p>
                    <a href="https://app.radargas.com" className="rg-btn primary">
                        🚀 Abrir RadarGas Gratis
                    </a>
                </div>
            </section>

            {/* ---- Footer ---- */}
            <footer className="rg-footer">
                <div className="rg-footer-inner">
                    <div className="rg-footer-bottom">
                        <span>© {new Date().getFullYear()} RadarGas — Datos MITECO</span>
                        <span>Precios orientativos. Verifica en la gasolinera.</span>
                    </div>
                </div>
            </footer>

            {/* ---- JSON-LD ---- */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'Blog',
                        name: 'Blog RadarGas',
                        url: 'https://radargas.com/blog',
                        description:
                            'Noticias, análisis y consejos sobre precios de gasolina y diésel en España.',
                        publisher: {
                            '@type': 'Organization',
                            name: 'RadarGas',
                            url: 'https://radargas.com',
                        },
                        blogPost: posts.map((p) => ({
                            '@type': 'BlogPosting',
                            headline: p.Title,
                            url: `https://radargas.com/blog/${p.Slug}`,
                            datePublished: p.PublishedAt,
                            description: p.Excerpt,
                        })),
                    }),
                }}
            />
        </div>
    );
}
