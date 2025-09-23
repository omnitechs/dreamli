
'use client';

export default function ExplainerVideo() {
  return (
    <section className="py-24 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            See Lithophanes Come to Life
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Watch how we transform your precious memories into stunning illuminated art pieces that reveal hidden details when backlit.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
            <iframe
              src="https://www.youtube.com/embed/NXiZzYpax3o?autoplay=1&loop=1&playlist=NXiZzYpax3o&mute=1&controls=1&modestbranding=1&rel=0"
              className="absolute inset-0 w-full h-full"
              allow="autoplay; encrypted-media"
              allowFullScreen
              title="Lithophanes Explained"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
