
'use client';

export default function HowItWorksSection() {
  const steps = [
    {
      icon: 'ri-upload-cloud-line',
      title: 'Upload your photo',
      description: 'Portrait, kids\' drawing, pet, or any favorite picture.',
      image: 'https://readdy.ai/api/search-image?query=Person%20uploading%20colorful%20family%20photo%20to%20computer%20screen%2C%20modern%20digital%20interface%20showing%20photo%20selection%2C%20bright%20clean%20workspace%20with%20various%20printed%20photos%20scattered%20around%2C%20happy%20family%20portrait%20being%20selected%2C%20user-friendly%20upload%20process%20visualization%2C%20warm%20lighting&width=500&height=400&seq=upload-photo-step&orientation=landscape'
    },
    {
      icon: 'ri-palette-line',
      title: 'Choose your style',
      description: 'Black & White or Full-Color. Frame Ratio and Color',
      image: 'https://readdy.ai/api/search-image?query=Two%20different%20lithophane%20styles%20side%20by%20side%2C%20one%20black%20and%20white%20monochrome%20lithophane%20showing%20classic%20portrait%20with%20beautiful%20depth%20and%20shadows%2C%20one%20full-color%20CMYK%20lithophane%20displaying%20vibrant%20colorful%20artwork%2C%20both%20illuminated%20with%20LED%20backlighting%20professional%20product%20photography%20setup&width=500&height=400&seq=style-choice-step&orientation=landscape'
    },
    {
      icon: 'ri-tools-line',
      title: 'We craft it',
      description: '3D-printed with precision and fitted with a uniform LED backlight.',
      image: 'https://readdy.ai/api/search-image?query=Modern%203D%20printer%20creating%20detailed%20lithophane%20with%20precision%2C%20high-tech%20manufacturing%20process%2C%20clean%20workshop%20environment%2C%20LED%20backlighting%20system%20being%20assembled%2C%20professional%20craftsmanship%20in%20action%2C%20technical%20precision%20and%20quality%20control&width=500&height=400&seq=crafting-step&orientation=landscape'
    },
    {
      icon: 'ri-truck-line',
      title: 'Delivered to your door',
      description: 'Ready to plug in and shine.',
      image: 'https://readdy.ai/api/search-image?query=Beautiful%20packaged%20lithophane%20being%20delivered%20to%20modern%20home%2C%20elegant%20gift%20packaging%20opened%20to%20reveal%20glowing%20lithophane%2C%20warm%20home%20interior%20setting%2C%20happy%20customer%20receiving%20their%20custom%20order%2C%20premium%20delivery%20experience%2C%20cozy%20living%20room%20atmosphere&width=500&height=400&seq=delivery-step&orientation=landscape'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From your photo to a stunning lithophane in just a few simple steps
          </p>
          
          <div className="mt-12 mb-16">
            <img 
              src="https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/a775e9327fa723a311f6ca3416f613c9.png" 
              alt="Lithophane Assembly Diagram" 
              className="w-full max-w-4xl h-auto mx-auto"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="relative mb-6">
                <img
                  src={step.image}
                  alt={step.title}
                  className="w-full h-48 object-cover rounded-xl"
                />
                <div className="absolute -bottom-4 left-4 w-12 h-12 bg-gradient-to-br from-[#8472DF] to-[#93C4FF] rounded-full flex items-center justify-center shadow-lg">
                  <i className={`${step.icon} text-white text-xl w-6 h-6 flex items-center justify-center`}></i>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-[#FFB067] text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  <h3 className="text-lg font-bold text-[#2E2E2E]">{step.title}</h3>
                </div>
                <p className="text-[#2E2E2E]/70 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
