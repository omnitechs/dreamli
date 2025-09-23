export default function BestPicturesSection() {
  const tips = [
    {
      text: "Clear subject, front or 3/4 view",
      icon: "ri-focus-3-line"
    },
    {
      text: "Good lighting and resolution (avoid heavy blur)",
      icon: "ri-sun-line"
    },
    {
      text: "Drawings with bold outlines and simple shapes work great",
      icon: "ri-pencil-line"
    },
    {
      text: "Add notes if certain details are essential (e.g., \"keep the scarf,\" \"bigger ears,\" \"simple round base\")",
      icon: "ri-sticky-note-line"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
              What pictures work best?
            </h2>
            
            <div className="space-y-6">
              {tips.map((tip, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <i className={`${tip.icon} text-green-600`}></i>
                  </div>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {tip.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-4 shadow-lg">
                <img 
                  src="https://readdy.ai/api/search-image?query=Childs%20colorful%20drawing%20of%20a%20cartoon%20character%20with%20bold%20outlines%20and%20simple%20shapes%2C%20bright%20colors%2C%20clear%20front%20view%2C%20perfect%20for%203D%20printing%20conversion%2C%20clean%20white%20background&width=300&height=300&seq=good-drawing-1&orientation=squarish"
                  alt="Good Example - Child's Drawing"
                  className="w-full h-32 object-cover rounded-lg mb-2"
                />
                <p className="text-sm text-green-600 font-semibold">✓ Great for 3D</p>
              </div>
              
              <div className="bg-white rounded-xl p-4 shadow-lg">
                <img 
                  src="https://readdy.ai/api/search-image?query=Clear%20photo%20of%20a%20pet%20dog%20in%20front%20view%20with%20good%20lighting%20and%20sharp%20focus%2C%20perfect%20for%203D%20model%20creation%2C%20clean%20background%2C%20professional%20quality&width=300&height=300&seq=good-photo-1&orientation=squarish"
                  alt="Good Example - Pet Photo"
                  className="w-full h-32 object-cover rounded-lg mb-2"
                />
                <p className="text-sm text-green-600 font-semibold">✓ Perfect clarity</p>
              </div>
            </div>

            <div className="space-y-4 mt-8">
              <div className="bg-white rounded-xl p-4 shadow-lg">
                <img 
                  src="https://readdy.ai/api/search-image?query=Simple%20logo%20design%20with%20bold%20shapes%20and%20clear%20contrast%2C%20minimalist%20style%2C%20perfect%20for%203D%20printing%2C%20clean%20geometric%20forms%2C%20single%20color%20design&width=300&height=300&seq=good-logo-1&orientation=squarish"
                  alt="Good Example - Logo"
                  className="w-full h-32 object-cover rounded-lg mb-2"
                />
                <p className="text-sm text-green-600 font-semibold">✓ Bold shapes</p>
              </div>
              
              <div className="bg-white rounded-xl p-4 shadow-lg">
                <img 
                  src="https://readdy.ai/api/search-image?query=Game%20character%20avatar%20with%20simple%20design%20and%20clear%20features%2C%203%2F4%20view%20angle%2C%20good%20for%203D%20conversion%2C%20cartoon%20style%20with%20defined%20shapes&width=300&height=300&seq=good-avatar-1&orientation=squarish"
                  alt="Good Example - Game Avatar"
                  className="w-full h-32 object-cover rounded-lg mb-2"
                />
                <p className="text-sm text-green-600 font-semibold">✓ Clear features</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}