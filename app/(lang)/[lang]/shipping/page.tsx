import type { Metadata } from 'next';
import Link from 'next/link';
import { languages, languageCodes, type LanguageCode } from '@/config/i18n';
import { notFound } from 'next/navigation';
import { getTranslations, getMessages } from 'next-intl/server';

type Copy = {
  hero: { title: string; subtitle: string; updated: string };
  store: { badge: string; detailHtml: string };
  s1: { title: string; euTitle: string; euText: string; usTitle: string; usText: string; noCountryBold: string; noCountryRest: string };
  s2: { title: string; onDemand: string; intro: string; p3d: string; sourced: string; prodTitle: string; prod1: string; prod2: string; shipTitle: string; ship1: string; ship2: string; overall: string };
  s3: { title: string; euTitle: string; eu1: string; eu2: string; eu3: string; usTitle: string; us1: string; us2: string; us3: string };
  s4: { title: string; p3dTitle: string; p3d1: string; p3d2: string; p3d3: string; srcTitle: string; src1: string; src2: string; src3: string; eco: string };
  s5: { title: string; desc: string; postnl: string; dhl: string; ups: string };
  s6: { title: string; intro: string; affectsTitle: string; a1: string; a2: string; a3: string; discountsTitle: string; d1: string; d2: string };
  s7: { title: string; i1: string; i2: string; i3: string };
  s8: { title: string; p1: string; p2: string };
  s9: { title: string; delayedTitle: string; delayed: string; lostTitle: string; lost: string };
  s10: { title: string; p: string };
  s11: { title: string; intro: string; one: string; oneSub: string; many: string; manySub: string; exTitle: string; ex1: string; ex2: string; note: string };
  s12: { title: string; intro: string; email: string; website: string; happyTitle: string; happySub: string };
  returns?: { title: string; standard: string; personalized: string; how: string; address: string; refund: string; perk: string };
  cta: { title: string; body: string; shop: string; contact: string };
};

const copy: Record<LanguageCode, Copy> = {
  en: {
    hero: { title: 'Shipping Policy', subtitle: 'Everything you need to know about delivery', updated: 'Last updated: November 2025' },
    store: { badge: 'Store Information', detailHtml: '<strong>Dreamli</strong> (trade name of OmniTechs V.O.F., Groningen, the Netherlands)' },
    s1: { title: 'Where We Ship', euTitle: 'European Union', euText: 'All countries within the EU', usTitle: 'United States', usText: 'All states in the USA', noCountryBold: "Don't see your country?", noCountryRest: "Contact us at and we'll check if we can arrange a custom shipment." },
    s2: { title: 'How Our Production & Shipping Works', onDemand: 'On-Demand Gift Store', intro: "Dreamli operates on a no-stock model. We don't hold large inventory. Instead:", p3d: '3D-printed products are made to order in our workshop in Groningen, Netherlands', sourced: 'Sourced products (toys, crafts, puzzles, décor) are prepared on demand from verified European distributors', prodTitle: 'Production Time', prod1: 'Typically 3–5 business days for 3D-printed items', prod2: 'Sourced items are prepared and packed within 1–3 business days', shipTitle: 'Shipping Time', ship1: 'Typically 2–7 business days depending on destination and carrier', ship2: 'A track & trace link is provided for every shipment', overall: 'Overall delivery time: usually 5–10 business days from order confirmation (production + shipping)' },
    s3: { title: 'Shipping Regions & Methods', euTitle: 'European Union', eu1: 'Standard delivery with PostNL, DHL, or similar', eu2: 'Tracking included', eu3: 'Estimated 2–7 business days', usTitle: 'United States', us1: 'Standard international delivery', us2: 'Tracking included', us3: 'Estimated 5–10 business days' },
    s4: { title: 'Order Handling & Packaging', p3dTitle: '3D-Printed Items', p3d1: 'Freshly produced per order', p3d2: 'Hand-finished for clean results', p3d3: 'Carefully packaged to avoid damage', srcTitle: 'Sourced Items', src1: 'Picked fresh from distributor', src2: 'Quality-checked before dispatch', src3: 'Secure packaging for transit', eco: 'We aim for eco-friendly packaging when possible while ensuring safe delivery.' },
    s5: { title: 'Shipping Carriers', desc: 'We may use other reliable carriers depending on your location to ensure timely delivery.', postnl: 'PostNL', dhl: 'DHL', ups: 'UPS' },
    s6: { title: 'Shipping Costs', intro: 'Shipping costs are calculated and displayed at checkout before you confirm your order.', affectsTitle: 'What Affects Shipping Cost', a1: 'Destination country', a2: 'Total package weight and size', a3: 'Chosen delivery speed', discountsTitle: 'Discounts We Offer', d1: 'Free shipping above certain order values', d2: 'Free shipping promotions for specific products or regions' },
    s7: { title: 'Tracking & Notifications', i1: 'You receive a track & trace link by email when your order ships', i2: 'If your order is split into multiple packages, you will receive tracking for each parcel', i3: 'We keep you informed if there are any unexpected delays' },
    s8: { title: 'Address Accuracy', p1: 'Please make sure your shipping address is complete and correct before placing your order.', p2: 'If a package cannot be delivered due to an incorrect address, additional shipping costs may apply to resend the item.' },
    s9: { title: 'Delivery Issues', delayedTitle: 'Delayed Delivery', delayed: 'Carriers may sometimes take longer than estimated due to peak periods or operational issues. We’ll support you in tracking the parcel and resolving issues.', lostTitle: 'Lost or Damaged', lost: 'If your package appears lost or arrives damaged, please contact us with your order number and photos. We’ll investigate and arrange a solution (replacement, repair, or refund).' },
    s10: { title: 'Customs & Import Duties', p: 'Orders shipped outside the EU may be subject to customs fees or import duties. These charges, if applicable, are the responsibility of the customer and are not included in our product prices or shipping costs.' },
    s11: { title: 'Split Shipments', intro: 'To ensure your gifts arrive in the best condition and as quickly as possible, we may ship your order:', one: 'One Combined Shipment', oneSub: 'All items together in one package', many: 'Multiple Parcels', manySub: 'Separate packages for different item types', exTitle: 'Example Split Shipment:', ex1: '3D-printed lamps in one box', ex2: 'Toys or other sourced items in another', note: 'You will receive tracking information for each parcel if shipped separately.' },
    s12: { title: 'Questions & Support', intro: 'If you have any questions about shipping times, carriers, or special delivery needs (for example, a birthday deadline or gift timing), please contact us before or after placing your order:', email: 'Email Us', website: 'Visit Website', happyTitle: "We're Happy to Help!", happySub: "We'll help you plan your order so your gift arrives on time." },
    cta: { title: 'Ready to Order Your Perfect Gift?', body: 'Browse our collection of 3D-printed items and curated gifts', shop: 'Browse Shop', contact: 'Contact Us' },
  },
  nl: {
    hero: { title: 'Verzendbeleid', subtitle: 'Alles wat je moet weten over levering', updated: 'Laatst bijgewerkt: november 2025' },
    store: { badge: 'Winkelinformatie', detailHtml: '<strong>Dreamli</strong> (handelsnaam van OmniTechs V.O.F., Groningen, Nederland)' },
    s1: { title: 'Waar we verzenden', euTitle: 'Europese Unie', euText: 'Alle landen binnen de EU', usTitle: 'Verenigde Staten', usText: 'Alle staten in de VS', noCountryBold: 'Staat jouw land er niet bij?', noCountryRest: 'Neem contact met ons op via en we kijken of we een zending op maat kunnen regelen.' },
    s2: { title: 'Hoe onze productie en verzending werkt', onDemand: 'On-demand cadeauwinkel', intro: 'Dreamli werkt zonder voorraad. We houden geen grote inventaris aan. In plaats daarvan:', p3d: '3D-geprinte producten worden op bestelling gemaakt in onze werkplaats in Groningen, Nederland', sourced: 'Ingekochte producten (speelgoed, knutselspullen, puzzels, decor) worden op aanvraag klaargemaakt door geverifieerde Europese distributeurs', prodTitle: 'Productietijd', prod1: 'Meestal 3–5 werkdagen voor 3D-geprinte items', prod2: 'Ingekochte items worden binnen 1–3 werkdagen voorbereid en verpakt', shipTitle: 'Verzendtijd', ship1: 'Gewoonlijk 2–7 werkdagen afhankelijk van bestemming en vervoerder', ship2: 'Elke zending bevat een track & trace-link', overall: 'Totale levertijd: meestal 5–10 werkdagen vanaf orderbevestiging (productie + verzending)' },
    s3: { title: 'Verzendregio’s en methoden', euTitle: 'Europese Unie', eu1: 'Standaardlevering met PostNL, DHL of vergelijkbaar', eu2: 'Tracking inbegrepen', eu3: 'Geschat 2–7 werkdagen', usTitle: 'Verenigde Staten', us1: 'Standaard internationale levering', us2: 'Tracking inbegrepen', us3: 'Geschat 5–10 werkdagen' },
    s4: { title: 'Orderverwerking & verpakking', p3dTitle: '3D‑geprinte items', p3d1: 'Vers per bestelling geproduceerd', p3d2: 'Handmatig afgewerkt voor een strak resultaat', p3d3: 'Zorgvuldig verpakt om schade te voorkomen', srcTitle: 'Ingekochte items', src1: 'Vers opgehaald bij distributeur', src2: 'Gecontroleerd op kwaliteit voor verzending', src3: 'Veilige verpakking voor transport', eco: 'We streven naar milieuvriendelijke verpakkingen waar mogelijk, met behoud van veilige levering.' },
    s5: { title: 'Vervoerders', desc: 'Afhankelijk van je locatie kunnen we andere betrouwbare vervoerders gebruiken om op tijd te leveren.', postnl: 'PostNL', dhl: 'DHL', ups: 'UPS' },
    s6: { title: 'Verzendkosten', intro: 'Verzendkosten worden berekend en getoond bij het afrekenen voordat je je bestelling bevestigt.', affectsTitle: 'Wat beïnvloedt de verzendkosten', a1: 'Bestemmingsland', a2: 'Totaalgewicht en -afmetingen', a3: 'Gekozen bezorgsnelheid', discountsTitle: 'Kortingen die we aanbieden', d1: 'Gratis verzending boven bepaalde orderwaarden', d2: 'Acties met gratis verzending voor specifieke producten of regio’s' },
    s7: { title: 'Tracking & meldingen', i1: 'Je ontvangt per e-mail een track & trace-link zodra je bestelling is verzonden', i2: 'Bij meerdere pakketten ontvang je tracking voor elk pakket', i3: 'We houden je op de hoogte bij onverwachte vertragingen' },
    s8: { title: 'Adresnauwkeurigheid', p1: 'Controleer of je verzendadres compleet en correct is voordat je bestelt.', p2: 'Als een pakket niet kan worden bezorgd door een fout adres, kunnen extra verzendkosten gelden om opnieuw te verzenden.' },
    s9: { title: 'Leveringsproblemen', delayedTitle: 'Vertraagde levering', delayed: 'Vervoerders kunnen soms langer doen dan geschat door drukte of operationele problemen. We helpen je het pakket te volgen en het op te lossen.', lostTitle: 'Vermist of beschadigd', lost: 'Als je pakket vermist lijkt of beschadigd aankomt, neem dan contact met ons op met je bestelnummer en foto’s. We onderzoeken het en regelen een oplossing (vervanging, reparatie of terugbetaling).' },
    s10: { title: 'Douane & invoerrechten', p: 'Zendingen buiten de EU kunnen onderhevig zijn aan douanekosten of invoerrechten. Deze kosten, indien van toepassing, zijn voor de klant en niet inbegrepen in onze productprijzen of verzendkosten.' },
    s11: { title: 'Gedeelde zendingen', intro: 'Om je cadeaus in de beste staat en zo snel mogelijk te leveren, kunnen we je bestelling zo verzenden:', one: 'Eén gecombineerde zending', oneSub: 'Alle items in één pakket', many: 'Meerdere pakketten', manySub: 'Aparte pakketten voor verschillende soorten items', exTitle: 'Voorbeeld van een gedeelde zending:', ex1: '3D‑geprinte lampen in één doos', ex2: 'Speelgoed of andere ingekochte items in een andere', note: 'Je ontvangt trackinginformatie voor elk pakket als ze afzonderlijk worden verzonden.' },
    s12: { title: 'Vragen & ondersteuning', intro: 'Heb je vragen over levertijden, vervoerders of speciale bezorgwensen (bijv. een verjaardag of cadeaumoment)? Neem dan vóór of na je bestelling contact met ons op:', email: 'Mail ons', website: 'Bezoek website', happyTitle: 'We helpen je graag!', happySub: 'We helpen je je bestelling zo te plannen dat je cadeau op tijd aankomt.' },
    cta: { title: 'Klaar om het perfecte cadeau te bestellen?', body: 'Bekijk onze collectie 3D‑geprinte items en zorgvuldig geselecteerde cadeaus', shop: 'Bezoek shop', contact: 'Contact' },
  },
  de: {
    hero: { title: 'Versandrichtlinie', subtitle: 'Alles, was Sie über die Lieferung wissen müssen', updated: 'Zuletzt aktualisiert: November 2025' },
    store: { badge: 'Shop-Informationen', detailHtml: '<strong>Dreamli</strong> (Handelsname von OmniTechs V.O.F., Groningen, Niederlande)' },
    s1: { title: 'Wohin wir liefern', euTitle: 'Europäische Union', euText: 'Alle Länder innerhalb der EU', usTitle: 'Vereinigte Staaten', usText: 'Alle US-Bundesstaaten', noCountryBold: 'Ihr Land ist nicht dabei?', noCountryRest: 'Kontaktieren Sie uns unter und wir prüfen, ob eine Sonderlieferung möglich ist.' },
    s2: { title: 'So funktionieren Produktion & Versand', onDemand: 'On-Demand Geschenkeshop', intro: 'Dreamli arbeitet ohne Lagerbestand. Wir halten keine großen Vorräte. Stattdessen:', p3d: '3D‑gedruckte Produkte werden auf Bestellung in unserer Werkstatt in Groningen (NL) gefertigt', sourced: 'Bezogene Produkte (Spielzeug, Basteln, Puzzles, Deko) werden auf Abruf von verifizierten europäischen Distributoren vorbereitet', prodTitle: 'Produktionszeit', prod1: 'Typischerweise 3–5 Werktage für 3D‑Druckartikel', prod2: 'Bezogene Artikel werden innerhalb von 1–3 Werktagen vorbereitet und verpackt', shipTitle: 'Versandzeit', ship1: 'In der Regel 2–7 Werktage je nach Ziel und Transportdienst', ship2: 'Für jede Sendung gibt es einen Sendungsverfolgungslink', overall: 'Gesamte Lieferzeit: meist 5–10 Werktage ab Bestellbestätigung (Produktion + Versand)' },
    s3: { title: 'Versandregionen & Methoden', euTitle: 'Europäische Union', eu1: 'Standardversand mit PostNL, DHL oder ähnlich', eu2: 'Sendungsverfolgung inklusive', eu3: 'Voraussichtlich 2–7 Werktage', usTitle: 'Vereinigte Staaten', us1: 'Standard internationaler Versand', us2: 'Sendungsverfolgung inklusive', us3: 'Voraussichtlich 5–10 Werktage' },
    s4: { title: 'Auftragsabwicklung & Verpackung', p3dTitle: '3D‑gedruckte Artikel', p3d1: 'Frisch pro Bestellung produziert', p3d2: 'Handveredelt für saubere Ergebnisse', p3d3: 'Sorgfältig verpackt, um Schäden zu vermeiden', srcTitle: 'Bezogene Artikel', src1: 'Frisch beim Distributor kommissioniert', src2: 'Vor dem Versand qualitätsgeprüft', src3: 'Sichere Verpackung für den Transport', eco: 'Wenn möglich, verwenden wir umweltfreundliche Verpackungen – bei sicherer Zustellung.' },
    s5: { title: 'Versanddienstleister', desc: 'Je nach Standort nutzen wir ggf. andere zuverlässige Dienstleister, um eine pünktliche Lieferung sicherzustellen.', postnl: 'PostNL', dhl: 'DHL', ups: 'UPS' },
    s6: { title: 'Versandkosten', intro: 'Die Versandkosten werden an der Kasse berechnet und angezeigt, bevor Sie die Bestellung bestätigen.', affectsTitle: 'Einflussfaktoren auf die Versandkosten', a1: 'Zielland', a2: 'Gesamtgewicht und -größe des Pakets', a3: 'Gewählte Liefergeschwindigkeit', discountsTitle: 'Von uns angebotene Rabatte', d1: 'Kostenloser Versand ab bestimmten Bestellwerten', d2: 'Gratisversand-Aktionen für bestimmte Produkte oder Regionen' },
    s7: { title: 'Sendungsverfolgung & Benachrichtigungen', i1: 'Sie erhalten per E‑Mail einen Tracking‑Link, sobald Ihre Bestellung versendet wurde', i2: 'Bei Teillieferungen erhalten Sie für jedes Paket eine eigene Verfolgung', i3: 'Wir informieren Sie bei unerwarteten Verzögerungen' },
    s8: { title: 'Adressgenauigkeit', p1: 'Bitte stellen Sie sicher, dass Ihre Lieferadresse vollständig und korrekt ist, bevor Sie bestellen.', p2: 'Kann ein Paket wegen falscher Adresse nicht zugestellt werden, können zusätzliche Versandkosten für den erneuten Versand anfallen.' },
    s9: { title: 'Lieferprobleme', delayedTitle: 'Verspätete Lieferung', delayed: 'In Stoßzeiten oder bei Betriebsproblemen kann es länger dauern als geschätzt. Wir unterstützen Sie bei Nachverfolgung und Lösung.', lostTitle: 'Verloren oder beschädigt', lost: 'Wenn Ihr Paket verloren scheint oder beschädigt ankommt, kontaktieren Sie uns bitte mit Bestellnummer und Fotos. Wir prüfen den Fall und sorgen für Ersatz, Reparatur oder Erstattung.' },
    s10: { title: 'Zoll & Einfuhrabgaben', p: 'Sendungen außerhalb der EU können zoll- oder einfuhrabgabepflichtig sein. Diese Gebühren trägt gegebenenfalls der Kunde; sie sind nicht in Produkt- oder Versandpreisen enthalten.' },
    s11: { title: 'Geteilte Sendungen', intro: 'Damit Ihre Geschenke in bestem Zustand und so schnell wie möglich ankommen, können wir Ihre Bestellung wie folgt versenden:', one: 'Eine kombinierte Sendung', oneSub: 'Alle Artikel zusammen in einem Paket', many: 'Mehrere Pakete', manySub: 'Separate Pakete für unterschiedliche Artikelarten', exTitle: 'Beispiel einer geteilten Sendung:', ex1: '3D‑gedruckte Lampen in einem Karton', ex2: 'Spielzeug oder andere bezogene Artikel in einem anderen', note: 'Für jedes Paket erhalten Sie eigene Tracking‑Informationen, wenn separat versendet.' },
    s12: { title: 'Fragen & Support', intro: 'Bei Fragen zu Lieferzeiten, Dienstleistern oder besonderen Lieferwünschen (z. B. Geburtstagstermin) kontaktieren Sie uns bitte vor oder nach der Bestellung:', email: 'E‑Mail schreiben', website: 'Website besuchen', happyTitle: 'Wir helfen gern!', happySub: 'Wir helfen Ihnen, die Bestellung so zu planen, dass das Geschenk rechtzeitig ankommt.' },
    cta: { title: 'Bereit für das perfekte Geschenk?', body: 'Entdecken Sie unsere 3D‑Druck‑Kollektion und kuratierte Geschenke', shop: 'Zum Shop', contact: 'Kontakt' },
  },
  fr: {
    hero: { title: 'Politique d’expédition', subtitle: 'Tout savoir sur la livraison', updated: 'Dernière mise à jour : novembre 2025' },
    store: { badge: 'Informations sur la boutique', detailHtml: '<strong>Dreamli</strong> (nom commercial d’OmniTechs V.O.F., Groningue, Pays‑Bas)' },
    s1: { title: 'Où nous livrons', euTitle: 'Union européenne', euText: 'Tous les pays de l’UE', usTitle: 'États‑Unis', usText: 'Tous les États américains', noCountryBold: 'Votre pays n’apparaît pas ?', noCountryRest: 'Contactez‑nous à l’adresse suivante et nous vérifierons s’il est possible d’organiser un envoi sur mesure.' },
    s2: { title: 'Comment fonctionnent notre production et nos envois', onDemand: 'Boutique cadeau à la demande', intro: 'Dreamli fonctionne sans stock. Nous ne conservons pas de gros inventaires. À la place :', p3d: 'Les produits imprimés en 3D sont fabriqués à la commande dans notre atelier à Groningue (Pays‑Bas)', sourced: 'Les produits sourcés (jouets, loisirs créatifs, puzzles, déco) sont préparés à la demande par des distributeurs européens vérifiés', prodTitle: 'Temps de production', prod1: 'Généralement 3 à 5 jours ouvrés pour les articles imprimés en 3D', prod2: 'Les articles sourcés sont préparés et emballés en 1 à 3 jours ouvrés', shipTitle: 'Délai d’expédition', ship1: 'En général 2 à 7 jours ouvrés selon la destination et le transporteur', ship2: 'Un lien de suivi est fourni pour chaque envoi', overall: 'Délai total : généralement 5 à 10 jours ouvrés après confirmation de commande (production + expédition)' },
    s3: { title: 'Régions et méthodes d’expédition', euTitle: 'Union européenne', eu1: 'Livraison standard avec PostNL, DHL ou équivalent', eu2: 'Suivi inclus', eu3: 'Estimé à 2–7 jours ouvrés', usTitle: 'États‑Unis', us1: 'Livraison internationale standard', us2: 'Suivi inclus', us3: 'Estimé à 5–10 jours ouvrés' },
    s4: { title: 'Traitement des commandes et emballage', p3dTitle: 'Articles imprimés en 3D', p3d1: 'Produits frais à chaque commande', p3d2: 'Finition manuelle pour un rendu propre', p3d3: 'Emballage soigné pour éviter les dommages', srcTitle: 'Articles sourcés', src1: 'Prélevés frais chez le distributeur', src2: 'Contrôlés qualité avant expédition', src3: 'Emballage sécurisé pour le transport', eco: 'Nous privilégions des emballages écoresponsables lorsque possible tout en garantissant une livraison sûre.' },
    s5: { title: 'Transporteurs', desc: 'Selon votre localisation, nous pouvons utiliser d’autres transporteurs fiables pour assurer une livraison dans les délais.', postnl: 'PostNL', dhl: 'DHL', ups: 'UPS' },
    s6: { title: 'Frais d’expédition', intro: 'Les frais d’expédition sont calculés et affichés au paiement avant la validation de votre commande.', affectsTitle: 'Ce qui influence le coût d’expédition', a1: 'Pays de destination', a2: 'Poids et dimensions du colis', a3: 'Vitesse de livraison choisie', discountsTitle: 'Réductions proposées', d1: 'Livraison gratuite au‑delà de certains montants', d2: 'Promotions de livraison gratuite pour certains produits ou régions' },
    s7: { title: 'Suivi et notifications', i1: 'Vous recevez par e‑mail un lien de suivi lorsque votre commande est expédiée', i2: 'Si votre commande est scindée en plusieurs colis, vous recevrez un suivi pour chacun', i3: 'Nous vous tenons informé en cas de retard inattendu' },
    s8: { title: 'Exactitude de l’adresse', p1: 'Veuillez vérifier que votre adresse de livraison est complète et correcte avant de commander.', p2: 'Si un colis ne peut être livré en raison d’une adresse incorrecte, des frais d’expédition supplémentaires peuvent s’appliquer pour le renvoi.' },
    s9: { title: 'Problèmes de livraison', delayedTitle: 'Livraison retardée', delayed: 'En période de forte activité ou en cas de problèmes opérationnels, la livraison peut prendre plus de temps que prévu. Nous vous aidons à suivre le colis et à résoudre le problème.', lostTitle: 'Perdu ou endommagé', lost: 'Si votre colis semble perdu ou arrive endommagé, contactez‑nous avec votre numéro de commande et des photos. Nous enquêterons et proposerons une solution (remplacement, réparation ou remboursement).' },
    s10: { title: 'Douanes et droits d’importation', p: 'Les envois hors UE peuvent être soumis à des frais de douane ou droits d’importation. Le cas échéant, ces frais sont à la charge du client et ne sont pas inclus dans nos prix ou frais d’expédition.' },
    s11: { title: 'Envois fractionnés', intro: 'Pour que vos cadeaux arrivent en parfait état et le plus rapidement possible, nous pouvons expédier votre commande de la manière suivante :', one: 'Un envoi combiné', oneSub: 'Tous les articles ensemble dans un seul colis', many: 'Plusieurs colis', manySub: 'Colis séparés selon le type d’articles', exTitle: 'Exemple d’envoi fractionné :', ex1: 'Lampes imprimées en 3D dans un colis', ex2: 'Jouets ou autres articles sourcés dans un autre', note: 'Vous recevrez des informations de suivi pour chaque colis en cas d’envois séparés.' },
    s12: { title: 'Questions & assistance', intro: 'Pour toute question sur les délais, les transporteurs ou des besoins spécifiques (par ex. date d’anniversaire), contactez‑nous avant ou après votre commande :', email: 'Nous écrire', website: 'Visiter le site', happyTitle: 'Nous sommes là pour vous aider !', happySub: 'Nous vous aidons à planifier votre commande pour une arrivée à temps.' },
    cta: { title: 'Prêt à commander le cadeau parfait ?', body: 'Parcourez notre sélection d’articles imprimés en 3D et de cadeaux sélectionnés', shop: 'Visiter la boutique', contact: 'Contact' },
  },
  pl: {
    hero: { title: 'Polityka wysyłki', subtitle: 'Wszystko o dostawie', updated: 'Ostatnia aktualizacja: listopad 2025' },
    store: { badge: 'Informacje o sklepie', detailHtml: '<strong>Dreamli</strong> (nazwa handlowa OmniTechs V.O.F., Groningen, Holandia)' },
    s1: { title: 'Dokąd wysyłamy', euTitle: 'Unia Europejska', euText: 'Wszystkie kraje UE', usTitle: 'Stany Zjednoczone', usText: 'Wszystkie stany w USA', noCountryBold: 'Nie widzisz swojego kraju?', noCountryRest: 'Skontaktuj się z nami pod adresem, a sprawdzimy, czy możemy zorganizować wysyłkę indywidualną.' },
    s2: { title: 'Jak działa nasza produkcja i wysyłka', onDemand: 'Sklep prezentowy on‑demand', intro: 'Dreamli działa bez magazynu. Nie utrzymujemy dużych zapasów. Zamiast tego:', p3d: 'Produkty drukowane 3D powstają na zamówienie w naszej pracowni w Groningen (Holandia)', sourced: 'Produkty pozyskiwane (zabawki, rękodzieło, łamigłówki, dekoracje) przygotowywane są na bieżąco przez zweryfikowanych europejskich dystrybutorów', prodTitle: 'Czas produkcji', prod1: 'Zwykle 3–5 dni roboczych dla produktów 3D', prod2: 'Produkty pozyskiwane są przygotowywane i pakowane w ciągu 1–3 dni roboczych', shipTitle: 'Czas dostawy', ship1: 'Zwykle 2–7 dni roboczych w zależności od miejsca i przewoźnika', ship2: 'Do każdej przesyłki dołączamy link do śledzenia', overall: 'Łączny czas dostawy: zwykle 5–10 dni roboczych od potwierdzenia zamówienia (produkcja + wysyłka)' },
    s3: { title: 'Regiony i metody wysyłki', euTitle: 'Unia Europejska', eu1: 'Dostawa standardowa z PostNL, DHL lub podobnym', eu2: 'Śledzenie w cenie', eu3: 'Szacunkowo 2–7 dni roboczych', usTitle: 'Stany Zjednoczone', us1: 'Standardowa dostawa międzynarodowa', us2: 'Śledzenie w cenie', us3: 'Szacunkowo 5–10 dni roboczych' },
    s4: { title: 'Obsługa zamówień i pakowanie', p3dTitle: 'Produkty 3D', p3d1: 'Wytwarzane świeżo na każde zamówienie', p3d2: 'Ręczne wykończenie dla czystego efektu', p3d3: 'Starannie zapakowane, aby uniknąć uszkodzeń', srcTitle: 'Produkty pozyskiwane', src1: 'Świeżo kompletowane u dystrybutora', src2: 'Kontrola jakości przed wysyłką', src3: 'Bezpieczne opakowanie na czas transportu', eco: 'Dbamy o ekologiczne opakowania, gdy to możliwe, zapewniając jednocześnie bezpieczną dostawę.' },
    s5: { title: 'Przewoźnicy', desc: 'W zależności od lokalizacji możemy używać innych zaufanych przewoźników, aby zapewnić terminową dostawę.', postnl: 'PostNL', dhl: 'DHL', ups: 'UPS' },
    s6: { title: 'Koszty wysyłki', intro: 'Koszty wysyłki są obliczane i wyświetlane przy kasie przed potwierdzeniem zamówienia.', affectsTitle: 'Co wpływa na koszt wysyłki', a1: 'Kraj docelowy', a2: 'Łączna waga i rozmiar paczki', a3: 'Wybrana prędkość dostawy', discountsTitle: 'Zniżki, które oferujemy', d1: 'Darmowa dostawa powyżej określonych kwot', d2: 'Promocje darmowej dostawy dla wybranych produktów lub regionów' },
    s7: { title: 'Śledzenie i powiadomienia', i1: 'Po wysyłce zamówienia otrzymasz e‑mailem link do śledzenia', i2: 'Jeśli zamówienie jest podzielone na kilka paczek, otrzymasz śledzenie dla każdej z nich', i3: 'Informujemy o wszelkich nieoczekiwanych opóźnieniach' },
    s8: { title: 'Dokładność adresu', p1: 'Upewnij się, że adres dostawy jest kompletny i poprawny przed złożeniem zamówienia.', p2: 'Jeśli przesyłka nie może zostać doręczona z powodu błędnego adresu, mogą obowiązywać dodatkowe koszty ponownej wysyłki.' },
    s9: { title: 'Problemy z dostawą', delayedTitle: 'Opóźniona dostawa', delayed: 'W okresach wzmożonego ruchu lub z powodu problemów operacyjnych dostawa może trwać dłużej niż szacowano. Pomożemy w śledzeniu paczki i rozwiązaniu problemu.', lostTitle: 'Zagubione lub uszkodzone', lost: 'Jeśli przesyłka zaginęła lub dotarła uszkodzona, skontaktuj się z nami, podając numer zamówienia i zdjęcia. Zbadamy sprawę i zaproponujemy rozwiązanie (wymiana, naprawa lub zwrot).' },
    s10: { title: 'Cło i opłaty importowe', p: 'Przesyłki poza UE mogą podlegać cłu lub opłatom importowym. Ewentualne opłaty ponosi klient; nie są one wliczone w ceny produktów ani koszty wysyłki.' },
    s11: { title: 'Podział przesyłek', intro: 'Aby Twoje prezenty dotarły w najlepszym stanie i możliwie najszybciej, możemy wysłać zamówienie w następujący sposób:', one: 'Jedna łączona przesyłka', oneSub: 'Wszystkie przedmioty w jednym opakowaniu', many: 'Wiele paczek', manySub: 'Oddzielne paczki dla różnych typów przedmiotów', exTitle: 'Przykład podziału przesyłki:', ex1: 'Lampy 3D w jednym pudełku', ex2: 'Zabawki lub inne pozyskane produkty w drugim', note: 'Otrzymasz informacje o śledzeniu dla każdej paczki, jeśli wysyłka nastąpi osobno.' },
    s12: { title: 'Pytania i wsparcie', intro: 'Masz pytania dotyczące czasu dostawy, przewoźników lub specjalnych potrzeb (np. termin urodzin)? Skontaktuj się z nami przed lub po złożeniu zamówienia:', email: 'Napisz do nas', website: 'Odwiedź stronę', happyTitle: 'Chętnie pomożemy!', happySub: 'Pomożemy zaplanować zamówienie tak, aby prezent dotarł na czas.' },
    cta: { title: 'Gotowy na idealny prezent?', body: 'Przeglądaj naszą kolekcję wydruków 3D i starannie dobranych upominków', shop: 'Odwiedź sklep', contact: 'Kontakt' },
  },
};

type Params = { lang: LanguageCode };

export async function generateMetadata(
  props: { params: Promise<Params> }
): Promise<Metadata> {
  const { lang } = await props.params;
  if (!languageCodes.includes(lang)) notFound();

  const path = '/shipping';
  const languagesMap = Object.fromEntries(languages.map(l => [l.code, `/${l.code}${path}`]));
  const t = await getTranslations({ locale: lang, namespace: 'Shipping' });
  const title = t('meta.title');
  const description = t('meta.description');

  return {
    metadataBase: new URL('https://dreamli.nl'),
    title,
    description,
    alternates: {
      canonical: `/${lang}${path}`,
      languages: { ...languagesMap, 'x-default': `/en${path}` },
    },
    openGraph: {
      title,
      description,
      url: `/${lang}${path}`,
      siteName: 'Dreamli',
      locale: lang,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: { index: true, follow: true },
  };
}

export default async function ShippingPage(
  props: { params: Promise<Params> }
) {
  const { lang } = await props.params;
  if (!languageCodes.includes(lang)) notFound();

  const messages = await getMessages({ locale: lang });
  const c = (messages as any).Shipping as Copy;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#8472DF] to-[#93C4FF] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {c.hero.title}
            </h1>
            <p className="text-xl opacity-90 mb-2">
              {c.hero.subtitle}
            </p>
            <p className="text-lg opacity-80">
              {c.hero.updated}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Store Info */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center bg-gradient-to-r from-[#8472DF] to-[#93C4FF] text-white px-6 py-3 rounded-full text-lg font-semibold mb-4">
              <i className="ri-store-3-line w-6 h-6 flex items-center justify-center mr-2"></i>
              {c.store.badge}
            </div>
            <p className="text-gray-600 text-lg" dangerouslySetInnerHTML={{ __html: c.store.detailHtml }} />
          </div>
        </div>

        {/* 1. Where We Ship */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-[#8472DF] to-[#93C4FF] rounded-full flex items-center justify-center text-white mr-4">
              1
            </div>
            {c.s1.title}
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <i className="ri-earth-line w-8 h-8 flex items-center justify-center text-[#93C4FF] mr-3"></i>
                <h3 className="text-xl font-semibold text-gray-800">{c.s1.euTitle}</h3>
              </div>
              <p className="text-gray-600">{c.s1.euText}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <i className="ri-flag-line w-8 h-8 flex items-center justify-center text-[#8472DF] mr-3"></i>
                <h3 className="text-xl font-semibold text-gray-800">{c.s1.usTitle}</h3>
              </div>
              <p className="text-gray-600">{c.s1.usText}</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-orange-50 rounded-xl border-l-4 border-[#FFB067]">
            <p className="text-gray-700">
              <strong>{c.s1.noCountryBold}</strong> {c.s1.noCountryRest}{' '}
              <a href="mailto:info@dreamli.nl" className="text-[#8472DF] hover:underline font-semibold">
                info@dreamli.nl
              </a>.
            </p>
          </div>
        </div>

        {/* 2. How Our Production Works */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-[#93C4FF] to-[#ACEEF3] rounded-full flex items-center justify-center text-white mr-4">
              2
            </div>
            {c.s2.title}
          </h2>

          <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <i className="ri-gift-line w-6 h-6 flex items-center justify-center text-[#ACEEF3] mr-2"></i>
              {c.s2.onDemand}
            </h3>
            <p className="text-gray-600 mb-4">
              {c.s2.intro}
            </p>

            <div className="space-y-3">
              <div className="flex items-start">
                <i className="ri-printer-3d-line w-6 h-6 flex items-center justify-center text-[#8472DF] mr-3 mt-1"></i>
                <p className="text-gray-700">
                  <strong>3D</strong> — {c.s2.p3d}
                </p>
              </div>
              <div className="flex items-start">
                <i className="ri-truck-line w-6 h-6 flex items-center justify-center text-[#93C4FF] mr-3 mt-1"></i>
                <p className="text-gray-700">
                  <strong>•</strong> {c.s2.sourced}
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-2 flex items-center">
                <i className="ri-time-line w-6 h-6 flex items-center justify-center text-[#8472DF] mr-2"></i>
                {c.s2.prodTitle}
              </h3>
              <p className="text-gray-700">{c.s2.prod1}</p>
              <p className="text-gray-500 text-sm">{c.s2.prod2}</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-2 flex items-center">
                <i className="ri-send-plane-line w-6 h-6 flex items-center justify-center text-[#93C4FF] mr-2"></i>
                {c.s2.shipTitle}
              </h3>
              <p className="text-gray-700">{c.s2.ship1}</p>
              <p className="text-gray-500 text-sm">{c.s2.ship2}</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-purple-50 rounded-xl">
            <p className="text-gray-700">
              <strong>{c.s2.overall.split(':')[0]}:</strong> {c.s2.overall.split(':').slice(1).join(':').trim()}
            </p>
          </div>
        </div>

        {/* 3. Shipping Regions & Methods */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-[#ACEEF3] to-[#93C4FF] rounded-full flex items-center justify-center text-white mr-4">
              3
            </div>
            {c.s3.title}
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{c.s3.euTitle}</h3>
              <ul className="text-gray-700 space-y-2">
                <li>• {c.s3.eu1}</li>
                <li>• {c.s3.eu2}</li>
                <li>• {c.s3.eu3}</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{c.s3.usTitle}</h3>
              <ul className="text-gray-700 space-y-2">
                <li>• {c.s3.us1}</li>
                <li>• {c.s3.us2}</li>
                <li>• {c.s3.us3}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 4. Order Handling & Packaging */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-[#FFB067] to-[#93C4FF] rounded-full flex items-center justify-center text-white mr-4">
              4
            </div>
            {c.s4.title}
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{c.s4.p3dTitle}</h3>
              <ul className="text-gray-700 space-y-2">
                <li>• {c.s4.p3d1}</li>
                <li>• {c.s4.p3d2}</li>
                <li>• {c.s4.p3d3}</li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{c.s4.srcTitle}</h3>
              <ul className="text-gray-700 space-y-2">
                <li>• {c.s4.src1}</li>
                <li>• {c.s4.src2}</li>
                <li>• {c.s4.src3}</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-green-50 rounded-xl">
            <p className="text-gray-700">
              {c.s4.eco}
            </p>
          </div>
        </div>

        {/* 5. Shipping Carriers */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-[#93C4FF] to-[#8472DF] rounded-full flex items-center justify-center text-white mr-4">
              5
            </div>
            {c.s5.title}
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 text-center">
              <i className="ri-ship-line text-2xl text-[#8472DF]"></i>
              <p className="text-gray-800 font-semibold mt-2">{c.s5.postnl}</p>
            </div>
            <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl p-4 text-center">
              <i className="ri-truck-line text-2xl text-[#93C4FF]"></i>
              <p className="text-gray-800 font-semibold mt-2">{c.s5.dhl}</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-purple-50 rounded-xl p-4 text-center">
              <i className="ri-roadster-line text-2xl text-[#FFB067]"></i>
              <p className="text-gray-800 font-semibold mt-2">{c.s5.ups}</p>
            </div>
          </div>

          <p className="text-gray-600 mt-6">
            {c.s5.desc}
          </p>
        </div>

        {/* 6. Shipping Costs */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-[#8472DF] to-[#ACEEF3] rounded-full flex items-center justify-center text-white mr-4">
              6
            </div>
            {c.s6.title}
          </h2>

          <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-xl p-6 mb-6">
            <p className="text-gray-700">
              {c.s6.intro}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{c.s6.affectsTitle}</h3>
              <ul className="text-gray-700 space-y-2">
                <li>• {c.s6.a1}</li>
                <li>• {c.s6.a2}</li>
                <li>• {c.s6.a3}</li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{c.s6.discountsTitle}</h3>
              <ul className="text-gray-700 space-y-2">
                <li>• {c.s6.d1}</li>
                <li>• {c.s6.d2}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 7. Tracking & Notifications */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-[#FFB067] to-[#8472DF] rounded-full flex items-center justify-center text-white mr-4">
              7
            </div>
            {c.s7.title}
          </h2>

          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 mb-6">
            <ul className="text-gray-700 space-y-2">
              <li>• {c.s7.i1}</li>
              <li>• {c.s7.i2}</li>
              <li>• {c.s7.i3}</li>
            </ul>
          </div>
        </div>

        {/* 8. Address Accuracy */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-[#93C4FF] to-[#ACEEF3] rounded-full flex items-center justify-center text-white mr-4">
              8
            </div>
            {c.s8.title}
          </h2>

          <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl p-6 mb-6">
            <p className="text-gray-700">
              {c.s8.p1}
            </p>
            <p className="text-gray-600 text-sm mt-2">
              {c.s8.p2}
            </p>
          </div>
        </div>

        {/* 9. Delivery Issues */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-[#8472DF] to-[#93C4FF] rounded-full flex items-center justify-center text-white mr-4">
              9
            </div>
            {c.s9.title}
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{c.s9.delayedTitle}</h3>
              <p className="text-gray-700">{c.s9.delayed}</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{c.s9.lostTitle}</h3>
              <p className="text-gray-700">{c.s9.lost}</p>
            </div>
          </div>
        </div>

        {/* 10. Customs & Import Duties */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-[#ACEEF3] to-[#93C4FF] rounded-full flex items-center justify-center text-white mr-4">
              10
            </div>
            {c.s10.title}
          </h2>

          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
            <p className="text-gray-700">
              {c.s10.p}
            </p>
          </div>
        </div>

        {/* 11. Split Shipments */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-[#FFB067] to-[#ACEEF3] rounded-full flex items-center justify-center text-white mr-4">
              11
            </div>
            {c.s11.title}
          </h2>

          <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl p-6 mb-6">
            <p className="text-gray-700 mb-4">
              {c.s11.intro}
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <i className="ri-box-3-line w-6 h-6 flex items-center justify-center text-[#ACEEF3] mr-2"></i>
                  <h4 className="font-semibold text-gray-800">{c.s11.one}</h4>
                </div>
                <p className="text-gray-600 text-sm">{c.s11.oneSub}</p>
              </div>

              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <i className="ri-stack-line w-6 h-6 flex items-center justify-center text-[#FFB067] mr-2"></i>
                  <h4 className="font-semibold text-gray-800">{c.s11.many}</h4>
                </div>
                <p className="text-gray-600 text-sm">{c.s11.manySub}</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-4">
            <h4 className="font-semibold text-gray-800 mb-2">{c.s11.exTitle}</h4>
            <div className="space-y-2">
              <p className="text-gray-700 flex items-center">
                <i className="ri-lightbulb-line w-5 h-5 flex items-center justify-center text-[#8472DF] mr-2"></i>
                {c.s11.ex1}
              </p>
              <p className="text-gray-700 flex items-center">
                <i className="ri-gamepad-line w-5 h-5 flex items-center justify-center text-[#93C4FF] mr-2"></i>
                {c.s11.ex2}
              </p>
            </div>
            <p className="text-sm text-gray-600 mt-3">
              {c.s11.note}
            </p>
          </div>
        </div>

        {/* 12. Questions & Support */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-[#FFB067] to-[#8472DF] rounded-full flex items-center justify-center text-white mr-4">
              12
            </div>
            {c.s12.title}
          </h2>

          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 mb-6">
            <p className="text-gray-700 mb-4">
              {c.s12.intro}
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <a
                href="mailto:info@dreamli.nl"
                className="flex items-center p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
              >
                <i className="ri-mail-line w-8 h-8 flex items-center justify-center text-[#8472DF] mr-3"></i>
                <div>
                  <h4 className="font-semibold text-gray-800">{c.s12.email}</h4>
                  <p className="text-[#8472DF]">info@dreamli.nl</p>
                </div>
              </a>

              <a
                href="https://dreamli.nl"
                className="flex items-center p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
              >
                <i className="ri-global-line w-8 h-8 flex items-center justify-center text-[#93C4FF] mr-3"></i>
                <div>
                  <h4 className="font-semibold text-gray-800">{c.s12.website}</h4>
                  <p className="text-[#93C4FF]">dreamli.nl</p>
                </div>
              </a>
            </div>
          </div>

          <div className="text-center p-6 bg-gradient-to-r from-[#8472DF] to-[#93C4FF] rounded-xl text-white">
            <h3 className="text-xl font-semibold mb-2">{c.s12.happyTitle}</h3>
            <p className="opacity-90">
              {c.s12.happySub}
            </p>
          </div>
        </div>

        {/* Returns & Refunds (appended) */}
        {c.returns && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-[#93C4FF] to-[#8472DF] rounded-full flex items-center justify-center text-white mr-4">
                13
              </div>
              {c.returns.title}
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>{c.returns.standard}</p>
              <p>{c.returns.personalized}</p>
              <p>{c.returns.how}</p>
              <p className="font-medium">{c.returns.address}</p>
              <p>{c.returns.refund}</p>
              <p className="text-purple-800 bg-purple-50 border border-purple-200 rounded-lg p-4">{c.returns.perk}</p>
            </div>
          </div>
        )}

        {/* Footer CTA */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-[#8472DF] to-[#93C4FF] rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">{c.cta.title}</h3>
            <p className="text-lg opacity-90 mb-6">
              {c.cta.body}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`https://shop.dreamli.nl${lang === 'en' ? '' : `/${lang}`}`}
                className="bg-white text-[#8472DF] px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap"
                target="_blank" rel="noopener noreferrer"
              >
                {c.cta.shop}
              </a>
              <Link
                href={`/${lang}/contact`}
                className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-[#8472DF] transition-colors whitespace-nowrap"
              >
                {c.cta.contact}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
