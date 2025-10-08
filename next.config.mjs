
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
      optimizeCss: true,
        webWorkerTs: true,   // <-- allow TypeScript in web workers
        esmExternals: true,  // <-- keep ESM behavior for worker deps
    },
};
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
