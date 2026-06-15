import type { Metadata } from "next";
import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import { TopperModel } from "@/models/topper.model";

interface Props {
  params: Promise<{
    subject: string;
  }>;
}

interface TopperData {
  firstName: string;
  lastName: string;
  rank: number;
  year: number;
  slug: string;
  marks: Record<string, number>;
}

interface SubjectInfo {
  name: string;
  description: string;
  overview?: string;
  whyPopular?: string;
  booklist?: string[];
  prepInsights?: string[];
  syllabusTopics?: string[];
  scoringTrend?: string;
}

const SUBJECT_DATA: Record<string, SubjectInfo> = {
  psir: {
    name: "Political Science & International Relations",
    description:
      "Explore UPSC topper strategies, booklists, and preparation insights for PSIR optional subject — India's most popular UPSC optional with strong GS overlap.",
    overview:
      "PSIR (Political Science & International Relations) is one of the most opted UPSC optional subjects, comprising two papers: Political Theory and Thought (Paper I) and Comparative Politics and International Relations (Paper II). The syllabus covers Western and Indian political thinkers, comparative government systems, international relations theories, and India's foreign policy. Candidates who enjoy conceptual analysis, contemporary affairs, and structured argumentation find PSIR a natural fit. The subject rewards clarity of thought, precise terminology, and the ability to link theoretical concepts with current events.",
    whyPopular:
      "PSIR consistently ranks among the top optional subjects by candidate preference. Its popularity stems from significant overlap with General Studies papers — especially GS II (Polity, Governance, International Relations) and GS IV (Ethics). This overlap reduces the total preparation burden. The answer-writing style for PSIR closely mirrors GS demands, making it easier to practice both simultaneously. Additionally, the syllabus is well-defined, predictable, and supported by abundant study material including standard textbooks, coaching notes, and previous year question banks.",
    booklist: [
      "M. Laxmikanth — Indian Polity (foundational reference for Paper II)",
      "A.C. Kapur — Select Essays on Political Thought",
      "O.P. Gauba — An Introduction to Political Theory",
      "Andrew Heywood — Political Theory: An Introduction",
      "Rajeev Bhargava — Political Theory: An Introduction",
      "S.C. Singhal — India's Foreign Policy",
      "V.P. Dutt — India's Foreign Policy",
      "J.C. Johari — Comparative Politics",
      "Hans J. Morgenthau — Politics Among Nations (IR theory)",
      "Oxford Handbook of International Relations (select chapters)",
    ],
    syllabusTopics: [
      "Plato, Aristotle, Machiavelli, Hobbes, Locke, Rousseau",
      "Marx, Gramsci, Arendt, Rawls, Nozick",
      "Indian political thought: Kautilya, Gandhi, Ambedkar, Nehru",
      "Comparative politics: forms of government, party systems, federalism",
      "International relations: realism, liberalism, constructivism",
      "India's foreign policy: neighbourhood, great powers, multilateralism",
      "United Nations, international law, global governance",
    ],
    prepInsights: [
      "Master the core political thinkers thoroughly — Plato, Aristotle, Machiavelli, Hobbes, Locke, Rousseau, Marx, and Gandhi are asked frequently.",
      "Link theoretical concepts to current events. For example, connect Rawls' theory of justice to contemporary debates on reservation or inequality.",
      "Build a structured framework for IR answers: theory + historical context + current example + India-specific angle.",
      "Practice 500-word answer writing within 45 minutes — PSIR demands depth within strict time limits.",
      "Use previous year papers to identify repeated themes and question patterns across the last decade.",
      "Develop a glossary of political science terminology for precise, impactful answers.",
    ],
    scoringTrend: "PSIR consistently produces top ranks. Toppers scoring 280+ marks in PSIR papers are common among top-100 ranks. The subject rewards structured answers with theoretical grounding and contemporary examples.",
  },
  "public-administration": {
    name: "Public Administration",
    description: "Public Administration optional: administrative theory, governance, and policy implementation — a favourite for candidates seeking direct GS overlap.",
    overview: "Public Administration (PA) as a UPSC optional covers administrative theory (Paper I) and Indian administration (Paper II). Paper I delves into classical and contemporary theories of organization, decision-making, development administration, and financial administration. Paper II focuses on the Indian administrative system — from central and state governments to district administration, citizen-centric governance, and social welfare programmes. PA is uniquely suited for aspirants who prefer a structured, well-defined syllabus with clear answer-writing frameworks. The subject's direct overlap with GS II, GS III, and Ethics makes it a high-ROI optional.",
    whyPopular: "PA is one of the most popular optional subjects because of its significant syllabus overlap with GS papers — especially governance, policy, and ethics content. The answer-writing style for PA (definition, theory, application, case study) mirrors GS demands, reducing the need for separate preparation approaches. PA also has abundant study material, predictable question patterns, and a relatively compact syllabus compared to subjects like History or Geography.",
    booklist: [
      "M.P. Sharma & B.L. Sadana — Public Administration in India (core text)",
      "Shriram Maheshwari — Public Administration",
      "Mohit Bhattacharya — New Horizons of Public Administration",
      "Ramesh K. Arora — Indian Public Administration",
      "S.R. Maheshwari — Administrative Thinkers",
      "Laxmikanth — Governance in India",
      "Hoshiar Singh — Indian Administration",
    ],
    syllabusTopics: [
      "Classical theories: Taylor, Fayol, Weber, Gulick, Urwick",
      "Behavioural theories: Simon, Barnard, McGregor, Likert",
      "Development administration and comparative public administration",
      "Budgeting, financial administration, and audit",
      "Civil service reforms, neutrality, and accountability",
      "Central, state, and district administration in India",
      "Citizen charters, RTI, e-governance, and social audits",
      "Welfare administration: food security, health, education",
    ],
    prepInsights: [
      "Build a strong theoretical foundation in Paper I thinkers — Weber, Taylor, Simon, and McGregor are frequently asked.",
      "Link administrative theories to Indian case studies. For example, connect Weber's bureaucratic model to red-tapism in Indian administration.",
      "Use real examples from government schemes and reforms in Paper II answers — Swachh Bharat, DBT, e-governance portals.",
      "Memorize key committees and commissions (Second ARC, Hota Committee, etc.) for Paper II questions.",
      "Practice case-study based answers — the ability to apply theory to a given scenario distinguishes top scorers.",
      "Maintain a current affairs journal focused on administrative reforms, policy changes, and governance innovations.",
    ],
    scoringTrend: "PA is a high-scoring optional with consistent performance. Toppers regularly score 280-320 marks. The subject's structured nature rewards systematic preparation and clear, example-driven answers.",
  },
  mathematics: {
    name: "Mathematics",
    description: "Mathematics optional: pure and applied mathematics with rigorous problem-solving — ideal for candidates with a strong quantitative background.",
    overview: "Mathematics as a UPSC optional comprises two papers covering real analysis, linear algebra, complex analysis, calculus, differential equations, probability and statistics, numerical methods, and mechanics. Unlike humanities optionals, Mathematics demands consistent problem-solving practice rather than theoretical memorization. Candidates with a B.Sc. or B.E./B.Tech background in quantitative disciplines find the syllabus manageable. The objective nature of marking — right answer gets full marks, partially correct answers get partial credit — makes Mathematics one of the most scoring optional subjects when prepared thoroughly.",
    whyPopular: "Mathematics is popular among engineering graduates and science students because of its predictable scoring pattern. Unlike subjects with subjective evaluation, Mathematics marks depend on correct solutions, making scores less dependent on examiner discretion. The syllabus overlaps significantly with engineering and science curricula, reducing the additional preparation burden. With rigorous practice, Mathematics can yield 340+ marks — among the highest across all optionals.",
    booklist: [
      "I.A. Maron — Problems in Calculus of One Variable",
      "Tom M. Apostol — Mathematical Analysis",
      "S. Kumaresan — Linear Algebra: A Geometric Approach",
      "S.L. Loney — The Elements of Coordinate Geometry",
      "Murray R. Spiegel — Complex Variables",
      "Erwin Kreyszig — Advanced Engineering Mathematics",
      "S.C. Gupta & V.K. Kapoor — Fundamentals of Mathematical Statistics",
      "R.K. Bhaduri — Mechanics",
    ],
    syllabusTopics: [
      "Real analysis: sequences, series, continuity, differentiation, Riemann integration",
      "Linear algebra: vector spaces, matrices, eigenvalues, inner product spaces",
      "Complex analysis: analytic functions, Cauchy's theorem, residues",
      "Calculus: functions of several variables, multiple integrals, differential equations",
      "Probability and statistics: distributions, hypothesis testing, regression",
      "Numerical methods: interpolation, integration, differential equations",
      "Mechanics: particle dynamics, rigid body motion, fluid mechanics",
    ],
    prepInsights: [
      "Practice problem-solving daily — Mathematics is a skill subject that rewards consistent practice over theoretical reading.",
      "Start with Calculus and Linear Algebra as they form the foundation for most other topics.",
      "Solve previous year question papers under timed conditions to build speed and accuracy.",
      "Maintain a formula notebook organized by topic for quick revision in the final weeks.",
      "Focus on high-weightage areas: Real Analysis, Linear Algebra, and Differential Equations are frequently tested.",
      "For statistics and probability, focus on standard distributions and hypothesis testing — numerical problems are common.",
    ],
    scoringTrend: "Mathematics is among the highest-scoring optionals. Candidates scoring 300+ are common, and top scorers often cross 340. The objective marking makes it a reliable choice for those with strong quantitative skills.",
  },
  sociology: {
    name: "Sociology",
    description:
      "Discover top UPSC strategies for Sociology optional with topper profiles, marks analysis, and preparation trends — a favourite for its GS overlap and concise syllabus.",
    overview:
      "Sociology as a UPSC optional is divided into two papers: Paper I covers sociological concepts, theories, and thinkers (foundations of sociology, social stratification, marriage and kinship, religion, politics, and social change). Paper II focuses on Indian society, including social structure, caste system, tribal communities, social movements, population dynamics, and development challenges. Sociology is widely regarded as one of the most manageable optional subjects due to its compact syllabus, everyday relevance, and strong overlap with GS papers. Candidates who enjoy logical reasoning, social observation, and essay-style answers find sociology a rewarding choice.",
    whyPopular:
      "Sociology is one of the most opted UPSC optional subjects for good reason. Its syllabus is approximately 40-50% shorter than subjects like History or Geography. The concepts are intuitive and draw from everyday social observations. There is significant overlap with GS I (Indian society, social issues), GS II (governance, welfare), and GS IV (ethics in social context). The answer-writing style for sociology — concept, theorist, example, critique — directly complements GS preparation. Additionally, sociology offers rich material for essays, making it a high-ROI subject.",
    booklist: [
      "Anthony Giddens — Sociology (comprehensive introductory text)",
      "George Ritzer — Sociological Theory",
      "D.P. Mukerji — Sociology (foundational Indian perspective)",
      "M.N. Srinivas — Religion and Society Among the Coorgs",
      "M.N. Srinivas — The Remembered Village",
      "G.S. Ghurye — Caste and Race in India",
      "Yogendra Singh — Culture and Civilization of Ancient India",
      "A.R. Desai — Social Background of Indian Nationalism",
      "Nandini Sundar — The Burning Forest: India's War in Bastar",
      "Satish Deshpande — Contemporary India: A Sociological View",
    ],
    syllabusTopics: [
      "Sociological thinkers: Marx, Weber, Durkheim, Parsons, Merton",
      "Social stratification: caste, class, gender, and ethnicity",
      "Marriage, family, kinship — changing patterns in India",
      "Religion and society: secularization, communalism, pluralism",
      "Social movements: peasant, tribal, environmental, women's",
      "Indian society: caste system, tribes, rural-urban divide",
      "Population, health, education, and development challenges",
      "Social change: Sanskritization, Westernization, modernization",
    ],
    prepInsights: [
      "Master the core thinkers — Marx, Weber, Durkheim are non-negotiable. Understand their concepts deeply, not just superficially.",
      "Link every sociological concept to an Indian example. For instance, connect Weber's Protestant Ethic to the concept of 'rationalization' in modern Indian bureaucracy.",
      "Build case studies around Indian social movements (Narmada Bachao, Chipko, anti-arrack) — these are frequently asked.",
      "Connect sociology to GS papers wherever possible: caste to GS I, education to GS II, development to GS III.",
      "Develop a comparative approach — contrast Indian social phenomena with global trends for a multidimensional answer.",
      "Use sociological terminology precisely in answers — 'anomie', 'alienation', 'collective conscience', 'habitus' — these signal subject mastery.",
    ],
    scoringTrend: "Sociology is a consistent performer. Toppers regularly score 260-310 marks. The subject rewards conceptual clarity, contemporary examples, and structured answers. Many top-50 ranks are sociology optional candidates.",
  },
  anthropology: {
    name: "Anthropology",
    description:
      "Master UPSC Anthropology optional: topper strategies, score trends, and preparation intelligence — a niche subject with high-scoring potential.",
    overview:
      "Anthropology as a UPSC optional is uniquely positioned: it combines science (human evolution, genetics, primatology) with social science (ethnography, kinship, religion, tribal studies). Paper I covers physical anthropology, archaeological anthropology, and anthropological theories. Paper II focuses on Indian anthropology — tribal cultures, social change, demographic profile, and contemporary issues affecting indigenous communities. Anthropology is particularly suitable for candidates from medical, biological, or social science backgrounds. Its combined scientific and humanistic approach makes it one of the most intellectually rewarding optionals.",
    whyPopular:
      "Anthropology is popular among a niche but dedicated group of aspirants. Its advantages include a well-defined, moderately sized syllabus; objective content in Paper I (evolution, genetics, primatology) that reduces subjectivity in evaluation; and strong linkage to GS papers on society, tribal development, and welfare. The subject also offers unique content not covered elsewhere in the UPSC syllabus, giving anthropology optional candidates distinctive perspectives in their answers.",
    booklist: [
      "K.L. Sharma — Social Stratification in India",
      "D.N. Majumdar — Races and Cultures of India",
      "M.N. Srinivas — Religion and Society Among the Coorgs",
      "Verrier Elwin — Tribal Life in India (key ethnographic source)",
      "N.K. Singhi — Tribal Development in India",
      "Herskovits — Cultural Anthropology (comprehensive reference)",
      "S.C. Dube — Indian Village",
      "Nita Kumar — The Politics of Gender, Community, and Modernity",
    ],
    syllabusTopics: [
      "Human evolution: fossil records, primate origins, hominid ancestry",
      "Genetics and race: Mendelian inheritance, DNA markers, racial classification",
      "Primatology: primate behaviour, social organization, locomotion",
      "Archaeological anthropology: tool typology, Palaeolithic to Neolithic",
      "Anthropological theories: evolutionism, diffusionism, structuralism, functionalism",
      "Indian tribal communities: distribution, economy, social organization",
      "Tribal development: problems of exploitation, displacement, and policy",
      "Kinship, marriage, and family: cross-cultural patterns",
    ],
    prepInsights: [
      "Master the evolution timeline — from Dryopithecus to Homo sapiens sapiens. Draw timelines and phylogenetic charts for clarity.",
      "Understand primatology basics: primate taxonomy, social organization, and behaviour patterns are frequently tested.",
      "For Indian anthropology, focus on tribal communities in central India (Bhils, Gonds, Santhals) and North-East (Nagas, Khasis).",
      "Link tribal development issues to current affairs — displacement due to mining, forest rights, PESA Act, and tribal welfare schemes.",
      "Build an ethnographic case study bank — 5-6 detailed tribal community profiles with data on their economy, marriage practices, and social change.",
      "Connect anthropological concepts to GS papers — kinship to society, tribal issues to governance, human evolution to science and technology.",
    ],
    scoringTrend: "Anthropology consistently rewards thorough preparation with scores in the 280-330 range. The objective content in Paper I (physical and archaeological anthropology) allows confident scoring, while Paper II (Indian anthropology) rewards contemporary examples and ethnographic depth.",
  },
  geography: {
    name: "Geography",
    description: "Geography optional: physical and human geography with map skills and case studies — a versatile choice with strong GS overlap.",
    overview: "Geography as a UPSC optional integrates physical geography (geomorphology, climatology, oceanography, biogeography) with human geography (population, settlement, economic geography, regional planning). Paper I covers principles of geography including cartography, remote sensing, and quantitative methods. Paper II focuses on the geography of India — physical features, agriculture, industry, transport, urbanisation, and regional development. Geography is uniquely visual — diagrams, maps, flowcharts, and data interpretation are integral to high-scoring answers. Candidates with a curiosity about places, patterns, and processes — and comfort with basic quantitative data — find geography a natural choice.",
    whyPopular: "Geography's popularity stems from several strategic advantages: substantial overlap with GS I (physical geography, climate, Indian society) and GS III (environment, agriculture, disaster management); the ability to use maps, diagrams, and flowcharts to make answers visually distinct and high-scoring; and a syllabus that is systematic and well-defined. Geography optional candidates often credit their map-based skills for helping them in GS papers as well.",
    booklist: [
      "G.C. Leong — Certificate Physical and Human Geography",
      "D.R. Khullar — Geography of India",
      "Majid Husain — Geography of India",
      "R.L. Singh — India: A Regional Geography",
      "Peter Haggett — Geography: A Modern Synthesis",
      "Alan Strahler & Arthur Strahler — Introducing Physical Geography",
      "R.C. Tiwari — Geography of India (for regional planning)",
      "Oxford School Atlas (for map practice)",
    ],
    syllabusTopics: [
      "Geomorphology: plate tectonics, weathering, fluvial, glacial, and coastal landforms",
      "Climatology: atmospheric circulation, monsoons, cyclones, climate change",
      "Oceanography: waves, currents, tides, coral reefs, marine resources",
      "Biogeography: ecosystem types, biodiversity, conservation",
      "Population and settlement geography: distribution, migration, urbanisation",
      "Economic geography: agriculture, industries, transport, trade",
      "Cartography and remote sensing: map projections, GIS, GPS",
      "Geography of India: physical divisions, agriculture, industrial regions",
    ],
    prepInsights: [
      "Master the physical geography fundamentals — geomorphology, climatology, and oceanography form the backbone of Paper I.",
      "Practice map work daily — locate physical features (peaks, passes, rivers) and cultural features (cities, ports, industries) on an outline map of India.",
      "Use diagrams liberally in answers — well-labelled block diagrams for landforms, climatic graphs, and flowcharts for processes.",
      "Link geographical phenomena to current events — connect flood patterns to climate change, or drought to agricultural distress.",
      "Build a case study bank for disasters (Uttarakhand floods, Chennai floods), development projects (Narmada dam), and conservation efforts.",
      "For Paper II, memorise key data points — acreage of major crops, industrial production, mineral reserves — for factual weight in answers.",
    ],
    scoringTrend: "Geography is a consistent, high-scoring optional. Scores typically range between 260-320. The use of diagrams and maps in answers can significantly boost marks. Many toppers in the top-100 ranks are geography optional candidates.",
  },
  philosophy: {
    name: "Philosophy",
    description: "Philosophy optional: Indian and Western philosophical thought and applied ethics — a niche subject for analytical thinkers with high-scoring potential.",
    overview: "Philosophy as a UPSC optional is structured into two papers: Paper I covers Indian philosophy (six orthodox schools — Nyaya, Vaisheshika, Samkhya, Yoga, Mimamsa, Vedanta — and heterodox schools — Buddhism, Jainism, Carvaka) and Western philosophy (Plato, Aristotle, Descartes, Spinoza, Leibniz, Locke, Berkeley, Hume, Kant, Hegel, Moore, Russell, Wittgenstein, Husserl, Heidegger, Sartra). Paper II covers socio-political philosophy and philosophy of religion. Philosophy is ideal for candidates who enjoy abstract reasoning, conceptual clarity, and structured argumentation. It is one of the more concise optional syllabuses, and its unique content differentiates candidates in both optional papers and essay writing.",
    whyPopular: "Philosophy, while less opted than mainstream subjects, has a dedicated following among aspirants who prefer conceptual depth over factual memorization. The syllabus is among the shortest across UPSC optionals, and the content does not change frequently (unlike current affairs-based subjects). Philosophy also offers excellent essay material — themes like justice, freedom, morality, and truth recur frequently in the UPSC essay paper. High-quality, structured answers in philosophy can earn very high marks due to the subject's analytical nature.",
    booklist: [
      "S. Radhakrishnan — Indian Philosophy (comprehensive two-volume text)",
      "Debiprasad Chattopadhyaya — Marxist Approach to Ancient Indian Philosophy",
      "C.D. Sharma — A Critical Survey of Indian Philosophy",
      "Bertrand Russell — History of Western Philosophy",
      "Will Durant — The Story of Philosophy",
      "Anthony Kenny — A New History of Western Philosophy",
      "J. Passmore — A Hundred Years of Philosophy",
      "John Cottingham — The Rationalists",
      "Peter Singer — Practical Ethics (for applied ethics)",
      "John Rawls — A Theory of Justice (select chapters)",
    ],
    syllabusTopics: [
      "Carvaka, Jainism, Buddhism — heterodox schools and their core tenets",
      "Nyaya: epistemology, logic, pramanas — perception, inference, testimony",
      "Vaisheshika: atomism, categories of reality",
      "Samkhya: prakriti and purusha, evolution of the world",
      "Yoga: Patanjali's psychology, mind control, meditation",
      "Purva Mimamsa: dharma, apurva, and the interpretation of Vedas",
      "Advaita Vedanta: Shankara's non-dualism, Brahman and Maya",
      "Plato and Aristotle: theory of forms, substance, virtue ethics",
      "Descartes, Spinoza, Leibniz: rationalism, substance, monads",
      "Locke, Berkeley, Hume: empiricism, ideas, causation, skepticism",
      "Kant: synthetic a priori, categories, categorical imperative",
      "Hegel: dialectic, absolute spirit, phenomenology",
      "Wittgenstein: picture theory, language games, private language argument",
    ],
    prepInsights: [
      "Start with Indian philosophy — it is more structured and self-contained. Master the six orthodox schools and their key concepts.",
      "For Western philosophy, focus on the rationalism-empiricism debate (Descartes to Hume) and Kant's synthesis — these are frequently tested.",
      "Practice writing concise, argument-driven answers. Philosophy rewards logical structure — premise, argument, counter-argument, conclusion.",
      "Create comparative charts: e.g., Plato vs Aristotle on justice, Shankara vs Ramanuja on Brahman, Descartes vs Hume on knowledge.",
      "Link philosophical concepts to contemporary issues — Rawls' justice to reservation policy, Kant's ethics to civil service values.",
      "Use philosophical terminology precisely — distinguish between a priori / a posteriori, analytic / synthetic, necessary / contingent.",
    ],
    scoringTrend: "Philosophy rewards conceptual clarity and structured presentation. Scores of 260-300 are achievable with systematic preparation. The subject's analytical nature means well-structured answers often score higher than in more descriptive subjects.",
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subject } = await params;
  const subjectKey = subject.toLowerCase();
  const subjectInfo = SUBJECT_DATA[subjectKey];

  if (!subjectInfo) {
    return { title: "Subject Not Found" };
  }

  return {
    title: `${subjectInfo.name} Optional Subject — UPSC CSE Preparation, Toppers & Strategy`,
    description: `${subjectInfo.name} optional subject for UPSC. ${subjectInfo.description}`,
    alternates: {
      canonical: `https://upscprepnotes.in/optional/${subjectKey}`,
    },
    openGraph: {
      title: `${subjectInfo.name} Optional Subject — UPSC CSE Preparation, Toppers & Strategy`,
      description: subjectInfo.description,
      url: `https://upscprepnotes.in/optional/${subjectKey}`,
    },
  };
}

export async function generateStaticParams() {
  return Object.keys(SUBJECT_DATA).map((s) => ({ subject: s }));
}

async function getSubjectData(subjectName: string) {
  await connectDB();

  const toppers = await TopperModel.find({
    optionalSubject: new RegExp(subjectName, "i"),
  }).lean();

  const mapped: TopperData[] = toppers.map((t: any) => ({
    firstName: t.firstName,
    lastName: t.lastName,
    rank: t.rank,
    year: t.year,
    slug: t.slug,
    marks: {
      gs1: t.marks?.gs1 || 0,
      gs2: t.marks?.gs2 || 0,
      gs3: t.marks?.gs3 || 0,
      gs4: t.marks?.gs4 || 0,
      essay: t.marks?.essay || 0,
      optional1: t.marks?.optional1 || 0,
      optional2: t.marks?.optional2 || 0,
      interview: t.marks?.interview || 0,
      written: t.marks?.written || 0,
      total: t.marks?.total || 0,
    },
  }));

  const totalMarks = mapped.map(t => t.marks.optional1 || t.marks.optional2 || 0).filter(m => m > 0);
  const avgMarks = totalMarks.length > 0 ? (totalMarks.reduce((a, b) => a + b, 0) / totalMarks.length).toFixed(1) : "—";
  const maxMarks = totalMarks.length > 0 ? Math.max(...totalMarks) : 0;
  const minMarks = totalMarks.length > 0 ? Math.min(...totalMarks) : 0;

  return { toppers: mapped, stats: { totalToppers: mapped.length, avgMarks, maxMarks, minMarks } };
}

function computeSubjectInsights(subjectName: string, toppers: TopperData[]) {
  if (toppers.length === 0) return [];

  const insights: string[] = [];
  const years = [...new Set(toppers.map(t => t.year))].sort();
  const ranks = toppers.map(t => t.rank).filter(r => r > 0);
  const interviews = toppers.map(t => t.marks.interview).filter(m => m > 0);
  const essays = toppers.map(t => t.marks.essay).filter(m => m > 0);
  const gs1 = toppers.map(t => t.marks.gs1).filter(m => m > 0);

  insights.push(`${toppers.length} topper${toppers.length > 1 ? "s" : ""} opted for ${subjectName} as their UPSC optional subject.`);
  insights.push(`Year range: ${Math.min(...years)}–${Math.max(...years)}`);

  if (ranks.length > 0) {
    insights.push(`Best rank among ${subjectName} optional toppers: AIR ${Math.min(...ranks)}`);
  }
  if (interviews.length > 0) {
    const avg = (interviews.reduce((a, b) => a + b, 0) / interviews.length).toFixed(1);
    insights.push(`Average interview score for ${subjectName} optional toppers: ${avg}`);
  }
  if (essays.length > 0) {
    const avg = (essays.reduce((a, b) => a + b, 0) / essays.length).toFixed(1);
    insights.push(`Average essay score for ${subjectName} optional toppers: ${avg}`);
  }

  return insights;
}

export default async function SubjectPage({ params }: Props) {
  const { subject } = await params;
  const subjectKey = subject.toLowerCase();
  const subjectInfo = SUBJECT_DATA[subjectKey];

  if (!subjectInfo) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center">
          <h1 className="text-4xl font-semibold">Subject not found</h1>
        </div>
      </main>
    );
  }

  const { toppers, stats } = await getSubjectData(subjectInfo.name);
  const insights = computeSubjectInsights(subjectInfo.name, toppers);

  const datasetSchema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "name": `${subjectInfo.name} UPSC Optional Topper Marks Dataset`,
    "description": `Structured dataset of UPSC CSE toppers who chose ${subjectInfo.name} as optional subject, including GS marks, optional marks, essay scores, interview scores, and AIR rankings.`,
    "url": `https://upscprepnotes.in/optional/${subjectKey}`,
    "keywords": [`${subjectInfo.name} UPSC`, "UPSC toppers", "UPSC optional subject", "civil services exam"],
    "variableMeasured": [
      { "@type": "PropertyValue", "name": "AIR", "description": "All India Rank" },
      { "@type": "PropertyValue", "name": "Year" },
      { "@type": "PropertyValue", "name": "Optional Marks" },
      { "@type": "PropertyValue", "name": "Interview" },
      { "@type": "PropertyValue", "name": "Total" },
    ],
    "distribution": {
      "@type": "DataDownload",
      "contentUrl": `https://upscprepnotes.in/optional/${subjectKey}`,
      "encodingFormat": "text/html",
    },
  };

  const OTHER_SUBJECTS = Object.entries(SUBJECT_DATA).filter(
    ([key]) => key !== subjectKey
  );

  return (
    <main className="min-h-screen bg-background text-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }}
      />

      {/* HERO */}
      <section className="mx-auto max-w-5xl px-6 py-24 md:py-32">
        {/* BREADCRUMB */}
        <div className="mb-10 flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-zinc-500">
          <Link href="/" data-track="optional-breadcrumb-home" className="transition hover:text-foreground">
            Home
          </Link>
          <span>•</span>
          <span>{subjectInfo.name}</span>
        </div>

        <div className="mb-12">
          <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-zinc-500">
            Optional Subject Intelligence
          </p>

          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            {subjectInfo.name} — UPSC Optional Subject, Toppers &amp; Strategy
          </h1>

          <p className="mt-6 max-w-2xl text-base md:text-lg leading-8 text-zinc-800">
            {subjectInfo.name} optional subject for UPSC CSE — {subjectInfo.description.slice(0, 1).toLowerCase() + subjectInfo.description.slice(1)}
          </p>
        </div>

        {/* STATS */}
        {stats && (
          <div className="grid gap-4 sm:gap-8 grid-cols-2 sm:grid-cols-4">
            <div>
              <p className="text-2xl sm:text-3xl font-semibold">{stats.totalToppers}</p>
              <p className="mt-2 text-xs sm:text-sm text-zinc-600">Toppers</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-semibold">{stats.avgMarks}</p>
              <p className="mt-2 text-xs sm:text-sm text-zinc-600">Avg Marks</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-semibold">{stats.maxMarks}</p>
              <p className="mt-2 text-xs sm:text-sm text-zinc-600">Highest Marks</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-semibold">{stats.minMarks}</p>
              <p className="mt-2 text-xs sm:text-sm text-zinc-600">Lowest Marks</p>
            </div>
          </div>
        )}
      </section>

      {/* COMPUTED INSIGHTS */}
      {insights.length > 0 && (
        <section className="mx-auto max-w-5xl px-6 pb-8">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Key Insights — {subjectInfo.name}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {insights.map((insight, i) => (
              <div key={i} className="rounded-xl border border-black/[0.06] bg-zinc-50 p-4 text-sm leading-6 text-zinc-700">
                {insight}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SUBJECT DETAIL SECTIONS */}
      {(subjectInfo.overview || subjectInfo.whyPopular || (subjectInfo.syllabusTopics || []).length > 0 || (subjectInfo.booklist || []).length > 0 || (subjectInfo.prepInsights || []).length > 0 || subjectInfo.scoringTrend) && (
        <section className="mx-auto max-w-5xl px-6 py-8 md:py-12">
          <div className="mb-8">
            <h2 className="text-3xl font-semibold">About {subjectInfo.name}</h2>
          </div>

          {subjectInfo.overview && (
            <div className="mb-8">
              <h3 className="text-2xl font-semibold">Subject Overview</h3>
              <p className="mt-3 text-zinc-700 leading-8">{subjectInfo.overview}</p>
            </div>
          )}

          {subjectInfo.whyPopular && (
            <div className="mb-8">
              <h3 className="text-2xl font-semibold">Why {subjectInfo.name} Is Popular</h3>
              <p className="mt-3 text-zinc-700 leading-8">{subjectInfo.whyPopular}</p>
            </div>
          )}

          {(subjectInfo.syllabusTopics || []).length > 0 && (
            <div className="mb-8">
              <h3 className="text-2xl font-semibold">Key Syllabus Topics</h3>
              <ul className="mt-3 list-disc pl-6 text-zinc-700 space-y-1">
                {subjectInfo.syllabusTopics!.map((topic, idx) => (
                  <li key={idx}>{topic}</li>
                ))}
              </ul>
            </div>
          )}

          {(subjectInfo.booklist || []).length > 0 && (
            <div className="mb-8">
              <h3 className="text-2xl font-semibold">Recommended Books</h3>
              <ul className="mt-3 list-disc pl-6 text-zinc-700 space-y-1">
                {subjectInfo.booklist!.map((book, idx) => (
                  <li key={idx}>{book}</li>
                ))}
              </ul>
            </div>
          )}

          {(subjectInfo.prepInsights || []).length > 0 && (
            <div className="mb-8">
              <h3 className="text-2xl font-semibold">Preparation Insights</h3>
              <div className="mt-3 grid gap-4 md:grid-cols-2">
                {subjectInfo.prepInsights!.map((insight, idx) => (
                  <div key={idx} className="rounded-lg border border-black/[0.06] bg-background p-4">
                    <p className="text-zinc-700 leading-7">{insight}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {subjectInfo.scoringTrend && (
            <div className="mb-8 rounded-xl border border-black/[0.06] bg-zinc-50 p-6">
              <h3 className="text-lg font-semibold">Scoring Trend</h3>
              <p className="mt-2 text-zinc-700 leading-7">{subjectInfo.scoringTrend}</p>
            </div>
          )}
        </section>
      )}

      {/* FULL MARKS TABLE */}
      {toppers.length > 0 && (
        <section className="mx-auto max-w-5xl px-6 py-16 md:py-24">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
            {subjectInfo.name} Topper Marks Table
          </p>
          <div className="overflow-x-auto rounded-2xl border border-black/[0.06]">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-black/[0.06] bg-zinc-50">
                  <th className="p-4 font-semibold">AIR</th>
                  <th className="p-4 font-semibold">Name</th>
                  <th className="p-4 font-semibold">Year</th>
                  <th className="p-4 font-semibold">Opt P1</th>
                  <th className="p-4 font-semibold">Opt P2</th>
                  <th className="p-4 font-semibold">Essay</th>
                  <th className="p-4 font-semibold">Written</th>
                  <th className="p-4 font-semibold">Interview</th>
                  <th className="p-4 font-semibold">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04]">
                {toppers.map((t) => (
                  <tr key={t.slug} className="hover:bg-zinc-50 transition">
                    <td className="p-4 font-semibold">{t.rank}</td>
                    <td className="p-4">
                      <Link
                        href={`/upsc-topper/${t.slug}`}
                        data-track={`optional-topper-${t.slug}`}
                        className="font-medium text-blue-600 underline underline-offset-2 hover:text-blue-800"
                      >
                        {t.firstName} {t.lastName}
                      </Link>
                    </td>
                    <td className="p-4 text-zinc-600">{t.year}</td>
                    <td className="p-4">{t.marks.optional1 || "—"}</td>
                    <td className="p-4">{t.marks.optional2 || "—"}</td>
                    <td className="p-4">{t.marks.essay || "—"}</td>
                    <td className="p-4">{t.marks.written || "—"}</td>
                    <td className="p-4">{t.marks.interview || "—"}</td>
                    <td className="p-4 font-semibold">{t.marks.total || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8">
            <Link
              href="/"
              data-track="optional-browse-all-toppers"
              className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              Browse All Toppers &rarr;
            </Link>
          </div>
        </section>
      )}

      {/* OTHER OPTIONAL SUBJECTS */}
      <section className="mx-auto max-w-5xl px-6 py-16 md:py-24 border-t border-zinc-100">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Explore Other Optional Subjects
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {OTHER_SUBJECTS.map(([key, info]) => (
            <Link
              key={key}
              href={`/optional/${key}`}
              data-track={`optional-other-${key}`}
              className="rounded-xl border border-black/[0.06] bg-zinc-50 p-4 text-sm font-medium transition hover:bg-zinc-100"
            >
              {info.name}
            </Link>
          ))}
        </div>
      </section>
      {/* COMPILATION UPSELL */}
      <section className="mx-auto max-w-5xl px-6 py-16 md:py-24 border-t border-zinc-100">
        <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6 md:p-8">
          <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="rounded-full bg-emerald-600 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">Complete Compilation</span>
              <h2 className="mt-2 text-lg font-bold text-gray-900 md:text-xl">
                Get {subjectInfo.name} Topper Answer Copies
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                50+ topper copies across GS1-4, Essay &amp; Optional. All at just ₹11 per copy.
              </p>
              <div className="mt-2 flex items-center gap-3">
                <span className="text-2xl font-bold text-gray-900">₹799</span>
                <span className="text-sm text-gray-500 line-through">₹4,999</span>
                <span className="text-xs text-emerald-700 font-semibold">83% off</span>
              </div>
            </div>
            <Link
              href="/store"
              data-track="optional-compilation-upsell"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-gray-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-gray-800"
            >
              Browse Store &rarr;
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
