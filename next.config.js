/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'Rating', value: 'general' },
                    { key: 'X-Permitted-Cross-Domain-Policies', value: 'none' },
                ],
            },
        ];
    },
}
module.exports = nextConfig
