/** @type {import('next').NextConfig} */

const nextConfig = {
	reactStrictMode: false,
	async redirects() {
		return [
			{
				source: '/',
				destination: '/tracks',
				permanent: true,
			},
		]
	},
}

export default nextConfig
