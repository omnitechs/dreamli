
'use client';

const trustStats = [
  {
    number: '50.000+',
    label: 'Gelukkige Families',
    icon: 'ri-heart-fill'
  },
  {
    number: '200.000+',
    label: 'Creatieve Projecten',
    icon: 'ri-palette-fill'
  },
  {
    number: '98%',
    label: 'Tevredenheid',
    icon: 'ri-star-fill'
  },
  {
    number: '15+',
    label: 'Landen Wereldwijd',
    icon: 'ri-global-fill'
  }
];

const testimonials = [
  {
    quote: "Dreamli heeft de manier waarop mijn kinderen spelen volledig getransformeerd. Ze zijn veel creatiever geworden!",
    author: "Sarah M.",
    location: "Amsterdam",
    avatar: "https://readdy.ai/api/search-image?query=vriendelijke%20moeder%20glimlachend%20portret%20Nederlandse%20vrouw%20blij%20tevreden%20ouder%20gelukkige%20uitdrukking&width=80&height=80&seq=sarah-avatar-nl&orientation=squarish"
  },
  {
    quote: "Als lerares zie ik het verschil dat creatief spelen maakt. Dreamli kits zijn perfect voor thuis én op school.",
    author: "Linda K.",
    location: "Utrecht",  
    avatar: "https://readdy.ai/api/search-image?query=professionele%20lerares%20vriendelijk%20gezicht%20Nederlandse%20educatieve%20specialist%20glimlachende%20vrouw&width=80&height=80&seq=linda-avatar-nl&orientation=squarish"
  },
  {
    quote: "Mijn zoon was altijd aan het gamen, maar nu maakt hij de mooiste dingen met zijn handen. Wat een verandering!",
    author: "Tom R.",
    location: "Rotterdam",
    avatar: "https://readdy.ai/api/search-image?query=trotse%20vader%20glimlachend%20Nederlandse%20man%20gelukkige%20ouder%20positieve%20uitdrukking%20vader%20figuur&width=80&height=80&seq=tom-avatar-nl&orientation=squarish"
  }
];

export default function TrustSectionNL() {
  return (
    <section className="py-20 bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Trust Stats */}
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Vertrouwd Door <span className="text-purple-600">Duizenden Families</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
            Word onderdeel van onze groeiende gemeenschap van creatieve families wereldwijd
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {trustStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-gradient-to-br from-purple-100 to-pink-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <i className={`${stat.icon} text-purple-600 text-2xl w-8 h-8 flex items-center justify-center`}></i>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="flex items-center mb-6">
                <img 
                  src={testimonial.avatar}
                  alt={testimonial.author}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.author}</div>
                  <div className="text-gray-600 text-sm">{testimonial.location}</div>
                </div>
              </div>
              
              <div className="flex mb-4">
                {[1,2,3,4,5].map((star) => (
                  <i key={star} className="ri-star-fill text-yellow-400 text-lg w-5 h-5 flex items-center justify-center"></i>
                ))}
              </div>
              
              <blockquote className="text-gray-700 leading-relaxed italic">
                "{testimonial.quote}"
              </blockquote>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Klaar om de Creativiteit van Je Kind te Ontketenen?</h3>
            <p className="text-lg mb-6 opacity-90">
              Word onderdeel van duizenden families die al de magie van creatief spelen hebben ontdekt
            </p>
            <a
              href="/nl/shop"
              className="inline-flex items-center px-8 py-4 bg-white text-purple-600 text-lg font-semibold rounded-full hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg whitespace-nowrap cursor-pointer"
            >
              Begin Je Reis
              <i className="ri-arrow-right-line ml-2 w-5 h-5 flex items-center justify-center"></i>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
