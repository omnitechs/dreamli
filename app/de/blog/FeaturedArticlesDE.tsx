import Link from 'next/link';
import Image from 'next/image';
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

function decodeHtmlEntities(text: string): string {
  try {
    const entities: { [key: string]: string } = {
      '&#8217;': "'",
      '&#8211;': "–",
      '&#8212;': "—",
      '&#8220;': '"',
      '&#8221;': '"',
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

function sanitizeHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

function truncateText(text: string, maxLength: number = 140): string {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength).replace(/\s+\S*$/, '') + '...';
}

async function getFeaturedPosts(): Promise<FeaturedPost[] | null> {
  try {
    const response = await fetch(
      'https://blog.dreamli.nl/wp-json/wp/v2/posts?sticky=true&_embed&_fields=id,slug,link,title,excerpt,categories,featured_media,_embedded',
      { next: { revalidate: 600 } }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }

    const posts = await response.json();

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

    const processedPosts: FeaturedPost[] = posts.map((post: any) => {
      let imageUrl =
        'https://readdy.ai/api/search-image?query=creative%20educational%20toys%20for%20children%20learning%20through%20play%20colorful%20background&width=400&height=256&seq=blog-placeholder-de&orientation=landscape';
      let imageAlt = 'Blog Artikel Bild';

      if (post._embedded?.['wp:featuredmedia']?.[0]?.source_url) {
        imageUrl = post._embedded['wp:featuredmedia'][0].source_url;
        imageAlt = post._embedded['wp:featuredmedia'][0].alt_text || 'Vorgestelltes Bild';
      } else if (post.featured_media && mediaMap[post.featured_media]) {
        imageUrl = mediaMap[post.featured_media].source_url;
        imageAlt = mediaMap[post.featured_media].alt_text || 'Vorgestelltes Bild';
      }

      let categories: string[] = [];
      if (post._embedded?.['wp:term']?.[0]) {
        categories = post._embedded['wp:term'][0].map((term: any) => decodeHtmlEntities(term.name));
      } else if (post.categories?.length > 0) {
        categories = post.categories
          .map((catId: number) => categoryMap[catId] ? decodeHtmlEntities(categoryMap[catId]) : 'Unkategorisiert')
          .filter(Boolean);
      }

      const decodedTitle = decodeHtmlEntities(post.title?.rendered ?? 'Ohne Titel');
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
        categories,
      };
    });

    return processedPosts;
  } catch (error) {
    console.error('Error fetching featured posts:', error);
    return null;
  }
}

export default async function FeaturedArticlesDE() {
  const posts = await getFeaturedPosts();

  const fallbackPosts: FeaturedPost[] = [
    {
      id: 1,
      slug: '',
      link: 'https://blog.dreamli.nl/the-science-of-crativity-play',
      title: { rendered: 'Die Wissenschaft des kreativen Spiels' },
      excerpt: {
        rendered:
          'Entdecken Sie, wie kreative Aktivitäten die kognitive Entwicklung und emotionale Intelligenz bei Kindern fördern.',
      },
      categories: [],
      featured_media: 0,
      imageUrl:
        'https://readdy.ai/api/search-image?query=happy%20children%20engaged%20in%20creative%20play%20activities%20painting%20drawing%20with%20colorful%20art%20supplies%20in%20bright%20playful%20classroom%20setting%20with%20natural%20lighting%20and%20joyful%20expressions&width=600&height=400&seq=science-creative-play-de&orientation=landscape',
      imageAlt: 'Die Wissenschaft des kreativen Spiels',
      categoryNames: ['Kindesentwicklung'],
      decodedTitle: 'Die Wissenschaft des kreativen Spiels',
      truncatedExcerpt:
        'Entdecken Sie, wie kreative Aktivitäten die kognitive Entwicklung und emotionale Intelligenz bei Kindern fördern.',
    },
    {
      id: 4,
      slug: '',
      link: 'https://blog.dreamli.nl/5-creative-activities-for-kids-at-home-to-boost-imagination/',
      title: { rendered: '5 kreative Aktivitäten für Kinder zu Hause zur Förderung der Fantasie' },
      excerpt: {
        rendered:
          'Spaßige und fesselnde Aktivitäten, die Kindern helfen, ihre Fantasie und Kreativität bequem von zu Hause aus zu entwickeln.',
      },
      categories: [],
      featured_media: 0,
      imageUrl:
        'https://readdy.ai/api/search-image?query=children%20doing%20creative%20activities%20at%20home%20with%20parents%20imagination%20play%20building%20blocks%20storytelling%20arts%20crafts%20in%20cozy%20living%20room%20happy%20family%20bonding%20colorful%20toys&width=600&height=400&seq=creative-activities-home-de&orientation=landscape',
      imageAlt: '5 kreative Aktivitäten für Kinder zu Hause zur Förderung der Fantasie',
      categoryNames: ['Aktivitäten'],
      decodedTitle: '5 kreative Aktivitäten für Kinder zu Hause zur Förderung der Fantasie',
      truncatedExcerpt:
        'Spaßige und fesselnde Aktivitäten, die Kindern helfen, ihre Fantasie und Kreativität bequem von zu Hause aus zu entwickeln.',
    },
    {
      id: 5,
      slug: '',
      link: 'https://blog.dreamli.nl/the-gift-that-changed-everything-a-fathers-legacy-the-games-that-built-a-mind/',
      title: {
        rendered:
          'Das Geschenk, das alles veränderte: Das Vermächtnis eines Vaters - Die Spiele, die einen Geist formten',
      },
      excerpt: {
        rendered:
          'Eine berührende Geschichte darüber, wie ein Vaters kreativer Ansatz zum Spielen die Entwicklung und bleibenden Erinnerungen seines Kindes geprägt hat.',
      },
      categories: [],
      featured_media: 0,
      imageUrl:
        'https://readdy.ai/api/search-image?query=father%20and%20child%20playing%20educational%20games%20together%20building%20blocks%20puzzles%20creative%20activities%20in%20warm%20home%20setting%20legacy%20of%20learning%20intergenerational%20bonding%20emotional%20connection&width=600&height=400&seq=father-legacy-games-de&orientation=landscape',
      imageAlt: 'Das Geschenk, das alles veränderte: Das Vermächtnis eines Vaters - Die Spiele, die einen Geist formten',
      categoryNames: ['Erfolgsgeschichten'],
      decodedTitle:
        'Das Geschenk, das alles veränderte: Das Vermächtnis eines Vaters - Die Spiele, die einen Geist formten',
      truncatedExcerpt:
        'Eine berührende Geschichte darüber, wie ein Vaters kreativer Ansatz zum Spielen die Entwicklung und bleibenden Erinnerungen seines Kindes geprägt hat.',
    },
  ];

  const displayPosts = posts ?? fallbackPosts;

  if (displayPosts.length === 0) {
    return (
      <section className="py-20 bg-gradient-to-b from-white to-purple-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Vorgestellte Artikel</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tauchen Sie ein in unsere beliebtesten Geschichten über Kreativität, Erziehung und das Erwecken der Fantasie zum Leben.
            </p>
          </div>
          <div className="text-center py-12">
            <i className="ri-article-line text-gray-400 text-6xl mb-4 w-16 h-16 flex items-center justify-center mx-auto"></i>
            <p className="text-gray-500 text-lg">Derzeit keine vorgestellten Artikel – schauen Sie bald wieder vorbei!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-white to-purple-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Vorgestellte Artikel</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tauchen Sie ein in unsere beliebtesten Geschichten über Kreativität, Erziehung und das Erwecken der Fantasie zum Leben.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {displayPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
            >
              <div className="relative">
                <Image
                  src={post.imageUrl}
                  alt={post.imageAlt}
                  width={600}
                  height={256}
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
                  5 Min. Lesezeit
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
                    Weiterlesen
                    <i className="ri-arrow-right-line ml-2 w-4 h-4 flex items-center justify-center"></i>
                  </a>
                ) : (
                  <Link
                    href={post.link}
                    className="inline-flex items-center text-purple-600 font-semibold hover:text-purple-700 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Weiterlesen
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