import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const host = process.env.NEXT_PUBLIC_APP_URL || 'https://example.com'
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'CCBot', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'Amazonbot', allow: '/' },
    ],
    sitemap: `${host}/sitemap.xml`,
    host,
  }
}


