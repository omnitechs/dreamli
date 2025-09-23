
import Header from '../components/Header';
import BlogHero from './BlogHero';
import CategoryHighlights from './CategoryHighlights';
import FeaturedArticles from './FeaturedArticles';
import LatestPosts from './LatestPosts';
import TrustSection from './TrustSection';
import NewsletterSignup from './NewsletterSignup';
import BlogClosingCTA from './BlogClosingCTA';
import Footer from '../components/Footer';
import BlogPageClient from './BlogPageClient';

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
      'https://blog.dreamli.nl/wp-json/wp/v2/posts?sticky=true&_embed&lang=en',
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
        let imageUrl = 'https://readdy.ai/api/search-image?query=creative%20children%20playing%20educational%20toys%20colorful%20playful%20learning%20environment%20bright%20cheerful%20atmosphere&width=600&height=400&seq=default-blog&orientation=landscape';
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
          categoryNames: categoryNames.length > 0 ? categoryNames : ['General']
        };
      })
    );

    return postsWithCategories;

  } catch (error) {
    console.error('Error fetching featured posts:', error);
    return null;
  }
}

export default async function BlogPage() {
  const featuredPosts = await getFeaturedPosts();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <BlogHero />
      <CategoryHighlights />
      
      {/* === FEATURED_POSTS_SLOT (leave this comment) === */}
      <FeaturedArticles featuredPosts={featuredPosts} />
      
      <LatestPosts />
      <TrustSection />
      <NewsletterSignup />
      <BlogClosingCTA />
      <Footer />
      
      <BlogPageClient />
    </div>
  );
}

export const metadata = {
  title: 'Dreamli Blog - Creative Play & Child Development Insights',
  description: 'Discover expert insights on creative play, child development, and educational activities. Read success stories and tips to spark imagination in children.',
  keywords: 'creative play, child development, educational activities, parenting tips, imagination, STEM learning, creativity',
  openGraph: {
    title: 'Dreamli Blog - Creative Play & Child Development Insights',
    description: 'Expert insights on creative play, child development, and educational activities to spark imagination in children.',
    images: [{
      url: 'https://readdy.ai/api/search-image?query=colorful%20creative%20children%20blog%20header%20educational%20toys%20learning%20playful%20environment%20bright%20cheerful%20atmosphere&width=1200&height=630&seq=blog-og&orientation=landscape',
      width: 1200,
      height: 630,
    }],
  },
};
