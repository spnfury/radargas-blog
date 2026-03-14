import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
    title: {
        template: '%s | Blog RadarGas',
        default: 'Blog RadarGas — Noticias sobre Gasolina en España',
    },
    description:
        'Noticias, análisis y consejos sobre precios de gasolina y diésel en España. Mantente informado con RadarGas.',
    keywords: [
        'noticias gasolina',
        'precio gasolina españa',
        'blog gasolina',
        'radargas',
    ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="es">
            <head>
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
                    rel="stylesheet"
                />
                <meta name="google-adsense-account" content="ca-pub-XXXXXXXXXX" />
            </head>
            <body>
                {children}
                {/* Google AdSense */}
                <Script
                    async
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXX"
                    crossOrigin="anonymous"
                    strategy="afterInteractive"
                />
            </body>
        </html>
    );
}
