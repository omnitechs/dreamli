
import Link from 'next/link';
import React from 'react';

interface FeaturedPost {
  id: number;
  slug: string;
  link: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  categories: number[];
  featured_media: number;
  imageUrl: string;
  imageAlt: string;
  categoryNames: string[];
  decodedTitle?: string;
  truncatedExcerpt?: string;
  categories?: string[];
}

interface FeaturedArticlesProps {
  featuredPosts: FeaturedPost[] | null;
}

/**
 * Decode a limited set of HTML entities to plain characters.
 * Falls back to the original text if an unexpected error occurs.
 */
function decodeHtmlEntities(text: string): string {
  try {
    const entities: { [key: string]: string } = {
      '&#8217;': "'",
      '&#8211;': "–",
      '&#8212;': "—",
      '&#8220;': '"', // left double quotation mark
      '&#8221;': '"', // right double quotation mark
      '&#8216;': "'",
      '&#038;': "&",
      '&amp;': "&",
      '&lt;': "<",
      '&gt;': ">",
      '&quot;': '"',
      '&apos;': "'",
      '&nbsp;': " ",
    };

    let decoded = text;
    for (const [entity, char] of Object.entries(entities)) {
      decoded = decoded.replace(new RegExp(entity, 'g'), char);
    }
    return decoded;
  } catch (e) {
    console.error('decodeHtmlEntities error:', e);
    return text;
  }
}

/** Strip HTML tags from a string and trim whitespace. */
function sanitizeHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

/** Truncate a text to a maximum length without cutting words mid‑way. */
function truncateText(text: string, maxLength: number = 140): string {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength).replace(/\s+\S*$/, '') + '...';
}

/**
 * Fetch sticky posts from the WordPress API and resolve their media and categories.
 * Returns `null` on fatal errors so the caller can decide on a fallback UI.
 */
async function getFeaturedPosts(): Promise<FeaturedPost[] | null> {
  try {
    const response = await fetch(
      'https://blog.dreamli.nl/wp-json/wp/v2/posts?sticky=true&_embed&lang=nl&_fields=id,slug,link,title,excerpt,categories,featured_media,_embedded',
      { next: { revalidate: 600 } }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }

    const posts = await response.json();

    // -------------------------------------------------
    // Resolve images for posts that lack an embedded image
    // -------------------------------------------------
    const postsNeedingImages = posts.filter(
      (post: any) =>
        post.featured_media && post.featured_media !== 0 && !post._embedded?.['wp:featuredmedia']?.[0]?.source_url
    );

    let mediaMap: { [key: number]: { source_url: string; alt_text: string } } = {};

    if (postsNeedingImages.length > 0) {
      const mediaIds = postsNeedingImages.map((p: any) => p.featured_media);
      const uniqueMediaIds = Array.from(new Set(mediaIds));

      try {
        const mediaResponse = await fetch(
          `https://blog.dreamli.nl/wp-json/wp/v2/media?include=${uniqueMediaIds.join(
            ','
          )}&_fields=id,source_url,alt_text,media_details`,
          { next: { revalidate: 600 } }
        );

        if (mediaResponse.ok) {
          const mediaData = await mediaResponse.json();
          mediaMap = mediaData.reduce((acc: any, media: any) => {
            acc[media.id] = {
              source_url: media.source_url,
              alt_text: media.alt_text || '',
            };
            return acc;
          }, {});
        }
      } catch (error) {
        console.error('Failed to fetch media:', error);
      }
    }

    // -------------------------------------------------
    // Resolve categories for posts that lack an embedded term
    // -------------------------------------------------
    const postsNeedingCategories = posts.filter(
      (post: any) => post.categories?.length > 0 && !post._embedded?.['wp:term']?.[0]
    );

    let categoryMap: { [key: number]: string } = {};

    if (postsNeedingCategories.length > 0) {
      const categoryIds = postsNeedingCategories.flatMap((p: any) => p.categories || []);
      const uniqueCategoryIds = Array.from(new Set(categoryIds));

      try {
        const categoryResponse = await fetch(
          `https://blog.dreamli.nl/wp-json/wp/v2/categories?include=${uniqueCategoryIds.join(
            ','
          )}&_fields=id,name,slug`,
          { next: { revalidate: 600 } }
        );

        if (categoryResponse.ok) {
          const categoryData = await categoryResponse.json();
          categoryMap = categoryData.reduce((acc: any, cat: any) => {
            acc[cat.id] = cat.name;
            return acc;
          }, {});
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    }

    // -------------------------------------------------
    // Build the final post objects with all resolved data
    // -------------------------------------------------
    const processedPosts: FeaturedPost[] = posts.map((post: any) => {
      // Default placeholder image
      let imageUrl =
        'https://readdy.ai/api/search-image?query=creatief%20educatief%20speelgoed%20voor%20kinderen%20leren%20door%20spelen%20kleurrijke%20achtergrond&width=400&height=256&seq=blog-placeholder-nl&orientation=landscape';
      let imageAlt = 'Blog post afbeelding';

      if (post._embedded?.['wp:featuredmedia']?.[0]?.source_url) {
        imageUrl = post._embedded['wp:featuredmedia'][0].source_url;
        imageAlt = post._embedded['wp:featuredmedia'][0].alt_text || 'Uitgelichte afbeelding';
      } else if (post.featured_media && mediaMap[post.featured_media]) {
        imageUrl = mediaMap[post.featured_media].source_url;
        imageAlt = mediaMap[post.featured_media].alt_text || 'Uitgelichte afbeelding';
      }

      // Resolve category names
      let categories: string[] = [];
      if (post._embedded?.['wp:term']?.[0]) {
        categories = post._embedded['wp:term'][0].map((term: any) => decodeHtmlEntities(term.name));
      } else if (post.categories?.length > 0) {
        categories = post.categories
          .map((catId: number) => categoryMap[catId] ? decodeHtmlEntities(categoryMap[catId]) : 'Algemeen')
          .filter(Boolean);
      }

      // Decode and clean title / excerpt
      const decodedTitle = decodeHtmlEntities(post.title?.rendered ?? 'Zonder titel');
      const decodedExcerpt = decodeHtmlEntities(post.excerpt?.rendered ?? '');

      const cleanExcerpt = decodedExcerpt
        .replace(/<[^>]*>/g, '')
        .replace(/\s+/g, ' ')
        .trim();

      const truncatedExcerpt = truncateText(cleanExcerpt, 140);

      return {
        id: post.id,
        slug: post.slug,
        link: post.link,
        title: post.title,
        excerpt: post.excerpt,
        categories: post.categories,
        featured_media: post.featured_media,
        imageUrl,
        imageAlt,
        categoryNames: categories,
        decodedTitle,
        truncatedExcerpt,
        categories, // keep for rendering convenience
      };
    });

    return processedPosts;
  } catch (error) {
    console.error('Error fetching featured posts:', error);
    return null;
  }
}

/**
 * FeaturedArticles component – displays a grid of sticky blog posts.
 * Falls back to a static list when the API call fails.
 */
export default async function FeaturedArticlesNL({ featuredPosts }: FeaturedArticlesProps) {
  // Use passed posts or fetch them
  const posts = featuredPosts ?? await getFeaturedPosts();

  // -------------------------------------------------
  // Pre‑defined fallback posts (used when API fails)
  // -------------------------------------------------
  const fallbackPosts: FeaturedPost[] = [
    {
      id: 1,
      slug: '',
      link: 'https://blog.dreamli.nl/de-wetenschap-van-creatief-spelen',
      title: { rendered: 'De Wetenschap van Creatief Spelen' },
      excerpt: {
        rendered:
          'Ontdek hoe creatieve activiteiten de cognitieve ontwikkeling en emotionele intelligentie van kinderen stimuleren.',
      },
      categories: [],
      featured_media: 0,
      imageUrl:
        'https://readdy.ai/api/search-image?query=blije%20kinderen%20bezig%20met%20creatieve%20spelactiviteiten%20schilderen%20tekenen%20met%20kleurrijke%20kunstbenodigdheden%20in%20heldere%20speelse%20klaslokaal%20setting%20met%20natuurlijk%20licht%20en%20vrolijke%20uitdrukkingen&width=600&height=400&seq=wetenschap-creatief-spelen-nl&orientation=landscape',
      imageAlt: 'De Wetenschap van Creatief Spelen',
      categoryNames: ['Kinderontwikkeling'],
      decodedTitle: 'De Wetenschap van Creatief Spelen',
      truncatedExcerpt:
        'Ontdek hoe creatieve activiteiten de cognitieve ontwikkeling en emotionele intelligentie van kinderen stimuleren.',
    },
    {
      id: 4,
      slug: '',
      link: 'https://blog.dreamli.nl/5-creatieve-activiteiten-voor-kinderen-thuis-om-verbeelding-te-stimuleren/',
      title: { rendered: '5 Creatieve Activiteiten voor Kinderen Thuis om Verbeelding te Stimuleren' },
      excerpt: {
        rendered:
          'Leuke en boeiende activiteiten die kinderen helpen hun verbeelding en creativiteit te ontwikkelen vanuit het comfort van thuis.',
      },
      categories: [],
      featured_media: 0,
      imageUrl:
        'https://readdy.ai/api/search-image?query=kinderen%20doen%20creatieve%20activiteiten%20thuis%20met%20ouders%20verbeelding%20spelen%20bouwblokken%20verhalen%20vertellen%20arts%20ambachten%20in%20gezellige%20woonkamer%20gelukkige%20familie%20binding%20kleurrijk%20speelgoed&width=600&height=400&seq=creatieve-activiteiten-thuis-nl&orientation=landscape',
      imageAlt: '5 Creatieve Activiteiten voor Kinderen Thuis om Verbeelding te Stimuleren',
      categoryNames: ['Activiteiten'],
      decodedTitle: '5 Creatieve Activiteiten voor Kinderen Thuis om Verbeelding te Stimuleren',
      truncatedExcerpt:
        'Leuke en boeiende activiteiten die kinderen helpen hun verbeelding en creativiteit te ontwikkelen vanuit het comfort van thuis.',
    },
    {
      id: 5,
      slug: '',
      link: 'https://blog.dreamli.nl/het-cadeau-dat-alles-veranderde-een-vaders-nalatenschap-de-spelletjes-die-een-geest-bouwden/',
      title: {
        rendered:
          'Het Cadeau Dat Alles Veranderde: Een Vaders Nalatenschap - De Spelletjes Die Een Geest Bouwden',
      },
      excerpt: {
        rendered:
          'Een ontroerend verhaal over hoe een vaders creatieve benadering van spelen de ontwikkeling en blijvende herinneringen van zijn kind vormde.',
      },
      categories: [],
      featured_media: 0,
      imageUrl:
        'https://readdy.ai/api/search-image?query=vader%20en%20kind%20spelen%20samen%20educatieve%20spelletjes%20bouwblokken%20puzzels%20creatieve%20activiteiten%20in%20warme%20thuisomgeving%20nalatenschap%20van%20leren%20intergenerationele%20binding%20emotionele%20verbinding&width=600&height=400&seq=vader-nalatenschap-spelletjes-nl&orientation=landscape',
      imageAlt: 'Het Cadeau Dat Alles Veranderde: Een Vaders Nalatenschap - De Spelletjes Die Een Geest Bouwden',
      categoryNames: ['Succesverhalen'],
      decodedTitle:
        'Het Cadeau Dat Alles Veranderde: Een Vaders Nalatenschap - De Spelletjes Die Een Geest Bouwden',
      truncatedExcerpt:
        'Een ontroerend verhaal over hoe een vaders creatieve benadering van spelen de ontwikkeling en blijvende herinneringen van zijn kind vormde.',
    },
  ];

  // Choose real posts if available, otherwise fallback.
  const displayPosts = posts ?? fallbackPosts;

  if (displayPosts.length === 0) {
    // Defensive UI – should never happen because fallbackPosts is non‑empty,
    // but we keep the guard for completeness.
    return (
      <section className="py-20 bg-gradient-to-b from-white to-purple-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Uitgelichte Artikelen</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Duik in onze meest populaire verhalen over creativiteit, opvoeding en het tot leven brengen van verbeelding.
            </p>
          </div>
          <div className="text-center py-12">
            <i className="ri-article-line text-gray-400 text-6xl mb-4 w-16 h-16 flex items-center justify-center mx-auto"></i>
            <p className="text-gray-500 text-lg">Nu geen uitgelichte berichten — kom snel terug!</p>
          </div>
        </div>
      </section>
    );
  }

  // -------------------------------------------------
  // Render the list of posts
  // -------------------------------------------------
  return (
    <section className="py-20 bg-gradient-to-b from-white to-purple-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Uitgelichte Artikelen</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Duik in onze meest populaire verhalen over creativiteit, opvoeding en het tot leven brengen van verbeelding.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {displayPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
            >
              <div className="relative">
                <img
                  src={post.imageUrl}
                  alt={post.imageAlt}
                  className="w-full h-64 object-cover object-top group-hover:scale-105 transition-transform duration-300"
                />
                {post.categoryNames && post.categoryNames.length > 0 && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 text-purple-600 px-3 py-1 rounded-full text-sm font-medium">
                      {post.categoryNames[0]}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex items-center text-gray-500 text-sm mb-3">
                  <i className="ri-time-line w-4 h-4 flex items-center justify-center mr-2"></i>
                  5 min lezen
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
                  {post.decodedTitle ?? post.title.rendered}
                </h3>

                <p className="text-gray-600 mb-4 leading-relaxed">
                  {post.truncatedExcerpt ?? sanitizeHtml(post.excerpt.rendered)}
                </p>

                {post.link.startsWith('https') ? (
                  <a
                    href={post.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-purple-600 font-semibold hover:text-purple-700 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Lees Meer
                    <i className="ri-arrow-right-line ml-2 w-4 h-4 flex items-center justify-center"></i>
                  </a>
                ) : (
                  <Link
                    href={post.link}
                    className="inline-flex items-center text-purple-600 font-semibold hover:text-purple-700 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Lees Meer
                    <i className="ri-arrow-right-line ml-2 w-4 h-4 flex items-center justify-center"></i>
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
