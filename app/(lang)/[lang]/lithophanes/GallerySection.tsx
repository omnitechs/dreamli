
import React from 'react';

const GallerySection = () => {
  const galleryItems = [
    {
      id: 1,
      title: "Neon Cat",
      category: "Color Lithophane",
      image: "https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/4c33e1920bd60e8c6dcb009174240ba7.png",
      alt: "Neon Cat"
    },
    {
      id: 2,
      title: "Vintage Portrait",
      category: "Black & White",
      image: "https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/6e3e80ecbd26a30954beda04bc7eec6e.png",
      alt: "Vintage Portrait"
    },
    {
      id: 3,
      title: "Van Gogh Artwork",
      category: "Color Lithophane",
      image: "https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/92d8b3aeda0636e578e2265a0f1efecc.png",
      alt: "Van Gogh Artwork"
    },
    {
      id: 4,
      title: "Family Memories",
      category: "Black & White",
      image: "https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/73e904a9cb42ef241a08e208b2385c8d.png",
      alt: "Family Memories"
    },
    {
      id: 5,
      title: "Nature Abstract",
      category: "Color Lithophane",
      image: "https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/6095ebea62015839f51023af09dda776.png",
      alt: "Nature Abstract"
    },
    {
      id: 6,
      title: "Pet Portrait",
      category: "Black & White",
      image: "https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/8b65eabc470add18be01b4ce38ec00f5.png",
      alt: "Pet Portrait"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-[#2E2E2E] mb-6">
              Gallery / Inspiration
            </h2>
            <p className="text-xl text-[#2E2E2E]/80 max-w-3xl mx-auto mb-4">
              Every photo becomes a luminous piece of art.
            </p>
            <p className="text-lg text-[#2E2E2E]/70">
              Discover the stunning possibilities with our custom lithophanes
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleryItems.map((item) => (
              <div
                key={item.id}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.alt}
                    className="w-full h-80 object-contain group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href="#upload"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-[#8472DF] to-[#93C4FF] text-white px-8 py-4 rounded-full text-lg font-bold hover:from-[#8472DF]/90 hover:to-[#93C4FF]/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 whitespace-nowrap cursor-pointer"
            >
              <i className="ri-image-line text-xl w-6 h-6 flex items-center justify-center"></i>
              Create Your Own
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
