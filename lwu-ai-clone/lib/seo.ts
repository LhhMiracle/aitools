import { Metadata } from 'next';

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: 'website' | 'article';
  noindex?: boolean;
}

const DEFAULT_SEO: SEOConfig = {
  title: 'LWU.AI - AI-Powered Creative Tools',
  description: 'Transform your ideas into reality with our suite of AI-powered creative tools. Generate images, remove backgrounds, upscale photos, and more.',
  keywords: ['AI tools', 'image generation', 'background removal', 'AI upscale', 'creative tools', 'artificial intelligence'],
  ogImage: '/og-image.jpg',
  ogType: 'website',
};

export function generateMetadata(config?: Partial<SEOConfig>): Metadata {
  const seo = { ...DEFAULT_SEO, ...config };
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    authors: [{ name: 'LWU.AI' }],
    creator: 'LWU.AI',
    publisher: 'LWU.AI',
    robots: seo.noindex ? 'noindex,nofollow' : 'index,follow',
    openGraph: {
      type: seo.ogType,
      locale: 'en_US',
      url: baseUrl,
      title: seo.title,
      description: seo.description,
      siteName: 'LWU.AI',
      images: [
        {
          url: seo.ogImage || '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: seo.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
      images: [seo.ogImage || '/og-image.jpg'],
      creator: '@lwuai',
    },
    alternates: {
      canonical: baseUrl,
    },
    icons: {
      icon: '/favicon.ico',
      apple: '/apple-touch-icon.png',
    },
    manifest: '/site.webmanifest',
  };
}

// Page-specific SEO configurations
export const PAGE_SEO = {
  home: {
    title: 'LWU.AI - AI-Powered Creative Tools for Everyone',
    description: 'Create stunning images, remove backgrounds, upscale photos, and more with our AI-powered creative tools. Start for free with 10 credits.',
    keywords: ['AI image generator', 'background remover', 'AI upscaler', 'text to speech', 'creative AI tools'],
  },
  dashboard: {
    title: 'Dashboard - LWU.AI',
    description: 'Manage your AI creations, track your credits, and access all your tools in one place.',
    noindex: true,
  },
  tools: {
    title: 'AI Tools - LWU.AI',
    description: 'Explore our collection of AI-powered creative tools including image generation, background removal, upscaling, and more.',
    keywords: ['AI tools', 'image generation', 'background removal', 'image upscale', 'text to speech'],
  },
  pricing: {
    title: 'Pricing - LWU.AI',
    description: 'Choose the perfect plan for your creative needs. All plans include a 7-day free trial and instant access to all AI tools.',
    keywords: ['AI tools pricing', 'subscription plans', 'credits packages', 'AI tools cost'],
  },
  login: {
    title: 'Sign In - LWU.AI',
    description: 'Sign in to access your AI creative tools and manage your account.',
    noindex: true,
  },
} as const;

export function generatePageMetadata(page: keyof typeof PAGE_SEO): Metadata {
  return generateMetadata(PAGE_SEO[page]);
}
