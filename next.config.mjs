
import createNextIntlPlugin from 'next-intl/plugin';
const nextConfig = {
 // output: "export",
  images: {
    unoptimized: true,
      domains: ['blob.vercel-storage.com'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
    experimental: {
        esmExternals: true,  // <-- keep ESM behavior for worker deps
        serverActions: {
            // raise as needed (20–50mb is common for images)
            bodySizeLimit: '25mb',
        },
    },
};
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
