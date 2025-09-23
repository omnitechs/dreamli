
export default function ProcessDetailSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            Exactly what happens after you upload
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Complete transparency. No surprises. Here's the step-by-step process from upload to delivery.
          </p>
        </div>

        <div className="space-y-12">
          {/* Step 1 */}
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">1</div>
                <h3 className="text-2xl font-bold text-gray-900">Upload & AI Processing</h3>
              </div>
              <div className="space-y-4 text-gray-600">
                <p>Upload your image (JPG, PNG, up to 10MB). Our AI analyzes the content and identifies the main subject.</p>
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">What our AI looks for:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Main subject and background separation</li>
                    <li>• Depth and dimension clues</li>
                    <li>• Color information and textures</li>
                    <li>• Optimal 3D conversion angles</li>
                  </ul>
                </div>
                <p className="font-medium text-gray-900">⏱️ Processing time: 30-60 seconds</p>
              </div>
            </div>
            <div className="lg:w-1/2">
              <div 
                className="w-full h-80 bg-cover bg-center rounded-2xl"
                style={{
                  backgroundImage: `url('https://readdy.ai/api/search-image?query=Computer%20screen%20showing%20AI%20image%20processing%20interface%20with%20a%20photo%20being%20analyzed%2C%20digital%20wireframe%20overlays%2C%20depth%20mapping%20visualization%2C%20modern%20tech%20interface%2C%20clean%20professional%20workspace%2C%20high-tech%20processing%20visualization&width=600&height=400&seq=ai-processing&orientation=landscape')`
                }}
              ></div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
            <div className="lg:w-1/2">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg">2</div>
                <h3 className="text-2xl font-bold text-gray-900">3D Preview Generation</h3>
              </div>
              <div className="space-y-4 text-gray-600">
                <p>Watch your 3D model appear in real-time. Rotate 360°, zoom in/out, inspect every angle.</p>
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Interactive preview features:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Full 360° rotation control</li>
                    <li>• Zoom and pan functionality</li>
                    <li>• Color and material preview</li>
                    <li>• Size reference indicators</li>
                  </ul>
                </div>
                <p className="font-medium text-gray-900">⏱️ Preview ready: Instantly</p>
              </div>
            </div>
            <div className="lg:w-1/2">
              <div 
                className="w-full h-80 bg-cover bg-center rounded-2xl"
                style={{
                  backgroundImage: `url('https://readdy.ai/api/search-image?query=3D%20model%20viewer%20interface%20showing%20a%20colorful%203D%20object%20that%20can%20be%20rotated%2C%20modern%20web%20interface%20with%20rotation%20controls%2C%20zoom%20buttons%2C%20clean%20white%20background%2C%20professional%203D%20visualization%20software%20look&width=600&height=400&seq=3d-preview&orientation=landscape')`
                }}
              ></div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg">3</div>
                <h3 className="text-2xl font-bold text-gray-900">Review & Adjustment</h3>
              </div>
              <div className="space-y-4 text-gray-600">
                <p>Not perfect? Request changes. We include one free round of adjustments with every order.</p>
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Common adjustments:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Make features more/less prominent</li>
                    <li>• Adjust proportions or scaling</li>
                    <li>• Modify colors or textures</li>
                    <li>• Add or remove small details</li>
                  </ul>
                </div>
                <p className="font-medium text-gray-900">⏱️ Revision time: 24-48 hours</p>
              </div>
            </div>
            <div className="lg:w-1/2">
              <div 
                className="w-full h-80 bg-cover bg-center rounded-2xl"
                style={{
                  backgroundImage: `url('https://readdy.ai/api/search-image?query=Before%20and%20after%20comparison%20showing%203D%20model%20improvements%2C%20side%20by%20side%20view%20with%20adjustment%20annotations%2C%20professional%20design%20revision%20process%2C%20clean%20interface%20with%20improvement%20highlights&width=600&height=400&seq=model-adjustment&orientation=landscape')`
                }}
              ></div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
            <div className="lg:w-1/2">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-lg">4</div>
                <h3 className="text-2xl font-bold text-gray-900">Professional 3D Printing</h3>
              </div>
              <div className="space-y-4 text-gray-600">
                <p>Once approved, we print using industrial-grade equipment. Each piece is hand-finished and quality-checked.</p>
                <div className="bg-orange-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Our printing process:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Industrial FDM/SLA 3D printers</li>
                    <li>• Premium PLA+ and resin materials</li>
                    <li>• Hand-finishing and detail work</li>
                    <li>• Quality control inspection</li>
                  </ul>
                </div>
                <p className="font-medium text-gray-900">⏱️ Production time: 3-5 business days</p>
              </div>
            </div>
            <div className="lg:w-1/2">
              <div 
                className="w-full h-80 bg-cover bg-center rounded-2xl"
                style={{
                  backgroundImage: `url('https://readdy.ai/api/search-image?query=Professional%203D%20printing%20workshop%20with%20high-end%203D%20printers%20working%2C%20colorful%20filaments%2C%20finished%203D%20printed%20objects%20on%20display%2C%20clean%20industrial%20workspace%2C%20quality%20control%20station&width=600&height=400&seq=3d-printing-shop&orientation=landscape')`
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Timeline Summary */}
        <div className="mt-16 bg-gray-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Total timeline: 7-10 business days</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-upload-2-line text-blue-600 text-xl"></i>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Upload</h4>
              <p className="text-sm text-gray-600">1 minute</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-eye-line text-green-600 text-xl"></i>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Review</h4>
              <p className="text-sm text-gray-600">1-2 days</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-printer-line text-purple-600 text-xl"></i>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Print</h4>
              <p className="text-sm text-gray-600">3-5 days</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-truck-line text-orange-600 text-xl"></i>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Delivery</h4>
              <p className="text-sm text-gray-600">2-3 days</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
