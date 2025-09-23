
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog - Dreamli | Creativity, Parenting Tips & Behind the Scenes Stories',
  description: 'Discover expert insights on child creativity, parenting tips, and behind-the-scenes stories from Dreamli. Learn how to nurture your child\'s imagination and development.',
  keywords: 'child creativity, parenting tips, child development, Dreamli stories, creativity education, children imagination',
  openGraph: {
    title: 'Blog - Dreamli | Creativity, Parenting Tips & Behind the Scenes Stories',
    description: 'Discover expert insights on child creativity, parenting tips, and behind-the-scenes stories from Dreamli. Learn how to nurture your child\'s imagination and development.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog - Dreamli | Creativity, Parenting Tips & Behind the Scenes Stories',
    description: 'Discover expert insights on child creativity, parenting tips, and behind-the-scenes stories from Dreamli. Learn how to nurture your child\'s imagination and development.',
  }
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
