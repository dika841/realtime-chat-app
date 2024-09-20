/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['lh3.googleusercontent.com']
      },
      async redirects() {
        return [
          {
            source: "/",
            destination: "/login",
            permanent: true,
          },
        ];
      },
};

export default nextConfig;
