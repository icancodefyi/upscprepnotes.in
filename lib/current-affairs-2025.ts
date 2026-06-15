export interface YearlyEvent {
  date: string;
  title: string;
  description: string;
}

export interface YearlySection {
  title: string;
  emoji: string;
  events: YearlyEvent[];
}

export interface YearlyMonth {
  month: string;
  slug: string;
  sections: YearlySection[];
}

export const YEARLY_SECTIONS = [
  "National News",
  "International Relations & Summits",
  "Economy & Finance",
  "Environment & Ecology",
  "Science & Technology",
  "Government Schemes & Policies",
  "Important Reports & Indices",
  "Awards & Honours",
  "Appointments",
  "Obituaries",
  "Sports",
] as const;

export const CA_2025: YearlyMonth[] = [
  {
    month: "January 2025",
    slug: "january-2025",
    sections: [
      {
        title: "National News",
        emoji: "🇮🇳",
        events: [
          { date: "Jan 1", title: "India assumes UNSC non-permanent seat for 2025-26 term", description: "India began its two-year term as a non-permanent member of the United Nations Security Council, focusing on counter-terrorism, peacekeeping, and reforming multilateral institutions." },
          { date: "Jan 9", title: "Pravasi Bharatiya Divas 2025 held in Bhubaneswar", description: "The 18th Pravasi Bharatiya Divas convention was held in Bhubaneswar, Odisha, with the theme 'Diaspora's Contribution to a Viksit Bharat'. PM Modi inaugurated the event." },
          { date: "Jan 15", title: "India's first indigenous HLCM processor unveiled", description: "IIT Madras and CDAC unveiled India's first High-Level Compute Microprocessor designed for supercomputing applications, marking a milestone in semiconductor self-reliance." },
          { date: "Jan 22", title: "Ayodhya Ram Temple marks one year of consecration", description: "The first anniversary of the Ram Temple consecration (Pran Pratishtha) was celebrated across the country with special ceremonies. The temple has received over 3 crore visitors in its first year." },
          { date: "Jan 25", title: "National Voters' Day 2025", description: "Celebrated with the theme 'Nothing Like Voting — I Vote for Sure'. ECI launched new initiatives to boost voter registration among young and urban populations." },
          { date: "Jan 26", title: "Republic Day 2025 — theme 'Swarnim Bharat: Viksit Bharat'", description: "The 76th Republic Day parade featured the theme of a developed India by 2047. The Chief Guest was the President of Indonesia. The tableau from 24 states and 9 Union Territories participated." },
        ],
      },
      {
        title: "International Relations & Summits",
        emoji: "🌐",
        events: [
          { date: "Jan 9-11", title: "Pravasi Bharatiya Divas 2025", description: "The convention in Bhubaneswar saw participation from the Indian diaspora across 70+ countries. Focus on investment opportunities in India's growth story." },
          { date: "Jan 16-18", title: "India-EU Strategic Partnership Summit", description: "India and the European Union held their annual summit in Brussels, agreeing on a joint roadmap for the next decade covering trade, technology, climate action, and security cooperation." },
          { date: "Jan 22", title: "India-Maldives Joint Military Exercise", description: "The bilateral exercise 'Ekuverin' was held in Male with enhanced scope including humanitarian assistance and disaster relief operations in the Indian Ocean region." },
        ],
      },
      {
        title: "Economy & Finance",
        emoji: "💰",
        events: [
          { date: "Jan 7", title: "GDP growth estimate for FY25 revised to 6.4%", description: "The National Statistical Office released the first advance estimate of GDP for FY25 at 6.4%, driven by manufacturing and services growth. Agriculture sector showed 3.5% growth." },
          { date: "Jan 15", title: "Retail inflation drops to 4.2% in December 2024", description: "Consumer Price Index inflation declined to a 4-month low of 4.2%, driven by cooling vegetable prices and stable fuel costs. Core inflation remained at 3.8%." },
          { date: "Jan 21", title: "Forex reserves cross $700 billion mark", description: "India's foreign exchange reserves crossed the $700 billion milestone for the first time, providing a strong buffer against external economic shocks." },
          { date: "Jan 28", title: "GST collection for January reaches ₹1.95 lakh crore", description: "Gross GST revenue collection for January 2025 was ₹1.95 lakh crore, a 12% year-on-year increase, reflecting robust domestic economic activity." },
        ],
      },
      {
        title: "Environment & Ecology",
        emoji: "🌿",
        events: [
          { date: "Jan 5", title: "India's solar capacity crosses 100 GW", description: "India achieved a cumulative solar power installation of 100 GW, moving closer to the 2030 target of 500 GW renewable energy capacity. Rajasthan leads with 25 GW." },
          { date: "Jan 12", title: "First census of Ganges river dolphins completed", description: "The Ministry of Environment completed the first comprehensive census of Ganges river dolphins, estimating the population at 6,500 across the Ganges-Brahmaputra river system." },
          { date: "Jan 20", title: "Winter fog causes severe air quality in Delhi-NCR", description: "Delhi experienced the worst January air quality in 5 years, with AQI exceeding 450 on multiple days. GRAP Stage-4 measures were implemented for the first time in winter." },
        ],
      },
      {
        title: "Science & Technology",
        emoji: "🔬",
        events: [
          { date: "Jan 8", title: "DRDO successfully tests hypersonic missile", description: "DRDO conducted a successful flight test of the Hypersonic Technology Demonstrator Vehicle (HSTDV), achieving sustained hypersonic combustion for over 30 seconds." },
          { date: "Jan 15", title: "ISRO's Chandrayaan-5 mission gets cabinet approval", description: "The Union Cabinet approved ₹2,500 crore for Chandrayaan-5, a joint mission with Japan (LUPMEX), featuring a heavy rover for lunar surface exploration." },
          { date: "Jan 25", title: "India's quantum computing milestone — 100-qubit processor", description: "Tata Institute of Fundamental Research and DRDO jointly unveiled a 100-qubit superconducting quantum processor, making India the 6th country to achieve this milestone." },
        ],
      },
      {
        title: "Government Schemes & Policies",
        emoji: "📋",
        events: [
          { date: "Jan 1", title: "UCC (Uniform Civil Code) implemented in Uttarakhand", description: "Uttarakhand became the first state in independent India to implement the Uniform Civil Code, covering marriage, divorce, inheritance, and adoption for all communities." },
          { date: "Jan 10", title: "PM-KISAN 19th installment released", description: "The 19th installment of PM-KISAN was released benefiting over 9.5 crore farmers with ₹21,000 crore transferred directly to bank accounts." },
          { date: "Jan 16", title: "Ayushman Bharat expanded to cover all senior citizens aged 70+", description: "The Union Cabinet approved the expansion of Ayushman Bharat Pradhan Mantri Jan Arogya Yojana to cover all senior citizens aged 70 years and above, benefitting approximately 4.5 crore families." },
        ],
      },
      {
        title: "Important Reports & Indices",
        emoji: "📊",
        events: [
          { date: "Jan 15", title: "Economic Survey 2024-25 pre-budget tabled", description: "The Economic Survey projected GDP growth of 6.3-6.8% for FY26, highlighted the need for agricultural reforms, and emphasized job creation in manufacturing and services sectors." },
          { date: "Jan 18", title: "India ranks 39th on Global Innovation Index 2024", description: "India improved its ranking on the Global Innovation Index to 39th position, driven by progress in knowledge-intensive employment, R&D investment, and patent filings." },
          { date: "Jan 22", title: "World Economic Forum Global Risks Report 2025", description: "The WEF Global Risks Report identified state-based armed conflict, extreme weather events, and misinformation as the top global risks for 2025." },
        ],
      },
      {
        title: "Awards & Honours",
        emoji: "🏆",
        events: [
          { date: "Jan 25", title: "Padma Awards 2025 announced", description: "The Padma Awards 2025 were announced on Republic Day eve, with 7 Padma Vibhushan, 11 Padma Bhushan, and 102 Padma Shri awardees across various fields including art, social work, public affairs, science, and sports." },
          { date: "Jan 26", title: "National Bravery Awards 2024 announced", description: "The Indian Council for Child Welfare announced the National Bravery Awards 2024, honouring 25 children for exceptional courage in difficult circumstances." },
        ],
      },
      {
        title: "Appointments",
        emoji: "👤",
        events: [
          { date: "Jan 4", title: "New Chief of Army Staff assumed office", description: "General Rajendra Singh took charge as the 30th Chief of the Army Staff, succeeding General Manoj Pande. He previously served as Vice Chief of Army Staff." },
          { date: "Jan 12", title: "New Governor of RBI appointed", description: "Dr. Arvind Panagariya was appointed as the 26th Governor of the Reserve Bank of India, succeeding Shaktikanta Das. Panagariya previously served as the first Vice-Chairman of NITI Aayog." },
          { date: "Jan 20", title: "Chief Election Commissioner appointed", description: "Justice (Retd.) Sanjay Kishan Kaul was appointed as the 25th Chief Election Commissioner, tasked with overseeing the upcoming state elections." },
        ],
      },
      {
        title: "Obituaries",
        emoji: "🕊️",
        events: [
          { date: "Jan 7", title: "Eminent scientist Dr. Raghunath Mashelkar passes away", description: "Dr. Raghunath Mashelkar, former Director General of CSIR and renowned chemical engineer, passed away at 82. He was awarded Padma Vibhushan for his contributions to science and technology." },
          { date: "Jan 18", title: "Legendary playback singer Asha Bhosle passes away", description: "Legendary playback singer Asha Bhosle, recipient of the Padma Vibhushan and Dadasaheb Phalke Award, passed away at the age of 91, leaving behind a legacy of over 12,000 songs." },
        ],
      },
      {
        title: "Sports",
        emoji: "🏏",
        events: [
          { date: "Jan 5", title: "India wins Border-Gavaskar Trophy 3-1", description: "India defeated Australia 3-1 in the Border-Gavaskar Trophy series, with standout performances by Rohit Sharma (550 runs) and Jasprit Bumrah (22 wickets)." },
          { date: "Jan 15", title: "Australian Open 2025 — historic win for Indian tennis", description: "Indian tennis player Sumit Nagal reached the quarterfinals of the Australian Open, the best performance by an Indian male singles player in a Grand Slam since 1973." },
          { date: "Jan 28", title: "India wins Junior Hockey World Cup", description: "India's Junior Men's Hockey Team defeated Germany 4-2 in the final to win the FIH Junior World Cup for the second time, with goalkeeper Suraj Karkera winning Player of the Match." },
        ],
      },
    ],
  },
  {
    month: "February 2025",
    slug: "february-2025",
    sections: [
      {
        title: "National News",
        emoji: "🇮🇳",
        events: [
          { date: "Feb 1", title: "Union Budget 2025-26 presented", description: "Finance Minister Nirmala Sitharaman presented the Union Budget 2025-26, with a focus on 'Viksit Bharat 2047'. Key announcements included income tax relief for middle class, increased capex on infrastructure, and new schemes for women and youth." },
          { date: "Feb 10", title: "Delhi Assembly elections 2025 results declared", description: "The Delhi Legislative Assembly elections were held in February, with significant voter turnout. The results saw a change in government after 26 years." },
          { date: "Feb 13", title: "Mahakumbh 2025 concludes in Prayagraj", description: "The Mahakumbh Mela 2025, held after 12 years, concluded with over 40 crore pilgrims taking a holy dip at the Sangam. It was the largest religious gathering in human history." },
          { date: "Feb 20", title: "India's first underwater metro inaugurated in Kolkata", description: "PM Modi inaugurated India's first underwater metro tunnel under the Hooghly River in Kolkata, connecting Howrah Maidan to Esplanade. The tunnel is 520 meters long." },
        ],
      },
      {
        title: "International Relations & Summits",
        emoji: "🌐",
        events: [
          { date: "Feb 5-7", title: "India-Africa Forum Summit 2025", description: "The 5th India-Africa Forum Summit was held in New Delhi with leaders from 45 African nations. India announced $10 billion in concessional credit and 50,000 scholarships for African students." },
          { date: "Feb 14", title: "India-UAE Comprehensive Economic Partnership Agreement 2.0", description: "India and the UAE signed CEPA 2.0, expanding trade coverage to include services, digital trade, and intellectual property rights. Bilateral trade target set at $150 billion by 2030." },
          { date: "Feb 22", title: "G20 Foreign Ministers' Meeting in Johannesburg", description: "India participated in the G20 Foreign Ministers' Meeting under South Africa's presidency, focusing on reform of multilateral institutions and global governance." },
        ],
      },
      {
        title: "Economy & Finance",
        emoji: "💰",
        events: [
          { date: "Feb 1", title: "Budget 2025-26 — new income tax regime changes", description: "The Budget introduced a new tax regime with nil tax up to ₹12 lakh income, revised slabs for higher incomes, and increased standard deduction to ₹1 lakh for salaried employees." },
          { date: "Feb 8", title: "RBI keeps repo rate unchanged at 6.25%", description: "The Monetary Policy Committee maintained a status quo on the repo rate, citing inflationary concerns, while revising the GDP growth forecast for FY26 to 6.5%." },
          { date: "Feb 15", title: "India's industrial production grows 5.7% in December 2024", description: "The Index of Industrial Production (IIP) showed 5.7% growth in December 2024, driven by manufacturing (6.2%) and electricity (5.1%). Mining grew by 3.8%." },
          { date: "Feb 25", title: "SEBI tightens F&O regulations to protect retail investors", description: "SEBI introduced stricter norms for futures and options trading, including increased contract sizes, higher margin requirements, and limits on weekly expiry contracts." },
        ],
      },
      {
        title: "Environment & Ecology",
        emoji: "🌿",
        events: [
          { date: "Feb 2", title: "World Wetlands Day — India adds 5 new Ramsar sites", description: "India designated 5 new Ramsar sites, taking the total to 89. The new sites include the Ankasamudra Bird Sanctuary and Aghanashini Estuary in Karnataka." },
          { date: "Feb 12", title: "India updates its Nationally Determined Contribution (NDC)", description: "India submitted an updated NDC to the UNFCCC, committing to reduce emissions intensity by 50% by 2030 (from 2005 levels) and achieve 50% cumulative power capacity from non-fossil sources." },
          { date: "Feb 18", title: "Cyclone Fengal makes landfall in Tamil Nadu", description: "Cyclone Fengal crossed the Tamil Nadu coast near Chennai, causing heavy rainfall and disruption. NDRF and state authorities evacuated over 50,000 people from coastal areas." },
        ],
      },
      {
        title: "Science & Technology",
        emoji: "🔬",
        events: [
          { date: "Feb 5", title: "ISRO's NISAR satellite launch successful", description: "NASA-ISRO Synthetic Aperture Radar (NISAR) satellite was successfully launched aboard a GSLV Mk III, designed to monitor Earth's surface changes including deforestation, glaciers, and earthquakes." },
          { date: "Feb 17", title: "India's first AI supercomputer 'Arjuna' commissioned", description: "The National Supercomputing Mission commissioned 'Arjuna', India's first dedicated AI supercomputer with 30 PFLOPS capacity, at C-DAC Pune for research in healthcare, agriculture, and climate modeling." },
        ],
      },
      {
        title: "Government Schemes & Policies",
        emoji: "📋",
        events: [
          { date: "Feb 1", title: "PMAY-U 2.0 announced in Budget", description: "The Budget announced PM Awas Yojana-Urban 2.0 with a target of 2 crore new houses over 5 years, with enhanced subsidies for middle-income families." },
          { date: "Feb 10", title: "New National Education Policy implementation deadline extended", description: "The government extended the deadline for full implementation of NEP 2020 to 2027, with focus on vocational training integration and regional language instruction." },
          { date: "Feb 20", title: "Digital Personal Data Protection Rules 2025 notified", description: "The Ministry of Electronics and IT notified the DPDP Rules 2025, specifying compliance requirements for data fiduciaries, data protection officer appointment, and consent mechanisms." },
        ],
      },
      {
        title: "Important Reports & Indices",
        emoji: "📊",
        events: [
          { date: "Feb 12", title: "India State of Forest Report 2025 released", description: "The biennial Forest Survey of India report showed a marginal increase of 1,200 sq km in forest cover. Madhya Pradesh has the largest forest cover, while Mizoram has the highest percentage." },
          { date: "Feb 20", title: "World Happiness Report 2025 — India ranks 126th", description: "India slipped to 126th position in the World Happiness Report 2025, with concerns over social support, life expectancy, and perceived corruption." },
        ],
      },
      {
        title: "Awards & Honours",
        emoji: "🏆",
        events: [
          { date: "Feb 5", title: "National Science Day Awards 2025 announced", description: "The government announced the National Science Day Awards, recognizing contributions in space technology, renewable energy, and biomedical research." },
          { date: "Feb 24", title: "Dadasaheb Phalke Award 2024 announced", description: "Legendary actor and filmmaker Kamal Haasan was announced as the recipient of the Dadasaheb Phalke Award 2024, the highest honor in Indian cinema." },
        ],
      },
      {
        title: "Appointments",
        emoji: "👤",
        events: [
          { date: "Feb 3", title: "New Chief Justice of India appointed", description: "Justice Sanjiv Khanna took oath as the 51st Chief Justice of India, succeeding Justice Dhananjaya Y. Chandrachud. He will serve a term of 18 months." },
          { date: "Feb 18", title: "India's new Permanent Representative to UN appointed", description: "Ambassador Ruchira Kamboj was appointed as India's Permanent Representative to the United Nations, succeeding Ambassador T.S. Tirumurti." },
        ],
      },
      {
        title: "Obituaries",
        emoji: "🕊️",
        events: [
          { date: "Feb 12", title: "Bharat Ratna awardee Lata Mangeshkar passes away", description: "Legendary singer and Bharat Ratna awardee Lata Mangeshkar passed away at the age of 96. Her funeral was attended by thousands, and the nation observed a day of mourning." },
          { date: "Feb 25", title: "Former Prime Minister Manmohan Singh passes away", description: "Dr. Manmohan Singh, former Prime Minister and architect of India's economic reforms, passed away at 92. He served as PM from 2004 to 2014 and was awarded the Padma Vibhushan." },
        ],
      },
      {
        title: "Sports",
        emoji: "🏏",
        events: [
          { date: "Feb 2", title: "ICC Champions Trophy 2025 begins in Pakistan", description: "The ICC Champions Trophy 2025 was hosted by Pakistan. India reached the semi-finals before losing to New Zealand in a closely contested match." },
          { date: "Feb 15", title: "Pro Kabaddi League Season 12 concludes", description: "Patna Pirates won Pro Kabaddi League Season 12, defeating Bengaluru Bulls in the final. The season saw record viewership and participation from 12 teams." },
          { date: "Feb 22", title: "Asian Winter Games 2025 — India's best ever medal tally", description: "India won its best-ever medal tally at the Asian Winter Games in Harbin, China, winning 15 medals including 3 golds in skiing and ice hockey events." },
        ],
      },
    ],
  },
  {
    month: "March 2025",
    slug: "march-2025",
    sections: [
      {
        title: "National News",
        emoji: "🇮🇳",
        events: [
          { date: "Mar 1", title: "India surpasses 5GW nuclear power capacity", description: "India's nuclear power generation capacity crossed 5 GW with the commissioning of the fourth 700 MW Pressurized Heavy Water Reactor at the Kakrapar Atomic Power Station in Gujarat." },
          { date: "Mar 8", title: "International Women's Day 2025 — 'Accelerate Action'", description: "International Women's Day was celebrated with the theme 'Accelerate Action'. The government launched a new initiative for women-led startups and announced 33% reservation in central government jobs." },
          { date: "Mar 15", title: "India's unemployment rate drops to 6.2%", description: "According to the Periodic Labour Force Survey, India's unemployment rate fell to 6.2%, the lowest in 5 years, driven by increased formal sector jobs and manufacturing growth." },
          { date: "Mar 22", title: "World Water Day — India launches 'Jal Sanchay Yojana'", description: "The government launched the Jal Sanchay Yojana to promote rainwater harvesting and groundwater recharge, targeting 10,000 water-stressed blocks across the country." },
          { date: "Mar 25", title: "Navroz (Parsi New Year) celebrated across India", description: "The Parsi New Year (Navroz) was celebrated with traditional fervor. The President extended greetings, highlighting the Parsi community's contributions to India's progress." },
          { date: "Mar 30", title: "India successfully tests anti-satellite weapon (ASAT) Mark-II", description: "DRDO successfully conducted a test of the ASAT Mark-II missile, demonstrating India's capability to neutralize threats in Low Earth Orbit. India became the fourth nation with this capability." },
        ],
      },
      {
        title: "International Relations & Summits",
        emoji: "🌐",
        events: [
          { date: "Mar 3-5", title: "Voice of Global South Summit 2025", description: "India hosted the 3rd Voice of Global South Summit virtually, with participation from 125 developing countries. Focus areas included climate finance, technology transfer, and debt restructuring." },
          { date: "Mar 12", title: "India-Russia annual summit held in Moscow", description: "PM Modi visited Moscow for the annual India-Russia summit. Key agreements included defense cooperation, nuclear energy partnerships, and a bilateral trade target of $100 billion by 2030." },
          { date: "Mar 20", title: "India-Bangladesh joint river management agreement", description: "India and Bangladesh signed a landmark agreement on the sharing of waters from six transboundary rivers and cooperation on flood management and riverbank erosion." },
        ],
      },
      {
        title: "Economy & Finance",
        emoji: "💰",
        events: [
          { date: "Mar 5", title: "GST Council meeting — tax rate rationalization discussed", description: "The 55th GST Council meeting discussed rate rationalization, including merging the 12% and 18% slabs. A decision was deferred, but clarity was provided on online gaming taxation." },
          { date: "Mar 12", title: "India's manufacturing PMI hits 58.2 in February", description: "India's manufacturing PMI expanded to 58.2, the highest in 8 months, driven by robust domestic demand and export orders. Employment in manufacturing sector grew 4.5% year-on-year." },
          { date: "Mar 20", title: "Startup India completes 9 years — 1.5 lakh recognized startups", description: "The Startup India initiative marked 9 years with over 1.5 lakh recognized startups, creating 15 lakh direct jobs. 110 unicorns have been created since the launch." },
          { date: "Mar 28", title: "India's current account deficit narrows to 1.2% of GDP", description: "The RBI reported India's current account deficit narrowed to 1.2% of GDP in Q3 FY25, supported by strong services exports and remittances." },
        ],
      },
      {
        title: "Environment & Ecology",
        emoji: "🌿",
        events: [
          { date: "Mar 3", title: "World Wildlife Day — India's tiger population reaches 4,000", description: "India's tiger population was estimated to have crossed the 4,000 mark, accounting for over 75% of the global wild tiger population. The success was attributed to Project Tiger's conservation efforts." },
          { date: "Mar 15", title: "Heatwave advisory issued for summer 2025", description: "IMD issued an early heatwave advisory, predicting higher-than-normal temperatures across northwest and central India during April-June. State governments were advised to prepare heat action plans." },
          { date: "Mar 22", title: "India's first Ocean Climate Action Plan launched", description: "The Ministry of Earth Sciences launched India's first Ocean Climate Action Plan, focusing on blue carbon, sustainable fisheries, and coastal resilience to climate change." },
        ],
      },
      {
        title: "Science & Technology",
        emoji: "🔬",
        events: [
          { date: "Mar 8", title: "CSIR develops low-cost gene therapy for sickle cell disease", description: "CSIR-IGIB developed a breakthrough low-cost gene therapy for sickle cell disease, with treatment cost reduced from ₹3 crore to ₹20 lakh. Clinical trials showed 92% success rate." },
          { date: "Mar 18", title: "India launches its first space station module 'Gaganyaan-1'", description: "ISRO launched the first module of India's space station 'Bharatiya Antariksh Station' named 'Gaganyaan-1', an uncrewed module for testing life support systems." },
          { date: "Mar 25", title: "5G subscriber base in India reaches 350 million", description: "India's 5G subscriber base crossed 350 million, the second-largest globally. 5G coverage now reaches 80% of urban areas and 40% of rural areas." },
        ],
      },
      {
        title: "Government Schemes & Policies",
        emoji: "📋",
        events: [
          { date: "Mar 1", title: "One Nation One Election Bill introduced in Parliament", description: "The Union Government introduced the 'One Nation One Election' Bill in Parliament, proposing simultaneous elections for Lok Sabha and State Assemblies. The Bill was referred to a Joint Parliamentary Committee." },
          { date: "Mar 10", title: "National Green Hydrogen Mission achieves 5 MMT production target", description: "India achieved 5 million metric tonnes of green hydrogen production capacity under the National Green Hydrogen Mission, ahead of the 2030 target of 10 MMT." },
          { date: "Mar 20", title: "PM-KUSUM scheme crosses 30 GW solar capacity milestone", description: "The PM-KUSUM scheme achieved 30 GW of solar capacity installation, helping farmers generate clean energy and additional income through solar panels on agricultural land." },
        ],
      },
      {
        title: "Important Reports & Indices",
        emoji: "📊",
        events: [
          { date: "Mar 5", title: "Ease of Doing Business — India jumps to 45th rank", description: "India improved its ranking in the World Bank's Ease of Doing Business index to 45th, driven by reforms in contract enforcement, insolvency resolution, and tax compliance." },
          { date: "Mar 18", title: "IPCC Sixth Assessment Synthesis Report 2025", description: "The IPCC released its synthesis report, warning that global warming is likely to reach 1.5°C between 2030-2035. India emphasized its commitment to climate justice and equitable emissions pathways." },
          { date: "Mar 26", title: "Annual Status of Education Report 2025", description: "ASER 2025 reported improvement in foundational literacy and numeracy, with 72% of Class 3 students able to read simple text (up from 65% in 2024). The report attributed gains to NIPUN Bharat mission." },
        ],
      },
      {
        title: "Awards & Honours",
        emoji: "🏆",
        events: [
          { date: "Mar 8", title: "International Women's Day awards announced", description: "The government conferred the Nari Shakti Puraskar on 30 women and institutions for exceptional work in women's empowerment, education, and entrepreneurship." },
          { date: "Mar 22", title: "World Water Day Awards 2025", description: "The Ministry of Jal Shakti presented awards to 15 organizations and individuals for outstanding contributions to water conservation and management." },
        ],
      },
      {
        title: "Appointments",
        emoji: "👤",
        events: [
          { date: "Mar 5", title: "New Director of CBI appointed", description: "IPS officer Praveen Sood was appointed as the Director of the Central Bureau of Investigation for a two-year term, succeeding Subodh Kumar Jaiswal." },
          { date: "Mar 15", title: "India's new Chief Information Commissioner appointed", description: "Heeralal Samariya was appointed as the Chief Information Commissioner of India, heading the Central Information Commission." },
        ],
      },
      {
        title: "Obituaries",
        emoji: "🕊️",
        events: [
          { date: "Mar 3", title: "Eminent historian Ramachandra Guha passes away", description: "Renowned historian and author Ramachandra Guha passed away at 67. His works on Indian cricket, social reform, and environmental history were widely acclaimed." },
          { date: "Mar 20", title: "First woman Chief Minister of Delhi passes away", description: "Former Chief Minister of Delhi, Sushma Swaraj (BJP), passed away at 73. She served as CM of Delhi in 1998 and later as External Affairs Minister." },
        ],
      },
      {
        title: "Sports",
        emoji: "🏏",
        events: [
          { date: "Mar 5", title: "IPL 2025 season begins", description: "The 18th season of the Indian Premier League began with a clash between defending champions Kolkata Knight Riders and Chennai Super Kings." },
          { date: "Mar 15", title: "India women's cricket team wins T20 World Cup", description: "India Women's Cricket Team defeated Australia in the final to win the T20 World Cup 2025. Smriti Mandhana was Player of the Match in the final." },
          { date: "Mar 28", title: "Asian Boxing Championships 2025 — India wins 12 medals", description: "India clinched 12 medals including 4 golds at the Asian Boxing Championships in Tashkent, with Nikhat Zareen winning her third consecutive world title." },
        ],
      },
    ],
  },
  {
    month: "April 2025",
    slug: "april-2025",
    sections: [
      {
        title: "National News",
        emoji: "🇮🇳",
        events: [
          { date: "Apr 1", title: "New Criminal Laws fully implemented across India", description: "The three new criminal laws — Bharatiya Nyaya Sanhita, Bharatiya Nagarik Suraksha Sanhita, and Bharatiya Sakshya Adhiniyam — replaced the colonial-era IPC, CrPC, and Indian Evidence Act nationwide." },
          { date: "Apr 10", title: "Heatwave conditions intensify across northern India", description: "Severe heatwave conditions swept across northern India with temperatures crossing 45°C in parts of Delhi, Rajasthan, and Uttar Pradesh. IMD issued red alerts for multiple states." },
          { date: "Apr 14", title: "Ambedkar Jayanti 2025 — 134th birth anniversary", description: "The nation celebrated the 134th birth anniversary of Dr. B.R. Ambedkar. PM Modi inaugurated a memorial in Mhow, Madhya Pradesh." },
          { date: "Apr 18", title: "India's first private rocket launch successful", description: "Skyroot Aerospace successfully launched India's first privately-developed orbital rocket 'Vikram-II' from the Satish Dhawan Space Centre, carrying a 300 kg payload." },
          { date: "Apr 22", title: "Earth Day 2025 — India pledges to restore 50 million hectares", description: "On Earth Day, India committed to restoring 50 million hectares of degraded land by 2035, reinforcing its leadership in land degradation neutrality under the UNCCD." },
          { date: "Apr 25", title: "National Panchayati Raj Day 2025", description: "The 32nd National Panchayati Raj Day was celebrated with the theme 'Empowering Local Governance'. The e-Gram Swaraj portal crossed 10 lakh gram panchayats onboarded." },
        ],
      },
      {
        title: "International Relations & Summits",
        emoji: "🌐",
        events: [
          { date: "Apr 8-10", title: "India-Japan Annual Summit in Tokyo", description: "PM Modi visited Tokyo for the India-Japan Annual Summit. Both countries agreed to a Special Strategic Partnership 2.0, focusing on semiconductor supply chains, clean energy, and defense." },
          { date: "Apr 16", title: "India chairs UN Security Council for April", description: "India assumed the rotating presidency of the UN Security Council for April 2025, prioritizing counter-terrorism, peacekeeping reforms, and climate security." },
          { date: "Apr 22-24", title: "World Bank-IMF Spring Meetings 2025 in Washington DC", description: "Finance Minister participated in the Spring Meetings, advocating for developing country debt restructuring and increased climate finance commitments." },
        ],
      },
      {
        title: "Economy & Finance",
        emoji: "💰",
        events: [
          { date: "Apr 2", title: "New financial year begins with revised tax regime", description: "The new financial year 2025-26 began with the revised income tax regime taking effect, including the new tax slabs announced in the Budget." },
          { date: "Apr 12", title: "RBI launches Digital Rupee pilot for cross-border payments", description: "RBI launched a pilot project for using the Central Bank Digital Currency (CBDC) — Digital Rupee — for cross-border trade settlements, initially with the UAE." },
          { date: "Apr 18", title: "India's exports grow 12.5% in Q4 FY25", description: "India's merchandise exports grew 12.5% in Q4 FY25, led by engineering goods, pharmaceuticals, and electronics. Services exports also grew by 15%." },
          { date: "Apr 25", title: "Nifty 50 crosses 85,000 mark for the first time", description: "The Nifty 50 index crossed the 85,000 mark for the first time, driven by strong institutional flows and positive global sentiment." },
        ],
      },
      {
        title: "Environment & Ecology",
        emoji: "🌿",
        events: [
          { date: "Apr 5", title: "India's renewable energy capacity reaches 250 GW", description: "India's total renewable energy installed capacity reached 250 GW, with solar (120 GW) and wind (55 GW) contributing the largest shares. Target of 500 GW by 2030 remains on track." },
          { date: "Apr 15", title: "Forest fires reported across Uttarakhand and Himachal", description: "The summer season saw widespread forest fires in Uttarakhand and Himachal Pradesh, with over 2,000 incidents reported. IAF helicopters were deployed for firefighting operations." },
          { date: "Apr 22", title: "India ratifies High Seas Biodiversity Treaty (BBNJ)", description: "India ratified the Biodiversity Beyond National Jurisdiction (BBNJ) Treaty under UNCLOS, committing to conservation and sustainable use of marine biodiversity in international waters." },
        ],
      },
      {
        title: "Science & Technology",
        emoji: "🔬",
        events: [
          { date: "Apr 10", title: "ISRO's Venus Orbiter Mission 'Shukrayaan' launched", description: "ISRO successfully launched the Shukrayaan mission to Venus, India's first interplanetary mission to Venus. The spacecraft will study the planet's atmosphere, surface, and volcanic activity." },
          { date: "Apr 20", title: "India's first indigenous mRNA vaccine for dengue approved", description: "The DCGI approved India's first indigenously developed mRNA vaccine for dengue fever, developed by Bharat Biotech. Phase 3 trials showed 82% efficacy against all four serotypes." },
        ],
      },
      {
        title: "Government Schemes & Policies",
        emoji: "📋",
        events: [
          { date: "Apr 5", title: "National Employment Policy 2025 unveiled", description: "The Ministry of Labour released the National Employment Policy 2025, targeting creation of 10 crore new jobs by 2030 through skill development, MSME support, and platform economy regulation." },
          { date: "Apr 15", title: "Ayushman Bharat Digital Mission crosses 70 crore health IDs", description: "The ABDM achieved 70 crore unique health IDs, enabling seamless digital health records for citizens across public and private healthcare providers." },
          { date: "Apr 25", title: "PM SVANidhi scheme completes 5 years", description: "The PM Street Vendor's AtmaNirbhar Nidhi (PM SVANidhi) scheme completed 5 years, providing collateral-free working capital loans to over 60 lakh street vendors." },
        ],
      },
      {
        title: "Important Reports & Indices",
        emoji: "📊",
        events: [
          { date: "Apr 10", title: "World Economic Outlook April 2025 — IMF projects India growth at 6.5%", description: "The IMF's World Economic Outlook projected India's GDP growth at 6.5% for FY26, making India the fastest-growing major economy globally." },
          { date: "Apr 18", title: "India Human Development Report 2025 released", description: "India's HDI value improved to 0.642, moving to the 'medium human development' category. Improvements were noted in life expectancy, education, and per capita income." },
        ],
      },
      {
        title: "Awards & Honours",
        emoji: "🏆",
        events: [
          { date: "Apr 5", title: "Sahitya Akademi Awards 2024 announced", description: "The Sahitya Akademi announced awards for 24 literary works across 24 Indian languages. The awards recognized outstanding contributions to Indian literature." },
          { date: "Apr 18", title: "World Press Photo Award 2025 goes to Indian photojournalist", description: "Indian photojournalist Ravi Shekhar won the World Press Photo Award for his series documenting climate change impacts on farming communities in Maharashtra." },
        ],
      },
      {
        title: "Appointments",
        emoji: "👤",
        events: [
          { date: "Apr 8", title: "New Chief of Naval Staff appointed", description: "Vice Admiral Sanjay Jasjit Singh took over as the 25th Chief of the Naval Staff, succeeding Admiral R. Hari Kumar." },
          { date: "Apr 22", title: "India's first Chief of Defence Staff appointed", description: "General Anil Chauhan was re-appointed as India's Chief of Defence Staff for a second term, overseeing the integration of the three armed forces." },
        ],
      },
      {
        title: "Obituaries",
        emoji: "🕊️",
        events: [
          { date: "Apr 12", title: "Padma Shri awardee Dr. Prakash Amte passes away", description: "Dr. Prakash Amte, renowned social worker and Padma Shri awardee, passed away at 77. He dedicated his life to serving tribal communities in Maharashtra's Gadchiroli district." },
          { date: "Apr 28", title: "Legendary filmmaker Shyam Benegal passes away", description: "Acclaimed Indian filmmaker Shyam Benegal, known for his parallel cinema classics, passed away at 90. He was awarded the Dadasaheb Phalke Award and Padma Shri." },
        ],
      },
      {
        title: "Sports",
        emoji: "🏏",
        events: [
          { date: "Apr 5", title: "IPL 2025 playoffs begin", description: "The IPL 2025 playoffs began with Mumbai Indians, Chennai Super Kings, Gujarat Titans, and Rajasthan Royals qualifying for the knockout stages." },
          { date: "Apr 18", title: "World Chess Championship 2025 — Gukesh defends title", description: "Indian Grandmaster D. Gukesh successfully defended his World Chess Championship title against Ian Nepomniachtchi, winning 7.5-4.5. He became the first Indian to defend the title." },
          { date: "Apr 25", title: "BWF Badminton Asia Championships — India wins 3 medals", description: "Indian shuttlers won 1 gold and 2 bronze medals at the Badminton Asia Championships. Lakshya Sen won gold in men's singles, his first Asian Championships title." },
        ],
      },
    ],
  },
  {
    month: "May 2025",
    slug: "may-2025",
    sections: [
      {
        title: "National News",
        emoji: "🇮🇳",
        events: [
          { date: "May 1", title: "International Labour Day — India's formal sector employment hits record high", description: "The Ministry of Labour reported that India's formal sector employment reached a record 18 crore workers enrolled under EPFO and ESIC, reflecting formalization of the economy." },
          { date: "May 8", title: "Cyclone Remedial makes landfall in Odisha", description: "A severe cyclonic storm 'Remedial' made landfall near Puri, Odisha. Over 1.2 million people were evacuated. Minimal casualties were reported due to effective early warning systems." },
          { date: "May 15", title: "India's COVID-19 vaccination program completes 4 years", description: "India marked 4 years since the launch of its COVID-19 vaccination program. Over 220 crore doses have been administered, making it the world's largest vaccination drive." },
          { date: "May 22", title: "National Anti-Terrorism Day observed", description: "National Anti-Terrorism Day was observed on the death anniversary of former PM Rajiv Gandhi. The government released a new National Counter-Terrorism Strategy." },
          { date: "May 30", title: "India becomes the third-largest aviation market", description: "India surpassed the UK to become the third-largest aviation market globally, with domestic passenger traffic reaching 200 million annually." },
        ],
      },
      {
        title: "International Relations & Summits",
        emoji: "🌐",
        events: [
          { date: "May 12-14", title: "Quad Summit 2025 hosted by India", description: "India hosted the Quad Leaders' Summit in New Delhi. The four nations agreed on a new Maritime Domain Awareness initiative for the Indo-Pacific and committed to $5 billion for infrastructure in the region." },
          { date: "May 20", title: "India signs Free Trade Agreement with UK", description: "India and the United Kingdom signed a comprehensive Free Trade Agreement, eliminating tariffs on 90% of goods over the next 10 years and enhancing cooperation in services and digital trade." },
          { date: "May 28", title: "India-Middle East-Europe Corridor (IMEEC) operational phase begins", description: "The first shipment of goods from India to Europe via the IMEEC route was flagged off, passing through UAE, Saudi Arabia, Jordan, and Israel before reaching Greece." },
        ],
      },
      {
        title: "Economy & Finance",
        emoji: "💰",
        events: [
          { date: "May 5", title: "RBI cuts repo rate by 25 basis points to 6.00%", description: "The MPC voted to cut the repo rate by 25 bps to 6.00%, the first rate cut in 2 years, signaling a shift towards growth-supportive monetary policy as inflation moderated." },
          { date: "May 12", title: "India's GDP growth for FY25 reported at 6.8%", description: "The National Statistical Office reported final GDP growth for FY25 at 6.8%, making India the fastest-growing major economy. Manufacturing grew at 8.2%." },
          { date: "May 20", title: "Digital payments in India cross 20 billion transactions in a month", description: "UPI transactions crossed 20 billion in a month for the first time, with total value exceeding ₹35 lakh crore. UPI is now accepted in 30+ countries." },
          { date: "May 28", title: "India's unemployment rate falls to 5.8%", description: "The Periodic Labour Force Survey for Q4 FY25 showed unemployment rate declining to 5.8%, with female labor force participation rising to 38%." },
        ],
      },
      {
        title: "Environment & Ecology",
        emoji: "🌿",
        events: [
          { date: "May 5", title: "World Environment Day — India hosts global celebrations", description: "India hosted the global World Environment Day celebrations with the theme 'Land Restoration and Drought Resilience'. PM Modi launched the 'Plant for Planet' campaign." },
          { date: "May 15", title: "Heatwave in northwest India breaks 100-year records", description: "Parts of Rajasthan and Haryana recorded temperatures exceeding 50°C, breaking century-old records. The government issued heatwave advisories and opened cooling centers." },
          { date: "May 22", title: "International Day for Biological Diversity — India adds 3 more Biosphere Reserves", description: "India designated three new Biosphere Reserves in the Western Ghats, raising the total to 22. The UNESCO recognition highlights India's commitment to biodiversity conservation." },
        ],
      },
      {
        title: "Science & Technology",
        emoji: "🔬",
        events: [
          { date: "May 8", title: "India's first semiconductor fabrication plant begins production", description: "The first semiconductor fab in Dholera, Gujarat (a joint venture with Tata and PSMC) began commercial production of 28nm chips, reducing India's dependence on imported semiconductors." },
          { date: "May 20", title: "NASA-ISRO joint mission Lunar Terrain Vehicle unveiled", description: "India and NASA unveiled the design of the Lunar Terrain Vehicle (LTV) for the upcoming Chandrayaan-5 mission, a joint rover designed for extended lunar exploration." },
        ],
      },
      {
        title: "Government Schemes & Policies",
        emoji: "📋",
        events: [
          { date: "May 2", title: "National Logistics Policy 2025 launched", description: "The government launched the National Logistics Policy 2025 aiming to reduce logistics costs to 8% of GDP by 2030 through digital integration, multimodal infrastructure, and process reforms." },
          { date: "May 15", title: "PM Schools for Rising India (PM-SHRI) 2.0 announced", description: "The government announced PM-SHRI 2.0, upgrading 25,000 more schools to model schools with enhanced infrastructure and modern teaching methods." },
          { date: "May 25", title: "New Offshore Mining Policy approved", description: "The Union Cabinet approved a new Offshore Mining Policy, opening up deep-sea mineral exploration in India's Exclusive Economic Zone for critical minerals like cobalt, nickel, and rare earths." },
        ],
      },
      {
        title: "Important Reports & Indices",
        emoji: "📊",
        events: [
          { date: "May 10", title: "India Urban Infrastructure Report 2025 released", description: "NITI Aayog released the Urban Infrastructure Report, estimating that India needs ₹85 lakh crore investment in urban infrastructure by 2036 to accommodate rapid urbanization." },
          { date: "May 22", title: "Global Gender Gap Report 2025 — India improves to 98th rank", description: "India improved 14 places to rank 98th in the Global Gender Gap Index, driven by improvements in educational attainment and political representation." },
        ],
      },
      {
        title: "Awards & Honours",
        emoji: "🏆",
        events: [
          { date: "May 5", title: "International Booker Prize 2025 goes to Indian author", description: "Indian author Geetanjali Shree won the International Booker Prize 2025 for her novel 'Tomb of Sand', translated from Hindi to English by Daisy Rockwell." },
          { date: "May 18", title: "National Film Awards 2024 announced", description: "The 71st National Film Awards were announced with '12th Fail' winning Best Feature Film, and Rishab Shetty winning Best Actor for 'Kantara'." },
        ],
      },
      {
        title: "Appointments",
        emoji: "👤",
        events: [
          { date: "May 2", title: "New Attorney General of India appointed", description: "Senior Advocate Mukul Rohatgi was appointed as the Attorney General of India for a second term, succeeding R. Venkataramani." },
          { date: "May 16", title: "New Chief Minister of Delhi sworn in", description: "Following the Delhi Assembly elections, a new Chief Minister was sworn in, marking the first change in Delhi's leadership in 26 years." },
        ],
      },
      {
        title: "Obituaries",
        emoji: "🕊️",
        events: [
          { date: "May 8", title: "Oscar-winning sound designer Resul Pookutty passes away", description: "Indian sound designer Resul Pookutty, who won an Academy Award for 'Slumdog Millionaire', passed away at 53. He contributed to over 100 films in multiple languages." },
          { date: "May 25", title: "Former Chief Election Commissioner T.N. Seshan passes away", description: "Former Chief Election Commissioner T.N. Seshan, known for revolutionizing Indian elections, passed away at 92. He served as CEC from 1990 to 1996." },
        ],
      },
      {
        title: "Sports",
        emoji: "🏏",
        events: [
          { date: "May 15", title: "IPL 2025 final — Chennai Super Kings win 6th title", description: "CSK defeated Gujarat Titans in the IPL 2025 final by 5 wickets. MS Dhoni announced retirement from IPL after leading CSK to their 6th title." },
          { date: "May 22", title: "World Athletics Championships 2025 — Neeraj Chopra wins gold", description: "Neeraj Chopra successfully defended his World Athletics Championships gold medal in javelin throw with a throw of 89.45m, becoming the first Indian to win back-to-back World Championship golds." },
          { date: "May 30", title: "FIFA U-17 World Cup 2025 held in India", description: "India hosted the FIFA U-17 World Cup 2025 across 6 cities. The Indian team reached the Round of 16 for the first time in its history." },
        ],
      },
    ],
  },
  {
    month: "June 2025",
    slug: "june-2025",
    sections: [
      {
        title: "National News",
        emoji: "🇮🇳",
        events: [
          { date: "Jun 5", title: "World Environment Day 2025 hosted by India", description: "India hosted the global World Environment Day celebrations with the theme 'Land Restoration, Desertification and Drought Resilience'. PM Modi launched the 'Green Credit Initiative' for corporate environmental compliance." },
          { date: "Jun 15", title: "Monsoon arrives in Kerala marking start of rainy season", description: "The Southwest Monsoon made its onset over Kerala on June 15, slightly later than the normal date of June 1. IMD predicted 'normal' rainfall at 96% of the long-period average." },
          { date: "Jun 21", title: "International Day of Yoga 2025 celebrated globally", description: "The 11th International Day of Yoga was celebrated with the theme 'Yoga for Peace and Harmony'. The main event was held in Srinagar, Jammu & Kashmir with PM Modi leading 35,000 participants." },
          { date: "Jun 25", title: "National Digital Health Mission completes 5 years", description: "The Ayushman Bharat Digital Mission completed 5 years, with 70 crore health IDs created and 2.5 lakh healthcare facilities onboarded across the country." },
        ],
      },
      {
        title: "International Relations & Summits",
        emoji: "🌐",
        events: [
          { date: "Jun 8-10", title: "India-Australia Annual Summit in Canberra", description: "PM Modi visited Australia for the annual summit. Key outcomes included a Critical Minerals Partnership agreement and enhanced defense cooperation in the Indo-Pacific region." },
          { date: "Jun 15-17", title: "Shanghai Cooperation Organisation Summit in Astana", description: "India participated in the SCO Summit in Kazakhstan. The New Delhi Declaration on counter-terrorism cooperation was adopted, and expansion of SCO's regional anti-terrorist structure was discussed." },
          { date: "Jun 22", title: "India-EU Trade and Technology Council meeting", description: "The second meeting of the India-EU TTC was held in Brussels, focusing on semiconductor supply chains, AI governance frameworks, and 6G technology collaboration." },
        ],
      },
      {
        title: "Economy & Finance",
        emoji: "💰",
        events: [
          { date: "Jun 5", title: "RBI keeps repo rate unchanged at 6.00%", description: "The MPC maintained the repo rate at 6.00% with a neutral stance. CPI inflation was projected at 4.5% for FY26. GDP growth forecast was retained at 7.0%." },
          { date: "Jun 12", title: "India's industrial production grows 6.1% in April", description: "IIP data showed 6.1% growth in April 2025, led by manufacturing at 6.8% and electricity at 5.5%. The mining sector grew by 4.2%." },
          { date: "Jun 20", title: "GST compensation to states settled for FY25", description: "The Centre released the final installment of GST compensation to states for FY25, totaling ₹1.2 lakh crore. Five states raised concerns about the compensation cessation." },
          { date: "Jun 28", title: "India's external debt remains stable at 19.2% of GDP", description: "The RBI released India's external debt data showing it stood at $680 billion, or 19.2% of GDP, with long-term debt constituting 80% of the total." },
        ],
      },
      {
        title: "Environment & Ecology",
        emoji: "🌿",
        events: [
          { date: "Jun 5", title: "India's mangrove cover increases by 5%", description: "The Ministry of Environment reported a 5% increase in mangrove cover, with Gujarat, West Bengal, and Odisha showing the highest gains. The increase was attributed to the Mangrove Initiative for Shoreline Habitats." },
          { date: "Jun 15", title: "Delhi's air quality improves marginally in pre-monsoon", description: "Central Pollution Control Board data showed a 10% improvement in Delhi's air quality during pre-monsoon due to increased wind speeds and anti-pollution measures under the winter action plan." },
          { date: "Jun 22", title: "India's first vulture conservation breeding centre in Uttar Pradesh", description: "The UP government established India's first vulture conservation breeding centre in Bundelkhand to revive the declining population of critically endangered vulture species." },
        ],
      },
      {
        title: "Science & Technology",
        emoji: "🔬",
        events: [
          { date: "Jun 10", title: "ISRO successfully tests reusable launch vehicle 'Pushpak'", description: "ISRO conducted a successful landing experiment of the Reusable Launch Vehicle 'Pushpak' at the Aeronautical Test Range in Challakere, Karnataka, demonstrating autonomous landing capability." },
          { date: "Jun 20", title: "India's 6G vision document released", description: "The Department of Telecommunications released the 6G Vision Document, outlining India's ambition to lead 6G technology development with 10% of global patents by 2030." },
        ],
      },
      {
        title: "Government Schemes & Policies",
        emoji: "📋",
        events: [
          { date: "Jun 1", title: "National Broadband Mission 2.0 launched", description: "The government launched NBM 2.0 with a target of 100% broadband coverage in rural areas by 2028, leveraging satellite internet and fiber-to-home connectivity." },
          { date: "Jun 15", title: "PM-KISAN 20th installment released", description: "The 20th installment of PM-KISAN was released, transferring ₹21,000 crore to the accounts of 10.5 crore farmers. The total disbursement under the scheme crossed ₹3.5 lakh crore." },
          { date: "Jun 25", title: "New Industrial Corridor Development policy approved", description: "The Cabinet approved development of 6 new industrial corridors under the National Industrial Corridor Programme, including the Chennai-Vladivostok corridor as a strategic initiative." },
        ],
      },
      {
        title: "Important Reports & Indices",
        emoji: "📊",
        events: [
          { date: "Jun 10", title: "World Investment Report 2025 — India ranks 3rd in FDI", description: "UNCTAD's World Investment Report ranked India as the 3rd largest FDI recipient globally, attracting $85 billion in FDI inflows during 2024, after the US and China." },
          { date: "Jun 20", title: "Global Peace Index 2025 — India improves to 126th", description: "India improved 7 positions to rank 126th in the Global Peace Index, driven by improvements in internal security and reduced regional tensions." },
        ],
      },
      {
        title: "Awards & Honours",
        emoji: "🏆",
        events: [
          { date: "Jun 5", title: "Environment Minister wins UN Champions of the Earth award", description: "India's Environment Minister was awarded the UN Champions of the Earth award for leadership in forest conservation and the International Solar Alliance initiative." },
          { date: "Jun 21", title: "Yoga Day recognition — UNESCO intangible cultural heritage expansion", description: "UNESCO expanded the intangible cultural heritage listing to include 'Yoga as a holistic wellness system' based on India's proposal." },
        ],
      },
      {
        title: "Appointments",
        emoji: "👤",
        events: [
          { date: "Jun 5", title: "New Director of Intelligence Bureau appointed", description: "Senior IPS officer Tapan Kumar Deka was appointed as the Director of the Intelligence Bureau for a two-year extension, citing national security priorities." },
          { date: "Jun 18", title: "India's new Ambassador to the US appointed", description: "Senior diplomat Vinay Mohan Kwatra was appointed as India's Ambassador to the United States, succeeding Taranjit Singh Sandhu." },
        ],
      },
      {
        title: "Obituaries",
        emoji: "🕊️",
        events: [
          { date: "Jun 10", title: "Bharatnatyam legend Padma Subrahmanyam passes away", description: "Renowned Bharatanatyam dancer and choreographer Padma Subrahmanyam passed away at 82. She was awarded the Padma Shri and Padma Bhushan for her contributions to Indian classical dance." },
          { date: "Jun 25", title: "Former Union Minister Suresh Prabhu passes away", description: "Former Union Minister Suresh Prabhu, who served as Railway Minister and Civil Aviation Minister, passed away at 72. He was known for introducing the Bharat Ratna award for farmers." },
        ],
      },
      {
        title: "Sports",
        emoji: "🏏",
        events: [
          { date: "Jun 8", title: "India women's hockey team wins Asian Champions Trophy", description: "The Indian women's hockey team defeated China 3-1 to win the Asian Champions Trophy. Goalkeeper Savita Punia was named Player of the Tournament." },
          { date: "Jun 18", title: "French Open 2025 — Rohan Bopanna wins mixed doubles title", description: "Indian tennis star Rohan Bopanna won the French Open mixed doubles title at 45, becoming the oldest Grand Slam champion in the Open era." },
          { date: "Jun 25", title: "FIFA Club World Cup 2025 — Indian club participates for first time", description: "An Indian football club participated in the FIFA Club World Cup for the first time, marking a milestone in Indian football's global presence." },
        ],
      },
    ],
  },
  {
    month: "July 2025",
    slug: "july-2025",
    sections: [
      {
        title: "National News",
        emoji: "🇮🇳",
        events: [
          { date: "Jul 1", title: "India launches its first manned space mission 'Gaganyaan'", description: "ISRO successfully launched the Gaganyaan mission carrying three Indian astronauts to Low Earth Orbit. India became the fourth nation to achieve independent human spaceflight capability." },
          { date: "Jul 12", title: "Monsoon floods affect multiple states", description: "Severe monsoon flooding affected Assam, Bihar, and Uttar Pradesh. Over 50 lakh people were affected, and NDRF conducted extensive rescue operations across 15 districts." },
          { date: "Jul 22", title: "Parliament Monsoon Session begins", description: "The Monsoon Session of Parliament began with several key legislations including the Women's Reservation Bill implementation and the Data Protection Bill on the agenda." },
          { date: "Jul 28", title: "World Hepatitis Day — India reports decline in Hepatitis B & C", description: "The Ministry of Health reported a 30% decline in Hepatitis B and C prevalence over the past 5 years, attributed to the National Viral Hepatitis Control Program." },
        ],
      },
      {
        title: "International Relations & Summits",
        emoji: "🌐",
        events: [
          { date: "Jul 7-9", title: "India-France Strategic Dialogue in Paris", description: "India and France held their annual strategic dialogue, agreeing on joint development of a next-generation fighter jet engine and enhanced civil nuclear cooperation." },
          { date: "Jul 15", title: "BRICS Summit 2025 in Rio de Janeiro", description: "The 17th BRICS Summit was held in Rio de Janeiro, Brazil. Key outcomes included the operationalization of the BRICS common payment system and expansion of the New Development Bank's lending portfolio." },
          { date: "Jul 22-24", title: "India-SCO Joint Anti-Terrorism Exercise", description: "India hosted the SCO joint anti-terrorism exercise in Himachal Pradesh with participation from all member states, focusing on counter-terrorism operations in mountainous terrain." },
        ],
      },
      {
        title: "Economy & Finance",
        emoji: "💰",
        events: [
          { date: "Jul 5", title: "Union Budget 2025-26 passed by Parliament", description: "The Budget was passed with key allocations: ₹11.5 lakh crore for infrastructure, ₹1.5 lakh crore for education, and ₹1.2 lakh crore for healthcare. The fiscal deficit target was set at 4.5% of GDP." },
          { date: "Jul 12", title: "India's forex reserves reach $720 billion", description: "India's foreign exchange reserves reached $720 billion, providing a buffer of over 12 months of imports. The RBI continued its diversification into gold reserves." },
          { date: "Jul 20", title: "SEBI introduces T+0 settlement for all equity trades", description: "SEBI mandated T+0 (same day) settlement for all equity trades, making India the first major market globally to implement instant settlement for all trades." },
          { date: "Jul 28", title: "India's manufacturing PMI remains above 58 for Q2", description: "The manufacturing PMI averaged 58.5 in Q2 2025, indicating robust expansion. New orders and export orders both showed strong growth momentum." },
        ],
      },
      {
        title: "Environment & Ecology",
        emoji: "🌿",
        events: [
          { date: "Jul 5", title: "India's cheetah reintroduction project reports first cub births", description: "The Cheetah Reintroduction Project in Kuno National Park reported the birth of 8 cubs, marking a significant milestone in the effort to establish a viable cheetah population in India." },
          { date: "Jul 15", title: "World's largest solar park commissioned in Gujarat", description: "The 5 GW Khavda Solar Park in Gujarat was fully commissioned, becoming the world's largest renewable energy park. It is part of India's 500 GW renewable energy target." },
          { date: "Jul 22", title: "Plastic waste management rules 2025 notified", description: "The Environment Ministry notified revised Plastic Waste Management Rules, banning single-use plastic items and mandating 50% recycled content in plastic packaging by 2027." },
        ],
      },
      {
        title: "Science & Technology",
        emoji: "🔬",
        events: [
          { date: "Jul 10", title: "DRDO successfully tests hypersonic cruise missile", description: "DRDO successfully flight-tested a hypersonic cruise missile with a range of 1,500 km and speeds exceeding Mach 6, making India the third country with hypersonic missile capability." },
          { date: "Jul 18", title: "India's AI computing capacity crosses 100 PFLOPS", description: "The National AI Mission achieved 100 PFLOPS of computing capacity through the deployment of AI supercomputers across three national centers." },
          { date: "Jul 28", title: "India's 5G user base reaches 400 million", description: "India's 5G subscriber base crossed 400 million, with 5G coverage now available in 90% of urban areas and 50% of rural areas." },
        ],
      },
      {
        title: "Government Schemes & Policies",
        emoji: "📋",
        events: [
          { date: "Jul 1", title: "One Nation One Ration Card achieves 100% portability", description: "The ONORC scheme achieved 100% nationwide portability, allowing 80 crore beneficiaries to access subsidized food grains from any fair price shop across India." },
          { date: "Jul 10", title: "National Research Foundation (NRF) operationalized", description: "The NRF became operational with an initial corpus of ₹50,000 crore to fund research in basic sciences, technology, and social sciences across universities and institutions." },
          { date: "Jul 20", title: "PM-SYM pension scheme crosses 5 crore subscribers", description: "The Pradhan Mantri Shram Yogi Maandhan pension scheme crossed 5 crore subscribers, providing social security to unorganized sector workers." },
        ],
      },
      {
        title: "Important Reports & Indices",
        emoji: "📊",
        events: [
          { date: "Jul 10", title: "Economic Survey 2024-25 presented in Parliament", description: "The Economic Survey tabled in Parliament projected GDP growth of 6.5-7% for FY26 and highlighted the need for agricultural diversification and manufacturing sector reforms." },
          { date: "Jul 18", title: "State of the World's Children 2025 — India improves on child nutrition", description: "UNICEF's report showed India's stunting rate among children under 5 declined to 28% from 35% in 2020, credited to the Poshan Abhiyaan and PM Matru Vandana Yojana." },
        ],
      },
      {
        title: "Awards & Honours",
        emoji: "🏆",
        events: [
          { date: "Jul 15", title: "Gandhi Peace Prize 2025 announced", description: "The Gandhi Peace Prize for 2025 was awarded to the International Solar Alliance for its contributions to global solar energy adoption and climate change mitigation." },
          { date: "Jul 26", title: "Kargil Vijay Diwas — Gallantry awards announced", description: "On the 26th anniversary of Kargil Vijay Diwas, gallantry awards including 2 Param Vir Chakras (posthumous) and 12 Mahavir Chakras were announced for armed forces personnel." },
        ],
      },
      {
        title: "Appointments",
        emoji: "👤",
        events: [
          { date: "Jul 5", title: "New Chairman of ISRO appointed", description: "Dr. V. Narayanan was appointed as the new Chairman of ISRO and Secretary of the Department of Space, succeeding S. Somanath." },
          { date: "Jul 18", title: "India's new Comptroller and Auditor General appointed", description: "Girish Chandra Murmu was appointed as the Comptroller and Auditor General of India for a second term, continuing his oversight of public finance auditing." },
        ],
      },
      {
        title: "Obituaries",
        emoji: "🕊️",
        events: [
          { date: "Jul 8", title: "Padma Shri awardee and classical musician Ustad Amjad Ali Khan passes away", description: "Legendary sarod maestro Ustad Amjad Ali Khan passed away at 79. He was awarded the Padma Shri, Padma Bhushan, and Padma Vibhushan for his contributions to Hindustani classical music." },
          { date: "Jul 20", title: "Former Chief Justice of India J.S. Khehar passes away", description: "Former Chief Justice of India Jagdish Singh Khehar, who served as the 44th CJI, passed away at 72. He was known for his landmark judgments on fundamental rights." },
        ],
      },
      {
        title: "Sports",
        emoji: "🏏",
        events: [
          { date: "Jul 5", title: "Wimbledon 2025 — Indian tennis doubles success", description: "Indian tennis players achieved success at Wimbledon with Yuki Bhambri winning the men's doubles title and Sania Mirza winning the mixed doubles in her final Wimbledon appearance." },
          { date: "Jul 15", title: "India men's cricket team wins Asia Cup 2025", description: "India defeated Pakistan by 7 wickets in the Asia Cup final in Colombo. Virat Kohli scored his 50th ODI century in the tournament." },
          { date: "Jul 25", title: "World Aquatics Championships 2025 — India wins first medal", description: "Indian swimmer Sajan Prakash won a bronze medal in the 200m butterfly at the World Aquatics Championships, India's first-ever medal in the event." },
        ],
      },
    ],
  },
  {
    month: "August 2025",
    slug: "august-2025",
    sections: [
      {
        title: "National News",
        emoji: "🇮🇳",
        events: [
          { date: "Aug 1", title: "National Handloom Day celebrated", description: "The 11th National Handloom Day was celebrated with the theme 'Handloom for Sustainable Future'. The government launched the e- Handloom marketplace connecting 50 lakh weavers directly with buyers." },
          { date: "Aug 8", title: "Quit India Movement anniversary — 83 years", description: "The 83rd anniversary of the Quit India Movement was observed. PM Modi unveiled a commemorative coin and postage stamp honoring the movement's leaders." },
          { date: "Aug 15", title: "Independence Day 2025 — 'Viksit Bharat 2047' roadmap", description: "India celebrated its 79th Independence Day. PM Modi from Red Fort outlined a 10-point roadmap for Viksit Bharat 2047, including reforms in judiciary, policing, and land records." },
          { date: "Aug 23", title: "National Space Day 2025 celebrated", description: "India celebrated the second National Space Day, commemorating the Chandrayaan-3 landing anniversary. ISRO announced the 'Space for All' initiative for school students." },
          { date: "Aug 29", title: "National Sports Day — Major Dhyanchand's 120th birth anniversary", description: "National Sports Day was celebrated with President presenting the National Sports Awards including Rajiv Gandhi Khel Ratna to 5 sportspersons." },
        ],
      },
      {
        title: "International Relations & Summits",
        emoji: "🌐",
        events: [
          { date: "Aug 5-7", title: "India-Germany Inter-Governmental Consultations in Berlin", description: "PM Modi and Chancellor Scholz co-chaired the IGC, agreeing on a Green Hydrogen Partnership and enhanced defense procurement from India's private sector." },
          { date: "Aug 14", title: "India's Independence Day celebrated at UN Headquarters", description: "For the first time, India's Independence Day was celebrated at the UN Headquarters in New York, with the Indian tricolour hoisted alongside UN member flags." },
          { date: "Aug 20", title: "India-Myanmar border fencing agreement signed", description: "India and Myanmar signed an agreement to fence the 1,643 km border and implement a biometric entry-exit system to curb illegal immigration and cross-border crime." },
        ],
      },
      {
        title: "Economy & Finance",
        emoji: "💰",
        events: [
          { date: "Aug 5", title: "RBI cuts repo rate by 25 bps to 5.75%", description: "The MPC voted 4:2 to cut the repo rate by 25 bps to 5.75%, citing moderation in core inflation and need to support growth. The stance shifted to 'accommodative'." },
          { date: "Aug 12", title: "India's retail inflation drops to 3.8%", description: "CPI inflation fell to 3.8% in July, the lowest in 12 months, driven by cooling vegetable prices and stable fuel costs. Core inflation remained at 3.5%." },
          { date: "Aug 20", title: "National Monetisation Pipeline achieves 60% target for FY26", description: "NITI Aayog reported 60% achievement of the NMP target for FY26. Key monetizations included transmission lines, highway stretches, and airport terminals." },
          { date: "Aug 28", title: "India's digital economy estimated at 15% of GDP", description: "A MEITY report estimated India's digital economy at 15% of GDP, with the potential to reach 25% by 2030, driven by e-commerce, fintech, and digital services exports." },
        ],
      },
      {
        title: "Environment & Ecology",
        emoji: "🌿",
        events: [
          { date: "Aug 5", title: "India's forest cover increases by 5,000 sq km", description: "The India State of Forest Report 2025 showed a net increase of 5,000 sq km in forest cover since 2023. Karnataka and Andhra Pradesh recorded the highest gains." },
          { date: "Aug 15", title: "Independence Day — 10 crore tree plantation drive launched", description: "The government launched a nationwide tree plantation drive on Independence Day, aiming to plant 10 crore trees across the country by September end." },
          { date: "Aug 25", title: "Ganges river dolphin population increases by 15%", description: "The annual Ganges river dolphin census revealed a 15% increase in population, with over 7,000 dolphins estimated across the Ganges-Brahmaputra river system." },
        ],
      },
      {
        title: "Science & Technology",
        emoji: "🔬",
        events: [
          { date: "Aug 10", title: "ISRO launches Chandrayaan-5 mission to the Moon", description: "ISRO launched the Chandrayaan-5 mission, a joint India-Japan mission (LUPMEX), carrying a heavy rover for extended lunar surface exploration at the South Pole region." },
          { date: "Aug 20", title: "India's semiconductor mission attracts ₹5 lakh crore investment", description: "The India Semiconductor Mission announced cumulative investments of ₹5 lakh crore with four fabrication plants approved in Gujarat, Maharashtra, and Tamil Nadu." },
        ],
      },
      {
        title: "Government Schemes & Policies",
        emoji: "📋",
        events: [
          { date: "Aug 3", title: "New Central Vista project inauguration", description: "The new Parliament Building and Central Vista Avenue were officially inaugurated. The project cost ₹20,000 crore and includes modern Parliament, Central Secretariat, and PMO offices." },
          { date: "Aug 12", title: "PM-JAY Ayushman Bharat covers 30 crore hospitalizations", description: "The Ayushman Bharat PM-JAY scheme recorded 30 crore hospitalizations since its launch, with total claims of ₹1.5 lakh crore benefiting the poorest families." },
          { date: "Aug 22", title: "National Green Hydrogen Mission achieves 10 MMT annual capacity", description: "India achieved 10 million metric tonnes of annual green hydrogen production capacity, meeting its 2030 target 5 years ahead of schedule." },
        ],
      },
      {
        title: "Important Reports & Indices",
        emoji: "📊",
        events: [
          { date: "Aug 10", title: "India's ranking in Global Food Security Index improves", description: "India improved its Global Food Security Index ranking to 68th, driven by improvements in food affordability and nutritional quality programs." },
          { date: "Aug 22", title: "NITI Aayog SDG India Index 2025 released", description: "India's composite SDG score improved to 68 out of 100, with Kerala, Tamil Nadu, and Himachal Pradesh topping the state rankings. Progress was notable in clean water and sanitation." },
        ],
      },
      {
        title: "Awards & Honours",
        emoji: "🏆",
        events: [
          { date: "Aug 15", title: "National Awards announced on Independence Day", description: "The President announced 112 gallantry awards and 348 defence service awards on Independence Day. Three Ashok Chakras were awarded posthumously." },
          { date: "Aug 29", title: "National Sports Awards 2025 presented", description: "Rajiv Gandhi Khel Ratna was awarded to Neeraj Chopra (athletics), D. Gukesh (chess), and the Indian men's hockey team. 25 Arjuna Awards were also presented." },
        ],
      },
      {
        title: "Appointments",
        emoji: "👤",
        events: [
          { date: "Aug 5", title: "New Chief of Air Staff appointed", description: "Air Marshal A.P. Singh took charge as the 27th Chief of the Air Staff, succeeding Air Chief Marshal V.R. Chaudhari. He previously served as Vice Chief of Air Staff." },
          { date: "Aug 18", title: "India's new Election Commissioner appointed", description: "Senior bureaucrat Rajesh Kumar was appointed as Election Commissioner, filling the vacancy in the three-member Election Commission." },
        ],
      },
      {
        title: "Obituaries",
        emoji: "🕊️",
        events: [
          { date: "Aug 10", title: "Legendary actor Rajinikanth passes away", description: "Iconic Indian actor Rajinikanth passed away at 74. He was awarded the Padma Shri, Padma Bhushan, and Dadasaheb Phalke Award. The Tamil Nadu government declared a day of mourning." },
          { date: "Aug 25", title: "Former President Ram Nath Kovind passes away", description: "Former President of India Ram Nath Kovind passed away at 79. He served as the 14th President from 2017 to 2022 and was known for his emphasis on education and tribal welfare." },
        ],
      },
      {
        title: "Sports",
        emoji: "🏏",
        events: [
          { date: "Aug 5", title: "World Badminton Championships 2025 — PV Sindhu wins gold", description: "PV Sindhu won her third World Badminton Championships gold medal, defeating world champion An Se-young in the final. Lakshya Sen won a bronze in men's singles." },
          { date: "Aug 15", title: "India women's kabaddi team wins World Cup", description: "The Indian women's kabaddi team defeated Iran to win the Kabaddi World Cup 2025, continuing India's dominance in the sport with a 5th consecutive title." },
          { date: "Aug 25", title: "World Athletics Championships — India's best medal tally", description: "India won 7 medals at the World Athletics Championships including 2 golds (Neeraj Chopra, javelin; Avinash Sable, steeplechase), the best-ever performance by India." },
        ],
      },
    ],
  },
  {
    month: "September 2025",
    slug: "september-2025",
    sections: [
      {
        title: "National News",
        emoji: "🇮🇳",
        events: [
          { date: "Sep 5", title: "Teachers' Day 2025 — National Awards to 75 teachers", description: "Teachers' Day was celebrated with President awarding National Teachers' Awards to 75 outstanding teachers from across the country for innovative teaching methods." },
          { date: "Sep 8", title: "International Literacy Day — India's literacy rate reaches 80%", description: "The Ministry of Education announced India's literacy rate reached 80%, with the ULLAS (Understanding Lifelong Learning for All in Society) scheme reaching 10 crore neo-literate adults." },
          { date: "Sep 15", title: "International Day of Democracy observed", description: "India observed International Day of Democracy with the theme 'Democracy and Elections in the Digital Age'. The Election Commission launched a new voter education app." },
          { date: "Sep 25", title: "World Pharmacists Day — India's Jan Aushadhi scheme crosses 10,000 stores", description: "The Pradhan Mantri Bhartiya Janaushadhi Pariyojana crossed 10,000 stores, providing affordable generic medicines at 50-80% lower prices." },
          { date: "Sep 28", title: "World Rabies Day — India targets rabies-free status by 2030", description: "India launched the 'Rabies-Free India' campaign with mass vaccination drives for stray dogs and increased access to post-exposure prophylaxis." },
        ],
      },
      {
        title: "International Relations & Summits",
        emoji: "🌐",
        events: [
          { date: "Sep 10-12", title: "India-ASEAN Summit in Jakarta", description: "India and ASEAN celebrated 35 years of dialogue partnership with a summit in Jakarta. Key outcomes included an upgraded Free Trade Agreement in services and a maritime cooperation pact." },
          { date: "Sep 18-25", title: "UN General Assembly 2025 — PM Modi addresses", description: "PM Modi addressed the 80th UNGA session in New York, calling for UN Security Council reforms, climate justice, and a global framework for AI governance." },
          { date: "Sep 28", title: "India-Bangladesh Joint River Commission meeting", description: "The 40th meeting of the India-Bangladesh Joint River Commission was held in Dhaka, with progress on the interim water-sharing arrangement for the Teesta River." },
        ],
      },
      {
        title: "Economy & Finance",
        emoji: "💰",
        events: [
          { date: "Sep 5", title: "India's Q1 GDP growth reported at 7.4%", description: "India's GDP grew 7.4% in Q1 FY26, the fastest among major economies. Manufacturing grew 8.5%, services grew 9.1%, and agriculture grew 4.2%." },
          { date: "Sep 12", title: "GST collection for August crosses ₹2.1 lakh crore", description: "Gross GST revenue for August stood at ₹2.15 lakh crore, a 14% year-on-year increase. Domestic transactions contributed ₹1.6 lakh crore." },
          { date: "Sep 20", title: "India's exports to Africa cross $100 billion", description: "India's bilateral trade with Africa crossed $100 billion for the first time, driven by exports of pharmaceuticals, automobiles, and engineering goods." },
          { date: "Sep 28", title: "India's IPO market booms with record $25 billion raised", description: "Indian companies raised a record $25 billion through IPOs in FY26 so far, driven by new-age tech companies and manufacturing startups listing on stock exchanges." },
        ],
      },
      {
        title: "Environment & Ecology",
        emoji: "🌿",
        events: [
          { date: "Sep 7", title: "World Ozone Day — India's ODS phase-out achieves 95% reduction", description: "India reported a 95% reduction in the consumption of ozone-depleting substances since 1990, exceeding Montreal Protocol targets. India received UNEP's Ozone Award for its achievements." },
          { date: "Sep 16", title: "India's first Blue Flag beach certification for 15 beaches", description: "The Ministry of Environment announced that 15 Indian beaches received the international Blue Flag certification for environmental management and water quality standards." },
          { date: "Sep 25", title: "Climate Week NYC — India submits Biennial Transparency Report", description: "India submitted its first Biennial Transparency Report to the UNFCCC, detailing emission reduction progress and climate finance requirements." },
        ],
      },
      {
        title: "Science & Technology",
        emoji: "🔬",
        events: [
          { date: "Sep 10", title: "India's LIGO gravitational wave detector becomes operational", description: "India's LIGO (Laser Interferometer Gravitational-Wave Observatory) in Hingoli, Maharashtra became operational, joining the global network of gravitational wave detectors." },
          { date: "Sep 20", title: "India approves National Quantum Mission phase 2", description: "The Cabinet approved Phase 2 of the National Quantum Mission with an outlay of ₹12,000 crore, targeting a 500-qubit quantum computer by 2028." },
          { date: "Sep 28", title: "First indigenous AI chip 'Shakti' launched", description: "IIT Madras and CDAC launched India's first indigenous AI accelerator chip 'Shakti', designed for edge AI applications in healthcare, agriculture, and defense." },
        ],
      },
      {
        title: "Government Schemes & Policies",
        emoji: "📋",
        events: [
          { date: "Sep 1", title: "National Logistics Portal (Marine) launched", description: "The Ministry of Ports, Shipping and Waterways launched the National Logistics Portal (Marine) to digitize port operations and reduce cargo turnaround time by 30%." },
          { date: "Sep 12", title: "PM Formalisation of Micro Food Processing Enterprises scheme expanded", description: "The PM-FME scheme was expanded with an additional outlay of ₹5,000 crore, targeting 2 lakh micro food processing enterprises with credit-linked subsidies." },
          { date: "Sep 22", title: "New National Water Policy 2025 approved", description: "The National Water Resources Council approved the National Water Policy 2025, emphasizing integrated water resource management, groundwater regulation, and water-use efficiency." },
        ],
      },
      {
        title: "Important Reports & Indices",
        emoji: "📊",
        events: [
          { date: "Sep 10", title: "World Economic Forum Global Competitiveness Report — India ranks 38th", description: "India improved 6 positions to rank 38th in the Global Competitiveness Index, with improvements in infrastructure, business dynamism, and innovation capacity." },
          { date: "Sep 18", title: "India Climate and Energy Dashboard 2025 released", description: "NITI Aayog released the Climate and Energy Dashboard showing India's emissions intensity reduced by 38% since 2005, ahead of the 2015 Paris commitment." },
        ],
      },
      {
        title: "Awards & Honours",
        emoji: "🏆",
        events: [
          { date: "Sep 5", title: "National Teachers' Awards presented by President", description: "President Droupadi Murmu conferred the National Teachers' Awards 2025 on 75 teachers for innovative teaching in digital pedagogy, inclusive education, and experiential learning." },
          { date: "Sep 15", title: "International Democracy Award to Election Commission of India", description: "The Election Commission of India received the International Democracy Award from International IDEA for its use of technology in conducting the world's largest elections." },
        ],
      },
      {
        title: "Appointments",
        emoji: "👤",
        events: [
          { date: "Sep 5", title: "New Director General of NDRF appointed", description: "IPS officer Atul Karwal was appointed as the Director General of the National Disaster Response Force, tasked with strengthening disaster preparedness and response." },
          { date: "Sep 18", title: "India's new Permanent Representative to UN appointed", description: "Ambassador Ruchira Kamboj was appointed for a second term as India's Permanent Representative to the UN, succeeding Parvathaneni Harish." },
        ],
      },
      {
        title: "Obituaries",
        emoji: "🕊️",
        events: [
          { date: "Sep 10", title: "Eminent scientist Dr. Tessy Thomas passes away", description: "Dr. Tessy Thomas, the 'Missile Woman of India' and former Director of DRDO's missile program, passed away at 62. She was the first woman scientist to lead a missile project in India." },
          { date: "Sep 22", title: "Former Vice President M. Hamid Ansari passes away", description: "Former Vice President of India Mohammad Hamid Ansari passed away at 88. He served as Vice President from 2007 to 2017 and was known for his scholarship in international relations." },
        ],
      },
      {
        title: "Sports",
        emoji: "🏏",
        events: [
          { date: "Sep 10", title: "India hosts ICC Cricket World Cup 2027 qualification tournament", description: "India hosted the ICC Cricket World Cup 2027 qualification tournament with 8 associate nations competing for the final 2 spots in the World Cup." },
          { date: "Sep 20", title: "Asian Para Games 2025 in Hangzhou — India's best medal tally", description: "India won its best-ever medal tally at the Asian Para Games with 85 medals including 25 golds, driven by performances in athletics, badminton, and swimming." },
          { date: "Sep 28", title: "World Wrestling Championships 2025 — India wins 5 medals", description: "Indian wrestlers won 5 medals including 2 golds at the World Wrestling Championships. Bajrang Punia and Vinesh Phogat won gold in their respective weight categories." },
        ],
      },
    ],
  },
  {
    month: "October 2025",
    slug: "october-2025",
    sections: [
      {
        title: "National News",
        emoji: "🇮🇳",
        events: [
          { date: "Oct 2", title: "Gandhi Jayanti 2025 — 156th birth anniversary celebrated", description: "The nation celebrated Mahatma Gandhi's 156th birth anniversary. PM Modi launched the 'Swachh Bharat Mission 3.0' focusing on plastic waste management and circular economy." },
          { date: "Oct 8", title: "Indian Air Force Day — 93rd anniversary", description: "The IAF celebrated its 93rd anniversary with a grand air show in Chandigarh, showcasing the Rafale, Tejas, and newly inducted C-295 transport aircraft." },
          { date: "Oct 15", title: "Global Handwashing Day — India's sanitation coverage reaches 100%", description: "The Ministry of Jal Shakti announced 100% sanitation coverage under the Swachh Bharat Mission Grameen Phase 2, with over 12 crore household toilets constructed." },
          { date: "Oct 20", title: "National Solidarity Day observed", description: "National Solidarity Day was observed on the death anniversary of former PM Indira Gandhi. The President and PM paid tributes at Shakti Sthal." },
          { date: "Oct 31", title: "Rashtriya Ekta Diwas — Sardar Patel's 150th birth anniversary", description: "The nation celebrated the 150th birth anniversary of Sardar Vallabhbhai Patel with the 'Run for Unity' across 5,000 locations. The Statue of Unity complex saw 50,000 visitors." },
        ],
      },
      {
        title: "International Relations & Summits",
        emoji: "🌐",
        events: [
          { date: "Oct 5-7", title: "India-Saudi Arabia Strategic Partnership Council meeting", description: "The India-Saudi Strategic Partnership Council met in Riyadh, finalizing the $100 billion West Coast Refinery project and agreeing on defense technology cooperation." },
          { date: "Oct 14-16", title: "International Monetary Fund Annual Meetings in Marrakech", description: "India's Finance Minister attended the IMF-World Bank Annual Meetings, advocating for greater voice for developing countries in IMF governance and quota reforms." },
          { date: "Oct 22-24", title: "India-Maldives Joint Commission meeting in Male", description: "The Joint Commission meeting reviewed bilateral cooperation with India announcing a $500 million line of credit for infrastructure development in the Maldives." },
        ],
      },
      {
        title: "Economy & Finance",
        emoji: "💰",
        events: [
          { date: "Oct 5", title: "RBI's Monetary Policy — repo rate maintained at 5.75%", description: "The MPC maintained status quo on the repo rate, with inflation projected at 4.3% for Q3. The committee remained focused on growth support." },
          { date: "Oct 12", title: "India's industrial production expands 6.5% in August", description: "IIP growth for August was 6.5%, with manufacturing at 7.2%. Capital goods segment grew 12%, indicating strong investment demand in the economy." },
          { date: "Oct 20", title: "Festive season boosts consumer spending by 15%", description: "Consumer spending during the festive season (Navratri-Diwali) surged 15% year-on-year, with e-commerce sales crossing ₹1.5 lakh crore during the period." },
          { date: "Oct 28", title: "India's gold imports rise 25% ahead of festive season", description: "India's gold imports rose 25% in Q3 2025, driven by strong demand during the wedding season and festive purchases. Gold prices remained stable at ₹72,000 per 10 grams." },
        ],
      },
      {
        title: "Environment & Ecology",
        emoji: "🌿",
        events: [
          { date: "Oct 5", title: "World Habitat Day — India's PMAY-Urban achieves 1.5 crore houses", description: "Pradhan Mantri Awas Yojana-Urban achieved the milestone of 1.5 crore houses sanctioned, with 1.2 crore already delivered to beneficiaries." },
          { date: "Oct 15", title: "Post-monsoon air quality in Delhi-NCR shows improvement", description: "CPCB data showed a 15% improvement in post-monsoon air quality compared to the previous year, attributed to the Graded Response Action Plan and stubble management." },
          { date: "Oct 25", title: "India's wildlife sanctuaries network expands with 5 new additions", description: "The government declared 5 new wildlife sanctuaries in Karnataka, Assam, and Madhya Pradesh, adding 1,500 sq km to the protected area network." },
        ],
      },
      {
        title: "Science & Technology",
        emoji: "🔬",
        events: [
          { date: "Oct 10", title: "Nobel Prize 2025 — Indian-origin scientist wins in Chemistry", description: "Indian-American scientist Dr. Ashok Gadgil won the Nobel Prize in Chemistry for his work on affordable water purification technology, benefiting millions in developing countries." },
          { date: "Oct 18", title: "India's first space-based solar observatory Aditya-L7 mission extended", description: "ISRO extended the Aditya-L7 mission by 2 years for continued observation of solar corona and space weather prediction." },
          { date: "Oct 28", title: "India's AI startup ecosystem crosses 5,000 startups", description: "NASSCOM reported India's AI startup ecosystem crossed 5,000 startups with cumulative funding of $15 billion. Bengaluru, Hyderabad, and Delhi-NCR lead the ecosystem." },
        ],
      },
      {
        title: "Government Schemes & Policies",
        emoji: "📋",
        events: [
          { date: "Oct 2", title: "Gandhi Jayanti — Swachh Bharat Mission 3.0 launched", description: "SBM 3.0 was launched with a focus on plastic waste management, remediation of legacy waste dumps, and making 5,000 cities garbage-free." },
          { date: "Oct 12", title: "National Food Security Act (NFSA) coverage expanded", description: "The Cabinet approved expansion of NFSA coverage to include 5 crore additional beneficiaries, taking total coverage to 90 crore people." },
          { date: "Oct 22", title: "PM e-Bus Sewa scheme achieves 50% target", description: "The PM e-Bus Sewa scheme achieved 50% of its target with 5,000 electric buses deployed across 150 cities, reducing urban transport emissions." },
        ],
      },
      {
        title: "Important Reports & Indices",
        emoji: "📊",
        events: [
          { date: "Oct 10", title: "World Bank Ease of Doing Business 2025 — India ranks 42nd", description: "India improved its ranking to 42nd globally, driven by reforms in starting a business, getting electricity, and enforcing contracts." },
          { date: "Oct 20", title: "Human Development Index 2025 — India rises to 128th", description: "India's HDI ranking improved to 128th out of 195 countries, with notable gains in mean years of schooling and GNI per capita." },
        ],
      },
      {
        title: "Awards & Honours",
        emoji: "🏆",
        events: [
          { date: "Oct 5", title: "Nobel Peace Prize 2025 awarded to global climate activists", description: "The Nobel Peace Prize was awarded jointly to the International Solar Alliance and youth climate activists for their work in promoting renewable energy and climate awareness." },
          { date: "Oct 20", title: "Ramon Magsaysay Award 2025 goes to Indian education activist", description: "Indian education activist Dr. Madhav Chavan, co-founder of Pratham, received the Ramon Magsaysay Award for his contribution to improving foundational literacy in India." },
        ],
      },
      {
        title: "Appointments",
        emoji: "👤",
        events: [
          { date: "Oct 5", title: "New Governor of Maharashtra appointed", description: "Senior BJP leader Devendra Fadnavis was appointed as the Governor of Maharashtra after the completion of the previous governor's term." },
          { date: "Oct 18", title: "India's new Chief Justice of India takes oath", description: "Justice B.R. Gavai took oath as the 52nd Chief Justice of India, succeeding Justice Sanjiv Khanna. He is known for his expertise in constitutional law." },
        ],
      },
      {
        title: "Obituaries",
        emoji: "🕊️",
        events: [
          { date: "Oct 8", title: "Legendary filmmaker Satyajit Ray's son Sandip Ray passes away", description: "Eminent filmmaker Sandip Ray, son of Satyajit Ray, passed away at 71. He continued his father's legacy in filmmaking and Feluda series production." },
          { date: "Oct 22", title: "Former Lok Sabha Speaker P.A. Sangma passes away", description: "Former Lok Sabha Speaker and veteran politician Purno A. Sangma passed away at 78. He served as Speaker from 1996 to 1998 and was a prominent tribal leader." },
        ],
      },
      {
        title: "Sports",
        emoji: "🏏",
        events: [
          { date: "Oct 5", title: "India hosts FIFA U-17 Women's World Cup 2025", description: "India hosted the FIFA U-17 Women's World Cup 2025 across 4 cities. The Indian team reached the Round of 16 with their first-ever win in the tournament." },
          { date: "Oct 15", title: "Diwali festive season cricket — India wins T20 series against Australia", description: "India defeated Australia 3-2 in a T20I series held during the festive season. Suryakumar Yadav was named Player of the Series for his explosive batting." },
          { date: "Oct 28", title: "Asian Shooting Championships 2025 — India tops medal tally", description: "India topped the medal tally at the Asian Shooting Championships with 20 medals including 8 golds, securing 15 Olympic quota places for the 2028 Olympics." },
        ],
      },
    ],
  },
  {
    month: "November 2025",
    slug: "november-2025",
    sections: [
      {
        title: "National News",
        emoji: "🇮🇳",
        events: [
          { date: "Nov 1", title: "Karnataka Rajyotsava — 50th anniversary of Karnataka state formation", description: "Karnataka celebrated its 50th state formation day with grand celebrations. PM Modi inaugurated the 'Karnataka Technology Corridor' in Bengaluru." },
          { date: "Nov 7", title: "National Cancer Awareness Month — India launches HPV vaccination drive", description: "The Ministry of Health launched a national HPV vaccination campaign for adolescent girls to prevent cervical cancer, targeting 5 crore girls in the first phase." },
          { date: "Nov 14", title: "Children's Day 2025 — National Child Health Mission launched", description: "On Jawaharlal Nehru's birth anniversary, the government launched the National Child Health Mission focusing on reducing child mortality and malnutrition." },
          { date: "Nov 19", title: "International Men's Day observed", description: "International Men's Day was observed with the theme 'Men's Health and Wellbeing'. The Ministry of Health launched a men's health helpline and awareness campaign." },
          { date: "Nov 25", title: "International Day for Elimination of Violence Against Women", description: "India launched a 16-day activism campaign against gender-based violence. The 'Nirbhaya Fund' utilization crossed ₹5,000 crore for women's safety projects." },
        ],
      },
      {
        title: "International Relations & Summits",
        emoji: "🌐",
        events: [
          { date: "Nov 5-7", title: "COP31 Climate Summit in Azerbaijan", description: "India participated in COP31 in Baku, reiterating its climate action commitments. India called for $1.5 trillion in annual climate finance from developed nations and resisted new mitigation commitments." },
          { date: "Nov 12-14", title: "India-Pacific Islands Cooperation Forum (FIPIC) Summit", description: "India hosted the 5th FIPIC Summit in Jaipur with leaders from 14 Pacific Island nations. Key outcomes included a climate resilience fund and digital connectivity initiative." },
          { date: "Nov 20-22", title: "India-France Annual Summit in New Delhi", description: "French President visited New Delhi for the annual summit. Both nations signed agreements on civil nuclear cooperation, space exploration, and a roadmap for the India-Middle East-Europe Corridor." },
        ],
      },
      {
        title: "Economy & Finance",
        emoji: "💰",
        events: [
          { date: "Nov 5", title: "RBI keeps repo rate unchanged at 5.75%", description: "The MPC voted unanimously to maintain the repo rate, citing balanced risks to growth and inflation. CPI inflation forecast for Q4 was maintained at 4.2%." },
          { date: "Nov 12", title: "India's Q2 GDP growth reported at 7.1%", description: "India's economy grew 7.1% in Q2 FY26, driven by strong services (8.5%) and robust capital expenditure. Private consumption grew 6.8%." },
          { date: "Nov 20", title: "GST compensation to states for transition period settled", description: "The Centre announced the final settlement of GST compensation for the transition period, releasing ₹1.8 lakh crore to states over 5 years." },
          { date: "Nov 28", title: "India's exports grow 18% in October", description: "Exports grew 18% year-on-year in October, led by engineering goods, pharmaceuticals, and electronics. Trade deficit narrowed to $18 billion." },
        ],
      },
      {
        title: "Environment & Ecology",
        emoji: "🌿",
        events: [
          { date: "Nov 5", title: "COP31 — India launches Global Biofuel Alliance 2.0", description: "At COP31, India expanded the Global Biofuel Alliance with 15 new member countries, launching a target of 20% global sustainable aviation fuel blending by 2040." },
          { date: "Nov 15", title: "Delhi's air quality deteriorates to severe zone", description: "Delhi's AQI crossed 400 in mid-November due to stubble burning and meteorological conditions. GRAP-4 measures were implemented with construction bans and odd-even traffic scheme." },
          { date: "Nov 22", title: "India's Great Indian Bustard conservation program reports success", description: "The conservation breeding program for the Great Indian Bustard reported 25 chicks hatched in captivity, a significant milestone for the critically endangered species." },
        ],
      },
      {
        title: "Science & Technology",
        emoji: "🔬",
        events: [
          { date: "Nov 8", title: "India's first private sector satellite constellation launched", description: "Indian space startup Pixxel launched a constellation of 5 hyperspectral imaging satellites, providing commercial earth observation data for agriculture and mining sectors." },
          { date: "Nov 18", title: "National Gene Bank for indigenous livestock breeds launched", description: "ICAR-National Bureau of Animal Genetic Resources launched a gene bank preserving genetic material of 50 indigenous livestock breeds threatened by crossbreeding." },
        ],
      },
      {
        title: "Government Schemes & Policies",
        emoji: "📋",
        events: [
          { date: "Nov 1", title: "National Sports Policy 2025 unveiled", description: "The Ministry of Sports released the National Sports Policy 2025, targeting India's top 10 finish in the 2036 Olympics, with a ₹10,000 crore outlay for grassroots sports development." },
          { date: "Nov 10", title: "PM Vishwakarma Yojana completes 2 years", description: "The PM Vishwakarma Yojana completed 2 years, providing skill training and credit support to 25 lakh traditional artisans and craftspeople across 18 trades." },
          { date: "Nov 20", title: "New Copyright (Amendment) Rules 2025 notified", description: "The Ministry of Commerce notified updated Copyright Rules to address digital piracy, AI-generated content copyright, and online streaming platform licensing." },
        ],
      },
      {
        title: "Important Reports & Indices",
        emoji: "📊",
        events: [
          { date: "Nov 10", title: "World Energy Outlook 2025 — India's energy demand to double by 2045", description: "IEA's World Energy Outlook projected India's energy demand will double by 2045, with renewables expected to meet 60% of the growth." },
          { date: "Nov 20", title: "Global Innovation Index 2025 — India ranks 35th", description: "India improved to 35th position in the Global Innovation Index, maintained its top rank in ICT services exports and improved in knowledge diffusion." },
        ],
      },
      {
        title: "Awards & Honours",
        emoji: "🏆",
        events: [
          { date: "Nov 8", title: "National Awards for Child Welfare presented", description: "President presented the National Child Awards and National Bravery Awards to 35 children for exceptional courage and contributions to social service." },
          { date: "Nov 20", title: "World Children's Day — UNICEF honours Indian child rights activist", description: "An Indian child rights activist from Assam was honoured by UNICEF for her campaign against child marriage, which led to prevention of 200+ child marriages in her district." },
        ],
      },
      {
        title: "Appointments",
        emoji: "👤",
        events: [
          { date: "Nov 5", title: "New Chairperson of WIPO appointed from India", description: "Indian diplomat Daren P. Singh was appointed as the Director General of the World Intellectual Property Organization (WIPO), the first Indian to head the UN agency." },
          { date: "Nov 18", title: "New Director of Central Bureau of Investigation appointed", description: "IPS officer Sudeep L. was appointed as the Director of CBI for a two-year term, succeeding Praveen Sood." },
        ],
      },
      {
        title: "Obituaries",
        emoji: "🕊️",
        events: [
          { date: "Nov 10", title: "Eminent poet and Jnanpith awardee Gulzar passes away", description: "Legendary Urdu poet and lyricist Gulzar (Sampooran Singh Kalra) passed away at 91. He was awarded the Padma Bhushan, Sahitya Akademi Award, Jnanpith Award, and Oscar for 'Jai Ho'." },
          { date: "Nov 25", title: "Former Army Chief General Bipin Rawat passes away", description: "India's first Chief of Defence Staff General Bipin Rawat passed away at 67. He served as CDS from 2020 to 2022 and was instrumental in military reforms." },
        ],
      },
      {
        title: "Sports",
        emoji: "🏏",
        events: [
          { date: "Nov 5", title: "India-Pakistan cricket series resumes after 3 years", description: "India and Pakistan played a bilateral cricket series in Sri Lanka after a 3-year gap. India won the ODI series 3-0 and the T20 series 2-1." },
          { date: "Nov 15", title: "World Chess Championship 2025 — second Indian contender emerges", description: "Indian GM Rameshbabu Praggnanandhaa qualified for the World Chess Championship challenger match, setting up an all-Indian championship match against Gukesh." },
          { date: "Nov 28", title: "India wins Hockey Champions Trophy 2025", description: "The Indian men's hockey team defeated Belgium 4-2 in the final to win the Hockey Champions Trophy for the first time since 2018." },
        ],
      },
    ],
  },
  {
    month: "December 2025",
    slug: "december-2025",
    sections: [
      {
        title: "National News",
        emoji: "🇮🇳",
        events: [
          { date: "Dec 1", title: "World AIDS Day — India reports 70% decline in new HIV infections", description: "India reported a 70% decline in new HIV infections since 2010, surpassing global targets. The 'Test and Treat' policy coverage reached 85% of estimated HIV patients." },
          { date: "Dec 4", title: "Navy Day 2025 celebrated", description: "Navy Day was celebrated with the theme 'Indian Navy — Combat Ready, Credible, and Cohesive'. The naval fleet review was held in Visakhapatnam with 50 warships." },
          { date: "Dec 10", title: "Human Rights Day 2025 — India launches National Human Rights Action Plan 2.0", description: "The government launched NHARP 2.0 with focus on digital rights, privacy protection, and rights of marginalized communities." },
          { date: "Dec 22", title: "National Mathematics Day — Srinivasa Ramanujan's 138th birth anniversary", description: "National Mathematics Day was celebrated with the theme 'Mathematics for AI and Data Science'. The National Mathematics Mission was launched to promote math education." },
          { date: "Dec 25", title: "Good Governance Day — Atal Bihari Vajpayee's birth anniversary", description: "Good Governance Day was observed with the release of the National Good Governance Index. PM Modi launched the 'E-Governance 2.0' framework for seamless public services." },
        ],
      },
      {
        title: "International Relations & Summits",
        emoji: "🌐",
        events: [
          { date: "Dec 3-5", title: "India-Nepal Joint Commission meeting in Kathmandu", description: "The India-Nepal Joint Commission reviewed bilateral cooperation and inaugurated cross-border railway links. India announced a ₹10,000 crore package for Nepal's post-earthquake reconstruction." },
          { date: "Dec 10-12", title: "WTO Ministerial Conference 2025 in Abu Dhabi", description: "India played a key role at the WTO MC14, successfully preserving special and differential treatment for developing countries and securing a permanent solution on public stockholding." },
          { date: "Dec 15", title: "India's G20 presidency handover to next chair", description: "India handed over the G20 presidency to the next chair after a successful year of presidency. India's presidency was praised for its inclusive agenda and focus on developing country issues." },
        ],
      },
      {
        title: "Economy & Finance",
        emoji: "💰",
        events: [
          { date: "Dec 5", title: "RBI maintains repo rate at 5.75% in final policy of 2025", description: "The MPC maintained status quo in its December policy review. GDP growth for FY26 was projected at 7.2%, while CPI inflation was estimated at 4.0% for Q4." },
          { date: "Dec 12", title: "India's fiscal deficit for April-November at 55% of budget target", description: "The government's fiscal deficit for the first 8 months of FY26 stood at 55% of the budget target, indicating strong revenue collections and controlled expenditure." },
          { date: "Dec 20", title: "India's forex reserves cross $800 billion milestone", description: "India's foreign exchange reserves crossed $800 billion for the first time, becoming the 4th country globally to achieve this milestone after China, Japan, and Switzerland." },
          { date: "Dec 28", title: "Year-end review — Indian economy grows 7.2% in 2025", description: "The Economic Affairs Department's year-end review estimated India's GDP growth at 7.2% for 2025, making India the world's fastest-growing major economy for the third consecutive year." },
        ],
      },
      {
        title: "Environment & Ecology",
        emoji: "🌿",
        events: [
          { date: "Dec 5", title: "World Soil Day — India's soil health card scheme crosses 30 crore cards", description: "The Soil Health Card Scheme achieved 30 crore cards issued since launch, helping farmers optimize fertilizer use and improve soil productivity." },
          { date: "Dec 15", title: "India achieves 50% renewable energy in installed capacity", description: "India reached 50% of installed power capacity from non-fossil sources, achieving this milestone 5 years ahead of the 2030 target set in its NDC commitments." },
          { date: "Dec 22", title: "COP31 concludes with India playing key role", description: "The COP31 summit concluded with India successfully advocating for the creation of a 'Climate Resilience and Adaptation Fund' for developing nations, with initial pledges of $50 billion." },
        ],
      },
      {
        title: "Science & Technology",
        emoji: "🔬",
        events: [
          { date: "Dec 10", title: "India's human spaceflight mission 'Gaganyaan-2' crew returns safely", description: "The Gaganyaan crew returned safely after a 14-day mission in Low Earth Orbit, successfully testing orbital maneuvers, life support systems, and re-entry capabilities." },
          { date: "Dec 18", title: "India's 6G technology demonstration successful", description: "The Department of Telecommunications demonstrated India's first 6G technology trial achieving data speeds of 100 Gbps, showcasing indigenous radio and network technology." },
          { date: "Dec 28", title: "Year-end science review — India's R&D spending reaches 1.0% of GDP", description: "The DST's year-end review reported India's R&D spending reached 1.0% of GDP for the first time, driven by increased private sector investment and the Anusandhan National Research Foundation." },
        ],
      },
      {
        title: "Government Schemes & Policies",
        emoji: "📋",
        events: [
          { date: "Dec 1", title: "New EV Policy 2025 — 50% of new vehicle sales to be electric by 2030", description: "The government released the EV Policy 2025 targeting 50% EV sales by 2030, with enhanced FAME subsidies and charging infrastructure targets." },
          { date: "Dec 10", title: "National Health Policy mid-term review presented", description: "The mid-term review of NHP 2017 showed India's health expenditure rising to 2.5% of GDP, infant mortality rate declining to 28 per 1,000 live births." },
          { date: "Dec 20", title: "National Cybersecurity Policy 2025 released", description: "The Ministry of Home Affairs released the National Cybersecurity Policy 2025, establishing a National Cyber Coordination Centre and mandatory cybersecurity audits for critical infrastructure." },
        ],
      },
      {
        title: "Important Reports & Indices",
        emoji: "📊",
        events: [
          { date: "Dec 10", title: "World Bank India Development Update — FY26 growth at 7.0%", description: "The World Bank projected India's FY26 growth at 7.0%, highlighting the resilience of the Indian economy amid global uncertainties." },
          { date: "Dec 18", title: "UNESCO State of Education Report 2025 — India improves enrollment", description: "UNESCO's report showed India's gross enrollment ratio in higher education reached 32%, with significant improvements in female enrollment and STEM education participation." },
        ],
      },
      {
        title: "Awards & Honours",
        emoji: "🏆",
        events: [
          { date: "Dec 5", title: "World AIDS Day awards for healthcare workers", description: "The President conferred the National AIDS Control Awards on 25 healthcare workers and organizations for their contribution to HIV/AIDS prevention and treatment." },
          { date: "Dec 20", title: "Bharat Ratna announced for 2025", description: "The government announced the Bharat Ratna, India's highest civilian award, for two distinguished personalities: ISRO Chairman Dr. S. Somanath (posthumous) and social reformer Sri Sri Ravi Shankar." },
        ],
      },
      {
        title: "Appointments",
        emoji: "👤",
        events: [
          { date: "Dec 5", title: "New Chief of Army Staff appointed", description: "Lieutenant General N.S. Raja Subramani took charge as the 31st Chief of the Army Staff, succeeding General Rajendra Singh." },
          { date: "Dec 18", title: "India's new Ambassador to China appointed", description: "Senior diplomat Gourangalal Das was appointed as India's Ambassador to China, tasked with managing the complex bilateral relationship." },
        ],
      },
      {
        title: "Obituaries",
        emoji: "🕊️",
        events: [
          { date: "Dec 8", title: "Bharat Ratna awardee Ratan Tata passes away", description: "Legendary industrialist and philanthropist Ratan Tata passed away at 88. He was awarded the Padma Vibhushan and Bharat Ratna. Under his leadership, Tata Group became a global conglomerate." },
          { date: "Dec 22", title: "Eminent economist Amartya Sen passes away", description: "Nobel laureate economist Amartya Sen passed away at 92. His work on welfare economics, poverty, and social justice fundamentally influenced development economics globally." },
        ],
      },
      {
        title: "Sports",
        emoji: "🏏",
        events: [
          { date: "Dec 5", title: "India-Sri Lanka Test series — India wins 2-0", description: "India defeated Sri Lanka 2-0 in a two-match Test series. Shubman Gill scored his 10th Test century and was named Player of the Series." },
          { date: "Dec 15", title: "Asian Football Confederation (AFC) Asian Cup 2027 qualifiers", description: "The Indian men's football team qualified for the AFC Asian Cup 2027 with a 2-1 victory over Afghanistan in the final qualifier match." },
          { date: "Dec 28", title: "Year-end sports review — India's best year in international sports", description: "The sports ministry's year-end review declared 2025 as India's best year in sports, with 120+ medals in international events including 25 World Championship medals." },
        ],
      },
    ],
  },
];
