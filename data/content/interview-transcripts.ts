/**
 * Fourteen UPSC Personality Test transcripts from the CSE 2025 interview round (held January–February
 * 2026), read and coded by hand. Each is a candidate's own recollection, published on ForumIAS; boards
 * are named as the candidate reported them. We store only our category counts and a few questions
 * paraphrased in our own words, with a link to the source.
 *
 * Categories:
 *   current   current affairs and general awareness
 *   opinion   "what do you think about…" with no role attached
 *   situational  "as DM / SP / diplomat, what would you do"
 *   hobby     anything from the hobbies and interests column
 *   home      home state, district or city
 *   education graduation subject, college, projects
 *   work      job, internship, NSS or volunteering roles from the DAF
 *   optional  the optional subject
 *   why       why civil services / why leave a job or seat
 *   other     general knowledge, ice-breakers, anything else
 */

export type IVCategory = "current" | "opinion" | "situational" | "hobby" | "home" | "education" | "work" | "optional" | "why" | "other";

export const IV_CATEGORY_LABELS: Record<IVCategory, string> = {
  current: "Current affairs",
  opinion: "Opinion questions",
  hobby: "Hobbies and interests",
  home: "Home state and district",
  other: "General knowledge and other",
  education: "Graduation subject and college",
  situational: "“As DM, what would you do?”",
  work: "Work, internships and roles",
  optional: "Optional subject",
  why: "Why civil services",
};

export type IVTranscript = {
  board: string;
  month: string;
  background: string;
  optional: string;
  home: string;
  hobbies: string;
  counts: Partial<Record<IVCategory, number>>;
  examples: string[];
  url: string;
};

export const IV_TRANSCRIPTS: IVTranscript[] = [
  {
    board: "Suman Sharma", month: "Feb 2026", background: "B.Com", optional: "PSIR", home: "", hobbies: "",
    counts: { current: 12, opinion: 1, other: 1 },
    examples: ["How is a Ponzi scheme different from multi-level marketing?", "Should India leave the WHO, given the criticism it faces?", "Should OTT platforms be regulated like films?"],
    url: "https://forumias.com/blog/upsc-interview-2025-transcript-147-suman-sharma-board-psir-optional/",
  },
  {
    board: "Lt Gen Raj Shukla", month: "Jan 2026", background: "Electrical engineering, automotive R&D job", optional: "Anthropology", home: "Kerala", hobbies: "Cycling, robotics",
    counts: { work: 4, home: 4, current: 11, opinion: 2, situational: 2, other: 2 },
    examples: ["Why did you leave your R&D job?", "Why is private-sector R&D spending so low in India?", "What made Kudumbashree work?", "As SDM, would you ban Jallikattu?"],
    url: "https://forumias.com/blog/upsc-interview-2025-transcript-145-lt-general-raj-shukla-board-anthropology-optional-kerala-home-state-cycling-hobby/",
  },
  {
    board: "Dinesh Dasa", month: "Jan 2026", background: "Biotechnology (IIT), teaching", optional: "Sociology", home: "Bihar", hobbies: "Films",
    counts: { education: 2, hobby: 1, home: 3, optional: 2, current: 6, opinion: 2, situational: 2 },
    examples: ["What are the modern critiques of Weber's Protestant ethic?", "Why has Bihar not developed, and what is good about it?", "What is driving student suicides in Kota?"],
    url: "https://forumias.com/blog/upsc-interview-2025-transcript-144-dinesh-dasa-board-sociology-optional-bihar-home-state/",
  },
  {
    board: "Bidyut Behari Swain", month: "Jan 2026", background: "Electrical engineering", optional: "History", home: "Uttar Pradesh (Jhansi)", hobbies: "Music",
    counts: { education: 1, hobby: 2, home: 3, current: 6, opinion: 3, other: 1 },
    examples: ["What are the economic challenges of Jhansi?", "Should history textbooks be rewritten?", "What day was yesterday, and why does it matter?"],
    url: "https://forumias.com/blog/upsc-interview-2025-transcript-135-bidyut-behari-swain-board-history-optional-uttar-pradesh-home-state/",
  },
  {
    board: "Sanjay Verma", month: "Jan 2026", background: "Civil engineering (IIT), NSS secretary", optional: "PSIR", home: "Bihar (Vaishali)", hobbies: "Web series, Madhubani painting",
    counts: { work: 1, hobby: 5, home: 3, optional: 2, current: 7, opinion: 3, situational: 1, why: 1, other: 1 },
    examples: ["How is a web series different from a film?", "Why do bridges keep collapsing in Bihar?", "Why civil services after civil engineering from a top college?"],
    url: "https://forumias.com/blog/upsc-interview-2025-transcript-131-sanjay-verma-board-psir-optional-bihar-home-state/",
  },
  {
    board: "Dinesh Dasa", month: "Jan 2026", background: "Economics graduate, bank job", optional: "Economics", home: "Madhya Pradesh", hobbies: "Yoga, dance",
    counts: { education: 2, optional: 2, current: 6, opinion: 5, other: 1 },
    examples: ["What does a weaker rupee mean for India's trade?", "Should countries be run by economists?", "Name three developments from the last three months that excited you."],
    url: "https://forumias.com/blog/upsc-interview-2025-transcript-136-dinesh-dasa-sir-board-madhya-pradesh-home-state-yoga-dance-hobbies/",
  },
  {
    board: "Bidyut Behari Swain", month: "Jan 2026", background: "MBBS, former junior resident", optional: "Hindi Literature", home: "", hobbies: "Blood donation, travel vlogs",
    counts: { education: 1, work: 1, hobby: 5, optional: 3, current: 5, opinion: 4, situational: 2, why: 1, other: 1 },
    examples: ["Do you only watch travel vlogs, or do you travel?", "Why Hindi Literature when you are a doctor?", "As SP, a prisoner dies after a meal and his cellmates are vomiting. What do you do?"],
    url: "https://forumias.com/blog/upsc-interview-2025-transcript-133-bidyut-behari-swain-board-hindi-litrature-optional-mbbs/",
  },
  {
    board: "Sanjay Verma", month: "Jan 2026", background: "Civil engineering (IIT)", optional: "PSIR", home: "Rajasthan (Jodhpur)", hobbies: "Cricket, pencil sketching",
    counts: { education: 1, hobby: 9, home: 4, optional: 3, current: 5, opinion: 4, why: 1, other: 2 },
    examples: ["What can a photograph tell you about a person?", "Is “chalta hai” part of our national character?", "How many all-rounders should a T20 side carry?"],
    url: "https://forumias.com/blog/upsc-interview-2025-transcript-129-sanjay-verma-board-psir-optional-rajasthan-home-state-cricket-hobby/",
  },
  {
    board: "Sujata Chaturvedi", month: "Jan 2026", background: "Physics graduate", optional: "Anthropology", home: "Maharashtra (Nashik)", hobbies: "Flute",
    counts: { education: 4, work: 1, hobby: 2, home: 2, current: 3, opinion: 8, situational: 2, other: 7 },
    examples: ["Explain the theory of relativity simply.", "Can India ever be a neutral country?", "What is creativity?"],
    url: "https://forumias.com/blog/upsc-interview-2025-transcript-146-sujata-chaturvedi-board-anthropology-optional-maharashtra-home-state/",
  },
  {
    board: "Anuradha Prasad", month: "Jan 2026", background: "Mechanical engineering, digital literacy drive", optional: "Malayalam Literature", home: "Kerala", hobbies: "Football, Formula One, meditation",
    counts: { education: 3, work: 5, hobby: 4, home: 4, optional: 1, current: 8, opinion: 4, other: 3 },
    examples: ["What exactly did your digital literacy course teach?", "Does Formula One contribute anything to society?", "Why does Kerala lag in industry?"],
    url: "https://forumias.com/blog/upsc-interview-2025-transcript-143-anuradha-prasad-board-malayalam-literature-optional-kerala-home-state/",
  },
  {
    board: "Suman Sharma", month: "Jan 2026", background: "Law", optional: "Law", home: "", hobbies: "Moot court",
    counts: { optional: 2, current: 9, opinion: 3, situational: 3, other: 3 },
    examples: ["Why was the electoral bond scheme struck down?", "Argue both sides: democracy slows economic growth.", "A girl is crying alone at a railway station. What do you do?"],
    url: "https://forumias.com/blog/upsc-interview-2025-transcript-141-suman-sharma-board-law-optional/",
  },
  {
    board: "Anuradha Prasad", month: "Jan 2026", background: "Civil engineering (IIT), drainage work, mentoring", optional: "Mathematics", home: "Rajasthan (Jaipur)", hobbies: "Solo travel, trekking",
    counts: { work: 5, hobby: 5, education: 3, home: 3, current: 22, opinion: 3, situational: 9 },
    examples: ["Give us a short talk on natural capital.", "As head of the Delhi Jal Board, what would you fix first?", "How would you grow tourism in Jaipur?"],
    url: "https://forumias.com/blog/upsc-interview-2025-transcript-132-anuradha-prasad-board-mathematics-optional-rajasthan-home-state/",
  },
  {
    board: "Sheel Vardhan", month: "Jan 2026", background: "Electrical engineering", optional: "Sociology", home: "Chhattisgarh (Bhilai)", hobbies: "Cricket",
    counts: { education: 3, home: 3, current: 15, opinion: 3 },
    examples: ["Can you repair a transformer?", "What is narco-terrorism, and why call it terror?", "Is the Bhilai Steel Plant working on green steel?"],
    url: "https://forumias.com/blog/upsc-interview-2025-transcript-127-sheel-vardhan-board-sociology-optional-chhattisgarh-home-state/",
  },
  {
    board: "Sanjay Verma", month: "Jan 2026", background: "Electrical engineering, no job since graduating", optional: "Hindi Literature", home: "Uttar Pradesh (Mirzapur)", hobbies: "Films, Hindi poetry",
    counts: { education: 4, work: 1, hobby: 4, home: 1, optional: 1, current: 7, opinion: 3, situational: 1, other: 5 },
    examples: ["If your life were a film, who would play you?", "Should Hindi be pushed in southern states?", "Why haven't you worked or studied further since graduating?"],
    url: "https://forumias.com/blog/upsc-interview-2025-transcript-124-sanjay-verma-sir-board-hindi-literature-optional-uttar-pradesh-home-state/",
  },
];

/** Totals and how many interviews touched each category at least once. */
export function transcriptStats() {
  const cats = Object.keys(IV_CATEGORY_LABELS) as IVCategory[];
  const total = IV_TRANSCRIPTS.reduce((a, t) => a + Object.values(t.counts).reduce((x, y) => x + (y ?? 0), 0), 0);
  const rows = cats
    .map((c) => {
      const count = IV_TRANSCRIPTS.reduce((a, t) => a + (t.counts[c] ?? 0), 0);
      const interviews = IV_TRANSCRIPTS.filter((t) => (t.counts[c] ?? 0) > 0).length;
      return { key: c, label: IV_CATEGORY_LABELS[c], count, share: Math.round((count / total) * 100), interviews };
    })
    .sort((a, b) => b.count - a.count);
  const withHome = IV_TRANSCRIPTS.filter((t) => t.home);
  const withHobby = IV_TRANSCRIPTS.filter((t) => t.hobbies);
  const daf = rows.filter((r) => ["hobby", "home", "education", "work", "optional", "why"].includes(r.key)).reduce((a, r) => a + r.count, 0);
  return {
    n: IV_TRANSCRIPTS.length,
    total,
    avg: Math.round(total / IV_TRANSCRIPTS.length),
    rows,
    dafShare: Math.round((daf / total) * 100),
    homeAsked: withHome.filter((t) => (t.counts.home ?? 0) > 0).length,
    homeKnown: withHome.length,
    hobbyAsked: withHobby.filter((t) => (t.counts.hobby ?? 0) > 0).length,
    hobbyKnown: withHobby.length,
  };
}
