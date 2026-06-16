export interface Question {
  id: number;
  text: string;
  options: { label: string; text: string; correct: boolean }[];
  explanation: string;
  subject: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface CAStory {
  id: number;
  category: "Economy" | "Polity" | "Environment" | "Science & Tech" | "International Relations" | "Social Issues" | "Security" | "Culture";
  title: string;
  body: string;
  source?: string;
}

export interface DailyContent {
  date: string;
  quiz: {
    title: string;
    questions: Question[];
  };
  currentAffairs: {
    title: string;
    stories: CAStory[];
  };
}

function todayDate(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const sampleContent: DailyContent = {
  date: "2026-06-16",
  quiz: {
    title: "Daily Current Affairs Quiz",
    questions: [
      {
        id: 1,
        text: "With reference to the PM-KISAN scheme, consider the following statements:",
        options: [
          { label: "A", text: "It provides income support of ₹6,000 per year to farmer families", correct: true },
          { label: "B", text: "It is funded entirely by state governments", correct: false },
          { label: "C", text: "It covers all farmers regardless of landholding size", correct: false },
          { label: "D", text: "It was launched in 2020", correct: false },
        ],
        explanation: "PM-KISAN was launched in February 2019 (not 2020). It provides ₹6,000 per year to small and marginal farmer families (not all farmers). The scheme is entirely funded by the central government. Option A is correct.",
        subject: "Polity",
        difficulty: "medium",
      },
      {
        id: 2,
        text: "Which of the following countries is not a member of the Shanghai Cooperation Organisation (SCO)?",
        options: [
          { label: "A", text: "India", correct: false },
          { label: "B", text: "Pakistan", correct: false },
          { label: "C", text: "Japan", correct: true },
          { label: "D", text: "China", correct: false },
        ],
        explanation: "SCO成员国包括中国、印度、巴基斯坦、俄罗斯、哈萨克斯坦、吉尔吉斯斯坦、塔吉克斯坦、乌兹别克斯坦和伊朗。日本不是SCO成员国。",
        subject: "International Relations",
        difficulty: "easy",
      },
      {
        id: 3,
        text: "Consider the following pairs: Wildlife Sanctuary — State. Which of the pairs is/are correctly matched?",
        options: [
          { label: "A", text: "Kuno National Park — Madhya Pradesh", correct: true },
          { label: "B", text: "Mukundara Hills — Rajasthan", correct: true },
          { label: "C", text: "Guru Ghasidas — Chhattisgarh", correct: true },
          { label: "D", text: "All of the above", correct: true },
        ],
        explanation: "All three are correctly matched. Kuno National Park (Madhya Pradesh) — cheetah reintroduction site. Mukundara Hills Tiger Reserve (Rajasthan). Guru Ghasidas National Park (Chhattisgarh) — proposed tiger reserve.",
        subject: "Environment",
        difficulty: "medium",
      },
      {
        id: 4,
        text: "The term 'Core of the Core' in the context of India's Strategic Petroleum Reserves refers to:",
        options: [
          { label: "A", text: "Crude oil stored in underground caverns at Mangalore", correct: false },
          { label: "B", text: "The minimum quantity of crude oil to be maintained at all times", correct: true },
          { label: "C", text: "Petroleum products reserved for defence forces", correct: false },
          { label: "D", text: "Oil reserves located in the Andaman basin", correct: false },
        ],
        explanation: "'Core of the Core' refers to the minimum quantity of crude oil that must be maintained in India's Strategic Petroleum Reserves at all times, below which drawdown is not permitted except in extreme emergencies.",
        subject: "Economy",
        difficulty: "hard",
      },
      {
        id: 5,
        text: "Miyawaki method of afforestation involves:",
        options: [
          { label: "A", text: "Planting native species in dense clusters", correct: true },
          { label: "B", text: "Aerial seeding using drones", correct: false },
          { label: "C", text: "Hydroseeding on slopes", correct: false },
          { label: "D", text: "Growing trees in waterlogged areas", correct: false },
        ],
        explanation: "The Miyawaki method, developed by Japanese botanist Akira Miyawaki, involves planting native species very close together (dense clusters) to create multi-layered forests that grow 10x faster and are 30x denser than conventional plantations.",
        subject: "Environment",
        difficulty: "easy",
      },
      {
        id: 6,
        text: "With reference to the National Pension System (NPS), which of the following statements is correct?",
        options: [
          { label: "A", text: "It is a defined benefit pension scheme", correct: false },
          { label: "B", text: "It is mandatory for all government employees recruited after 2004", correct: true },
          { label: "C", text: "It is regulated by the RBI", correct: false },
          { label: "D", text: "It guarantees a minimum pension amount", correct: false },
        ],
        explanation: "NPS is a defined contribution (not defined benefit) pension scheme. It is mandatory for all central government employees recruited after January 1, 2004. It is regulated by PFRDA (not RBI). It does not guarantee any minimum pension.",
        subject: "Polity",
        difficulty: "medium",
      },
      {
        id: 7,
        text: "The 'Char Dham' project in Uttarakhand is associated with:",
        options: [
          { label: "A", text: "Building a network of ropeways", correct: false },
          { label: "B", text: "Widening of national highways to pilgrimage sites", correct: true },
          { label: "C", text: "Setting up helipads at all four shrines", correct: false },
          { label: "D", text: "Construction of temporary shelters for pilgrims", correct: false },
        ],
        explanation: "The Char Dham project involves widening of national highways connecting the four pilgrimage sites — Yamunotri, Gangotri, Kedarnath, and Badrinath — to improve accessibility. It has faced legal challenges on environmental grounds.",
        subject: "Polity",
        difficulty: "medium",
      },
      {
        id: 8,
        text: "Olive ridley turtles are primarily found nesting along which coast of India?",
        options: [
          { label: "A", text: "Malabar Coast", correct: false },
          { label: "B", text: "Coromandel Coast", correct: false },
          { label: "C", text: "Odisha Coast", correct: true },
          { label: "D", text: "Konkan Coast", correct: false },
        ],
        explanation: "Olive ridley turtles nest primarily along the Odisha coast, especially at Gahirmatha Beach, Rushikulya River mouth, and Devi River mouth. They are known for their mass nesting phenomenon called 'arribada'.",
        subject: "Environment",
        difficulty: "easy",
      },
      {
        id: 9,
        text: "The concept of 'Whole Government Approach' in India is associated with:",
        options: [
          { label: "A", text: "Centre-state fiscal relations", correct: false },
          { label: "B", text: "National security and counter-terrorism", correct: true },
          { label: "C", text: "Education policy implementation", correct: false },
          { label: "D", text: "Health sector reforms", correct: false },
        ],
        explanation: "The 'Whole Government Approach' in India refers to coordinated action across all ministries and agencies to address national security threats, particularly counter-terrorism and internal security challenges.",
        subject: "Security",
        difficulty: "hard",
      },
      {
        id: 10,
        text: "Which of the following is the correct sequence of layers of the Earth's atmosphere from the surface upwards?",
        options: [
          { label: "A", text: "Troposphere — Stratosphere — Mesosphere — Thermosphere", correct: true },
          { label: "B", text: "Stratosphere — Troposphere — Mesosphere — Thermosphere", correct: false },
          { label: "C", text: "Troposphere — Mesosphere — Stratosphere — Thermosphere", correct: false },
          { label: "D", text: "Troposphere — Stratosphere — Thermosphere — Mesosphere", correct: false },
        ],
        explanation: "The correct sequence from Earth's surface upward is: Troposphere (0-12 km), Stratosphere (12-50 km), Mesosphere (50-80 km), Thermosphere (80-700 km). The stratosphere contains the ozone layer.",
        subject: "Geography",
        difficulty: "easy",
      },
    ],
  },
  currentAffairs: {
    title: "Today's Headlines",
    stories: [
      {
        id: 1,
        category: "Economy",
        title: "India's GDP grows at 7.2% in Q4 FY2026",
        body: "India's GDP grew 7.2% in the fourth quarter of FY2026, surpassing the estimate of 6.8%. The growth was driven by a strong performance in the manufacturing (8.1%) and services (7.8%) sectors. The full-year GDP growth is now estimated at 7.0%.",
        source: "Ministry of Statistics",
      },
      {
        id: 2,
        category: "Polity",
        title: "Parliament passes Digital Personal Data Protection Amendment",
        body: "Parliament passed the Digital Personal Data Protection (Amendment) Bill, 2026, introducing stricter penalties for data breaches (up to ₹500 crore), expanded user consent requirements, and new obligations for data fiduciaries handling children's data.",
        source: "PRS Legislative",
      },
      {
        id: 3,
        category: "Environment",
        title: "India commits to net-zero shipping by 2050 at IMO meet",
        body: "India joined 50+ nations at the International Maritime Organization (IMO) meeting in London, pledging to decarbonize maritime transport by 2050 through adoption of green hydrogen and alternative fuels.",
      },
      {
        id: 4,
        category: "Science & Tech",
        title: "ISRO successfully tests reusable launch vehicle Pushpak",
        body: "ISRO successfully conducted the autonomous landing test of its reusable launch vehicle (RLV) 'Pushpak' at the Aeronautical Test Range in Chitradurga, Karnataka. This brings India closer to having cost-effective access to space.",
      },
      {
        id: 5,
        category: "International Relations",
        title: "India and EU sign Free Trade Agreement after 15 years of negotiations",
        body: "India and the European Union signed a comprehensive Free Trade Agreement covering goods, services, and investment. The agreement is expected to boost bilateral trade by 40% over the next five years.",
      },
      {
        id: 6,
        category: "Social Issues",
        title: "Women's reservation implemented in state legislative councils",
        body: "Following the Nari Shakti Vandan Adhiniyam, the government has now mandated 33% reservation for women in all state legislative councils, extending the constitutional amendment beyond Lok Sabha and state assemblies.",
      },
    ],
  },
};

const dateContentMap: Record<string, DailyContent> = {
  "2026-06-16": sampleContent,
  "2026-06-15": {
    date: "2026-06-15",
    quiz: {
      title: "Daily Current Affairs Quiz",
      questions: sampleContent.quiz.questions.map((q) => ({ ...q, id: q.id })),
    },
    currentAffairs: {
      title: "Yesterday's Headlines",
      stories: sampleContent.currentAffairs.stories.map((s) => ({ ...s, id: s.id })),
    },
  },
};

export function getDailyContent(date?: string): DailyContent | null {
  const target = date || todayDate();
  return dateContentMap[target] || null;
}

export function getAllDates(): string[] {
  return Object.keys(dateContentMap).sort().reverse();
}
