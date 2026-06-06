/**
 * Seed the database with the 19 MBBS subjects and a starter set of topics
 * for each. Run with: npm run db:seed
 */
import { PrismaClient } from "@prisma/client";
import { SUBJECTS } from "./subjects-data";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding 19 MBBS subjects + topics...");
  for (const s of SUBJECTS) {
    const subject = await prisma.subject.upsert({
      where: { slug: s.slug },
      update: {
        name: s.name,
        shortName: s.shortName,
        description: s.description,
        color: s.color,
        icon: s.icon,
        order: s.order,
      },
      create: {
        slug: s.slug,
        name: s.name,
        shortName: s.shortName,
        description: s.description,
        color: s.color,
        icon: s.icon,
        order: s.order,
      },
    });

    for (let i = 0; i < s.topics.length; i++) {
      const t = s.topics[i];
      await prisma.topic.upsert({
        where: {
          subjectId_slug: { subjectId: subject.id, slug: t.slug },
        },
        update: { name: t.name, order: i },
        create: {
          subjectId: subject.id,
          slug: t.slug,
          name: t.name,
          order: i,
        },
      });
    }
    console.log(`  ✓ ${s.name} (${s.topics.length} topics)`);
  }
  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
