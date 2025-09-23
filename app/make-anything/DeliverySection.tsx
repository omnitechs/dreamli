export default function DeliverySection() {
  const guarantees = [
    {
      title: "Approve the 3D preview before we print",
      icon: "ri-eye-line",
      description: "You see exactly what you'll get"
    },
    {
      title: "One free round of small tweaks",
      icon: "ri-edit-2-line",
      description: "Perfect your model before printing"
    },
    {
      title: "Delivery in 7–10 days after approval (NL/EU)",
      icon: "ri-truck-line",
      description: "Fast, reliable shipping"
    },
    {
      title: "If it's damaged or not as approved, we'll reprint or refund",
      icon: "ri-shield-check-line",
      description: "Your satisfaction guaranteed"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            Delivery & guarantee
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {guarantees.map((guarantee, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className={`${guarantee.icon} text-blue-600 text-xl`}></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {guarantee.title}
                  </h3>
                  <p className="text-gray-600">
                    {guarantee.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-blue-50 rounded-2xl p-8 max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-medal-line text-blue-600 text-2xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Quality Promise
            </h3>
            <p className="text-gray-600">
              Every print is quality-checked before shipping. We stand behind our work with a full satisfaction guarantee.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}