import { prisma } from "./db";
import { SUBJECTS } from "../../prisma/subjects-data";

let inflight: Promise<void> | null = null;

/**
 * Make sure the 19 MBBS subjects and their starter topics are present.
 * Idempotent — safe to call on every request. Skips work when subjects exist
 * and runs a single shared seed when they're missing.
 */
export function ensureSeeded(): Promise<void> {
  if (inflight) return inflight;
  inflight = (async () => {
    const count = await prisma.subject.count();
    if (count > 0) return;
    console.log("[seed] Subject table empty, seeding 19 MBBS subjects…");
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
    }
    console.log("[seed] Done.");
  })().finally(() => {
    // Allow re-check on next request (no-op if already populated)
    inflight = null;
  });
  return inflight;
}
