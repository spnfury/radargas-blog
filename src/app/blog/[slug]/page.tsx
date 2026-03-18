// RadarGas Blog — Article Page
import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllSlugs, getPostBySlug } from '@/lib/nocodb';
import { notFound } from 'next/navigation';

// ---------- Markdown → HTML (lightweight, no deps) ----------
function markdownToHtml(md: string): string {
    let html = md
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        .replace(/^# (.+)$/gm, '<h1>$1</h1>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/^- (.+)$/gm, '<li>$1</li>')
        .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
        .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/(<li>.*?<\/li>)(\s*<li>)/g, '$1$2');

    html = html.replace(/((?:<li>.*?<\/li>\s*)+)/g, '<ul>$1</ul>');
    html = `<p>${html}</p>`;
    html = html
        .replace(/<p>\s*<\/p>/g, '')
        .replace(/<p>\s*(<h[1-3]>)/g, '$1')
        .replace(/(<\/h[1-3]>)\s*<\/p>/g, '$1')
        .replace(/<p>\s*(<ul>)/g, '$1')
        .replace(/(<\/ul>)\s*<\/p>/g, '$1');

    return html;
}

// ---------- Static Params ----------
export async function generateStaticParams() {
    const slugs = await getAllSlugs();
    return slugs.map((slug) => ({ slug }));
}

// ---------- Dynamic Metadata ----------
type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata(props: PageProps): Promise<Metadata> {
    const { slug } = await props.params;
    const post = await getPostBySlug(slug);
    if (!post) return { title: 'Artículo no encontrado' };

    return {
        title: post.Title,
        description: post.Excerpt,
        keywords: [
            'gasolina', 'precio gasolina', 'españa',
            post.Category.toLowerCase(), 'radargas',
        ],
        alternates: {
            canonical: `https://radargas.com/blog/${post.Slug}`,
        },
        openGraph: {
            title: post.Title,
            description: post.Excerpt,
            type: 'article',
            siteName: 'RadarGas',
            url: `https://radargas.com/blog/${post.Slug}`,
            locale: 'es_ES',
            publishedTime: post.PublishedAt,
            images: post.CoverImage ? [{ url: post.CoverImage, width: 800, height: 450 }] : [],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.Title,
            description: post.Excerpt,
            images: post.CoverImage ? [post.CoverImage] : [],
        },
    };
}

// ---------- Date formatter ----------
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

// ---------- Page ----------
export default async function BlogArticlePage(props: PageProps) {
    const { slug } = await props.params;
    const post = await getPostBySlug(slug);

    if (!post) notFound();

    const contentHtml = markdownToHtml(post.Content);

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

            {/* ---- Article Header ---- */}
            <section className="blog-article-header">
                <div className="rg-container">
                    <nav className="blog-breadcrumbs" aria-label="Breadcrumb">
                        <Link href="/">Blog</Link>
                        <span className="blog-breadcrumb-sep">/</span>
                        <span>{post.Category}</span>
                    </nav>

                    <div className="blog-article-meta">
                        <span className="blog-card-category">
                            {CATEGORY_EMOJIS[post.Category] || '📰'} {post.Category}
                        </span>
                        <span className="blog-card-date">
                            {formatDate(post.PublishedAt)}
                        </span>
                    </div>

                    <h1 className="blog-article-title">{post.Title}</h1>
                    <p className="blog-article-excerpt">{post.Excerpt}</p>
                </div>
            </section>

            {/* ---- Cover Image ---- */}
            {post.CoverImage && (
                <div className="blog-article-cover">
                    <div className="rg-container">
                        <img src={post.CoverImage} alt={post.Title} />
                    </div>
                </div>
            )}

            {/* ---- Article Content ---- */}
            <article className="blog-article-content">
                <div className="rg-container">
                    <div
                        className="blog-prose"
                        dangerouslySetInnerHTML={{ __html: contentHtml }}
                    />
                </div>
            </article>

            {/* ---- Ad ---- */}
            <div className="rg-container">

            </div>

            {/* ---- CTA ---- */}
            <section className="blog-cta">
                <div className="rg-container">
                    <h2>
                        Encuentra la gasolina más barata con{' '}
                        <span className="green">RadarGas</span>
                    </h2>
                    <p>
                        Compara precios de más de 12.000 gasolineras en España con datos del
                        Ministerio. 100% gratis.
                    </p>
                    <div className="rg-hero-buttons">
                        <a href="https://app.radargas.com" className="rg-btn primary">
                            🚀 Abrir RadarGas
                        </a>
                        <Link href="/" className="rg-btn secondary">
                            ← Volver al blog
                        </Link>
                    </div>
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
                        '@type': 'NewsArticle',
                        headline: post.Title,
                        description: post.Excerpt,
                        url: `https://radargas.com/blog/${post.Slug}`,
                        datePublished: post.PublishedAt,
                        image: post.CoverImage || undefined,
                        author: {
                            '@type': 'Organization',
                            name: 'RadarGas',
                            url: 'https://radargas.com',
                        },
                        publisher: {
                            '@type': 'Organization',
                            name: 'RadarGas',
                            url: 'https://radargas.com',
                            logo: {
                                '@type': 'ImageObject',
                                url: 'https://radargas.com/icons/icon-512.png',
                            },
                        },
                        articleSection: post.Category,
                        mainEntityOfPage: {
                            '@type': 'WebPage',
                            '@id': `https://radargas.com/blog/${post.Slug}`,
                        },
                    }),
                }}
            />
        </div>
    );
}
