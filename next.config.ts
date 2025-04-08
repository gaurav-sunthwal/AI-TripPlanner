import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  optimizePackageImports: ["@chakra-ui/react", "next/image"],
  images: {
    domains: ['www.ritzcarlton.com', 'dynamic-media-cdn.tripadvisor.com', 'www.culturalindia.net', 'upload.wikimedia.org', 'content3.jdmagicbox.com','media-cdn.tripadvisor.com','www.fabhotels.com'],
  },
};

export default nextConfig;
