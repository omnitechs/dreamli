export default function HowItWorksDesigner() {
  const steps = [
    {
      number: "1",
      title: "Sign up",
      description: "Tell us who you are so we can invite you early."
    },
    {
      number: "2", 
      title: "Get project emails",
      description: "We'll send new briefs with scope, budget, and timeline."
    },
    {
      number: "3",
      title: "Apply in the portal", 
      description: "Pick the projects you want to design (portal launching soon)."
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}