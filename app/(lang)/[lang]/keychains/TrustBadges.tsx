
export default function TrustBadges() {
  const badges = [
    {
      icon: 'ri-recycle-line',
      title: 'PLA+',
      description: 'Eco-friendly plastic'
    },
    {
      icon: 'ri-map-pin-line',
      title: 'Made in Groningen',
      description: 'Local Dutch production'
    },
    {
      icon: 'ri-bank-card-line',
      title: 'iDEAL/Stripe',
      description: 'Secure payments'
    },
    {
      icon: 'ri-nfc-line',
      title: 'Optional NFC',
      description: 'Smart technology'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {badges.map((badge, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <i className={`${badge.icon} text-2xl text-blue-600`}></i>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{badge.title}</h3>
              <p className="text-sm text-gray-600">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
