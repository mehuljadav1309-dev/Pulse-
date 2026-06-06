import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const MCQS: Record<string, Array<{ q: string; opts: string[]; a: number; e: string; d?: string }>> = {
  "anatomy::upper-limb": [
    {
      q: "Which nerve is most commonly injured in a midshaft humeral fracture?",
      opts: ["Ulnar nerve", "Median nerve", "Radial nerve", "Musculocutaneous nerve"],
      a: 2,
      e: "The radial nerve runs in the spiral (radial) groove of the humerus and is the most commonly injured nerve in midshaft humeral fractures, causing wrist drop.",
      d: "easy",
    },
    {
      q: "The deltoid muscle is innervated by which nerve?",
      opts: ["Axillary nerve", "Suprascapular nerve", "Long thoracic nerve", "Thoracodorsal nerve"],
      a: 0,
      e: "The deltoid is innervated by the axillary nerve (C5, C6), a branch of the posterior cord of the brachial plexus.",
      d: "medium",
    },
    {
      q: "The cephalic vein drains into which vessel?",
      opts: ["Axillary vein", "Subclavian vein", "Brachiocephalic vein", "Internal jugular vein"],
      a: 0,
      e: "It pierces the clavipectoral fascia to drain into the axillary vein.",
      d: "easy",
    },
    {
      q: "Which artery is the main supply to the rotator cuff?",
      opts: ["Anterior circumflex humeral", "Posterior circumflex humeral", "Suprascapular", "Thoracoacromial"],
      a: 2,
      e: "The suprascapular artery (branch of the thyrocervical trunk) provides the dominant blood supply to the supraspinatus and infraspinatus.",
      d: "hard",
    },
    {
      q: "Erb's point is located at the level of which nerve roots?",
      opts: ["C3–C4", "C5–C6", "C7–C8", "C8–T1"],
      a: 1,
      e: "Erb's point is the union of C5 and C6 nerve roots, located in the posterior triangle of the neck.",
      d: "medium",
    },
  ],
  "physiology::cardiovascular": [
    {
      q: "Which of the following decreases heart rate?",
      opts: ["Sympathetic stimulation", "Parasympathetic stimulation", "Thyroxine", "Atrial natriuretic peptide"],
      a: 1,
      e: "Parasympathetic (vagal) stimulation releases ACh at the SA node, decreasing heart rate (negative chronotropy).",
      d: "easy",
    },
    {
      q: "Starling's law relates cardiac output to:",
      opts: ["Heart rate", "Venous return / end-diastolic volume", "Arterial pressure", "Afterload"],
      a: 1,
      e: "Starling's law: the energy of contraction is proportional to the initial fibre length (i.e. preload / EDV).",
      d: "medium",
    },
    {
      q: "Normal coronary blood flow at rest is approximately:",
      opts: ["50 mL/min", "250 mL/min", "500 mL/min", "1000 mL/min"],
      a: 1,
      e: "Coronary flow at rest is ~225–250 mL/min (~5% of cardiac output), increasing 4–5x during exercise.",
      d: "medium",
    },
  ],
  "pharmacology::ans-pharma": [
    {
      q: "Beta-1 adrenergic receptors are predominantly located in the:",
      opts: ["Bronchial smooth muscle", "Cardiac muscle", "Skeletal muscle vasculature", "GI smooth muscle"],
      a: 1,
      e: "Beta-1 receptors are mainly cardiac - increase HR, contractility, and AV nodal conduction.",
      d: "easy",
    },
    {
      q: "Atropine acts as a muscarinic antagonist and causes all EXCEPT:",
      opts: ["Tachycardia", "Mydriasis", "Bronchoconstriction", "Dry mouth"],
      a: 2,
      e: "Atropine causes bronchodilation (not constriction) by blocking M3 receptors in bronchial smooth muscle.",
      d: "medium",
    },
  ],
  "pathology::general-pathology": [
    {
      q: "The hallmark cells of acute inflammation are:",
      opts: ["Lymphocytes", "Macrophages", "Neutrophils", "Plasma cells"],
      a: 2,
      e: "Neutrophils (PMNs) are the first responders and the hallmark of acute inflammation.",
      d: "easy",
    },
    {
      q: "Granulomatous inflammation is characteristically seen in:",
      opts: ["Acute appendicitis", "Tuberculosis", "Acute pancreatitis", "Viral hepatitis"],
      a: 1,
      e: "Granulomas (caseating) are the hallmark of TB; other granulomatous diseases include sarcoidosis and leprosy.",
      d: "medium",
    },
  ],
  "general-medicine::cardiology": [
    {
      q: "A 58-year-old man with EF 30% - which drug reduces all-cause mortality in HFrEF?",
      opts: ["Digoxin", "Ivabradine", "Spironolactone", "Diltiazem"],
      a: 2,
      e: "Mortality-reducing pillars in HFrEF: ARNI/ACE-i, evidence-based beta-blockers, MRA (spironolactone), and SGLT2 inhibitors (RALES trial).",
      d: "medium",
    },
    {
      q: "Most specific ECG finding for acute pericarditis is:",
      opts: ["Pathological Q waves", "Diffuse ST elevation with PR depression", "Tall R in V1", "Delta wave"],
      a: 1,
      e: "Diffuse concave ST elevation with PR-segment depression (and PR elevation in aVR) is characteristic of acute pericarditis.",
      d: "medium",
    },
  ],
  "microbiology::bacteriology": [
    {
      q: "Which bacterium is the most common cause of community-acquired pneumonia?",
      opts: ["Staphylococcus aureus", "Streptococcus pneumoniae", "Klebsiella pneumoniae", "Mycoplasma pneumoniae"],
      a: 1,
      e: "Streptococcus pneumoniae (the pneumococcus) is the most common cause of community-acquired bacterial pneumonia in adults.",
      d: "easy",
    },
  ],
  "biochemistry::vitamins": [
    {
      q: "Deficiency of vitamin B1 (thiamine) causes:",
      opts: ["Scurvy", "Beriberi", "Rickets", "Pellagra"],
      a: 1,
      e: "Thiamine (B1) deficiency causes beriberi (wet with high-output cardiac failure, or dry with peripheral neuropathy) and Wernicke-Korsakoff syndrome in alcoholics.",
      d: "easy",
    },
  ],
  "community-medicine::epidemiology": [
    {
      q: "Which study design is best for investigating a rare disease?",
      opts: ["Cohort study", "Case-control study", "Cross-sectional study", "RCT"],
      a: 1,
      e: "Case-control studies start with cases and controls, making them efficient for rare diseases and long latency outcomes.",
      d: "medium",
    },
  ],
};

async function main() {
  let total = 0;
  for (const [key, mcqs] of Object.entries(MCQS)) {
    const [subjectSlug, topicSlug] = key.split("::");
    const topic = await prisma.topic.findFirst({
      where: { slug: topicSlug, subject: { slug: subjectSlug } },
    });
    if (!topic) {
      console.warn(`Topic not found: ${key}`);
      continue;
    }
    for (const m of mcqs) {
      await prisma.mCQ.create({
        data: {
          topicId: topic.id,
          question: m.q,
          options: JSON.stringify(m.opts),
          correctIndex: m.a,
          explanation: m.e,
          difficulty: m.d ?? "medium",
          source: "seed",
          status: "published",
        },
      });
      total++;
    }
    console.log(`+ ${key}: ${mcqs.length} MCQs`);
  }
  console.log(`\nInserted ${total} MCQs total.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
