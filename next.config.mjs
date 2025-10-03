

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
    },
};

export default nextConfig;
