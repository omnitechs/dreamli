import HeaderDE from '../components/HeaderDE';
import FooterDE from '../components/FooterDE';
import ContactHeroDE from './ContactHeroDE';
import ContactInfoDE from './ContactInfoDE';
import ContactMapDE from './ContactMapDE';
import ContactFormDE from './ContactFormDE';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dreamli kontaktieren | Fragen zu 3D-Kreativkits',
  description: 'Kontaktieren Sie Dreamli bei Fragen zu personalisierten 3D-Kreativkits. Rufen Sie an, senden Sie eine E-Mail oder besuchen Sie uns in Groningen, Niederlande. Kundensupport für Ihre Bestellungen.',
  keywords: 'Dreamli kontaktieren, Kundendienst, Groningen, 3D-Druck, Kinderzeichnungen, Kreativkits',
  openGraph: {
    title: 'Dreamli kontaktieren | Fragen zu 3D-Kreativkits',
    description: 'Kontaktieren Sie Dreamli bei Fragen zu personalisierten 3D-Kreativkits. Rufen Sie an, senden Sie eine E-Mail oder besuchen Sie uns in Groningen, Niederlande.',
    type: 'website',
    locale: 'de_DE',
  },
};

export default function ContactPageDE() {
  return (
    <div className="min-h-screen">
      <HeaderDE />
      <ContactHeroDE />
      <ContactInfoDE />
      <ContactMapDE />
      <ContactFormDE />
      <FooterDE />
    </div>
  );
}