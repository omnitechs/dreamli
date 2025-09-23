import { Metadata } from 'next';
import Header from '../../components/Header';
import FooterNL from '../../components/FooterNL';
import ContactHeroNL from './ContactHeroNL';
import ContactInfoNL from './ContactInfoNL';
import ContactMapNL from './ContactMapNL';
import ContactFormNL from './ContactFormNL';

export const metadata: Metadata = {
  title: 'Contact - Dreamli | Neem Contact Met Ons Op',
  description: 'Neem contact op met Dreamli voor vragen over persoonlijke 3D creatieve knutselpakketten. Bel, mail of bezoek ons in Groningen, Nederland.',
  keywords: 'contact dreamli, klantenservice, groningen, 3d printen, kindertekeningen, knutselpakketten',
  openGraph: {
    title: 'Contact - Dreamli | Neem Contact Met Ons Op',
    description: 'Neem contact op met Dreamli voor vragen over persoonlijke 3D creatieve knutselpakketten. Bel, mail of bezoek ons in Groningen, Nederland.',
    type: 'website',
    locale: 'nl_NL',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact - Dreamli | Neem Contact Met Ons Op',
    description: 'Neem contact op met Dreamli voor vragen over persoonlijke 3D creatieve knutselpakketten. Bel, mail of bezoek ons in Groningen, Nederland.',
  },
};

export default function ContactPageNL() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Header />
      <ContactHeroNL />
      <ContactInfoNL />
      <ContactMapNL />
      <ContactFormNL />
      <FooterNL />
    </div>
  );
}