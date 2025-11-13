import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://nexthub.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/sign-in/', '/sign-up/', '/meeting/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
