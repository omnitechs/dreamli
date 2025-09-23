
import FaqSchema from '../components/FaqSchema';

const faqData = [
  {
    question: "How long does it take?",
    answer: "Design 2–5 business days; printing 1–3; shipping varies."
  },
  {
    question: "Can I request changes?",
    answer: "Yes, up to 3 revisions before printing."
  },
  {
    question: "What if I'm not happy?",
    answer: "Money-back after 3 revisions."
  },
  {
    question: "Are materials kid-safe?",
    answer: "We choose age-appropriate, child-safe kits; adult supervision recommended."
  },
  {
    question: "Which files can I upload?",
    answer: "JPG/PNG/GIF images; short video also OK."
  },
  {
    question: "Do I need an account?",
    answer: "We create one and send a login link."
  }
];

export default function FAQ() {
  return <FaqSchema faqs={faqData} />;
}
