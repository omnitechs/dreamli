
interface Product {
  id: number;
  name: string;
  permalink: string;
  price: string;
  price_html: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  short_description: string;
  images: Array<{
    id: number;
    src: string;
    alt: string;
  }>;
}

async function fetchFeaturedProducts(): Promise<Product[]> {
  try {
    const credentials = Buffer.from(
      'ck_58128e135ff8c970bba6cf1d0d14a369f2a01fe0:cs_45f1740f1ecc626027e08211d5e418bcb143a3d3'
    ).toString('base64');

    // Add timestamp to prevent aggressive caching
    const timestamp = Math.floor(Date.now() / (10 * 60 * 1000)); // Changes every 10 minutes
    const response = await fetch(
      `https://shop.dreamli.nl/wp-json/wc/v3/products?featured=true&status=publish&per_page=12&_fields=id,name,permalink,price,price_html,regular_price,sale_price,on_sale,short_description,images&cache_bust=${timestamp}`,
      {
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, must-revalidate',
        },
        next: { revalidate: 600 }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}

function sanitizeDescription(html: string, maxLength: number = 140): string {
  const text = html.replace(/<[^>]*>/g, '');
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

export default async function FeaturedProductsServer() {
  const products = await fetchFeaturedProducts();

  if (products.length === 0) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4" style={{ color: '#2E2E2E' }}>Featured Products</h2>
            <p style={{ color: '#2E2E2E' }}>No featured products available right now — check back soon!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4" style={{ color: '#2E2E2E' }}>Featured Products</h2>
          <p className="max-w-2xl mx-auto" style={{ color: '#2E2E2E' }}>
            Discover our handpicked selection of creative toys and kits
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" data-product-shop>
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-lg transition-shadow duration-300" style={{ borderColor: '#DBEAFE' }}>
              <div className="aspect-square overflow-hidden relative" style={{ backgroundColor: '#F3E8FF' }}>
                {product.on_sale && (
                  <div className="absolute top-3 left-3 text-white px-2 py-1 rounded-full text-xs font-bold z-10" style={{ backgroundColor: '#FFB067' }}>
                    SALE
                  </div>
                )}
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0].src}
                    alt={product.images[0].alt || product.name}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #F3E8FF 0%, #DBEAFE 100%)' }}>
                    <i className="ri-image-line text-4xl" style={{ color: '#8472DF' }}></i>
                  </div>
                )}
              </div>

              <div className="p-6">
                <h3 className="font-bold mb-2 text-lg leading-tight" style={{ color: '#2E2E2E' }}>
                  {product.name}
                </h3>

                {product.short_description && (
                  <p className="text-sm mb-4 leading-relaxed" style={{ color: '#2E2E2E' }}>
                    {sanitizeDescription(product.short_description)}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    {product.on_sale && product.regular_price ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold" style={{ color: '#FFB067' }}>
                          €{product.sale_price || product.price}
                        </span>
                        <span className="text-sm line-through" style={{ color: '#2E2E2E' }}>
                          €{product.regular_price}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xl font-bold" style={{ color: '#8472DF' }}>
                        €{product.price || product.regular_price}
                      </span>
                    )}
                  </div>

                  <a
                    href={product.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 whitespace-nowrap cursor-pointer hover:opacity-90"
                    style={{ backgroundColor: '#8472DF' }}
                  >
                    Shop Now
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
