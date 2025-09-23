'use client';

export default function ContactHeroNL() {
  return (
    <section 
      className="relative py-32 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://readdy.ai/api/search-image?query=Modern%20customer%20service%20office%20with%20friendly%20team%20members%20welcoming%20visitors%2C%20bright%20professional%20workspace%20with%20computers%20and%20comfortable%20seating%20area%2C%20natural%20lighting%20through%20large%20windows%2C%20clean%20minimalist%20interior%20design%20with%20plants%20and%20warm%20colors&width=1200&height=600&seq=contact-hero-nl&orientation=landscape')`
      }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          Neem Contact Op
        </h1>
        <p className="text-xl text-white/90 max-w-2xl mx-auto">
          We horen graag van je! Neem contact met ons op voor vragen over het tot leven brengen van je kind's tekeningen.
        </p>
      </div>
    </section>
  );
}