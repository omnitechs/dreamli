
import FaqSchema from '../../components/FaqSchema';

const faqData = [
  {
    question: "Hoe lang duurt het?",
    answer: "Ontwerp 2–5 werkdagen; printen 1–3; verzending varieert."
  },
  {
    question: "Kan ik wijzigingen aanvragen?",
    answer: "Ja, tot 3 revisies voordat we gaan printen."
  },
  {
    question: "Wat als ik niet tevreden ben?",
    answer: "Geld terug na 3 revisies."
  },
  {
    question: "Zijn de materialen veilig voor kinderen?",
    answer: "Wij kiezen leeftijdsgeschikte, kindveilige kits; toezicht van volwassenen aanbevolen."
  },
  {
    question: "Welke bestanden kan ik uploaden?",
    answer: "JPG/PNG/GIF afbeeldingen; korte video is ook OK."
  },
  {
    question: "Heb ik een account nodig?",
    answer: "Wij maken er een en sturen een inloglink."
  }
];

export default function FAQNL() {
  return <FaqSchema faqs={faqData} title="Veelgestelde Vragen" />;
}
