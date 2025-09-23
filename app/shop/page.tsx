import Link from 'next/link';
import FeaturedProductsServer from './FeaturedProductsServer';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata = {
  title: 'Dreamli Shop - Creative Toys & Educational Kits for Kids',
  description: 'Discover creative toys, STEM kits, educational games, and personalized 3D printed toys. High-quality, safe materials that spark imagination and learning in children.',
  keywords: 'creative toys, STEM kits, educational toys, 3D printed toys, painting kits, robotics for kids, safe toys, learning through play',
  openGraph: {
    title: 'Dreamli Shop - Creative Toys & Educational Kits for Kids',
    description: 'Discover creative toys, STEM kits, educational games, and personalized 3D printed toys. High-quality, safe materials that spark imagination and learning.',
    type: 'website',
  },
};

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Personalized Gift Packs Hero Sections */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, #F3E8FF 0%, #DBEAFE 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight" style={{ color: '#2E2E2E' }}>
                Turn your child's drawing into a keepsake collection!
              </h1>
              <p className="text-xl mb-4 leading-relaxed" style={{ color: '#2E2E2E' }}>
                Includes: Figurine, nightlight, magnet & keychains—all from one special illustration.
              </p>
              <p className="text-xl mb-8 leading-relaxed" style={{ color: '#2E2E2E' }}>
                Perfect for unforgettable gifts on birthdays, holidays, or just because.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/gifts" className="inline-block">
                  <button className="text-white px-8 py-4 rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer" style={{ backgroundColor: '#8472DF' }}>
                    Shop Gift Pack
                  </button>
                </Link>
              </div>
            </div>
            <div className="order-1 lg:order-2 w-full h-96 lg:h-[500px] rounded-xl overflow-hidden shadow-lg">
              <img 
                src="https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/70875d716ddf5ae4b60c514f25ad7174.webp" 
                alt="Personalized Gift Pack"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>
        </div>
      </section>

      {/* STEAM Pack Hero Section */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, #ACEEF3 0%, #93C4FF 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* STEAM Pack Image */}
            <div className="order-2 lg:order-1 w-full h-96 lg:h-[500px] rounded-xl overflow-hidden shadow-lg">
              <img 
                src="https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/ed2d7e7745697e05b30f29b042b79c5a.png" 
                alt="Personalized STEAM Pack"
                className="w-full h-full object-cover object-top"
              />
            </div>
            
            {/* Personalized STEAM Pack */}
            <div className="order-1 lg:order-2">
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight" style={{ color: '#2E2E2E' }}>
                Personalized STEAM Pack
              </h1>
              <p className="text-xl mb-8 leading-relaxed" style={{ color: '#2E2E2E' }}>
                Build, paint, and learn with your child's drawing!
              </p>
              
              <p className="text-xl mb-8 leading-relaxed" style={{ color: '#2E2E2E' }}>
                Includes everything to create a figurine, nightlight, magnet & keychains—all inspired by their own artwork.
              </p>
              
              <p className="text-xl mb-8 leading-relaxed" style={{ color: '#2E2E2E' }}>
                Encourages creativity, hands-on learning, and endless imagination—STEAM fun for kids and families!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/steam">
                  <button className="text-white px-10 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #8472DF 0%, #93C4FF 100%)' }}>
                    Shop STEAM Pack
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Original Hero Section */}
      <section className="py-20 overflow-hidden" style={{ background: 'linear-gradient(135deg, #DBEAFE 0%, #F3E8FF 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight" style={{ color: '#2E2E2E' }}>
              Creative Toys & Kits That Spark Imagination
            </h2>
            <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed" style={{ color: '#2E2E2E' }}>
              From painting kits and STEM projects to 3D printed toys — Dreamli brings fun and learning together.
            </p>
            <Link href="https://shop.dreamli.nl/" className="inline-block">
              <button className="text-white px-12 py-4 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105 cursor-pointer whitespace-nowrap" style={{ backgroundColor: '#FFB067' }}>
                Shop All Products
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="py-20 bg-white" data-product-shop="true">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" style={{ color: '#2E2E2E' }}>Shop by Category</h2>
            <p className="text-xl" style={{ color: '#2E2E2E' }}>Discover the perfect toys for every interest</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {/* Painting & Creative Kits */}
            <div className="rounded-3xl p-8 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer border" style={{ backgroundColor: '#F3E8FF', borderColor: '#8472DF' }}>
              <div className="w-full h-48 rounded-2xl mb-6 overflow-hidden">
                <img 
                  src="https://readdy.ai/api/search-image?query=Bright%20colorful%20painting%20and%20creative%20art%20kits%20for%20children%20with%20paintbrushes%20watercolors%20and%20craft%20supplies%20on%20clean%20white%20background%2C%20educational%20art%20materials%20that%20inspire%20creativity%20and%20imagination%20in%20kids&width=300&height=300&seq=cat1&orientation=squarish" 
                  alt="Painting & Creative Kits"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h3 className="text-xl font-bold mb-2 text-center" style={{ color: '#2E2E2E' }}>🎨 Painting & Creative Kits</h3>
              <p className="text-center text-sm" style={{ color: '#2E2E2E' }}>Unleash artistic expression</p>
            </div>

            {/* STEM & Robotics */}
            <div className="rounded-3xl p-8 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer border" style={{ backgroundColor: '#DBEAFE', borderColor: '#93C4FF' }}>
              <div className="w-full h-48 rounded-2xl mb-6 overflow-hidden">
                <img 
                  src="https://readdy.ai/api/search-image?query=Modern%20STEM%20and%20robotics%20kits%20for%20kids%20with%20colorful%20building%20blocks%20circuits%20and%20robot%20components%20on%20white%20background%2C%20educational%20technology%20toys%20that%20teach%20coding%20and%20engineering%20concepts%20to%20children&width=300&height=300&seq=cat2&orientation=squarish" 
                  alt="STEM & Robotics"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h3 className="text-xl font-bold mb-2 text-center" style={{ color: '#2E2E2E' }}>🤖 STEM & Robotics</h3>
              <p className="text-center text-sm" style={{ color: '#2E2E2E' }}>Build the future</p>
            </div>

            {/* Educational Toys */}
            <div className="rounded-3xl p-8 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer border" style={{ backgroundColor: '#ACEEF3', borderColor: '#ACEEF3' }}>
              <div className="w-full h-48 rounded-2xl mb-6 overflow-hidden">
                <img 
                  src="https://readdy.ai/api/search-image?query=Bright%20educational%20toys%20and%20learning%20games%20for%20children%20including%20alphabet%20blocks%20puzzles%20and%20counting%20toys%20on%20white%20background%2C%20colorful%20developmental%20toys%20that%20make%20learning%20fun%20and%20engaging%20for%20kids&width=300&height=300&seq=cat3&orientation=squarish" 
                  alt="Educational Toys"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h3 className="text-xl font-bold mb-2 text-center" style={{ color: '#2E2E2E' }}>🧩 Educational Toys</h3>
              <p className="text-center text-sm" style={{ color: '#2E2E2E' }}>Learn through play</p>
            </div>

            {/* Gift Boxes */}
            <div className="rounded-3xl p-8 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer border" style={{ backgroundColor: '#F3E8FF', borderColor: '#8472DF' }}>
              <div className="w-full h-48 rounded-2xl mb-6 overflow-hidden">
                <img 
                  src="https://readdy.ai/api/search-image?query=Beautiful%20gift%20boxes%20filled%20with%20assorted%20toys%20and%20activities%20for%20children%2C%20colorful%20surprise%20boxes%20with%20ribbons%20and%20creative%20contents%20on%20white%20background%2C%20perfect%20curated%20toy%20collections%20for%20special%20occasions&width=300&height=300&seq=cat4&orientation=squarish" 
                  alt="Gift Boxes"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h3 className="text-xl font-bold mb-2 text-center" style={{ color: '#2E2E2E' }}>🎁 Gift Boxes</h3>
              <p className="text-center text-sm" style={{ color: '#2E2E2E' }}>Curated surprises</p>
            </div>

            {/* 3D Printed Toys */}
            <div className="rounded-3xl p-8 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer border" style={{ backgroundColor: '#DBEAFE', borderColor: '#93C4FF' }}>
              <div className="w-full h-48 rounded-2xl mb-6 overflow-hidden">
                <img 
                  src="https://readdy.ai/api/search-image?query=Innovative%203D%20printed%20toys%20and%20custom%20figurines%20made%20from%20childrens%20drawings%2C%20colorful%20unique%20personalized%20toys%20on%20white%20background%2C%20modern%20technology%20creating%20one-of-a-kind%20playthings%20for%20kids&width=300&height=300&seq=cat5&orientation=squarish" 
                  alt="3D Printed Toys"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h3 className="text-xl font-bold mb-2 text-center" style={{ color: '#2E2E2E' }}>🖤 3D Printed Toys</h3>
              <p className="text-center text-sm" style={{ color: '#2E2E2E' }}>Bring drawings to life</p>
            </div>
          </div>
        </div>
      </section>

      {/* === FEATURED_PRODUCTS_SLOT (leave this comment) === */}
      <FeaturedProductsServer />

      {/* Why Dreamli Section */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, #ACEEF3 0%, #DBEAFE 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" style={{ color: '#2E2E2E' }}>Why Choose Dreamli?</h2>
            <p className="text-xl" style={{ color: '#2E2E2E' }}>Quality toys that make a difference</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#ACEEF3' }}>
                <i className="ri-shield-check-line text-2xl" style={{ color: '#2E2E2E' }}></i>
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: '#2E2E2E' }}>Safe Materials</h3>
              <p className="text-sm" style={{ color: '#2E2E2E' }}>High-quality, non-toxic materials tested for safety</p>
            </div>
            <div className="text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#F3E8FF' }}>
                <i className="ri-lightbulb-line text-2xl" style={{ color: '#8472DF' }}></i>
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: '#2E2E2E' }}>Inspires Creativity</h3>
              <p className="text-sm" style={{ color: '#2E2E2E' }}>Designed to spark imagination and learning</p>
            </div>
            <div className="text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#DBEAFE' }}>
                <i className="ri-leaf-line text-2xl" style={{ color: '#93C4FF' }}></i>
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: '#2E2E2E' }}>Eco-Friendly</h3>
              <p className="text-sm" style={{ color: '#2E2E2E' }}>Sustainably sourced and locally curated</p>
            </div>
            <div className="text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#FFB067' }}>
                <i className="ri-star-line text-2xl text-white"></i>
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: '#2E2E2E' }}>Unique Selection</h3>
              <p className="text-sm" style={{ color: '#2E2E2E' }}>Toys you won't find everywhere else</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-8" style={{ color: '#2E2E2E' }}>Our Story</h2>
          <p className="text-xl leading-relaxed" style={{ color: '#2E2E2E' }}>
            At Dreamli, we believe play is more than fun — it's the foundation of creativity and learning. 
            We source and create toys that combine joy with imagination, giving kids the tools to dream, 
            build, and grow.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
