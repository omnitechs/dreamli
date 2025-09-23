'use client';

export default function EvidenceInAction() {
  const testimonials = [
    {
      image: "https://readdy.ai/api/search-image?query=Happy%20teacher%20in%20modern%20classroom%20with%20group%20of%20engaged%20students%20working%20on%20creative%20projects%2C%20natural%20lighting%2C%20professional%20educational%20setting%2C%20diverse%20group%20of%20children%20focused%20on%20painting%20activities&width=350&height=250&seq=evidence-classroom-1&orientation=landscape",
      caption: "\"The children were completely absorbed for the full 45 minutes. I've never seen such focus during an art activity.\" - Teacher at Groningen Primary"
    },
    {
      image: "https://readdy.ai/api/search-image?query=Children%20proudly%20displaying%20their%20finished%20painted%203D%20figures%20in%20bright%20classroom%2C%20excited%20expressions%2C%20colorful%20artwork%2C%20celebration%20of%20creativity%2C%20warm%20educational%20environment&width=350&height=250&seq=evidence-classroom-2&orientation=landscape",
      caption: "\"Parents were amazed at the quality of work their children produced. The confidence boost was incredible.\" - BSO Coordinator, Assen"
    },
    {
      image: "https://readdy.ai/api/search-image?query=School%20administrator%20observing%20successful%20creative%20session%2C%20organized%20classroom%20activity%2C%20professional%20educational%20setting%2C%20students%20engaged%20in%20structured%20creative%20learning&width=350&height=250&seq=evidence-classroom-3&orientation=landscape",
      caption: "\"Easy to run, minimal mess, maximum engagement. This fits perfectly into our curriculum goals.\" - Head Teacher, Emmen"
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block bg-gradient-to-r from-green-100 to-emerald-100 rounded-full px-6 py-3 mb-6">
            <span className="text-sm font-semibold text-green-700">Evidence in Action</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Real Results from Real Schools
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            See how schools across Groningen are transforming creative learning
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="group">
              <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="overflow-hidden">
                  <img 
                    src={testimonial.image}
                    alt={`School testimonial ${index + 1}`}
                    className="w-full h-64 object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                <div className="p-6">
                  <p className="text-gray-700 leading-relaxed italic">{testimonial.caption}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-[#FFA726]/10 to-[#FF9800]/10 rounded-3xl p-8 border border-[#FFA726]/20">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Your school could be featured here
            </h3>
            <p className="text-gray-600 mb-6">
              Join the growing number of schools seeing real results with our creative programs
            </p>
            
            <div className="flex items-center justify-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-[#FFA726] rounded-full flex items-center justify-center">
                  <i className="ri-check-fill text-white text-sm"></i>
                </div>
                <span className="text-gray-700 font-medium">Free pilot session</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-[#FFA726] rounded-full flex items-center justify-center">
                  <i className="ri-check-fill text-white text-sm"></i>
                </div>
                <span className="text-gray-700 font-medium">No commitment required</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-[#FFA726] rounded-full flex items-center justify-center">
                  <i className="ri-check-fill text-white text-sm"></i>
                </div>
                <span className="text-gray-700 font-medium">Full support included</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}