import { PrismaClient, DayOfWeek } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  services,
  portfolioCategories,
  portfolioItems,
  testimonials,
  workingHours,
  blogCategories,
  aboutBio,
} from "../src/data/content";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  const adminEmail = process.env.ADMIN_EMAIL || "admin@sepidehmihanparast.de";
  const adminPassword = process.env.ADMIN_PASSWORD || "Sepide2025!";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash, name: "Sepideh Mihanparast", role: "SUPER_ADMIN" },
    create: {
      email: adminEmail,
      passwordHash,
      name: "Sepideh Mihanparast",
      role: "SUPER_ADMIN",
    },
  });

  console.log(`✓ Admin user: ${admin.email}`);

  for (const rule of workingHours) {
    await prisma.availabilityRule.upsert({
      where: { id: `${rule.dayOfWeek}-rule` },
      update: {
        startTime: rule.startTime,
        endTime: rule.endTime,
        isActive: true,
      },
      create: {
        id: `${rule.dayOfWeek}-rule`,
        dayOfWeek: rule.dayOfWeek as DayOfWeek,
        startTime: rule.startTime,
        endTime: rule.endTime,
        isActive: true,
      },
    });
  }

  console.log("✓ Working hours");

  for (const service of services) {
    const created = await prisma.service.upsert({
      where: { slug: service.slug },
      update: {
        durationMinutes: service.durationMinutes,
        bufferMinutes: service.bufferMinutes,
        sortOrder: service.sortOrder,
      },
      create: {
        slug: service.slug,
        durationMinutes: service.durationMinutes,
        bufferMinutes: service.bufferMinutes,
        sortOrder: service.sortOrder,
      },
    });

    for (const locale of ["de", "en"] as const) {
      await prisma.serviceTranslation.upsert({
        where: {
          serviceId_locale: { serviceId: created.id, locale },
        },
        update: {
          title: service[locale].title,
          description: service[locale].description,
          shortDesc: service[locale].shortDesc,
        },
        create: {
          serviceId: created.id,
          locale,
          title: service[locale].title,
          description: service[locale].description,
          shortDesc: service[locale].shortDesc,
        },
      });
    }
  }

  console.log(`✓ ${services.length} services`);

  for (const cat of portfolioCategories) {
    const created = await prisma.portfolioCategory.upsert({
      where: { slug: cat.slug },
      update: { sortOrder: cat.sortOrder },
      create: { slug: cat.slug, sortOrder: cat.sortOrder },
    });

    for (const locale of ["de", "en"] as const) {
      await prisma.portfolioCategoryTranslation.upsert({
        where: {
          categoryId_locale: { categoryId: created.id, locale },
        },
        update: { name: cat[locale].name },
        create: {
          categoryId: created.id,
          locale,
          name: cat[locale].name,
        },
      });
    }
  }

  console.log(`✓ ${portfolioCategories.length} portfolio categories`);

  for (const item of portfolioItems) {
    const category = await prisma.portfolioCategory.findUnique({
      where: { slug: item.categorySlug },
    });
    if (!category) continue;

    const media = await prisma.mediaFile.upsert({
      where: { cloudinaryId: item.image },
      update: {
        url: item.image,
        secureUrl: item.image,
        altText: item.de.altText,
      },
      create: {
        cloudinaryId: item.image,
        url: item.image,
        secureUrl: item.image,
        publicId: item.image,
        altText: item.de.altText,
        folder: "portfolio",
      },
    });

    const created = await prisma.portfolioItem.upsert({
      where: { slug: item.slug },
      update: {
        categoryId: category.id,
        featured: item.featured,
        sortOrder: item.sortOrder,
        publishedAt: new Date(),
      },
      create: {
        slug: item.slug,
        categoryId: category.id,
        featured: item.featured,
        sortOrder: item.sortOrder,
        publishedAt: new Date(),
        mediaFiles: { connect: { id: media.id } },
      },
    });

    for (const locale of ["de", "en"] as const) {
      await prisma.portfolioItemTranslation.upsert({
        where: {
          itemId_locale: { itemId: created.id, locale },
        },
        update: {
          title: item[locale].title,
          description: item[locale].description,
          altText: item[locale].altText,
        },
        create: {
          itemId: created.id,
          locale,
          title: item[locale].title,
          description: item[locale].description,
          altText: item[locale].altText,
        },
      });
    }
  }

  console.log(`✓ ${portfolioItems.length} portfolio items`);

  for (const item of testimonials) {
    const created = await prisma.testimonial.upsert({
      where: { id: `testimonial-${item.clientName.replace(/\s/g, "-")}` },
      update: {
        clientName: item.clientName,
        featured: item.featured,
        sortOrder: item.sortOrder,
        publishedAt: new Date(),
      },
      create: {
        id: `testimonial-${item.clientName.replace(/\s/g, "-")}`,
        clientName: item.clientName,
        featured: item.featured,
        sortOrder: item.sortOrder,
        publishedAt: new Date(),
      },
    });

    for (const locale of ["de", "en"] as const) {
      await prisma.testimonialTranslation.upsert({
        where: {
          testimonialId_locale: { testimonialId: created.id, locale },
        },
        update: { content: item[locale].content },
        create: {
          testimonialId: created.id,
          locale,
          content: item[locale].content,
        },
      });
    }
  }

  console.log(`✓ ${testimonials.length} testimonials`);

  for (const cat of blogCategories) {
    const created = await prisma.blogCategory.upsert({
      where: { slug: cat.slug },
      update: {},
      create: { slug: cat.slug },
    });

    for (const locale of ["de", "en"] as const) {
      await prisma.blogCategoryTranslation.upsert({
        where: {
          categoryId_locale: { categoryId: created.id, locale },
        },
        update: { name: cat[locale].name },
        create: {
          categoryId: created.id,
          locale,
          name: cat[locale].name,
        },
      });
    }
  }

  const bridalCat = await prisma.blogCategory.findUnique({
    where: { slug: "bridal-beauty" },
  });

  const samplePosts = [
    {
      slug: "bridal-beauty-trends-2025",
      de: {
        title: "Brautbeauty Trends 2025",
        excerpt: "Soft Glam, Minimalist Looks und zeitlose Eleganz für Ihren Hochzeitstag.",
        content: `<p>${aboutBio.de.philosophy}</p><p>Entdecken Sie die schönsten Brautlooks der Saison — von Classic Elegance bis Minimalist Look.</p>`,
      },
      en: {
        title: "Bridal Beauty Trends 2025",
        excerpt: "Soft glam, minimalist looks, and timeless elegance for your wedding day.",
        content: `<p>${aboutBio.en.philosophy}</p><p>Discover the most beautiful bridal looks of the season — from classic elegance to minimalist looks.</p>`,
      },
    },
    {
      slug: "cannes-red-carpet-styling",
      de: {
        title: "Cannes Red Carpet Styling",
        excerpt: "Elegantes Haarstyling für den roten Teppich — Raffiniert und sophisticated.",
        content: `<p>${aboutBio.de.highlights}</p>`,
      },
      en: {
        title: "Cannes Red Carpet Styling",
        excerpt: "Elegant hair styling for the red carpet — refined and sophisticated.",
        content: `<p>${aboutBio.en.highlights}</p>`,
      },
    },
  ];

  for (const post of samplePosts) {
    const created = await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {
        status: "PUBLISHED",
        publishedAt: new Date(),
        categoryId: bridalCat?.id,
      },
      create: {
        slug: post.slug,
        authorId: admin.id,
        status: "PUBLISHED",
        publishedAt: new Date(),
        featured: true,
        categoryId: bridalCat?.id,
      },
    });

    for (const locale of ["de", "en"] as const) {
      await prisma.blogPostTranslation.upsert({
        where: {
          postId_locale: { postId: created.id, locale },
        },
        update: {
          title: post[locale].title,
          excerpt: post[locale].excerpt,
          content: post[locale].content,
        },
        create: {
          postId: created.id,
          locale,
          title: post[locale].title,
          excerpt: post[locale].excerpt,
          content: post[locale].content,
        },
      });
    }
  }

  console.log(`✓ ${samplePosts.length} blog posts`);

  await prisma.setting.upsert({
    where: { key: "site" },
    update: {
      value: {
        name: "Sepideh Mihanparast",
        email: "se.mihanparast@yahoo.com",
        phone: "+49 176 567 33300",
        instagram: "https://www.instagram.com/beautyartist.sepid",
      },
    },
    create: {
      key: "site",
      value: {
        name: "Sepideh Mihanparast",
        email: "se.mihanparast@yahoo.com",
        phone: "+49 176 567 33300",
        instagram: "https://www.instagram.com/beautyartist.sepid",
      },
    },
  });

  console.log("✓ Settings");
  console.log("\n✅ Seed complete!");
  console.log(`\nAdmin login:\n  Email: ${adminEmail}\n  Password: ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
