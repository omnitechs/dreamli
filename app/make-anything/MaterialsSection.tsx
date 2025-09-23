export default function MaterialsSection() {
  const materials = [
    {
      title: "Solid single color",
      description: "Base price option in your choice of color",
      icon: "ri-palette-line"
    },
    {
      title: "Multi-color (4–16 colors)",
      description: "Using multi-material printing technology",
      icon: "ri-rainbow-line"
    },
    {
      title: "Satin white (paint-ready)",
      description: "Perfect base for custom painting on request",
      icon: "ri-brush-line"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            Materials & finishes
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We 3D-print in durable, high-quality plastics suitable for display and light handling.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {materials.map((material, index) => (
            <div key={index} className="bg-gray-50 rounded-2xl p-8 text-center hover:bg-gray-100 transition-colors duration-200">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className={`${material.icon} text-blue-600 text-2xl`}></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {material.title}
              </h3>
              <p className="text-gray-600">
                {material.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <img 
            src="https://readdy.ai/api/search-image?query=High%20quality%203D%20printed%20objects%20in%20different%20colors%20and%20finishes%20displayed%20on%20a%20clean%20white%20surface%2C%20professional%20product%20photography%2C%20various%20colorful%20figurines%20and%20decorative%20objects%2C%20excellent%20lighting%20and%20detail%2C%20modern%20minimalist%20presentation&width=800&height=400&seq=materials-showcase&orientation=landscape"
            alt="Materials and Finishes Showcase"
            className="w-full max-w-4xl mx-auto rounded-2xl shadow-lg object-cover h-80"
          />
        </div>
      </div>
    </section>
  );
}