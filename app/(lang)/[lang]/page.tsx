import { languages } from '@/config/i18n';
import HomePageComponent from "@/components/pages/HomePage";

export async function generateStaticParams() {
    // ✅ Return only string codes
    return languages.map(l => ({ lang: l.code }));
}

export default function HomePage({ params }: { params: { lang: string } }) {
    const { lang } = params;

    const titles: Record<string, string> = {
        en: 'Welcome to Dreamli',
        nl: 'Welkom bij Dreamli',
        de: 'Willkommen bei Dreamli',
        fr: 'Bienvenue chez Dreamli',
        pl: 'Witamy w Dreamli',
    };

    const descriptions: Record<string, string> = {
        en: 'Unique personalized gifts from children’s drawings.',
        nl: 'Unieke gepersonaliseerde cadeaus van kindertekeningen.',
        de: 'Einzigartige personalisierte Geschenke aus Kinderzeichnungen.',
        fr: 'Cadeaux personnalisés uniques à partir de dessins d’enfants.',
        pl: 'Unikalne spersonalizowane prezenty z rysunków dzieci.',
    };

    return <HomePageComponent />;
}
