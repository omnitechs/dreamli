import Link from 'next/link';
import FeaturedProductsServerNL from './FeaturedProductsServerNL';
import Header from '../../components/Header';
import FooterNL from '../components/FooterNL';

export const metadata = {
  title: 'Dreamli Shop - Creatief Speelgoed & Educatieve Kits voor Kinderen',
  description: 'Ontdek creatief speelgoed, STEAM-kits, educatieve spellen en gepersonaliseerde 3D-geprinte speelgoed. Hoogwaardige, veilige materialen die verbeelding en leren bij kinderen stimuleren.',
  keywords: 'creatief speelgoed, STEAM-kits, educatief speelgoed, 3D-geprint speelgoed, verfkits, robotica voor kinderen, veilig speelgoed, leren door spelen',
  openGraph: {
    title: 'Dreamli Shop - Creatief Speelgoed & Educatieve Kits voor Kinderen',
    description: 'Ontdek creatief speelgoed, STEAM-kits, educatieve spellen en gepersonaliseerde 3D-geprinte speelgoed. Hoogwaardige, veilige materialen die verbeelding en leren stimuleren.',
    type: 'website',
  },
};

export default function ShopPageNL() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Gepersonaliseerde Cadeaupakketten Hero Sectie */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, #F3E8FF 0%, #DBEAFE 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight" style={{ color: '#2E2E2E' }}>
                Maak van je kind's tekening een herinneringscollectie!
              </h1>
              <p className="text-xl mb-4 leading-relaxed" style={{ color: '#2E2E2E' }}>
                Inclusief: Figuurtje, nachtlampje, magneet & sleutelhangers—allemaal van één speciale illustratie.
              </p>
              <p className="text-xl mb-8 leading-relaxed" style={{ color: '#2E2E2E' }}>
                Perfect voor onvergetelijke cadeaus op verjaardagen, feestdagen, of gewoon omdat het kan.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/nl/gifts" className="inline-block">
                  <button className="text-white px-8 py-4 rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer" style={{ backgroundColor: '#8472DF' }}>
                    Shop Cadeaupakket
                  </button>
                </Link>
              </div>
            </div>
            <div className="order-1 lg:order-2 w-full h-96 lg:h-[500px] rounded-xl overflow-hidden shadow-lg">
              <img 
                src="https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/70875d716ddf5ae4b60c514f25ad7174.webp" 
                alt="Gepersonaliseerd Cadeaupakket"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>
        </div>
      </section>

      {/* STEAM Pakket Hero Sectie */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, #ACEEF3 0%, #93C4FF 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* STEAM Pakket Afbeelding */}
            <div className="order-2 lg:order-1 w-full h-96 lg:h-[500px] rounded-xl overflow-hidden shadow-lg">
              <img 
                src="https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/ed2d7e7745697e05b30f29b042b79c5a.png" 
                alt="Gepersonaliseerd STEAM Pakket"
                className="w-full h-full object-cover object-top"
              />
            </div>
            
            {/* Gepersonaliseerd STEAM Pakket */}
            <div className="order-1 lg:order-2">
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight" style={{ color: '#2E2E2E' }}>
                Gepersonaliseerd STEAM Pakket
              </h1>
              <p className="text-xl mb-8 leading-relaxed" style={{ color: '#2E2E2E' }}>
                Bouwen, verven en leren met je kind's tekening!
              </p>
              
              <p className="text-xl mb-8 leading-relaxed" style={{ color: '#2E2E2E' }}>
                Bevat alles om een figuurtje, nachtlampje, magneet & sleutelhangers te maken—allemaal geïnspireerd door hun eigen kunstwerk.
              </p>
              
              <p className="text-xl mb-8 leading-relaxed" style={{ color: '#2E2E2E' }}>
                Stimuleert creativiteit, praktisch leren en eindeloze verbeelding—STEAM plezier voor kinderen en families!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/nl/steam">
                  <button className="text-white px-10 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #8472DF 0%, #93C4FF 100%)' }}>
                    Shop STEAM Pakket
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Originele Hero Sectie */}
      <section className="py-20 overflow-hidden" style={{ background: 'linear-gradient(135deg, #DBEAFE 0%, #F3E8FF 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight" style={{ color: '#2E2E2E' }}>
              Creatief Speelgoed & Kits Die Verbeelding Aanwakkeren
            </h2>
            <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed" style={{ color: '#2E2E2E' }}>
              Van verfkits en STEAM-projecten tot 3D-geprinte speelgoed — Dreamli brengt plezier en leren samen.
            </p>
            <Link href="https://shop.dreamli.nl/" className="inline-block">
              <button className="text-white px-12 py-4 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105 cursor-pointer whitespace-nowrap" style={{ backgroundColor: '#FFB067' }}>
                Shop Alle Producten
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Shop per Categorie */}
      <section className="py-20 bg-white" data-product-shop="true">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" style={{ color: '#2E2E2E' }}>Shop per Categorie</h2>
            <p className="text-xl" style={{ color: '#2E2E2E' }}>Ontdek het perfecte speelgoed voor elke interesse</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {/* Verf & Creatieve Kits */}
            <div className="rounded-3xl p-8 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer border" style={{ backgroundColor: '#F3E8FF', borderColor: '#8472DF' }}>
              <div className="w-full h-48 rounded-2xl mb-6 overflow-hidden">
                <img 
                  src="https://readdy.ai/api/search-image?query=Bright%20colorful%20painting%20and%20creative%20art%20kits%20for%20children%20with%20paintbrushes%20watercolors%20and%20craft%20supplies%20on%20clean%20white%20background%2C%20educational%20art%20materials%20that%20inspire%20creativity%20and%20imagination%20in%20kids&width=300&height=300&seq=cat1nl&orientation=squarish" 
                  alt="Verf & Creatieve Kits"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h3 className="text-xl font-bold mb-2 text-center" style={{ color: '#2E2E2E' }}>🎨 Verf & Creatieve Kits</h3>
              <p className="text-center text-sm" style={{ color: '#2E2E2E' }}>Ontketenen artistieke expressie</p>
            </div>

            {/* STEAM & Robotica */}
            <div className="rounded-3xl p-8 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer border" style={{ backgroundColor: '#DBEAFE', borderColor: '#93C4FF' }}>
              <div className="w-full h-48 rounded-2xl mb-6 overflow-hidden">
                <img 
                  src="https://readdy.ai/api/search-image?query=Modern%20STEM%20and%20robotics%20kits%20for%20kids%20with%20colorful%20building%20blocks%20circuits%20and%20robot%20components%20on%20white%20background%2C%20educational%20technology%20toys%20that%20teach%20coding%20and%20engineering%20concepts%20to%20children&width=300&height=300&seq=cat2nl&orientation=squarish" 
                  alt="STEAM & Robotica"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h3 className="text-xl font-bold mb-2 text-center" style={{ color: '#2E2E2E' }}>🤖 STEAM & Robotica</h3>
              <p className="text-center text-sm" style={{ color: '#2E2E2E' }}>Bouw de toekomst</p>
            </div>

            {/* Educatief Speelgoed */}
            <div className="rounded-3xl p-8 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer border" style={{ backgroundColor: '#ACEEF3', borderColor: '#ACEEF3' }}>
              <div className="w-full h-48 rounded-2xl mb-6 overflow-hidden">
                <img 
                  src="https://readdy.ai/api/search-image?query=Bright%20educational%20toys%20and%20learning%20games%20for%20children%20including%20alphabet%20blocks%20puzzles%20and%20counting%20toys%20on%20white%20background%2C%20colorful%20developmental%20toys%20that%20make%20learning%20fun%20and%20engaging%20for%20kids&width=300&height=300&seq=cat3nl&orientation=squarish" 
                  alt="Educatief Speelgoed"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h3 className="text-xl font-bold mb-2 text-center" style={{ color: '#2E2E2E' }}>🧩 Educatief Speelgoed</h3>
              <p className="text-center text-sm" style={{ color: '#2E2E2E' }}>Leren door spelen</p>
            </div>

            {/* Cadeaudozen */}
            <div className="rounded-3xl p-8 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer border" style={{ backgroundColor: '#F3E8FF', borderColor: '#8472DF' }}>
              <div className="w-full h-48 rounded-2xl mb-6 overflow-hidden">
                <img 
                  src="https://readdy.ai/api/search-image?query=Beautiful%20gift%20boxes%20filled%20with%20assorted%20toys%20and%20activities%20for%20children%2C%20colorful%20surprise%20boxes%20with%20ribbons%20and%20creative%20contents%20on%20white%20background%2C%20perfect%20curated%20toy%20collections%20for%20special%20occasions&width=300&height=300&seq=cat4nl&orientation=squarish" 
                  alt="Cadeaudozen"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h3 className="text-xl font-bold mb-2 text-center" style={{ color: '#2E2E2E' }}>🎁 Cadeaudozen</h3>
              <p className="text-center text-sm" style={{ color: '#2E2E2E' }}>Samengestelde verrassingen</p>
            </div>

            {/* 3D-Geprint Speelgoed */}
            <div className="rounded-3xl p-8 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer border" style={{ backgroundColor: '#DBEAFE', borderColor: '#93C4FF' }}>
              <div className="w-full h-48 rounded-2xl mb-6 overflow-hidden">
                <img 
                  src="https://readdy.ai/api/search-image?query=Innovative%203D%20printed%20toys%20and%20custom%20figurines%20made%20from%20childrens%20drawings%2C%20colorful%20unique%20personalized%20toys%20on%20white%20background%2C%20modern%20technology%20creating%20one-of-a-kind%20playthings%20for%20kids&width=300&height=300&seq=cat5nl&orientation=squarish" 
                  alt="3D-Geprint Speelgoed"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h3 className="text-xl font-bold mb-2 text-center" style={{ color: '#2E2E2E' }}>🖤 3D-Geprint Speelgoed</h3>
              <p className="text-center text-sm" style={{ color: '#2E2E2E' }}>Breng tekeningen tot leven</p>
            </div>
          </div>
        </div>
      </section>

      {/* === FEATURED_PRODUCTS_SLOT (leave this comment) === */}
      <FeaturedProductsServerNL />

      {/* Waarom Dreamli Sectie */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, #ACEEF3 0%, #DBEAFE 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" style={{ color: '#2E2E2E' }}>Waarom Kiezen voor Dreamli?</h2>
            <p className="text-xl" style={{ color: '#2E2E2E' }}>Kwaliteitsspeelgoed dat het verschil maakt</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#ACEEF3' }}>
                <i className="ri-shield-check-line text-2xl" style={{ color: '#2E2E2E' }}></i>
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: '#2E2E2E' }}>Veilige Materialen</h3>
              <p className="text-sm" style={{ color: '#2E2E2E' }}>Hoogwaardige, niet-toxische materialen getest op veiligheid</p>
            </div>
            <div className="text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#F3E8FF' }}>
                <i className="ri-lightbulb-line text-2xl" style={{ color: '#8472DF' }}></i>
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: '#2E2E2E' }}>Inspireert Creativiteit</h3>
              <p className="text-sm" style={{ color: '#2E2E2E' }}>Ontworpen om verbeelding en leren te stimuleren</p>
            </div>
            <div className="text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#DBEAFE' }}>
                <i className="ri-leaf-line text-2xl" style={{ color: '#93C4FF' }}></i>
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: '#2E2E2E' }}>Milieuvriendelijk</h3>
              <p className="text-sm" style={{ color: '#2E2E2E' }}>Duurzaam geproduceerd en lokaal samengesteld</p>
            </div>
            <div className="text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#FFB067' }}>
                <i className="ri-star-line text-2xl text-white"></i>
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: '#2E2E2E' }}>Unieke Selectie</h3>
              <p className="text-sm" style={{ color: '#2E2E2E' }}>Speelgoed dat je niet overal vindt</p>
            </div>
          </div>
        </div>
      </section>

      {/* Ons Verhaal Sectie */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-8" style={{ color: '#2E2E2E' }}>Ons Verhaal</h2>
          <p className="text-xl leading-relaxed" style={{ color: '#2E2E2E' }}>
            Bij Dreamli geloven we dat spelen meer is dan plezier — het is de basis van creativiteit en leren. 
            We zoeken en creëren speelgoed dat vreugde combineert met verbeelding, en geven kinderen de tools 
            om te dromen, bouwen en groeien.
          </p>
        </div>
      </section>

      <FooterNL />
    </div>
  );
}