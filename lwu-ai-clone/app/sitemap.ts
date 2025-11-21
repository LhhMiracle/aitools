import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const routes = [
    '',
    '/tools',
    '/tools/image-generation',
    '/tools/image-upscale',
    '/tools/background-removal',
    '/tools/image-to-video',
    '/tools/text-to-speech',
    '/tools/hair-style',
    '/tools/cartoon-style',
    '/tools/portrait-enhance',
    '/tools/face-swap',
    '/tools/object-removal',
    '/tools/scene-composite',
    '/tools/photo-animation',
    '/tools/special-effects',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));
}
