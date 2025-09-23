import FaqSchema from '../../components/FaqSchema';

const faqData = [
  {
    question: "Wie lange dauert es?",
    answer: "Design 2–5 Werktage; Druck 1–3; Versand variiert."
  },
  {
    question: "Kann ich Änderungen anfordern?",
    answer: "Ja, bis zu 3 Revisionen vor dem Druck."
  },
  {
    question: "Was ist, wenn ich nicht zufrieden bin?",
    answer: "Geld-zurück-Garantie nach 3 Revisionen."
  },
  {
    question: "Sind die Materialien kindersicher?",
    answer: "Wir wählen altersgerechte, kindersichere Kits; Aufsicht durch Erwachsene empfohlen."
  },
  {
    question: "Welche Dateien kann ich hochladen?",
    answer: "JPG/PNG/GIF-Bilder; kurze Videos sind auch OK."
  },
  {
    question: "Brauche ich ein Konto?",
    answer: "Wir erstellen eines und senden einen Anmelde-Link."
  }
];

export default function FAQDE() {
  return <FaqSchema faqs={faqData} />;
}