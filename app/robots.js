export default function Robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin-panel/', '/api/'],
    },
    sitemap: 'https://www.drrahulghugedental.com/sitemap.xml',
  }
}
