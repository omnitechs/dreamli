
import Header from '../../components/Header';
import BlogHeroNL from './BlogHeroNL';
import CategoryHighlightsNL from './CategoryHighlightsNL';
import FeaturedArticlesNL from './FeaturedArticlesNL';
import LatestPostsNL from './LatestPostsNL';
import TrustSectionNL from './TrustSectionNL';
import NewsletterSignupNL from './NewsletterSignupNL';
import BlogClosingCTANL from './BlogClosingCTANL';
import FooterNL from '../../components/FooterNL';
import BlogPageClientNL from './BlogPageClientNL';

interface WordPressPost {
  id: number;
  slug: string;
  link: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  categories: number[];
  featured_media: number;
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
    }>;
    'wp:term'?: Array<Array<{
      id: number;
      name: string;
      slug: string;
    }>>;
  };
}

interface MediaItem {
  id: number;
  source_url: string;
  alt_text: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

async function getFeaturedPosts() {
  try {
    const response = await fetch(
      'https://blog.dreamli.nl/wp-json/wp/v2/posts?sticky=true&_embed&lang=nl',
      {
        next: { revalidate: 600 },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }

    const posts: WordPressPost[] = await response.json();
    
    if (!posts || posts.length === 0) {
      return [];
    }

    // Process images
    const postsWithImages = await Promise.all(
      posts.map(async (post) => {
        let imageUrl = 'https://readdy.ai/api/search-image?query=creatieve%20kinderen%20spelen%20educatief%20speelgoed%20kleurrijke%20speelse%20leeromgeving%20heldere%20vrolijke%20sfeer&width=600&height=400&seq=default-blog-nl&orientation=landscape';
        let imageAlt = post.title.rendered;

        // Try embedded media first
        if (post._embedded?.['wp:featuredmedia']?.[0]?.source_url) {
          imageUrl = post._embedded['wp:featuredmedia'][0].source_url;
          imageAlt = post._embedded['wp:featuredmedia'][0].alt_text || post.title.rendered;
        } else if (post.featured_media && post.featured_media > 0) {
          // Fallback: fetch media separately
          try {
            const mediaResponse = await fetch(
              `https://blog.dreamli.nl/wp-json/wp/v2/media/${post.featured_media}?_fields=id,source_url,alt_text`,
              { 
                next: { revalidate: 600 },
                headers: {
                  'Accept': 'application/json',
                }
              }
            );
            
            if (mediaResponse.ok) {
              const mediaData: MediaItem = await mediaResponse.json();
              if (mediaData.source_url) {
                imageUrl = mediaData.source_url;
                imageAlt = mediaData.alt_text || post.title.rendered;
              }
            }
          } catch (error) {
            console.error('Failed to fetch media for post', post.id, error);
          }
        }

        return {
          ...post,
          imageUrl,
          imageAlt
        };
      })
    );

    // Process categories
    const postsWithCategories = await Promise.all(
      postsWithImages.map(async (post) => {
        let categoryNames: string[] = [];

        // Try embedded categories first
        if (post._embedded?.['wp:term']?.[0]) {
          categoryNames = post._embedded['wp:term'][0]
            .filter(term => post.categories.includes(term.id))
            .map(term => term.name);
        } else if (post.categories && post.categories.length > 0) {
          // Fallback: fetch categories separately
          try {
            const categoriesResponse = await fetch(
              `https://blog.dreamli.nl/wp-json/wp/v2/categories?include=${post.categories.join(',')}&_fields=id,name,slug`,
              { 
                next: { revalidate: 600 },
                headers: {
                  'Accept': 'application/json',
                }
              }
            );
            
            if (categoriesResponse.ok) {
              const categoriesData: Category[] = await categoriesResponse.json();
              categoryNames = categoriesData.map(cat => cat.name);
            }
          } catch (error) {
            console.error('Failed to fetch categories for post', post.id, error);
          }
        }

        return {
          ...post,
          categoryNames: categoryNames.length > 0 ? categoryNames : ['Algemeen']
        };
      })
    );

    return postsWithCategories;

  } catch (error) {
    console.error('Error fetching featured posts:', error);
    return null;
  }
}

export default async function BlogPageNL() {
  const featuredPosts = await getFeaturedPosts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Header />
      <BlogHeroNL />
      <CategoryHighlightsNL />
      
      {/* === FEATURED_POSTS_SLOT (leave this comment) === */}
      <FeaturedArticlesNL featuredPosts={featuredPosts} />
      
      <LatestPostsNL />
      <TrustSectionNL />
      <NewsletterSignupNL />
      <BlogClosingCTANL />
      <FooterNL />
      
      <BlogPageClientNL />
    </div>
  );
}

export const metadata = {
  title: 'Dreamli Blog - Creatief Spelen & Kinderontwikkeling Inzichten',
  description: 'Ontdek deskundige inzichten over creatief spelen, kinderontwikkeling en educatieve activiteiten. Lees succesverhalen en tips om verbeelding bij kinderen te stimuleren.',
  keywords: 'creatief spelen, kinderontwikkeling, educatieve activiteiten, opvoedingstips, verbeelding, STEM leren, creativiteit',
  openGraph: {
    title: 'Dreamli Blog - Creatief Spelen & Kinderontwikkeling Inzichten',
    description: 'Deskundige inzichten over creatief spelen, kinderontwikkeling en educatieve activiteiten om verbeelding bij kinderen te stimuleren.',
    images: [{
      url: 'https://readdy.ai/api/search-image?query=kleurrijke%20creatieve%20kinderen%20blog%20header%20educatief%20speelgoed%20leren%20speelse%20omgeving%20heldere%20vrolijke%20sfeer&width=1200&height=630&seq=blog-og-nl&orientation=landscape',
      width: 1200,
      height: 630,
    }],
  },
};
