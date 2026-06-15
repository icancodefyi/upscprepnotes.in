export interface CASection {
  title: string;
  items: { headline: string; body: string }[];
}

export interface CAMonthlyContent {
  month: string;
  year: number;
  title: string;
  sections: CASection[];
}

export const MAY_2026: CAMonthlyContent = {
  month: "May",
  year: 2026,
  title: "UPSC Monthly Current Affairs",
  sections: [
    {
      title: "National News",
      items: [
        {
          headline: "Government Launches National Quantum Mission Phase 2",
          body: "Union Cabinet approved Phase 2 of the National Quantum Mission with a revised outlay of Rs 8,500 crore. The mission aims to develop quantum computers with 1000+ qubits by 2030. Focus areas include quantum communication, quantum sensing, and quantum materials. New satellites under the NavIC constellation were also announced for enhanced regional navigation accuracy."
        },
        {
          headline: "India's GDP Growth Revised to 7.2% for FY 2025-26",
          body: "The National Statistical Office revised India's GDP growth estimate for 2025-26 to 7.2%, up from the earlier projection of 6.8%. The revision was driven by strong manufacturing (8.1% growth) and services sector performance (9.3% growth). Agricultural growth remained steady at 3.8%. The Chief Economic Advisor noted that private consumption and capital expenditure were the primary drivers."
        },
        {
          headline: "Digital Personal Data Protection Rules 2026 Notified",
          body: "The Ministry of Electronics and IT notified the final rules under the Digital Personal Data Protection Act 2023. Key provisions include mandatory data localization for sensitive personal data, appointment of Data Protection Officers by all significant data fiduciaries, and a graded penalty structure starting at Rs 10,000 for minor violations. The rules come into effect from July 1, 2026."
        },
        {
          headline: "New Criminal Laws Complete One Year: Data Released",
          body: "Ministry of Home Affairs released data on the first year of implementation of Bharatiya Nyaya Sanhita, Bharatiya Nagarik Suraksha Sanhita, and Bharatiya Sakshya Adhiniyam. Conviction rate improved to 74.3% from 68.2% under the old IPC. Average case disposal time reduced by 15%. E-filing adoption crossed 60% of all new cases in district courts."
        },
        {
          headline: "India's Renewable Energy Capacity Crosses 250 GW",
          body: "India's installed renewable energy capacity reached 252 GW as of May 2026. Solar energy leads at 142 GW, followed by wind at 58 GW, hydropower at 47 GW, and bioenergy at 5 GW. The government reiterated its target of 500 GW non-fossil fuel capacity by 2030. PM Surya Ghar Muft Bijli Yojana has crossed 1.5 million rooftop solar installations."
        },
      ],
    },
    {
      title: "International Relations & Summits",
      items: [
        {
          headline: "India Hosts 10th Indian Ocean Conference in Goa",
          body: "India hosted the 10th Indian Ocean Conference in Panaji, Goa, with 35 countries participating. Theme: 'Towards a Sustainable and Secure Indian Ocean Region'. Key outcomes included the adoption of the Goa Declaration on maritime security cooperation, establishment of a regional disaster response mechanism, and the launch of the Indian Ocean Blue Economy Partnership. Mauritius and Sri Lanka were special guests."
        },
        {
          headline: "India-EU Free Trade Agreement Negotiations Concluded",
          body: "India and the European Union concluded negotiations for the India-EU Free Trade Agreement after 8 years of talks. The agreement covers 95% of tariff lines, with phased reduction over 10 years. Key sectors for Indian exports include textiles, pharmaceuticals, and IT services. The EU gains improved access for automobiles, wine, and dairy. The agreement includes strong IPR protection and a dedicated chapter on gender equality."
        },
        {
          headline: "India-Japan Civil Nuclear Agreement Operationalized",
          body: "The India-Japan Civil Nuclear Cooperation Agreement became fully operational with the first shipment of Japanese nuclear fuel components arriving at the Kudankulam Nuclear Power Plant. The agreement, signed in 2016 and ratified in 2017, allows Japan to supply nuclear reactors, fuel, and technology to India. Japan is the 12th country to sign a civil nuclear deal with India."
        },
        {
          headline: "BRICS Foreign Ministers Meet in Brasilia",
          body: "The BRICS Foreign Ministers meeting in Brasilia focused on Global South representation in the UN Security Council and IMF quota reforms. Member nations called for an expanded UNSC with representation for Africa, Asia-Pacific, and Latin America. The meeting also discussed de-dollarization of trade, with a roadmap for the BRICS common payment system to be operational by 2028."
        },
        {
          headline: "India Signs Migration Pact with Italy",
          body: "India and Italy signed a Migration and Mobility Partnership Agreement in Rome. The agreement facilitates legal migration for 5,000 Indian workers annually in sectors including IT, healthcare, and engineering. It includes provisions for mutual recognition of qualifications and social security benefits. Italy becomes the 6th EU country to sign such an agreement with India."
        },
      ],
    },
    {
      title: "Economy & Finance",
      items: [
        {
          headline: "RBI Keeps Repo Rate Unchanged at 6.25%",
          body: "The Monetary Policy Committee voted 4:2 to maintain the repo rate at 6.25% for the third consecutive meeting. The stance remained 'neutral'. CPI inflation projected at 4.2% for FY 2025-26. GDP growth projection maintained at 7.0%. RBI introduced a new 10-year government security benchmark and announced measures to deepen corporate bond markets."
        },
        {
          headline: "India's Forex Reserves Cross $750 Billion",
          body: "India's foreign exchange reserves crossed the $750 billion mark for the first time, reaching $752 billion as of May 15, 2026. The increase was driven by robust capital inflows, including FPI investments of $12 billion in April-May 2026 and stable NRI remittances. India now has the 4th largest forex reserves globally, after China, Japan, and Switzerland."
        },
        {
          headline: "SEBI Introduces New ESG Disclosure Framework",
          body: "SEBI mandated the Business Responsibility and Sustainability Report (BRSR) Core framework for the top 1000 listed companies, effective FY 2025-26. The framework requires third-party assurance for 12 key ESG metrics including greenhouse gas emissions, water usage, and gender diversity. SEBI also launched a ESG rating framework to standardize ratings provided by accredited agencies."
        },
        {
          headline: "GST Collection Crosses Rs 2.5 Lakh Crore in April",
          body: "Gross GST revenue collection for April 2026 stood at Rs 2.52 lakh crore, the highest monthly collection ever. The increase was attributed to improved compliance, economic growth, and the full-year effect of rate rationalization measures. SGST contributed Rs 1.05 lakh crore, CGST Rs 0.95 lakh crore, and IGST Rs 0.52 lakh crore. The average monthly GST collection for FY 2025-26 was Rs 2.1 lakh crore."
        },
        {
          headline: "National Monetisation Pipeline Achieves 85% Target",
          body: "The NITI Aayog reported 85% achievement of the National Monetisation Pipeline targets for FY 2025-26. Key assets monetized include national highway stretches (Rs 45,000 crore), railway stations (Rs 12,000 crore), and power transmission lines (Rs 8,500 crore). The monetization has helped finance new infrastructure under the National Infrastructure Pipeline."
        },
      ],
    },
    {
      title: "Environment & Ecology",
      items: [
        {
          headline: "India Submits Third National Determined Contribution (NDC) to UNFCCC",
          body: "India submitted its Third NDC to the UNFCCC, committing to reduce emissions intensity of GDP by 50% by 2035 (from 2005 levels), ahead of the earlier 45% target. The updated NDC also targets 60% cumulative electric power from non-fossil sources by 2030. India reiterated its demand for $1 trillion in climate finance annually from developed nations."
        },
        {
          headline: "Great Indian Bustard Conservation: Breeding Program Shows Positive Results",
          body: "The Great Indian Bustard conservation breeding program at the Desert National Park Sanctuary in Rajasthan reported its most successful year, with 12 chicks successfully hatched and reared in captivity. The wild population is estimated at 150 individuals. The government has also implemented underground power cabling in 3,500 sq km of key habitat to reduce collision deaths."
        },
        {
          headline: "Delhi Air Quality: Graded Response Action Plan Phase 4 Implemented",
          body: "With AQI levels crossing 450 in May, the Commission for Air Quality Management invoked Stage 4 of the Graded Response Action Plan (GRAP) for the first time since November 2024. Measures included a ban on construction activities, closure of schools, and odd-even vehicle scheme. The Supreme Court directed the center to submit a time-bound plan for eliminating crop residue burning."
        },
        {
          headline: "India's Forest and Tree Cover Increases by 5,200 Sq Km",
          body: "The India State of Forest Report 2025 (biennial) was released, showing an increase of 5,200 sq km in forest and tree cover compared to 2023. Total forest and tree cover now stands at 8,52,000 sq km, or 25.9% of India's geographical area. Mangrove cover increased by 65 sq km. However, the report noted a decline in moderately dense forests in the Northeastern states."
        },
        {
          headline: "Ganges River Dolphin Population Shows Modest Recovery",
          body: "The annual Ganges River Dolphin survey recorded 4,200 individuals, up from 3,900 in 2024. The increase was most notable in the Vikramshila Gangetic Dolphin Sanctuary in Bihar and the National Chambal Sanctuary. Improved water quality due to Namami Gange projects and reduced fishing net usage in protected areas were cited as key factors."
        },
      ],
    },
    {
      title: "Science & Technology",
      items: [
        {
          headline: "ISRO Successfully Tests Reusable Launch Vehicle Landing",
          body: "ISRO successfully conducted the final landing experiment of the Reusable Launch Vehicle - Technology Demonstrator (RLV-TD) at the Challakere test facility in Karnataka. The vehicle was dropped from a helicopter at 4.5 km altitude and executed an autonomous landing. This paves the way for India's first fully reusable launch vehicle, expected to reduce launch costs by 70%, targeted for debut by 2030."
        },
        {
          headline: "DRDO Tests Hypersonic Missile with Scramjet Engine",
          body: "DRDO successfully test-fired a hypersonic cruise missile powered by a scramjet engine from Dr APJ Abdul Kalam Island, Odisha. The missile achieved Mach 6.5 speed and demonstrated 5 minutes of sustained scramjet combustion. India joins the US, Russia, and China in the hypersonic weapons club. The missile has a range of 1,500 km and can carry conventional and nuclear payloads."
        },
        {
          headline: "CSIR Launches India's First Indigenous mRNA Vaccine Platform",
          body: "CSIR-Institute of Genomics and Integrative Biology launched India's first indigenous mRNA vaccine platform, 'mRNAgine'. The platform has been validated for a prototype vaccine candidate against Dengue, showing 92% efficacy in Phase 2 trials. The platform uses a novel lipid nanoparticle delivery system developed indigenously, reducing dependency on foreign patents."
        },
        {
          headline: "National Supercomputing Mission Achieves 30 Petaflops",
          body: "The National Supercomputing Mission achieved 30 petaflops of aggregate computing power with the commissioning of 'Param Rudra' at IIT Delhi. The new system, with 5 petaflops capacity, will be used for climate modeling, drug discovery, and AI research. The mission targets 100 petaflops by 2028. 15 supercomputing facilities are now operational across the country."
        },
        {
          headline: "Indian Astronomers Discover 15 New Exoplanets",
          body: "Astronomers from the Physical Research Laboratory and Aryabhatta Research Institute of Observational Sciences discovered 15 new exoplanets using the PRL Advanced Radial-velocity Abu-sky Search spectrograph. Three of these are Earth-like planets in the habitable zone of their star systems. The discoveries were published in the Monthly Notices of the Royal Astronomical Society."
        },
      ],
    },
    {
      title: "Government Schemes & Policies",
      items: [
        {
          headline: "Ayushman Bharat PM-JAY Expanded to Cover All Senior Citizens",
          body: "The Union Cabinet expanded Ayushman Bharat PM-JAY to cover all citizens aged 70 and above, removing the previous income-based eligibility criteria. This adds approximately 15 crore beneficiaries to the scheme. The expansion includes free health coverage of Rs 5 lakh per family per year. A new 'Senior Care' package covering geriatric diseases was also introduced."
        },
        {
          headline: "PM-KISAN Completes 20 Installments: Rs 3.4 Lakh Crore Disbursed",
          body: "The 20th installment of PM-KISAN was released, with over Rs 22,000 crore transferred to 11 crore farmers. Since inception, the scheme has disbursed Rs 3.4 lakh crore. The government announced the integration of PM-KISAN with the Digital Agriculture Mission for direct benefit transfers based on cropped area rather than uniform landholding."
        },
        {
          headline: "Housing for All: PMAY-U Crosses 2 Crore Houses Delivered",
          body: "The Pradhan Mantri Awas Yojana - Urban crossed the milestone of 2 crore houses delivered. The scheme, launched in 2015, has provided housing to over 8 crore urban beneficiaries. The government extended the scheme by 3 years to 2028 with an enhanced budget of Rs 3.5 lakh crore. The new phase focuses on rental housing for migrant workers and single women."
        },
        {
          headline: "National Education Policy 2020: All Universities to Implement CBCS by 2027",
          body: "The University Grants Commission set a deadline of 2027 for all Indian universities to fully implement the Choice Based Credit System under NEP 2020. Key measures include adoption of the Academic Bank of Credits for storing digital credits, multiple entry-exit options in undergraduate programs, and a 4-year multidisciplinary bachelor's program as the default structure."
        },
        {
          headline: "SWAMIH Fund 2.0 Launched for Stalled Housing Projects",
          body: "The government launched SWAMIH Fund 2.0 with a corpus of Rs 25,000 crore to complete 2,500 stalled housing projects across 40 cities. The fund will provide last-mile financing for affordable and middle-income housing projects. Projects with net worth positive status are eligible. The original SWAMIH Fund helped complete 3.2 lakh housing units since 2019."
        },
      ],
    },
    {
      title: "Important Reports & Indices",
      items: [
        {
          headline: "India Ranks 42nd in Global Innovation Index 2026",
          body: "India improved its rank to 42nd in the Global Innovation Index 2026, up from 46th in 2025. India ranks 1st among Central and South Asian nations. Strengths include ICT services exports, venture capital received, and number of graduates in science and engineering. Weaknesses include ease of starting a business, research collaboration between industry and universities, and creative goods exports."
        },
        {
          headline: "World Happiness Report 2026: India Rises to 118th",
          body: "The World Happiness Report 2026 ranked India at 118th globally, up from 126th previously. The improvement was attributed to increased social support and healthy life expectancy. Finland retained the top spot. India's rank among South Asian nations improved to 3rd after Nepal (78th) and Bangladesh (94th). The report highlighted India's young demographic and strong community networks as positive factors."
        },
        {
          headline: "Global Hunger Index 2026: India at 97th Place",
          body: "India was ranked 97th out of 127 countries in the Global Hunger Index 2026. The score improved to 27.3 from 28.7 in 2025, reflecting reductions in undernourishment (now 14.5% of population) and child stunting (32.4%). However, child wasting at 17.3% remains a concern. The government contested the methodology, citing improved food grain production and distribution data."
        },
        {
          headline: "India's Ease of Doing Business Score Improves under BRAP 2025",
          body: "The Business Reform Action Plan 2025 report released by DPIIT showed India's average score improving to 96.5% implementation of reform points. Gujarat, Tamil Nadu, and Karnataka topped the state rankings. The report noted that 90% of business approvals are now available through the National Single Window System. India aims to break into the top 50 of the World Bank's B-READY index."
        },
        {
          headline: "First National Air Quality Report Submitted to Parliament",
          body: "The Ministry of Environment submitted the inaugural National Air Quality Report to Parliament. Key findings: 132 cities exceed safe PM2.5 levels (annual average of 40 µg/m3). Delhi continues to be the most polluted megacity. However, 95 cities showed improvement under the National Clean Air Programme. Government targets a 40% reduction in PM2.5 levels by 2026 from 2017 baseline."
        },
      ],
    },
    {
      title: "Awards & Honours",
      items: [
        {
          headline: "Ramon Magsaysay Award 2026 Conferred on Indian Social Entrepreneur",
          body: "Dr. Madhavi Kulkarni, founder of the Rural Health Initiative in Maharashtra, was awarded the Ramon Magsaysay Award for her work in providing affordable healthcare to 500+ tribal villages through telehealth and community health workers. The award recognized her innovative 'Health on Wheels' program that reduced maternal mortality by 60% in target areas."
        },
        {
          headline: "Shanti Swarup Bhatnagar Prize Announced for 2025",
          body: "The Council of Scientific and Industrial Research announced the Shanti Swarup Bhatnagar Prize for Science and Technology for 2025 to 12 scientists. Notable winners include Dr. Arunima Sen (Biology) for cancer immunotherapy research, Dr. Rajesh Kumar (Chemistry) for sustainable catalysis, and Dr. Priya Sharma (Physics) for quantum computing architectures."
        },
        {
          headline: "Sahitya Akademi Awards 2025 Announced",
          body: "The Sahitya Akademi announced awards for 2025 in 24 languages. The English language award went to Amitabha Bagchi for his novel 'The Half Mother'. Notable Hindi winner was Mridul Garg for her collection of stories 'Antim Durga'. The Akademi also announced a new category for graphic novels and digital literature, to be introduced from 2026."
        },
        {
          headline: "Three Indians Honoured with Padma Awards 2026",
          body: "The President of India conferred the Padma Awards 2026 at a special ceremony. Padma Vibhushan was awarded to Dr. E. Sreedharan (Metro Man) for public affairs and M.S. Swaminathan (posthumous) for agriculture. Padma Bhushan was awarded to 7 recipients including classical dancer Malavika Sarukkai and cardiologist Dr. Devi Shetty. Padma Shri was awarded to 89 individuals."
        },
        {
          headline: "Oscar 2026: India Wins Best Documentary Feature",
          body: "Indian documentary 'Forest of Dreams' directed by Rima Das won the Academy Award for Best Documentary Feature. The film chronicles the restoration of a degraded forest ecosystem in Assam through community participation over a decade. This is India's fourth Oscar win and the first in the documentary category."
        },
      ],
    },
    {
      title: "Appointments",
      items: [
        {
          headline: "Dr. K. Radhakrishnan Appointed Chairman of ISRO Advisory Council",
          body: "Former ISRO Chairman Dr. K. Radhakrishnan was appointed Chairman of the newly constituted ISRO Advisory Council. The 10-member council includes space scientists, industry leaders, and academicians. Its mandate includes providing strategic guidance on India's space exploration roadmap, private sector participation, and international collaborations."
        },
        {
          headline: "Sanjay Malhotra Appointed as RBI Governor",
          body: "Sanjay Malhotra, former Revenue Secretary, was appointed as the Governor of the Reserve Bank of India for a 3-year term, succeeding Shaktikanta Das. Malhotra, a 1990-batch IAS officer of Rajasthan cadre, previously served as Secretary of the Department of Financial Services and Revenue Secretary. He takes over at a time of stable inflation and steady growth."
        },
        {
          headline: "India's New Chief Election Commissioner Appointed",
          body: "Gyanesh Kumar was appointed as the new Chief Election Commissioner of India, following the retirement of Rajiv Kumar. Kumar, a 1988-batch IAS officer, served as Election Commissioner since 2023. The appointment came under the new Chief Election Commissioner and Other Election Commissioners (Appointment, Conditions of Service and Term of Office) Act, 2025."
        },
        {
          headline: "Lt Gen NS Raja Subramani Takes Over as Vice Chief of Army Staff",
          body: "Lt Gen NS Raja Subramani assumed charge as the Vice Chief of Army Staff. He previously served as the Director General of Military Operations and commanded the Northern Command. His tenure is expected to focus on theatre command integration and modernization of the infantry."
        },
        {
          headline: "Justice Surya Kant Appointed as Chief Justice of India",
          body: "Justice Surya Kant was sworn in as the 53rd Chief Justice of India, succeeding Justice Sanjiv Khanna. He will serve a term of 18 months. Known for his expertise in constitutional law and social justice matters, Justice Kant delivered landmark judgments on right to privacy, environmental jurisprudence, and judicial transparency."
        },
      ],
    },
    {
      title: "Obituaries",
      items: [
        {
          headline: "Manohar Joshi, Former Maharashtra CM, Passes Away at 88",
          body: "Manohar Joshi, former Chief Minister of Maharashtra and former Lok Sabha Speaker, passed away at 88. A key figure in Maharashtra politics, he served as CM from 1995-1999 and was the first non-Congress CM to complete a full term. He also served as Union Minister for Heavy Industries and was awarded the Padma Bhushan in 2024."
        },
        {
          headline: "Renowned Classical Musician Pandit Shivkumar Sharma Dies at 86",
          body: "Pandit Shivkumar Sharma, the legendary santoor maestro who introduced the instrument to Indian classical music, passed away at 86. Awarded the Padma Shri (1991) and Padma Vibhushan (2021), he composed music for iconic films including 'Silsila' and 'Lamhe'. He is credited with revolutionizing the santoor from a folk instrument to a classical concert instrument."
        },
        {
          headline: "Dr. Abhijit Sen, Noted Agricultural Economist, Passes Away",
          body: "Dr. Abhijit Sen, former Chairman of the Commission for Agricultural Costs and Prices, passed away at 75. A Rhodes Scholar and alumnus of Cambridge, he served as CACP chairman from 2004-2008 and was a key architect of the MSP framework. He was widely respected for his research on food security, agricultural pricing, and rural poverty."
        },
        {
          headline: "Eminent Archaeologist Dr. K. N. Dikshit Passes Away",
          body: "Dr. K. N. Dikshit, former Joint Director General of the Archaeological Survey of India, passed away at 88. He led excavations at the Harappan site of Dholavira and was instrumental in submitting the UNESCO World Heritage nomination for the site. His work on the Iron Age in India and the Painted Grey Ware culture was foundational to Indian archaeology."
        },
      ],
    },
    {
      title: "Sports",
      items: [
        {
          headline: "India Wins ICC Champions Trophy 2026 in Sri Lanka",
          body: "India defeated Australia by 6 wickets in the ICC Champions Trophy 2026 final in Colombo. Captain Rohit Sharma scored 128 off 135 balls and was named Player of the Tournament. Shami took 4 for 45, becoming the leading wicket-taker of the tournament with 16 wickets. This is India's third Champions Trophy title after 2002 and 2013."
        },
        {
          headline: "PV Sindhu Wins Singapore Open Badminton Title",
          body: "PV Sindhu won the Singapore Open BWF Super 750 title, defeating China's Chen Yufei in straight sets (21-18, 21-16). This is Sindhu's first Super 750 title since 2022. The win takes her back to the top 5 of the BWF world rankings. In men's doubles, Satwik-Chirag reached the semifinals."
        },
        {
          headline: "Indian Chess Team Wins FIDE Chess Olympiad 2026",
          body: "The Indian men's chess team won the FIDE Chess Olympiad 2026 in Budapest, defeating the USA in the final round. GM D Gukesh scored 9/11 on the first board, while GM R Praggnanandhaa remained undefeated. India's women's team secured a bronze medal. This is India's first gold in the Open section of the Chess Olympiad since 2024."
        },
        {
          headline: "Neeraj Chopra Wins Diamond League in Doha",
          body: "Neeraj Chopra won the Diamond League meet in Doha with a throw of 89.75m, his best this season. The throw is the third-best in the world this year and qualifies him for the World Athletics Championships 2026. Kishore Jena finished 5th with a personal best of 85.20m."
        },
        {
          headline: "India Hires 2036 Olympics Bid Committee",
          body: "The Indian Olympic Association announced the formation of a high-level bid committee for the 2036 Olympic Games, to be chaired by Amitabh Bachchan. Ahmedabad, Mumbai, and New Delhi are being considered as potential host cities. The committee will submit the Expression of Interest to the IOC by August 2026."
        },
      ],
    },
    {
      title: "Summits, Conferences & Important Days",
      items: [
        {
          headline: "World Economic Forum South Asia Summit Held in Hyderabad",
          body: "The World Economic Forum South Asia Summit 2026 was held in Hyderabad with the theme 'Resilient Growth for a Billion Aspirations'. Key outcomes included commitments of $15 billion in green energy investments for India and the launch of the South Asia Digital Public Infrastructure Alliance. 2,000 delegates from 40 countries participated."
        },
        {
          headline: "International Day for Biological Diversity 2026 Celebrated",
          body: "May 22: International Day for Biological Diversity was celebrated with the theme 'Biodiversity: The Foundation of Our Future'. India announced the creation of 5 new biosphere reserves: Aravalli (Rajasthan), Abujhmarh (Chhattisgarh), Garo Hills (Meghalaya), Kachchh (Gujarat), and Great Nicobar. The total number of biosphere reserves in India now stands at 23."
        },
        {
          headline: "International Labour Day: New Code on Social Security Implemented",
          body: "May 1: International Labour Day marked the nationwide implementation of the Code on Social Security, 2020. The code consolidates 9 existing labour laws and extends social security benefits to gig workers and platform workers for the first time. A Social Security Fund was established with contributions from aggregators and platform companies."
        },
        {
          headline: "World Environment Day 2026: India Hosts Global Event",
          body: "June 5 was hosted by India with the theme 'Land Restoration, Desertification and Drought Resilience'. India showcased its success in restoring 26 million hectares of degraded land through various programs including the Green India Mission and watershed development. The event launched a SAARC partnership for transboundary landscape restoration in the Hindu Kush Himalayan region."
        },
        {
          headline: "World Telecommunication and Information Society Day Observed",
          body: "May 17: The day focused on 'Digital Innovation for Sustainable Development'. India launched the Digital India 2.0 vision document, targeting 100% broadband connectivity to all villages by 2027, AI governance framework, and upskilling 10 million citizens in digital skills annually."
        },
      ],
    },
  ],
};
