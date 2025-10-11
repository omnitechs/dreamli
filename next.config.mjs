
import createNextIntlPlugin from 'next-intl/plugin';
const nextConfig = {
 // output: "export",
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
    experimental: {
        webWorkerTs: true,   // <-- allow TypeScript in web workers
        esmExternals: true,  // <-- keep ESM behavior for worker deps
        serverActions: {
            // raise as needed (20–50mb is common for images)
            bodySizeLimit: '25mb',
        },
    },
};
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
