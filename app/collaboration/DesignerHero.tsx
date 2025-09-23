'use client';

export default function DesignerHero() {
  const scrollToForm = () => {
    const formSection = document.getElementById('designer-form-section');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-white pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Design for Dreamli
        </h1>
        <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
          We're building a project portal where you can browse Dreamli jobs and apply.
        </p>
        <button
          onClick={scrollToForm}
          className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg whitespace-nowrap"
        >
          Join as a Designer
        </button>
      </div>
    </section>
  );
}