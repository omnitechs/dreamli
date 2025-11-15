import type { Metadata } from 'next';
import { languages, languageCodes, type LanguageCode } from '@/config/i18n';
import { notFound } from 'next/navigation';
import { getTranslations, getMessages } from 'next-intl/server';

// Local per-language copy for the About page. This keeps changes minimal and
// doesn't require adding new message keys in the global messages/*.json files.
const copy: Record<LanguageCode, {
  metaTitle: string;
  metaDescription: string;
  hero: { title: string; subtitle: string };
  mission: { title: string; body: string };
  basedIn: { title: string; body: string; imageAlt: string };
  create: { titleA: string; titleB: string; subtitle: string };
  createCards: { title: string; text: string }[];
  eco: { title: string; body: string };
  source: { titleA: string; titleB: string; subtitle: string; imageAlt: string };
  sourceCards: { title: string; text: string }[];
  sourcingPartners: { title: string; body: string };
  why: { titleA: string; titleB: string; subtitle: string };
  whyCards: { title: string; text: string }[];
  ensures: { title: string; bullets: string[]; notePrefix: string; note: string };
  business: { titleA: string; titleB: string };
  legal: { title: string; subtitle: string; fields: { label: string; value: string }[]; disclaimer: string };
  shipping: { title: string; bullets: string[] };
  contactInfo: { title: string; companyLine: string };
  promise: { titleA: string; titleB: string; subtitle: string; cards: { title: string; text: string }[] };
  cta: { title: string; body: string; shop: string; contact: string };
}> = {
  en: {
    metaTitle: 'About Dreamli',
    metaDescription: 'A gift-focused online shop based in Groningen, the Netherlands. Our goal is simple: to make choosing a meaningful gift easy, personal, and enjoyable.',
    hero: {
      title: 'About Dreamli',
      subtitle: 'A gift-focused online shop based in Groningen, the Netherlands. Our goal is simple: to make choosing a meaningful gift easy, personal, and enjoyable.'
    },
    mission: {
      title: 'Our Mission',
      body: "We bring together two worlds to offer a complete gifting experience. Whether you're looking for something handmade in our workshop or carefully curated from trusted suppliers, we help you find a gift that feels personal."
    },
    basedIn: {
      title: 'Based in Groningen',
      body: 'Our workshop is located in the heart of the Netherlands, where we design and produce unique 3D-printed items with care and attention to detail.',
      imageAlt: 'Dreamli workshop in Groningen'
    },
    create: {
      titleA: 'What We',
      titleB: 'Create',
      subtitle: 'In our Groningen workshop, we design and produce a wide range of 3D-printed items'
    },
    createCards: [
      { title: 'Lamps & Mood Lights', text: 'Beautiful illuminated pieces that create the perfect ambiance' },
      { title: 'Vases & Planters', text: 'Elegant containers for your favorite plants and flowers' },
      { title: 'Home Décor Pieces', text: 'Unique decorative items to personalize your space' },
      { title: 'Personalized Gifts', text: 'Custom-made items tailored to your specific needs' },
      { title: 'Interior Accessories', text: 'Small details that make a big difference in your home' }
    ],
    eco: {
      title: 'Eco-Friendly Production',
      body: 'All prints are made using eco-friendly PLA+, produced fresh after each order, and hand-finished for clean results. Nothing sits in storage — every piece is made specifically for your order.'
    },
    source: {
      titleA: 'What We',
      titleB: 'Source',
      subtitle: 'To make Dreamli a full gift destination, we also offer carefully curated products from verified European wholesalers',
      imageAlt: 'Curated product collection'
    },
    sourceCards: [
      { title: 'Toys & Creative Play Items', text: 'Inspiring toys that spark imagination and creativity' },
      { title: 'Arts & Crafts', text: 'Everything needed for creative projects and artistic expression' },
      { title: 'Puzzles & Brain Games', text: 'Challenging and fun activities for all ages' },
      { title: 'Outdoor & Garden Décor', text: 'Beautiful pieces to enhance your outdoor spaces' },
      { title: 'Stationery & Lifestyle Products', text: 'Quality items for work, study, and everyday life' }
    ],
    sourcingPartners: {
      title: 'Our Sourcing Partners',
      body: 'These items are sourced from verified European wholesalers, including partners such as ArtBizniz and similar licensed distributors. We do not rebrand these items or claim exclusivity. We simply curate products that fit the creative, joyful, and gifting-focused spirit of Dreamli.'
    },
    why: {
      titleA: 'Why Delivery Takes',
      titleB: '5–10 Days',
      subtitle: 'Dreamli operates on a no-stock model for better quality and sustainability'
    },
    whyCards: [
      { title: 'Made to Order', text: 'All 3D-printed items are created specifically for your order, ensuring freshness and quality.' },
      { title: 'Fresh from Partners', text: 'All sourced items are picked fresh from our partner distributors for optimal condition.' },
      { title: 'Quality Checked', text: 'Each order is thoroughly quality-checked before shipping to ensure perfection.' }
    ],
    ensures: {
      title: 'This Model Ensures:',
      bullets: ['Lower waste', 'Fresh production', 'Better quality control', 'Clean packaging', 'More consistent results'],
      notePrefix: 'For customers:',
      note: 'This means delivery typically takes 5–10 days, depending on production and courier speed.'
    },
    business: { titleA: 'Our', titleB: 'Business Identity' },
    legal: {
      title: 'Legal Information',
      subtitle: 'Transparent business practices',
      fields: [
        { label: 'Trade Name:', value: 'Dreamli' },
        { label: 'Registered Company:', value: 'OmniTechs V.O.F.' },
        { label: 'RSIN:', value: '866537211' },
        { label: 'Location:', value: 'Groningen, The Netherlands' }
      ],
      disclaimer: 'All sales, payments, fulfillment, and customer support for Dreamli are handled by OmniTechs V.O.F. under the Dreamli brand. This ensures full transparency, legal clarity, and trust for both customers and partners.'
    },
    shipping: {
      title: 'Shipping & Returns',
      bullets: [
        'We ship across the European Union and the United States using PostNL, DHL, and UPS.',
        'Every order includes a track & trace link.',
        "We offer 30-day returns on all items, including customized 3D prints (as long as they're undamaged and properly packed)."
      ]
    },
    contactInfo: {
      title: 'Contact Information',
      companyLine: 'OmniTechs V.O.F. — Groningen, Netherlands'
    },
    promise: {
      titleA: 'Our',
      titleB: 'Promise',
      subtitle: "Our mission is to help you find a gift that feels personal — whether it's handmade in our workshop or carefully curated from trusted European suppliers.",
      cards: [
        { title: 'Transparent Practices', text: 'Honest business practices with clear information' },
        { title: 'Reliable Shipping', text: 'EU & USA shipping with tracking' },
        { title: 'High Quality', text: 'Verified products and fresh production' },
        { title: 'Real Support', text: 'Responsive customer service' }
      ]
    },
    cta: {
      title: 'Ready to find the perfect gift?',
      body: "Whether you need help choosing a gift, have custom requests, or have questions about your order, we're here to help.",
      shop: 'Visit Our Shop',
      contact: 'Contact Us'
    }
  },
  nl: {
    metaTitle: 'Over Dreamli',
    metaDescription: 'Een cadeaugerichte online winkel uit Groningen. Ons doel: het kiezen van een betekenisvol cadeau makkelijk, persoonlijk en leuk maken.',
    hero: {
      title: 'Over Dreamli',
      subtitle: 'Een cadeaugerichte online winkel uit Groningen, Nederland. Ons doel is simpel: een betekenisvol cadeau kiezen moet eenvoudig, persoonlijk en leuk zijn.'
    },
    mission: {
      title: 'Onze Missie',
      body: 'Wij brengen twee werelden samen voor een complete cadeau-ervaring. Handgemaakt in onze studio of zorgvuldig geselecteerd bij betrouwbare leveranciers — wij helpen je een persoonlijk cadeau te vinden.'
    },
    basedIn: {
      title: 'Gevestigd in Groningen',
      body: 'Onze studio ligt in het hart van Nederland, waar we unieke 3D-geprinte items ontwerpen en produceren met aandacht voor detail.',
      imageAlt: 'Dreamli-werkplaats in Groningen'
    },
    create: {
      titleA: 'Wat Wij',
      titleB: 'Maken',
      subtitle: 'In onze Groningse studio ontwerpen en produceren we een breed scala aan 3D-geprinte items'
    },
    createCards: [
      { title: 'Lampen & Sfeerverlichting', text: 'Prachtige lichtobjecten die de juiste sfeer creëren' },
      { title: 'Vazen & Plantenpotten', text: 'Elegante houders voor je favoriete bloemen en planten' },
      { title: 'Woondecoratie', text: 'Unieke decoratieve items om je ruimte te personaliseren' },
      { title: 'Gepersonaliseerde Cadeaus', text: 'Op maat gemaakte items afgestemd op jouw wensen' },
      { title: 'Interieuraccessoires', text: 'Kleine details met groot effect in huis' }
    ],
    eco: {
      title: 'Milieuvriendelijke Productie',
      body: 'Alle prints worden gemaakt met milieuvriendelijke PLA+, vers na elke bestelling en met de hand afgewerkt. Niets ligt op voorraad — elk stuk wordt speciaal voor jou gemaakt.'
    },
    source: {
      titleA: 'Wat Wij',
      titleB: 'Inkomen',
      subtitle: 'Om Dreamli een complete cadeaubestemming te maken, bieden we ook zorgvuldig geselecteerde producten van Europese groothandels.',
      imageAlt: 'Geselecteerde productcollectie'
    },
    sourceCards: [
      { title: 'Speelgoed & Creatief Spel', text: 'Inspirerend speelgoed dat verbeelding prikkelt' },
      { title: 'Knutselen & Hobby', text: 'Alles voor creatieve projecten en artistieke expressie' },
      { title: 'Puzzels & Breinspelletjes', text: 'Uitdagend en leuk voor alle leeftijden' },
      { title: 'Buiten- & Tuindecoratie', text: 'Mooie items voor je buitenruimte' },
      { title: 'Papierwaren & Lifestyle', text: 'Kwaliteitsproducten voor werk, studie en dagelijks gebruik' }
    ],
    sourcingPartners: {
      title: 'Onze Inkooppartners',
      body: 'Deze artikelen worden ingekocht bij geverifieerde Europese groothandels, waaronder partners zoals ArtBizniz en vergelijkbare licentiehouders. We rebranden niet en claimen geen exclusiviteit — we cureren simpelweg wat past bij de creatieve, vrolijke en cadeaugerichte geest van Dreamli.'
    },
    why: {
      titleA: 'Waarom Levertijd',
      titleB: '5–10 Dagen',
      subtitle: 'Dreamli werkt zonder voorraad voor betere kwaliteit en duurzaamheid'
    },
    whyCards: [
      { title: 'Op Bestelling Gemaakt', text: 'Alle 3D-prints worden speciaal voor jouw bestelling gemaakt — vers en van hoge kwaliteit.' },
      { title: 'Vers van Partners', text: 'Ingekochte items komen vers van onze distributeurs voor de beste conditie.' },
      { title: 'Kwaliteitscontrole', text: 'Elke bestelling wordt grondig gecontroleerd voor verzending.' }
    ],
    ensures: {
      title: 'Dit Model Zorgt Voor:',
      bullets: ['Minder afval', 'Verse productie', 'Betere kwaliteitscontrole', 'Schone verpakking', 'Consistentere resultaten'],
      notePrefix: 'Voor klanten:',
      note: 'De levering duurt meestal 5–10 dagen, afhankelijk van productie en bezorgdienst.'
    },
    business: { titleA: 'Onze', titleB: 'Bedrijfsidentiteit' },
    legal: {
      title: 'Juridische Informatie',
      subtitle: 'Transparante bedrijfsvoering',
      fields: [
        { label: 'Handelsnaam:', value: 'Dreamli' },
        { label: 'Ingeschreven bij:', value: 'OmniTechs V.O.F.' },
        { label: 'RSIN:', value: '866537211' },
        { label: 'Locatie:', value: 'Groningen, Nederland' }
      ],
      disclaimer: 'Alle verkoop, betalingen, fulfillment en klantenservice voor Dreamli worden uitgevoerd door OmniTechs V.O.F. onder het Dreamli-merk — voor volledige transparantie en vertrouwen.'
    },
    shipping: {
      title: 'Verzending & Retour',
      bullets: [
        'We verzenden binnen de EU en de VS met PostNL, DHL en UPS.',
        'Elke bestelling bevat een track & trace-link.',
        '30 dagen retour op alle items, ook maatwerk (onbeschadigd en goed verpakt).'
      ]
    },
    contactInfo: {
      title: 'Contactinformatie',
      companyLine: 'OmniTechs V.O.F. — Groningen, Nederland'
    },
    promise: {
      titleA: 'Onze',
      titleB: 'Belofte',
      subtitle: 'Onze missie: je helpen een persoonlijk cadeau te vinden — handgemaakt in onze studio of zorgvuldig geselecteerd bij betrouwbare Europese leveranciers.',
      cards: [
        { title: 'Transparante werkwijze', text: 'Eerlijke bedrijfsvoering met duidelijke informatie' },
        { title: 'Betrouwbare verzending', text: 'EU & VS-verzending met tracking' },
        { title: 'Hoge kwaliteit', text: 'Geverifieerde producten en verse productie' },
        { title: 'Echte support', text: 'Responsieve klantenservice' }
      ]
    },
    cta: {
      title: 'Klaar om het perfecte cadeau te vinden?',
      body: 'Zoek je hulp bij kiezen, heb je maatwerkverzoeken of vragen over je bestelling? We helpen je graag.',
      shop: 'Bezoek onze winkel',
      contact: 'Neem contact op'
    }
  },
  de: {
    metaTitle: 'Über Dreamli',
    metaDescription: 'Ein geschenkfokussierter Onlineshop aus Groningen, Niederlande. Unser Ziel: bedeutungsvolle Geschenke einfach, persönlich und angenehm machen.',
    hero: {
      title: 'Über Dreamli',
      subtitle: 'Ein geschenkfokussierter Onlineshop aus Groningen, Niederlande. Unser Ziel ist einfach: Die Wahl eines sinnvollen Geschenks soll leicht, persönlich und angenehm sein.'
    },
    mission: {
      title: 'Unsere Mission',
      body: 'Wir verbinden zwei Welten, um ein ganzheitliches Schenkerlebnis zu bieten. Handgemacht in unserer Werkstatt oder sorgfältig kuratiert von vertrauenswürdigen Anbietern — wir helfen dir, ein persönliches Geschenk zu finden.'
    },
    basedIn: {
      title: 'Sitz in Groningen',
      body: 'Unsere Werkstatt befindet sich im Herzen der Niederlande, wo wir einzigartige 3D-gedruckte Teile mit Sorgfalt und Liebe zum Detail herstellen.',
      imageAlt: 'Dreamli-Werkstatt in Groningen'
    },
    create: {
      titleA: 'Was wir',
      titleB: 'Herstellen',
      subtitle: 'In unserer Groninger Werkstatt entwerfen und produzieren wir eine große Bandbreite 3D-gedruckter Artikel'
    },
    createCards: [
      { title: 'Lampen & Stimmungslichter', text: 'Schöne Lichtobjekte für die perfekte Atmosphäre' },
      { title: 'Vasen & Pflanzgefäße', text: 'Elegante Behälter für Blumen und Pflanzen' },
      { title: 'Wohnaccessoires', text: 'Einzigartige Deko, um deinen Raum zu personalisieren' },
      { title: 'Personalisierte Geschenke', text: 'Maßgefertigte Artikel nach deinen Wünschen' },
      { title: 'Interieur-Accessoires', text: 'Kleine Details mit großer Wirkung' }
    ],
    eco: {
      title: 'Umweltfreundliche Produktion',
      body: 'Alle Drucke entstehen mit umweltfreundlichem PLA+, frisch nach jeder Bestellung und von Hand sauber veredelt. Nichts liegt auf Lager — jedes Stück wird speziell für dich gefertigt.'
    },
    source: {
      titleA: 'Was wir',
      titleB: 'Einkaufen',
      subtitle: 'Als komplette Geschenkadresse bieten wir auch sorgfältig kuratierte Produkte von geprüften europäischen Großhändlern.',
      imageAlt: 'Kuratiertes Produktsortiment'
    },
    sourceCards: [
      { title: 'Spielzeug & Kreatives Spielen', text: 'Inspirierendes Spielzeug für Fantasie und Kreativität' },
      { title: 'Kunst & Basteln', text: 'Alles für kreative Projekte und künstlerischen Ausdruck' },
      { title: 'Puzzles & Knobelspiele', text: 'Anspruchsvoll und unterhaltsam für alle Altersgruppen' },
      { title: 'Outdoor- & Gartendeko', text: 'Schöne Stücke für Außenbereiche' },
      { title: 'Papeterie & Lifestyle', text: 'Qualitätsartikel für Arbeit, Studium und Alltag' }
    ],
    sourcingPartners: {
      title: 'Unsere Beschaffungspartner',
      body: 'Diese Artikel stammen von verifizierten europäischen Großhändlern, darunter Partner wie ArtBizniz und ähnliche Lizenzhändler. Wir rebranden nicht und beanspruchen keine Exklusivität — wir kuratieren, was zum kreativen, fröhlichen und geschenkzentrierten Geist von Dreamli passt.'
    },
    why: {
      titleA: 'Warum die Lieferung',
      titleB: '5–10 Tage dauert',
      subtitle: 'Dreamli arbeitet ohne Lagerbestand — für Qualität und Nachhaltigkeit'
    },
    whyCards: [
      { title: 'Auf Bestellung gefertigt', text: 'Alle 3D-Drucke werden speziell für deine Bestellung produziert — frisch und hochwertig.' },
      { title: 'Frisch von Partnern', text: 'Eingekaufte Artikel kommen frisch von unseren Distributoren.' },
      { title: 'Qualitätsgeprüft', text: 'Jede Bestellung wird vor dem Versand gründlich geprüft.' }
    ],
    ensures: {
      title: 'Dieses Modell sorgt für:',
      bullets: ['Weniger Abfall', 'Frische Produktion', 'Bessere Qualitätskontrolle', 'Saubere Verpackung', 'Konstantere Ergebnisse'],
      notePrefix: 'Für Kund:innen:',
      note: 'Die Lieferung dauert in der Regel 5–10 Tage — je nach Produktion und Versanddienst.'
    },
    business: { titleA: 'Unsere', titleB: 'Unternehmensidentität' },
    legal: {
      title: 'Rechtliche Informationen',
      subtitle: 'Transparente Geschäftspraktiken',
      fields: [
        { label: 'Handelsname:', value: 'Dreamli' },
        { label: 'Eingetragenes Unternehmen:', value: 'OmniTechs V.O.F.' },
        { label: 'RSIN:', value: '866537211' },
        { label: 'Standort:', value: 'Groningen, Niederlande' }
      ],
      disclaimer: 'Alle Verkäufe, Zahlungen, die Abwicklung und der Support für Dreamli werden von OmniTechs V.O.F. unter der Marke Dreamli durchgeführt — für volle Transparenz und Vertrauen.'
    },
    shipping: {
      title: 'Versand & Rückgabe',
      bullets: [
        'Versand in der EU und den USA mit PostNL, DHL und UPS.',
        'Jede Bestellung enthält eine Sendungsverfolgung.',
        '30 Tage Rückgabe auf alle Artikel, auch Maßanfertigungen (unbeschädigt und gut verpackt).'
      ]
    },
    contactInfo: {
      title: 'Kontaktinformationen',
      companyLine: 'OmniTechs V.O.F. — Groningen, Niederlande'
    },
    promise: {
      titleA: 'Unser',
      titleB: 'Versprechen',
      subtitle: 'Unsere Mission: Dir zu helfen, ein persönliches Geschenk zu finden — handgemacht in unserer Werkstatt oder sorgfältig kuratiert von vertrauenswürdigen europäischen Partnern.',
      cards: [
        { title: 'Transparente Praxis', text: 'Ehrliche Geschäftspraktiken mit klaren Informationen' },
        { title: 'Zuverlässiger Versand', text: 'Versand in EU & USA mit Sendungsverfolgung' },
        { title: 'Hohe Qualität', text: 'Geprüfte Produkte und frische Produktion' },
        { title: 'Echter Support', text: 'Reaktionsschneller Kundendienst' }
      ]
    },
    cta: {
      title: 'Bereit für das perfekte Geschenk?',
      body: 'Braucht du Hilfe bei der Auswahl, individuelle Wünsche oder Fragen zur Bestellung? Wir helfen gerne.',
      shop: 'Shop besuchen',
      contact: 'Kontaktiere uns'
    }
  },
  fr: {
    metaTitle: 'À propos de Dreamli',
    metaDescription: "Boutique en ligne dédiée aux cadeaux basée à Groningue, Pays-Bas. Notre mission : rendre le choix d’un cadeau significatif simple, personnel et agréable.",
    hero: {
      title: 'À propos de Dreamli',
      subtitle: "Une boutique cadeaux basée à Groningue, aux Pays-Bas. Notre objectif est simple : choisir un cadeau qui compte doit être facile, personnel et plaisant."
    },
    mission: {
      title: 'Notre Mission',
      body: 'Nous réunissons deux univers pour une expérience cadeau complète. Fait main dans notre atelier ou soigneusement sélectionné auprès de fournisseurs de confiance — nous vous aidons à trouver un cadeau qui a du sens.'
    },
    basedIn: {
      title: 'Basé à Groningue',
      body: 'Notre atelier est au cœur des Pays-Bas, où nous concevons et produisons des objets 3D uniques avec soin et précision.',
      imageAlt: 'Atelier Dreamli à Groningue'
    },
    create: {
      titleA: 'Ce que nous',
      titleB: 'Créons',
      subtitle: 'Dans notre atelier de Groningue, nous concevons et produisons une large gamme d’objets imprimés en 3D'
    },
    createCards: [
      { title: 'Lampes & lumières d’ambiance', text: 'De belles pièces lumineuses pour créer l’ambiance parfaite' },
      { title: 'Vases & cache-pots', text: 'Des contenants élégants pour vos fleurs et plantes' },
      { title: 'Décoration intérieure', text: 'Des objets uniques pour personnaliser votre espace' },
      { title: 'Cadeaux personnalisés', text: 'Des pièces sur mesure adaptées à vos besoins' },
      { title: 'Accessoires d’intérieur', text: 'De petits détails qui font une grande différence chez vous' }
    ],
    eco: {
      title: 'Production écoresponsable',
      body: 'Toutes les impressions sont réalisées en PLA+ écologique, fraîchement produites après chaque commande et finies à la main. Rien n’est stocké — chaque pièce est faite spécialement pour vous.'
    },
    source: {
      titleA: 'Ce que nous',
      titleB: 'Sourçons',
      subtitle: 'Pour faire de Dreamli une destination cadeau complète, nous proposons aussi des produits soigneusement sélectionnés auprès de grossistes européens vérifiés.',
      imageAlt: 'Sélection de produits'
    },
    sourceCards: [
      { title: 'Jouets & jeux créatifs', text: 'Des jouets qui stimulent l’imagination et la créativité' },
      { title: 'Arts & loisirs créatifs', text: 'Tout le nécessaire pour des projets créatifs' },
      { title: 'Puzzles & casse-têtes', text: 'Stimulants et ludiques pour tous les âges' },
      { title: 'Décor extérieur & jardin', text: 'De belles pièces pour vos espaces extérieurs' },
      { title: 'Papeterie & lifestyle', text: 'Des articles de qualité pour le travail et le quotidien' }
    ],
    sourcingPartners: {
      title: 'Nos partenaires d’approvisionnement',
      body: "Ces produits proviennent de grossistes européens vérifiés, dont ArtBizniz et d’autres distributeurs licenciés. Nous ne rebrandons pas et ne revendiquons aucune exclusivité — nous sélectionnons ce qui correspond à l’esprit créatif, joyeux et orienté cadeaux de Dreamli."
    },
    why: {
      titleA: 'Pourquoi la livraison prend',
      titleB: '5–10 jours',
      subtitle: 'Dreamli fonctionne sans stock pour plus de qualité et de durabilité'
    },
    whyCards: [
      { title: 'Fabriqué à la commande', text: 'Chaque objet imprimé en 3D est créé spécialement pour votre commande.' },
      { title: 'Frais de nos partenaires', text: 'Les articles sourcés arrivent directement de nos distributeurs.' },
      { title: 'Contrôle qualité', text: 'Chaque commande est contrôlée avant expédition.' }
    ],
    ensures: {
      title: 'Ce modèle garantit :',
      bullets: ['Moins de déchets', 'Production fraîche', 'Meilleur contrôle qualité', 'Emballage propre', 'Résultats plus constants'],
      notePrefix: 'Pour les clients :',
      note: 'La livraison prend généralement 5–10 jours selon la production et le transporteur.'
    },
    business: { titleA: 'Notre', titleB: 'Identité d’entreprise' },
    legal: {
      title: 'Informations légales',
      subtitle: 'Pratiques commerciales transparentes',
      fields: [
        { label: 'Nom commercial :', value: 'Dreamli' },
        { label: 'Société enregistrée :', value: 'OmniTechs V.O.F.' },
        { label: 'RSIN :', value: '866537211' },
        { label: 'Localisation :', value: 'Groningue, Pays-Bas' }
      ],
      disclaimer: 'Les ventes, paiements, exécution et support client de Dreamli sont assurés par OmniTechs V.O.F. sous la marque Dreamli — gage de transparence et de confiance.'
    },
    shipping: {
      title: 'Expédition & retours',
      bullets: [
        'Expédition UE et USA via PostNL, DHL et UPS.',
        'Chaque commande inclut un lien de suivi.',
        'Retours sous 30 jours sur tous les articles, y compris personnalisés (intacts et bien emballés).'
      ]
    },
    contactInfo: {
      title: 'Informations de contact',
      companyLine: 'OmniTechs V.O.F. — Groningue, Pays-Bas'
    },
    promise: {
      titleA: 'Notre',
      titleB: 'Promesse',
      subtitle: 'Notre mission : vous aider à trouver un cadeau personnel — fait main dans notre atelier ou soigneusement sélectionné auprès de partenaires européens de confiance.',
      cards: [
        { title: 'Pratiques transparentes', text: 'Des pratiques honnêtes avec une information claire' },
        { title: 'Expédition fiable', text: 'Livraison UE & USA avec suivi' },
        { title: 'Haute qualité', text: 'Produits vérifiés et production fraîche' },
        { title: 'Support réel', text: 'Service client réactif' }
      ]
    },
    cta: {
      title: 'Prêt à trouver le cadeau parfait ?',
      body: 'Besoin d’aide pour choisir, de demandes sur mesure ou de questions ? Nous sommes là pour vous.',
      shop: 'Visiter la boutique',
      contact: 'Nous contacter'
    }
  },
  pl: {
    metaTitle: 'O Dreamli',
    metaDescription: 'Sklep internetowy z prezentami z siedzibą w Groningen. Nasz cel: aby wybór znaczącego prezentu był łatwy, osobisty i przyjemny.',
    hero: {
      title: 'O Dreamli',
      subtitle: 'Sklep z prezentami z Groningen, Holandia. Nasz cel jest prosty: wybór prezentu ma być łatwy, osobisty i przyjemny.'
    },
    mission: {
      title: 'Nasza Misja',
      body: 'Łączymy dwa światy, aby zaoferować pełne doświadczenie prezentowe. Rękodzieło z naszej pracowni lub starannie wybrane produkty — pomożemy znaleźć prezent, który naprawdę pasuje.'
    },
    basedIn: {
      title: 'Siedziba w Groningen',
      body: 'Nasza pracownia znajduje się w sercu Holandii, gdzie z troską i precyzją tworzymy unikalne wydruki 3D.',
      imageAlt: 'Pracownia Dreamli w Groningen'
    },
    create: {
      titleA: 'Co',
      titleB: 'Tworzymy',
      subtitle: 'W naszej pracowni w Groningen projektujemy i produkujemy szeroką gamę przedmiotów drukowanych w 3D'
    },
    createCards: [
      { title: 'Lampy i światła nastrojowe', text: 'Piękne, podświetlane elementy tworzące idealny klimat' },
      { title: 'Wazony i doniczki', text: 'Eleganckie pojemniki na kwiaty i rośliny' },
      { title: 'Dekoracje do domu', text: 'Unikalne ozdoby personalizujące przestrzeń' },
      { title: 'Prezenty personalizowane', text: 'Produkty na zamówienie, dopasowane do Twoich potrzeb' },
      { title: 'Akcesoria do wnętrz', text: 'Małe detale robiące dużą różnicę' }
    ],
    eco: {
      title: 'Przyjazna środowisku produkcja',
      body: 'Wszystkie wydruki powstają z ekologicznego PLA+, świeżo po złożeniu zamówienia, a następnie są ręcznie wykończane. Nic nie leży na magazynie — każdy element powstaje specjalnie dla Ciebie.'
    },
    source: {
      titleA: 'Co',
      titleB: 'Sprowadzamy',
      subtitle: 'Aby Dreamli było kompletnym miejscem na prezenty, oferujemy też starannie wybrane produkty od sprawdzonych europejskich hurtowników.',
      imageAlt: 'Wyselekcjonowana kolekcja produktów'
    },
    sourceCards: [
      { title: 'Zabawki i kreatywna zabawa', text: 'Zabawki pobudzające wyobraźnię i kreatywność' },
      { title: 'Sztuka i rękodzieło', text: 'Wszystko do kreatywnych projektów' },
      { title: 'Puzzle i łamigłówki', text: 'Wyzwanie i zabawa dla każdego wieku' },
      { title: 'Dekoracje ogrodowe', text: 'Piękne elementy do przestrzeni na zewnątrz' },
      { title: 'Papiernicze i lifestyle', text: 'Jakościowe przedmioty do pracy i nauki' }
    ],
    sourcingPartners: {
      title: 'Nasi partnerzy zakupowi',
      body: 'Produkty pochodzą od zweryfikowanych europejskich hurtowników, m.in. ArtBizniz i podobnych licencjonowanych dystrybutorów. Nie rebrandujemy i nie rościmy sobie wyłączności — selekcjonujemy to, co pasuje do kreatywnego, radosnego, prezentowego ducha Dreamli.'
    },
    why: {
      titleA: 'Dlaczego dostawa trwa',
      titleB: '5–10 dni',
      subtitle: 'Działamy bez magazynu — dla lepszej jakości i zrównoważenia'
    },
    whyCards: [
      { title: 'Na zamówienie', text: 'Wszystkie wydruki 3D powstają konkretnie dla Twojego zamówienia.' },
      { title: 'Świeżo od partnerów', text: 'Sprowadzane produkty trafiają prosto od naszych dystrybutorów.' },
      { title: 'Kontrola jakości', text: 'Każde zamówienie jest dokładnie sprawdzane przed wysyłką.' }
    ],
    ensures: {
      title: 'Ten model zapewnia:',
      bullets: ['Mniej odpadów', 'Świeża produkcja', 'Lepsza kontrola jakości', 'Czyste pakowanie', 'Bardziej spójne wyniki'],
      notePrefix: 'Dla klientów:',
      note: 'Dostawa zwykle zajmuje 5–10 dni, zależnie od produkcji i kuriera.'
    },
    business: { titleA: 'Nasza', titleB: 'Tożsamość firmy' },
    legal: {
      title: 'Informacje prawne',
      subtitle: 'Przejrzyste praktyki biznesowe',
      fields: [
        { label: 'Nazwa handlowa:', value: 'Dreamli' },
        { label: 'Zarejestrowana spółka:', value: 'OmniTechs V.O.F.' },
        { label: 'RSIN:', value: '866537211' },
        { label: 'Lokalizacja:', value: 'Groningen, Holandia' }
      ],
      disclaimer: 'Sprzedaż, płatności, realizacja i obsługa klienta dla Dreamli są prowadzone przez OmniTechs V.O.F. pod marką Dreamli — w pełnej przejrzystości i zaufaniu.'
    },
    shipping: {
      title: 'Wysyłka i zwroty',
      bullets: [
        'Wysyłka w UE i USA z PostNL, DHL i UPS.',
        'Każde zamówienie zawiera link śledzenia.',
        '30 dni na zwrot wszystkich produktów, także personalizowanych (nienaruszonych i dobrze zapakowanych).'
      ]
    },
    contactInfo: {
      title: 'Informacje kontaktowe',
      companyLine: 'OmniTechs V.O.F. — Groningen, Holandia'
    },
    promise: {
      titleA: 'Nasza',
      titleB: 'Obietnica',
      subtitle: 'Nasza misja: pomóc Ci znaleźć osobisty prezent — wykonany ręcznie w naszej pracowni lub starannie wybrany od zaufanych europejskich partnerów.',
      cards: [
        { title: 'Przejrzyste zasady', text: 'Uczciwe praktyki biznesowe i jasne informacje' },
        { title: 'Niezawodna wysyłka', text: 'Dostawa do UE i USA z numerem śledzenia' },
        { title: 'Wysoka jakość', text: 'Zweryfikowane produkty i świeża produkcja' },
        { title: 'Prawdziwe wsparcie', text: 'Responsywna obsługa klienta' }
      ]
    },
    cta: {
      title: 'Gotowy na idealny prezent?',
      body: 'Pomożemy wybrać prezent, zrealizować zamówienie na miarę i odpowiemy na pytania.',
      shop: 'Odwiedź sklep',
      contact: 'Skontaktuj się'
    }
  }
};

export async function generateMetadata(
  props: { params: Promise<{ lang: LanguageCode }> }
): Promise<Metadata> {
  const { lang } = await props.params;
  if (!languageCodes.includes(lang)) notFound();

  const t = await getTranslations({ locale: lang, namespace: 'About' });

  return {
    metadataBase: new URL('https://dreamli.nl'),
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: `/${lang}/about`,
      languages: Object.fromEntries(
        languages.map(l => [l.code, `/${l.code}/about`])
      )
    },
    openGraph: {
      title: t('metaTitle'),
      description: t('metaDescription'),
      url: `/${lang}/about`,
      siteName: 'Dreamli',
      locale: lang,
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: t('metaTitle'),
      description: t('metaDescription')
    },
    robots: { index: true, follow: true }
  };
}

export default async function AboutPage(
  props: { params: Promise<{ lang: LanguageCode }> }
) {
  const { lang } = await props.params;
  const messages = await getMessages({ locale: lang });
  const c = (messages as any).About;

  // Safely highlight the brand name inside the hero title without coercing JSX to string
  const renderHighlightedBrand = (title: string) => {
    const token = 'Dreamli';
    const parts = title.split(token);
    if (parts.length === 1) return title;
    return (
      <>
        {parts.map((part, i) => (
          <span key={i}>
            {i > 0 && <span className="text-[#8472DF]">Dreamli</span>}
            {part}
          </span>
        ))}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#DBEAFE]/20 to-[#F3E8FF]/20 py-16 sm:py-24 lg:py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2E2E2E] leading-tight mb-6">
                {renderHighlightedBrand(c.hero.title)}
              </h1>
              <p className="text-xl text-[#2E2E2E]/80 max-w-4xl mx-auto leading-relaxed">
                {c.hero.subtitle}
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <h2 className="text-2xl font-bold text-[#2E2E2E] mb-4">{c.mission.title}</h2>
                  <p className="text-[#2E2E2E]/70 leading-relaxed">
                    {c.mission.body}
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-[#F8F9FF] to-[#F3E8FF]/50 rounded-2xl p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-[#8472DF] rounded-full flex items-center justify-center">
                      <i className="ri-map-pin-line text-white text-lg w-5 h-5 flex items-center justify-center"></i>
                    </div>
                    <h3 className="text-xl font-bold text-[#2E2E2E]">{c.basedIn.title}</h3>
                  </div>
                  <p className="text-[#2E2E2E]/70">
                    {c.basedIn.body}
                  </p>
                </div>
              </div>
              
              <div className="relative">
                <img 
                  src="https://readdy.ai/api/search-image?query=Modern%203D%20printing%20workshop%20in%20Groningen%20Netherlands%2C%20clean%20and%20organized%20workspace%20with%20multiple%203D%20printers%20creating%20colorful%20objects%2C%20bright%20natural%20lighting%2C%20professional%20equipment%2C%20eco-friendly%20materials%2C%20creative%20atmosphere%2C%20high-tech%20manufacturing%20environment&width=600&height=500&seq=groningen-workshop&orientation=landscape"
                  alt={c.basedIn.imageAlt}
                  className="w-full h-[500px] rounded-2xl object-cover shadow-2xl"
                />
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br from-[#8472DF] to-[#93C4FF] rounded-full opacity-80 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Create Section */}
      <section className="py-16 sm:py-24 lg:py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-[#2E2E2E] mb-6 leading-tight">
                {c.create.titleA} <span className="text-[#8472DF]">{c.create.titleB}</span>
              </h2>
              <p className="text-xl text-[#2E2E2E]/80 max-w-4xl mx-auto leading-relaxed">
                {c.create.subtitle}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {/* 5 cards */}
              <div className="bg-gradient-to-br from-[#F8F9FF] to-[#F3E8FF]/50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-[#8472DF] rounded-xl flex items-center justify-center mb-4">
                  <i className="ri-lightbulb-line text-white text-xl w-6 h-6 flex items-center justify-center"></i>
                </div>
                <h3 className="text-lg font-bold text-[#2E2E2E] mb-2">{c.createCards[0].title}</h3>
                <p className="text-[#2E2E2E]/70 text-sm">{c.createCards[0].text}</p>
              </div>

              <div className="bg-gradient-to-br from-[#F8F9FF] to-[#DBEAFE]/30 rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-[#93C4FF] rounded-xl flex items-center justify-center mb-4">
                  <i className="ri-plant-line text-white text-xl w-6 h-6 flex items-center justify-center"></i>
                </div>
                <h3 className="text-lg font-bold text-[#2E2E2E] mb-2">{c.createCards[1].title}</h3>
                <p className="text-[#2E2E2E]/70 text-sm">{c.createCards[1].text}</p>
              </div>

              <div className="bg-gradient-to-br from-[#F8F9FF] to-[#ACEEF3]/20 rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-[#ACEEF3] rounded-xl flex items-center justify-center mb-4">
                  <i className="ri-home-4-line text-white text-xl w-6 h-6 flex items-center justify-center"></i>
                </div>
                <h3 className="text-lg font-bold text-[#2E2E2E] mb-2">{c.createCards[2].title}</h3>
                <p className="text-[#2E2E2E]/70 text-sm">{c.createCards[2].text}</p>
              </div>

              <div className="bg-gradient-to-br from-[#F8F9FF] to-[#FFB067]/20 rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-[#FFB067] rounded-xl flex items-center justify-center mb-4">
                  <i className="ri-gift-2-line text-white text-xl w-6 h-6 flex items-center justify-center"></i>
                </div>
                <h3 className="text-lg font-bold text-[#2E2E2E] mb-2">{c.createCards[3].title}</h3>
                <p className="text-[#2E2E2E]/70 text-sm">{c.createCards[3].text}</p>
              </div>

              <div className="bg-gradient-to-br from-[#F8F9FF] to-[#F3E8FF]/50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-[#8472DF] rounded-xl flex items-center justify-center mb-4">
                  <i className="ri-palette-line text-white text-xl w-6 h-6 flex items-center justify-center"></i>
                </div>
                <h3 className="text-lg font-bold text-[#2E2E2E] mb-2">{c.createCards[4].title}</h3>
                <p className="text-[#2E2E2E]/70 text-sm">{c.createCards[4].text}</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#8472DF]/10 to-[#93C4FF]/10 rounded-2xl p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#8472DF] to-[#93C4FF] rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className="ri-leaf-line text-white text-xl w-6 h-6 flex items-center justify-center"></i>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#2E2E2E] mb-2">{c.eco.title}</h3>
                  <p className="text-[#2E2E2E]/70 leading-relaxed">
                    {c.eco.body}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Source Section */}
      <section className="py-16 sm:py-24 lg:py-32 bg-gradient-to-br from-[#F3E8FF]/30 to-[#DBEAFE]/20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-[#2E2E2E] mb-6 leading-tight">
                {c.source.titleA} <span className="text-[#8472DF]">{c.source.titleB}</span>
              </h2>
              <p className="text-xl text-[#2E2E2E]/80 max-w-4xl mx-auto leading-relaxed">
                {c.source.subtitle}
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="relative">
                <img 
                  src="https://readdy.ai/api/search-image?query=Curated%20collection%20of%20creative%20toys%2C%20arts%20and%20crafts%20supplies%2C%20puzzles%20and%20brain%20games%2C%20outdoor%20garden%20decor%2C%20stationery%20and%20lifestyle%20products%2C%20organized%20display%20in%20modern%20European%20warehouse%2C%20bright%20and%20colorful%20products%2C%20professional%20product%20photography&width=600&height=500&seq=sourced-products&orientation=landscape"
                  alt={c.source.imageAlt}
                  className="w-full h-[500px] rounded-2xl object-cover shadow-2xl"
                />
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-[#FFB067] to-[#8472DF] rounded-full opacity-80 animate-bounce"></div>
              </div>

              <div className="space-y-6">
                {/* 5 bullets/cards */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#8472DF] rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="ri-gamepad-line text-white text-lg w-5 h-5 flex items-center justify-center"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#2E2E2E] mb-1">{c.sourceCards[0].title}</h3>
                    <p className="text-[#2E2E2E]/70 text-sm">{c.sourceCards[0].text}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#93C4FF] rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="ri-brush-line text-white text-lg w-5 h-5 flex items-center justify-center"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#2E2E2E] mb-1">{c.sourceCards[1].title}</h3>
                    <p className="text-[#2E2E2E]/70 text-sm">{c.sourceCards[1].text}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#ACEEF3] rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="ri-puzzle-line text-white text-lg w-5 h-5 flex items-center justify-center"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#2E2E2E] mb-1">{c.sourceCards[2].title}</h3>
                    <p className="text-[#2E2E2E]/70 text-sm">{c.sourceCards[2].text}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#FFB067] rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="ri-plant-fill text-white text-lg w-5 h-5 flex items-center justify-center"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#2E2E2E] mb-1">{c.sourceCards[3].title}</h3>
                    <p className="text-[#2E2E2E]/70 text-sm">{c.sourceCards[3].text}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#8472DF] rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="ri-pencil-line text-white text-lg w-5 h-5 flex items-center justify-center"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#2E2E2E] mb-1">{c.sourceCards[4].title}</h3>
                    <p className="text-[#2E2E2E]/70 text-sm">{c.sourceCards[4].text}</p>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <h4 className="font-bold text-[#2E2E2E] mb-2">{c.sourcingPartners.title}</h4>
                  <p className="text-[#2E2E2E]/70 text-sm leading-relaxed">
                    {c.sourcingPartners.body}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why 5-10 Days Section */}
      <section className="py-16 sm:py-24 lg:py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-[#2E2E2E] mb-6 leading-tight">
                {c.why.titleA} <span className="text-[#8472DF]">{c.why.titleB}</span>
              </h2>
              <p className="text-xl text-[#2E2E2E]/80 max-w-4xl mx-auto leading-relaxed">
                {c.why.subtitle}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#8472DF] to-[#93C4FF] rounded-xl flex items-center justify-center flex-shrink-0">
                    <i className="ri-printer-line text-white text-xl w-6 h-6 flex items-center justify-center"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#2E2E2E] mb-2">{c.whyCards[0].title}</h3>
                    <p className="text-[#2E2E2E]/70">
                      {c.whyCards[0].text}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#93C4FF] to-[#ACEEF3] rounded-xl flex items-center justify-center flex-shrink-0">
                    <i className="ri-hand-heart-line text-white text-xl w-6 h-6 flex items-center justify-center"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#2E2E2E] mb-2">{c.whyCards[1].title}</h3>
                    <p className="text-[#2E2E2E]/70">
                      {c.whyCards[1].text}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#ACEEF3] to-[#FFB067] rounded-xl flex items-center justify-center flex-shrink-0">
                    <i className="ri-shield-check-line text-white text-xl w-6 h-6 flex items-center justify-center"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#2E2E2E] mb-2">{c.whyCards[2].title}</h3>
                    <p className="text-[#2E2E2E]/70">
                      {c.whyCards[2].text}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#F8F9FF] to-[#F3E8FF]/50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-[#2E2E2E] mb-6">{c.ensures.title}</h3>
                <div className="space-y-4">
                  {c.ensures.bullets.map((b, i) => (
                    <div className="flex items-center gap-3" key={i}>
                      <i className="ri-check-line text-[#8472DF] text-xl w-6 h-6 flex items-center justify-center"></i>
                      <span className="text-[#2E2E2E] font-medium">{b}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-white rounded-xl">
                  <p className="text-[#2E2E2E]/70 text-sm">
                    <strong>{c.ensures.notePrefix}</strong> {c.ensures.note}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Identity Section */}
      <section className="py-16 sm:py-24 lg:py-32 bg-gradient-to-br from-[#F3E8FF]/30 to-[#DBEAFE]/20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-[#2E2E2E] mb-6 leading-tight">
                {c.business.titleA} <span className="text-[#8472DF]">{c.business.titleB}</span>
              </h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="bg-white rounded-2xl p-8 shadow-xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#8472DF] to-[#93C4FF] rounded-2xl flex items-center justify-center">
                    <i className="ri-building-2-line text-white text-2xl w-8 h-8 flex items-center justify-center"></i>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#2E2E2E]">{c.legal.title}</h3>
                    <p className="text-[#2E2E2E]/60">{c.legal.subtitle}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {c.legal.fields.map((f, i) => (
                    <div className="flex items-start gap-3" key={i}>
                      <i className="ri-store-line text-[#8472DF] text-lg w-5 h-5 flex items-center justify-center mt-1"></i>
                      <div>
                        <p className="font-semibold text-[#2E2E2E]">{f.label}</p>
                        <p className="text-[#2E2E2E]/70">{f.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-gradient-to-r from-[#8472DF]/10 to-[#93C4FF]/10 rounded-xl">
                  <p className="text-[#2E2E2E]/70 text-sm leading-relaxed">
                    {c.legal.disclaimer}
                  </p>
                </div>
              </div>

              <div className="space-y-8">
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-[#8472DF] rounded-full flex items-center justify-center">
                      <i className="ri-truck-line text-white text-lg w-5 h-5 flex items-center justify-center"></i>
                    </div>
                    <h3 className="text-xl font-bold text-[#2E2E2E]">{c.shipping.title}</h3>
                  </div>
                  <div className="space-y-3 text-[#2E2E2E]/70">
                    {c.shipping.bullets.map((s, i) => (
                      <p key={i}>{s}</p>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-[#93C4FF] rounded-full flex items-center justify-center">
                      <i className="ri-phone-line text-white text-lg w-5 h-5 flex items-center justify-center"></i>
                    </div>
                    <h3 className="text-xl font-bold text-[#2E2E2E]">{c.contactInfo.title}</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <i className="ri-mail-line text-[#8472DF] text-lg w-5 h-5 flex items-center justify-center"></i>
                      <a href="mailto:info@dreamli.nl" className="text-[#8472DF] hover:text-[#8472DF]/80 transition-colors">info@dreamli.nl</a>
                    </div>
                    <div className="flex items-center gap-3">
                      <i className="ri-global-line text-[#8472DF] text-lg w-5 h-5 flex items-center justify-center"></i>
                      <a href="https://dreamli.nl" className="text-[#8472DF] hover:text-[#8472DF]/80 transition-colors">https://dreamli.nl</a>
                    </div>
                    <div className="flex items-center gap-3">
                      <i className="ri-building-2-line text-[#8472DF] text-lg w-5 h-5 flex items-center justify-center"></i>
                      <span className="text-[#2E2E2E]/70">{c.contactInfo.companyLine}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Promise Section */}
      <section className="py-16 sm:py-24 lg:py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-[#2E2E2E] mb-6 leading-tight">
                {c.promise.titleA} <span className="text-[#8472DF]">{c.promise.titleB}</span>
              </h2>
              <p className="text-xl text-[#2E2E2E]/80 max-w-4xl mx-auto leading-relaxed">
                {c.promise.subtitle}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {c.promise.cards.map((card, idx) => (
                <div key={idx} className={
                  idx === 0
                    ? 'bg-gradient-to-br from-[#F8F9FF] to-[#F3E8FF]/50 rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300'
                    : idx === 1
                    ? 'bg-gradient-to-br from-[#F8F9FF] to-[#DBEAFE]/30 rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300'
                    : idx === 2
                    ? 'bg-gradient-to-br from-[#F8F9FF] to-[#ACEEF3]/20 rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300'
                    : 'bg-gradient-to-br from-[#F8F9FF] to-[#FFB067]/20 rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300'
                }>
                  <div className={
                    idx === 0
                      ? 'w-16 h-16 bg-[#8472DF] rounded-2xl flex items-center justify-center mx-auto mb-4'
                      : idx === 1
                      ? 'w-16 h-16 bg-[#93C4FF] rounded-2xl flex items-center justify-center mx-auto mb-4'
                      : idx === 2
                      ? 'w-16 h-16 bg-[#ACEEF3] rounded-2xl flex items-center justify-center mx-auto mb-4'
                      : 'w-16 h-16 bg-[#FFB067] rounded-2xl flex items-center justify-center mx-auto mb-4'
                  }>
                    <i className={
                      idx === 0
                        ? 'ri-shield-check-line text-white text-2xl w-8 h-8 flex items-center justify-center'
                        : idx === 1
                        ? 'ri-truck-line text-white text-2xl w-8 h-8 flex items-center justify-center'
                        : idx === 2
                        ? 'ri-star-line text-white text-2xl w-8 h-8 flex items-center justify-center'
                        : 'ri-customer-service-2-line text-white text-2xl w-8 h-8 flex items-center justify-center'
                    }></i>
                  </div>
                  <h3 className="text-lg font-bold text-[#2E2E2E] mb-2">{card.title}</h3>
                  <p className="text-[#2E2E2E]/70 text-sm">{card.text}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-16">
              <div className="bg-gradient-to-r from-[#8472DF]/10 to-[#93C4FF]/10 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-[#2E2E2E] mb-4">
                  {c.cta.title}
                </h3>
                <p className="text-[#2E2E2E]/70 mb-6 max-w-2xl mx-auto">
                  {c.cta.body}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href="https://shop.dreamli.nl" className="inline-flex items-center gap-3 bg-[#8472DF] text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-[#8472DF]/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 whitespace-nowrap cursor-pointer">
                    <i className="ri-store-line text-xl w-6 h-6 flex items-center justify-center"></i>
                    {c.cta.shop}
                  </a>
                  <a href="mailto:info@dreamli.nl" className="inline-flex items-center gap-3 bg-white text-[#8472DF] border-2 border-[#8472DF] px-8 py-4 rounded-full text-lg font-bold hover:bg-[#8472DF] hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 whitespace-nowrap cursor-pointer">
                    <i className="ri-mail-line text-xl w-6 h-6 flex items-center justify-center"></i>
                    {c.cta.contact}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
