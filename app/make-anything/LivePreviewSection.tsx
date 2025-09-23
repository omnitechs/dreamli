export default function LivePreviewSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            See it live before you buy
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Drop your picture or drawing. The AI builds a 3D preview you can rotate, zoom, and refine. Confirm when you're happy, or request a small adjustment.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <i className="ri-3d-view-line text-blue-600 text-xl"></i>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Live AI model preview</h3>
                <p className="text-gray-600">Watch your 3D model build in real-time as our AI processes your image</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <i className="ri-edit-line text-blue-600 text-xl"></i>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">1 free round of small tweaks</h3>
                <p className="text-gray-600">Request minor adjustments to get your model just right</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <i className="ri-checkbox-circle-line text-blue-600 text-xl"></i>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Approve before printing</h3>
                <p className="text-gray-600">Only proceed to print when you're completely satisfied with the result</p>
              </div>
            </div>

            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-colors duration-200 whitespace-nowrap cursor-pointer">
              Upload a picture
            </button>
          </div>

          <div className="relative">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <img 
                src="https://readdy.ai/api/search-image?query=Interactive%203D%20model%20viewer%20interface%20showing%20a%20cute%20cartoon%20character%20being%20rotated%20and%20zoomed%2C%20clean%20modern%20UI%20with%20rotation%20controls%20and%20zoom%20buttons%2C%20professional%20software%20interface%20design%2C%20bright%20lighting%2C%20high%20quality%20render&width=600&height=400&seq=preview-interface&orientation=landscape"
                alt="Live 3D Preview Interface"
                className="w-full h-80 object-cover rounded-xl"
              />
              <div className="absolute top-12 right-12 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Live Preview
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}