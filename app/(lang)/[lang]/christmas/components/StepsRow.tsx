import { useTranslations } from 'next-intl';

export default function StepsRow() {
  const tc = useTranslations('christmas');
  const steps = [
    {
      icon: 'ri-lightbulb-line',
      title: tc('steps.imagine.title'),
      desc: tc('steps.imagine.desc'),
    },
    {
      icon: 'ri-magic-line',
      title: tc('steps.generate.title'),
      desc: tc('steps.generate.desc'),
    },
    {
      icon: 'ri-truck-line',
      title: tc('steps.order.title'),
      desc: tc('steps.order.desc'),
    }
  ];

  return (
    <section className="py-20 px-6 bg-gradient-to-br from-[#F3E8FF] to-[#DBEAFE]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-[#2E2E2E] mb-4">
            {tc('steps.title')}
          </h2>
          <p className="text-xl text-[#2E2E2E]/70">
            {tc('steps.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-[#8472DF] to-transparent"></div>
              )}

              <div className="text-center space-y-4">
                <div className="relative inline-block">
                  <div className="w-32 h-32 bg-gradient-to-br from-[#8472DF] to-[#93C4FF] rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-[#8472DF]/30">
                    <i className={`${step.icon} text-6xl text-white`}></i>
                  </div>
                  <div className="absolute -top-2 -right-2 w-10 h-10 bg-white border-2 border-[#8472DF] rounded-full flex items-center justify-center text-[#8472DF] font-bold">
                    {index + 1}
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-[#2E2E2E]">{step.title}</h3>

                <p className="text-[#2E2E2E]/70 text-lg">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
