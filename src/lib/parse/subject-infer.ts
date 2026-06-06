/**
 * Subject inference by keyword matching. Used when the parser detects a
 * CEREB-style export whose parent <h2> doesn't explicitly name a subject.
 *
 * Returns a slug (matching prisma.subject.slug) or null if no match.
 */

type SubjectEntry = { slug: string; keywords: string[]; aliases: string[] };

const ENTRIES: SubjectEntry[] = [
  { slug: "anatomy",          keywords: ["anatomy", "anat"], aliases: ["upper limb", "lower limb", "histology", "embryology", "neuroanat"] },
  { slug: "physiology",       keywords: ["physiology", "physio"], aliases: ["cardiovascular system", "respiratory system", "renal system", "gi system", "nerve muscle"] },
  { slug: "biochemistry",     keywords: ["biochemistry", "biochem"], aliases: ["enzymes", "metabolism", "vitamins", "molecular biology", "lipid", "carbohydrate"] },
  { slug: "pathology",        keywords: ["pathology", "path"], aliases: ["general pathology", "hematology", "neoplasia", "inflammation", "systemic pathology"] },
  { slug: "microbiology",     keywords: ["microbiology", "micro"], aliases: ["bacteriology", "virology", "mycology", "parasitology", "immunology", "mycobacterium"] },
  { slug: "pharmacology",     keywords: ["pharmacology", "pharma", "pharm"], aliases: ["autonomic", "chemotherapy", "antimicrobial", "drug"] },
  { slug: "forensic-medicine",keywords: ["forensic", "fmt", "toxicology"], aliases: ["autopsy", "wound", "medicolegal", "identification"] },
  { slug: "community-medicine",keywords: ["community medicine", "psm", "spm", "preventive", "social medicine"], aliases: ["epidemiology", "biostatistics", "national health", "vaccination", "communicable disease"] },
  { slug: "general-medicine", keywords: ["medicine", "general medicine", "internal medicine"], aliases: ["cardiology", "neurology", "pulmonology", "endocrinology", "nephrology", "rheumatology", "gastroenterology", "hematology"] },
  { slug: "general-surgery",  keywords: ["surgery", "general surgery"], aliases: ["gi surgery", "trauma surgery", "urology", "vascular", "surgical oncology", "laparotomy"] },
  { slug: "obg",              keywords: ["obg", "obstetrics", "gynaecology", "gynecology"], aliases: ["pregnancy", "labor", "menstrual", "ovary", "uterus", "infertility"] },
  { slug: "pediatrics",       keywords: ["pediatrics", "paediatrics", "peds", "paeds"], aliases: ["neonatology", "growth", "child health", "infant"] },
  { slug: "ophthalmology",    keywords: ["ophthalmology", "ophthal", "eye"], aliases: ["retina", "glaucoma", "cornea", "cataract", "refraction", "visual"] },
  { slug: "ent",              keywords: ["ent", "otorhinolaryngology", "otolaryngology", "ear nose throat"], aliases: ["larynx", "pharynx", "sinus", "cochlea", "vestibular"] },
  { slug: "orthopedics",      keywords: ["orthopedics", "orthopaedics", "ortho"], aliases: ["fracture", "spine", "joint", "bone", "tendon", "ligament"] },
  { slug: "dermatology",      keywords: ["dermatology", "derma", "dvl", "venereology"], aliases: ["skin", "leprosy", "std", "psoriasis", "eczema", "venereal"] },
  { slug: "psychiatry",       keywords: ["psychiatry", "psych"], aliases: ["schizophrenia", "depression", "anxiety", "bipolar", "mental", "psychosis"] },
  { slug: "anesthesiology",   keywords: ["anesthesiology", "anaesthesiology", "anesthesia", "anaesthesia", "anesth"], aliases: ["intubation", "epidural", "spinal anesthesia", "general anesthesia", "regional", "pain management"] },
  { slug: "radiology",        keywords: ["radiology", "radiodiagnosis", "radio"], aliases: ["x-ray", "xray", "ct scan", "mri", "ultrasound", "imaging", "radiograph"] },
];

const SUBJECT_SLUGS = new Set(ENTRIES.map((e) => e.slug));

/**
 * Returns the inferred subject slug, or null if nothing matches.
 *
 * When called with two strings, the FIRST one is treated as the
 * higher-priority signal (e.g. an iframe title or per-MCQ topic) and the
 * SECOND is the fallback (e.g. filename). This matches how the HTML
 * parser is expected to use it: title wins over filename.
 */
export function inferSubjectSlug(text: string): string | null;
export function inferSubjectSlug(primary: string, fallback: string): string | null;
export function inferSubjectSlug(a: string, b?: string): string | null {
  if (!a && !b) return null;
  const primary = (a ?? "").toLowerCase();
  const fallback = (b ?? "").toLowerCase();

  const match = (lower: string, weight: number) => {
    let best: { slug: string; score: number } | null = null;
    for (const e of ENTRIES) {
      let score = 0;
      for (const k of e.keywords) {
        const re = new RegExp(`(^|[^a-z])${escapeRegExp(k)}([^a-z]|$)`, "i");
        if (re.test(lower)) score += (k.length >= 5 ? 4 : 3) * weight;
        else if (lower.includes(k)) score += 1 * weight;
      }
      for (const al of e.aliases) {
        if (lower.includes(al)) score += 2 * weight;
      }
      if (score > 0 && (!best || score > best.score)) {
        best = { slug: e.slug, score };
      }
    }
    return best;
  };

  // Primary string gets 3x weight; fallback gets 1x.
  const p = primary ? match(primary, 3) : null;
  if (p && p.score >= 4) return p.slug;
  const f = fallback ? match(fallback, 1) : null;
  if (f && f.score >= 3) return f.slug;
  if (p && p.score >= 2) return p.slug;
  if (f) return f.slug;
  return null;
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export const ALL_SUBJECT_SLUGS = SUBJECT_SLUGS;
