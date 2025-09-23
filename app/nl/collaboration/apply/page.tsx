
import Header from '../../../components/Header';
import FooterNL from '../../../components/FooterNL';
import ApplicationFormNL from './ApplicationFormNL';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Aanvragen voor Partnerschap | Word Lid van Dreamli\'s Samenwerkingsnetwerk',
  description: 'Aanvragen om Dreamli partner te worden. Vul onze partnerschapsaanvraag in voor fabrikanten, verkopers en ontwerpers in creatief onderwijs.',
  keywords: 'partnerschap aanvraag, dreamli partners, samenwerkingsformulier, educatief zakelijk partnerschap',
  openGraph: {
    title: 'Aanvragen voor Partnerschap | Word Lid van Dreamli\'s Samenwerkingsnetwerk',
    description: 'Aanvragen om Dreamli partner te worden. Partnerschapsmogelijkheden voor creatieve onderwijsbedrijven.',
    type: 'website',
    locale: 'nl_NL',
  },
};

export default function ApplicationPageNL() {
  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Partner Aanvraag – Dreamli Samenwerkingshub
            </h1>
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800">Laten we Samen Bouwen.</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Dreamli werkt samen met fabrikanten, verkopers en ontwerpers die onze missie delen om creativiteit bij kinderen aan te wakkeren. 
                Vul deze aanvraag in om lid te worden van de Samenwerkingshub en begin met het werken met ons.
              </p>
            </div>
          </div>
          <ApplicationFormNL />
        </div>
      </div>
      <FooterNL />
    </div>
  );
}
