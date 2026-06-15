import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.NEXTAUTH_URL || 'https://f-travel.id').replace(/\/$/, '');
  const locales = ['id', 'en'];

  // Static routes
  const staticPaths = ['', '/about', '/contact', '/blog', '/destinations', '/portfolio', '/gallery'];
  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Add static routes for all locales
  for (const locale of locales) {
    for (const path of staticPaths) {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === '' ? 'daily' : 'weekly',
        priority: path === '' ? 1.0 : 0.8,
      });
    }
  }

  // Fetch dynamic routes
  try {
    const destinations = await prisma.destination.findMany({
      select: { slug: true, updatedAt: true },
      where: { status: 'PUBLISHED' },
    });

    const packages = await prisma.travelPackage.findMany({
      select: { slug: true, updatedAt: true },
      where: { status: 'PUBLISHED' },
    });

    const blogPosts = await prisma.blogPost.findMany({
      select: { slug: true, updatedAt: true },
      where: { status: 'PUBLISHED' },
    });

    const portfolios = await prisma.portfolioProject.findMany({
      select: { id: true, updatedAt: true },
      where: { status: 'PUBLISHED' },
    });

    // Add destinations
    for (const dest of destinations) {
      for (const locale of locales) {
        sitemapEntries.push({
          url: `${baseUrl}/${locale}/destinations/${dest.slug}`,
          lastModified: dest.updatedAt,
          changeFrequency: 'weekly',
          priority: 0.7,
        });
      }
    }

    // Add packages
    for (const pkg of packages) {
      for (const locale of locales) {
        sitemapEntries.push({
          url: `${baseUrl}/${locale}/packages/${pkg.slug}`,
          lastModified: pkg.updatedAt,
          changeFrequency: 'weekly',
          priority: 0.8,
        });
      }
    }

    // Add blog posts
    for (const post of blogPosts) {
      for (const locale of locales) {
        sitemapEntries.push({
          url: `${baseUrl}/${locale}/blog/${post.slug}`,
          lastModified: post.updatedAt,
          changeFrequency: 'weekly',
          priority: 0.6,
        });
      }
    }

    // Add portfolios
    for (const pf of portfolios) {
      for (const locale of locales) {
        sitemapEntries.push({
          url: `${baseUrl}/${locale}/portfolio/${pf.id}`,
          lastModified: pf.updatedAt,
          changeFrequency: 'monthly',
          priority: 0.6,
        });
      }
    }
  } catch (error) {
    console.error('Error generating sitemap dynamic entries:', error);
  }

  return sitemapEntries;
}
