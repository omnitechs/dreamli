import type { Metadata } from "next";
import { ReactNode } from "react";
import { languages, defaultLanguage, type Language } from "@/config/i18n";

/* ---------- SSG for all languages (robust to strings OR objects) ---------- */
export async function generateStaticParams() {
    const toCode = (item: { code: string } | string) =>
        typeof item === "string" ? item : item.code;

    return languages.map((item) => ({ lang: toCode(item) as Language }));
}

/* ---------- Localized metadata ---------- */
export async function generateMetadata({
                                           params,
                                       }: {
    params: { lang: Language };
}): Promise<Metadata> {
    const { lang } = params;

    const titles: Record<Language, string> = {
        en: "Dreamli | Personalized 3D Creative Kits from Kids' Drawings",
        nl: "Dreamli | Gepersonaliseerde 3D Knutselsets van Kindertekeningen",
        de: "Dreamli | Personalisierte 3D-Bastelsets aus Kinderzeichnungen",
        fr: "Dreamli | Kits créatifs 3D personnalisés à partir de dessins d'enfants",
        pl: "Dreamli | Spersonalizowane 3D zestawy kreatywne z rysunków dzieci",
    };

    const descriptions: Record<Language, string> = {
        en: "Transform your child's drawings into personalized 3D figures and painting kits. Eco-friendly, fun, and designed to boost creativity & confidence.",
        nl: "Verander de tekeningen van je kind in gepersonaliseerde 3D-figuren en knutselsets. Milieuvriendelijk, leuk en goed voor de creativiteit.",
        de: "Verwandle die Zeichnungen deines Kindes in personalisierte 3D-Figuren und Bastelsets. Umweltfreundlich, kreativ und spaßig.",
        fr: "Transformez les dessins de votre enfant en figurines et kits créatifs 3D personnalisés, écologiques et amusants.",
        pl: "Zmieniaj rysunki dziecka w spersonalizowane figurki i zestawy malarskie 3D. Ekologiczne, kreatywne i zabawne.",
    };

    return {
        title: titles[lang],
        description: descriptions[lang],
        alternates: {
            languages: {
                en: "/en",
                nl: "/nl",
                de: "/de",
                fr: "/fr",
                pl: "/pl",
            },
        },
    };
}

/* ---------- Layout ---------- */
export default function LangLayout({
                                       children,
                                       params,
                                   }: {
    children: ReactNode;
    params: { lang: Language };
}) {
    const { lang } = params;

    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Dreamli",
        legalName: "OmniTechs V.O.F.",
        url: "https://dreamli.nl",
        logo:
            "https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/48224f9cc1b0c55ac8c088f51f17f701.png",
        foundingDate: "2023-01-01",
        founders: [
            {
                "@type": "Person",
                name: "Seyed Sina Sadegh Esfahani",
                jobTitle: "Founder & CEO",
                sameAs: [
                    "https://www.linkedin.com/in/sina-sadegh-esfahani",
                    "https://dreamli.nl",
                ],
            },
        ],
        address: {
            "@type": "PostalAddress",
            streetAddress: "Resedastraat 39",
            postalCode: "9713 TN",
            addressLocality: "Groningen",
            addressRegion: "GR",
            addressCountry: "NL",
        },
        contactPoint: [
            {
                "@type": "ContactPoint",
                telephone: "+31645559587",
                email: "info@dreamli.nl",
                contactType: "Customer Support",
                availableLanguage: ["English", "Dutch", "German", "French", "Polish"],
                areaServed: "EU",
            },
        ],
        sameAs: [
            "https://www.instagram.com/dreamli",
            "https://www.linkedin.com/company/dreamli",
            "https://www.facebook.com/dreamli",
        ],
    };

    return (
        <html lang={lang}>
        <head>
            <meta name="google" content="notranslate" />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
            />
        </head>
        <body>{children}</body>
        </html>
    );
}
