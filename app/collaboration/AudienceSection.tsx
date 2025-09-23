'use client';

export default function AudienceSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12">
          {/* For Designers */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6">
              <i className="ri-palette-line text-2xl text-white"></i>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">For Designers</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Transform your creative concepts into reality. Upload your innovative ideas, set your pricing, and collaborate directly with Dreamli to reach families who will love your creations.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mt-1">
                  <i className="ri-check-line text-purple-600 text-sm"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Upload & Showcase</h4>
                  <p className="text-gray-600 text-sm">Present your digital or physical concepts in our professional platform</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mt-1">
                  <i className="ri-check-line text-purple-600 text-sm"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Set Your Terms</h4>
                  <p className="text-gray-600 text-sm">Control pricing and collaboration parameters for your designs</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mt-1">
                  <i className="ri-check-line text-purple-600 text-sm"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Reach Families</h4>
                  <p className="text-gray-600 text-sm">Connect with our established network of parents and children</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <img 
                src="https://readdy.ai/api/search-image?query=Creative%20designer%20working%20on%20children%20product%20concepts%20at%20modern%20desk%20with%20colorful%20sketches%2C%20digital%20tablet%20showing%20kid-friendly%20designs%2C%20bright%20inspiring%20workspace%20with%20design%20tools%20and%20materials%2C%20professional%20yet%20playful%20atmosphere%2C%20diverse%20creative%20elements&width=400&height=250&seq=designer-work&orientation=landscape"
                alt="Designer workspace"
                className="w-full h-48 object-cover object-top rounded-xl"
              />
            </div>
          </div>

          {/* For Manufacturers */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl flex items-center justify-center mb-6">
              <i className="ri-settings-3-line text-2xl text-white"></i>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">For Manufacturers</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Partner with us to produce and distribute innovative child-focused products. Explore co-branding opportunities and tap into new markets through our established network.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                  <i className="ri-check-line text-blue-600 text-sm"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Production Partnership</h4>
                  <p className="text-gray-600 text-sm">Collaborate on manufacturing innovative children's products</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                  <i className="ri-check-line text-blue-600 text-sm"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Distribution Networks</h4>
                  <p className="text-gray-600 text-sm">Access our established channels and customer base</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                  <i className="ri-check-line text-blue-600 text-sm"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Co-branding Opportunities</h4>
                  <p className="text-gray-600 text-sm">Build your brand alongside Dreamli in the children's market</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <img 
                src="https://readdy.ai/api/search-image?query=Modern%20manufacturing%20facility%20producing%20colorful%20children%20products%2C%20automated%20production%20line%20with%20quality%20control%2C%20professional%20workers%20inspecting%20kid-friendly%20toys%20and%20products%2C%20clean%20industrial%20environment%20with%20bright%20lighting%2C%20organized%20and%20efficient%20workflow&width=400&height=250&seq=manufacturing-floor&orientation=landscape"
                alt="Manufacturing facility"
                className="w-full h-48 object-cover object-top rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}