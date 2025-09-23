import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import MailchimpSubscriptionCoupon from "./components/MailchimpSubscriptionCoupon";

export const metadata: Metadata = {
  title: "Dreamli | Personalized 3D Creative Kits from Kids' Drawings",
  description: "Transform your child's drawings into personalized 3D figures and painting kits. Eco-friendly, fun, and designed to boost creativity & confidence.",
  keywords: "kids drawings, personalized, 3D creative kits, painting kits, boost creativity, eco-friendly, children art, 3D printing, creative play",
  openGraph: {
    title: "Dreamli | Personalized 3D Creative Kits from Kids' Drawings",
    description: "Transform your child's drawings into personalized 3D figures and painting kits. Eco-friendly, fun, and designed to boost creativity & confidence.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dreamli | Personalized 3D Creative Kits from Kids' Drawings",
    description: "Transform your child's drawings into personalized 3D figures and painting kits. Eco-friendly, fun, and designed to boost creativity & confidence.",
  },
  icons: {
    icon: 'https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/9c9edad9b68474ee37e885e5ff2b1112.png',
    shortcut: 'https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/9c9edad9b68474ee37e885e5ff2b1112.png',
    apple: 'https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/9c9edad9b68474ee37e885e5ff2b1112.png',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Dreamli",
    "legalName": "OmniTechs V.O.F.",
    "url": "https://dreamli.nl",
    "logo": "https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/48224f9cc1b0c55ac8c088f51f17f701.png",
    "foundingDate": "2023-01-01",
    "founder": {
      "@type": "Person",
      "name": "Seyed Sina Sadegh Esfahani"
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Resedastraat 39",
      "postalCode": "9713TN",
      "addressLocality": "Groningen",
      "addressCountry": "Netherlands"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+31645559587",
      "email": "info@dreamli.nl",
      "contactType": "customer service"
    },
    "sameAs": [
      "https://www.facebook.com/dreamli",
      "https://www.instagram.com/dreamli",
      "https://www.linkedin.com/company/dreamli"
    ]
  };

  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          href="/fonts/inter-latin-400-normal.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/inter-latin-500-normal.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/inter-latin-600-normal.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/inter-latin-700-normal.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <style dangerouslySetInnerHTML={{
          __html: `
            @font-face {
              font-family: 'Inter';
              font-style: normal;
              font-weight: 400;
              font-display: swap;
              src: url('/fonts/inter-latin-400-normal.woff2') format('woff2');
              unicode-range: U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;
            }
            @font-face {
              font-family: 'Inter';
              font-style: normal;
              font-weight: 500;
              font-display: swap;
              src: url('/fonts/inter-latin-500-normal.woff2') format('woff2');
              unicode-range: U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;
            }
            @font-face {
              font-family: 'Inter';
              font-style: normal;
              font-weight: 600;
              font-display: swap;
              src: url('/fonts/inter-latin-600-normal.woff2') format('woff2');
              unicode-range: U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;
            }
            @font-face {
              font-family: 'Inter';
              font-style: normal;
              font-weight: 700;
              font-display: swap;
              src: url('/fonts/inter-latin-700-normal.woff2') format('woff2');
              unicode-range: U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;
            }
            body {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
            }
          `
        }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema, null, 2)
          }}
        />
      </head>
      <body>
        {children}
        <MailchimpSubscriptionCoupon />
        
        {/* Move all non-critical scripts to bottom with lazyOnload */}
        <Script
          src="//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"
          strategy="lazyOnload"
        />
        
        {/* Microsoft Clarity - defer loading */}
        <Script id="clarity-script" strategy="lazyOnload">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "sy5gylxyzn");
          `}
        </Script>

        {/* Google Analytics 4 - defer loading */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-2Q0BPDFWS4"
          strategy="lazyOnload"
        />
        <Script id="gtag-init" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-2Q0BPDFWS4');
          `}
        </Script>
      </body>
    </html>
  )
}
