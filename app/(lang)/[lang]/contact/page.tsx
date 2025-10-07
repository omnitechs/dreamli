
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import ContactHero from './ContactHero';
import ContactInfo from './ContactInfo';
import ContactMap from './ContactMap';
import ContactForm from './ContactForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Dreamli | Get in Touch About 3D Creative Kits',
  description: 'Contact Dreamli for questions about personalized 3D creative kits. Call, email, or visit us in Groningen, Netherlands. Customer support for your orders.',
  keywords: 'contact dreamli, customer service, groningen, 3d printing, kids drawings, creative kits',
  openGraph: {
    title: 'Contact Dreamli | Get in Touch About 3D Creative Kits',
    description: 'Contact Dreamli for questions about personalized 3D creative kits. Call, email, or visit us in Groningen, Netherlands.',
    type: 'website',
    locale: 'en_US',
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <ContactHero />
      <ContactInfo />
      <ContactMap />
      <ContactForm />
    </div>
  );
}
