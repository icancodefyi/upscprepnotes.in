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

export const JUNE_2026: CAMonthlyContent = {
  month: "June",
  year: 2026,
  title: "UPSC Monthly Current Affairs",
  sections: [
    {
      title: "National News",
      items: [
        {
          headline: "G7 Summit 2026: India Champions Global South at Evian Summit",
          body: "PM Modi attended the 52nd G7 Summit in Evian, France (June 16-17) under the theme 'Forging New Partnerships and Rebuilding International Solidarity'. India addressed the global trust deficit, called for reforming the development paradigm beyond donor-recipient models, and amplified Global South voices. Bilateral meetings were held with US President Trump, UK PM Starmer, Canadian PM Carney, UAE President Al Nahyan, and Japanese PM Takaichi. Modi also visited Slovakia (June 15) elevating ties to a Comprehensive Partnership and received Slovakia's highest civilian award, the Order of the White Double Cross."
        },
        {
          headline: "Supreme Court Upholds 28% GST on Online Gaming",
          body: "The Supreme Court delivered landmark rulings upholding the constitutional validity of the 28% GST levy on online gaming companies (retrospective) and affirming state laws banning real-money gaming platforms. A bench of Justices Pardiwala and Mahadevan ruled that betting and gambling are State subjects under Entry 34 of List II of the Seventh Schedule. The total tax demands on gaming companies run into several lakh crore rupees. The ruling came under the Promotion and Regulation of Online Gaming Act, 2025."
        },
        {
          headline: "Government Blocks Telegram Ahead of NEET Re-Test",
          body: "The Ministry of Electronics & IT ordered the blocking of Telegram in India until June 21 at the NTA's request, following organised use of the platform by cheating rackets ahead of the NEET (UG) 2026 re-examination. The app was delisted from Google Play and Apple App Store. The IAF ferried NEET papers via Mi-17 helicopters to 20+ locations. Over 22 lakh candidates sat the re-test with nearly 5 lakh security personnel deployed."
        },
        {
          headline: "Delhi High Court Recognizes Right to be Forgotten",
          body: "The Delhi High Court recognized the Right to be Forgotten under Article 21 of the Constitution and directed global de-indexing of acquittal records. This landmark privacy judgment marks a significant step in India's evolving data protection jurisprudence. The ruling aligns with the Digital Personal Data Protection Act, 2023 framework and the Supreme Court's 2017 right to privacy judgment."
        },
        {
          headline: "India's Defence Production Hits Record ₹1.78 Lakh Crore",
          body: "India's defence production reached a record ₹1.78 lakh crore in FY 2025-26, marking 110% growth over five years. Defence exports crossed ₹25,000 crore. The government attributed the growth to policy reforms including the Defence Acquisition Procedure 2020, positive indigenisation lists, and private sector participation. DRDO successfully tested multiple systems including the Agni-V missile with MIRV technology and new counter-drone systems."
        },
      ],
    },
    {
      title: "International Relations & Summits",
      items: [
        {
          headline: "PM Modi Visits France, Slovakia, Seychelles in Major Diplomatic Push",
          body: "PM Modi undertook a six-day visit to France (June 13-18) for the G7 Summit and VivaTech 2026 in Paris, where he jointly inaugurated 'Bharat Innovates' in Nice with President Macron as part of the India-France Year of Innovation. He then visited Slovakia (June 15) elevating ties to Comprehensive Partnership. Later, PM Modi paid a three-day state visit to Seychelles (June 27-29) where he was conferred Seychelles' highest civilian honour 'Guardian of the Blue Horizon' by President Herminie. India and Seychelles concluded a Rs 1,250 crore line of credit agreement and signed an extradition treaty."
        },
        {
          headline: "India-France Deepen Defence Cooperation",
          body: "India and France agreed to strengthen defence ties focusing on joint development and co-production of critical military technologies including fighter jet engines and advanced naval platforms. French President Macron and PM Modi discussed the Scorpene submarine programme, Rafale aircraft sustainment, and the upcoming Jaitapur EPR nuclear reactor project. France remains India's second-largest defence supplier after Russia. The two nations elevated their relationship to a Special Global Strategic Partnership."
        },
        {
          headline: "India-Seychelles Expand Strategic Partnership",
          body: "India and Seychelles unveiled 19 outcomes spanning defence, digital payments, space, and health cooperation. The agreements included India's Unified Payments Interface (UPI) integration in Seychelles, a new deep space communication network collaboration, and Indian assistance for AI and cybersecurity centres. The visit coincided with the 50th anniversary of diplomatic relations and Seychelles' Golden Jubilee National Day celebrations."
        },
        {
          headline: "BRICS Space Economy Framework Proposed by India",
          body: "India proposed a BRICS Space Economy framework at the BRICS Space Leaders' meeting to deepen space cooperation among member nations. The framework aims to facilitate joint satellite development, shared earth observation data, and collaborative deep space missions. BRICS foreign ministers meeting earlier in May in Brasilia had also discussed de-dollarisation of trade and a common payment system roadmap by 2028."
        },
        {
          headline: "India-Japan Adopt Implementation Rules for Joint Crediting Mechanism",
          body: "India and Japan adopted implementation rules for the Joint Crediting Mechanism (JCM), enabling technology transfer and carbon credit trading between the two nations. The mechanism supports India's efforts to attract Japanese investment in clean energy projects. PM Modi held a bilateral meeting with Japanese PM Sanae Takaichi on the sidelines of the G7 Summit, focusing on the Mumbai-Ahmedabad High Speed Rail project and the India-Japan Industrial Competitiveness Partnership."
        },
      ],
    },
    {
      title: "Economy & Finance",
      items: [
        {
          headline: "RBI Keeps Repo Rate Unchanged at 5.25%, Cuts GDP Forecast to 6.6%",
          body: "The MPC unanimously voted to keep the repo rate unchanged at 5.25% for the eighth consecutive time, retaining a neutral stance. The RBI cut FY27 GDP growth forecast to 6.6% from 6.9%, citing West Asia conflict, elevated crude oil prices, and sub-normal monsoon risks. CPI inflation for FY27 projected at 5.1%, peaking at 5.9% in Q3. RBI Governor Sanjay Malhotra flagged El Niño risks and announced measures to attract foreign capital including expanded FAR for government securities."
        },
        {
          headline: "India's GDP Grew 7.8% in Q4 FY 2025-26, Beating Forecasts",
          body: "India's GDP growth for Q4 (January-March 2026) came in at 7.8%, beating the RBI's 7.0% forecast. Full-year FY 2025-26 GDP growth was revised to 7.2%. The growth was driven by strong manufacturing (8.1%), services (9.3%), and robust private consumption. However, the Q1 FY27 outlook was tempered by the West Asia conflict and rising energy prices, with the Finance Ministry projecting 7.2-7.5% growth."
        },
        {
          headline: "GST Collections Rise 13.9% to Rs 1.95 Lakh Crore in June",
          body: "Gross GST revenue collection for June 2026 stood at Rs 1.95 lakh crore, a 13.9% year-on-year increase. Import tax collections surged 34.6%, while domestic GST saw a 6.5% rise. The government also approved a Rs 19,700-crore carbon capture, utilisation and storage (CCUS) scheme expected to attract investments of about Rs 37,500 crore and create carbon-capture capacity of 7 million tonnes per year."
        },
        {
          headline: "India's Forex Reserves Stay Above $750 Billion",
          body: "India's foreign exchange reserves remained above the $750 billion mark, standing at $751 billion as of June 2026. The RBI announced measures to attract FPI investments including removing STCG, LTCG, and withholding taxes on FII investments in government bonds. The central bank also expanded the Fully Accessible Route (FAR) for government securities and eased FPI investment restrictions."
        },
        {
          headline: "SEBI Revamps FPI Norms, Eases Investment Rules",
          body: "SEBI introduced new norms for Foreign Portfolio Investors including relaxed disclosure requirements for non-controlling beneficial ownership up to 10% under automatic route for investors from land-bordering countries. The Cabinet also eased FDI rules allowing faster clearances within a definitive 60-day timeline for critical sectors. India's money market turnover hit a record as banks ramped up borrowing."
        },
      ],
    },
    {
      title: "Environment & Ecology",
      items: [
        {
          headline: "World Environment Day 2026: India Launches National Biodiversity Conservation Plan",
          body: "India hosted World Environment Day (June 5) with the theme 'Land Restoration, Desertification and Drought Resilience'. MoEFCC unveiled the National Biodiversity Conservation Plan 2026-2030 integrating biodiversity across all sectors. The government also launched a nationwide campaign to eliminate single-use plastics in protected areas and showcased success in restoring 26 million hectares of degraded land under the Green India Mission."
        },
        {
          headline: "State of India's Environment 2026: Seven Planetary Boundaries Breached",
          body: "The CSE-DTE annual report 'State of India's Environment 2026: In Figures' revealed that India experienced extreme weather on 99% of days in 2025. Seven of nine planetary boundaries are now breached, with ocean acidification joining climate change and biosphere integrity in the danger zone. Forest diversion for non-forest use rose to 97,000 hectares between 2020-25. The report ranked Goa first among states on environmental performance."
        },
        {
          headline: "India's Green Hydrogen Mission Shows Substantial Progress",
          body: "The Ministry of New and Renewable Energy reported substantial progress in green hydrogen production. Several pilot projects including a major facility in Gujarat's coastal region commenced operations. The government is finalising incentive schemes for industrial adoption. The National Green Hydrogen Mission targets 5 MMT annual green hydrogen production by 2030, positioning India as a global hub."
        },
        {
          headline: "Supreme Court Reviews Great Indian Bustard Conservation Progress",
          body: "The Supreme Court-appointed committee reviewed installation of underground power lines to prevent GIB collisions with overhead cables. The government allocated additional funds for habitat protection in Rajasthan and Gujarat. The wild GIB population is estimated at 150 individuals. New conservation regulations for e-waste management were also notified, targeting the 3.5 million tonnes of annual e-waste generation."
        },
        {
          headline: "Monsoon Deficit Raises Concerns: 75% of India Reports Deficient Rainfall",
          body: "The India Meteorological Department reported that nearly 75% of the country experienced deficient rainfall in June due to El Niño conditions. The southwest monsoon onset over Kerala was delayed. However, reservoirs, renewable energy expansion (252 GW total renewable capacity), and water conservation measures provided resilience. The government activated contingency plans for 500+ drought-prone districts."
        },
      ],
    },
    {
      title: "Science & Technology",
      items: [
        {
          headline: "ISRO Successfully Tests Advanced Rocket Engine for Gaganyaan",
          body: "ISRO fired up an advanced rocket engine, marking a key milestone for the Gaganyaan human spaceflight mission. The uncrewed Gaganyaan-1 test flight carrying humanoid robot Vyomitra is scheduled for later in 2026. AI is being integrated for mission control and crew health monitoring. DRDO also successfully conducted the Integrated Air Drop Test (IADT-02) validating the parachute deceleration system for the Crew Module."
        },
        {
          headline: "India Tests Agni-V Missile with MIRV Technology",
          body: "DRDO successfully conducted a user-specific trial of the Agni-V intercontinental ballistic missile (range 5,000+ km) off the coast of Odisha on June 28. A separate secretive test on June 10 from Chandipur with 11,442 residents evacuated fuelled speculation of an Agni-6 ICBM test (range 8,000-12,000 km). DRDO Chief confirmed readiness for the Agni-6 programme. The Agni-V test incorporated Multiple Independently Targetable Re-entry Vehicle (MIRV) technology."
        },
        {
          headline: "India's Next-Gen NavIC Satellites Under Development",
          body: "ISRO is actively developing next-generation NavIC satellites with enhanced signal strength and broader coverage. The new satellites will improve India's indigenous navigation system, reducing dependence on foreign systems like GPS. ISRO also announced plans for a new advanced Deep Space Communication Network to support interplanetary missions to Mars and Venus."
        },
        {
          headline: "CSIR Launches Bharat Skill Development Initiative 2.0",
          body: "The Ministry of Skill Development and Entrepreneurship launched 'Bharat Skill Development Initiative 2.0' focusing on AI, robotics, green jobs, and advanced manufacturing. The revamped programme emphasises industry collaboration and digital learning platforms. The PM-Vikas (Viksit Kaushal) initiative was also launched to provide advanced training to rural artisans and traditional craftsmen, targeting 1 million rural workers by 2027."
        },
        {
          headline: "Police Begin Collecting DNA Records Under Criminal Procedure Act",
          body: "Police across several Indian states began collecting DNA records of suspects under the Criminal Procedure (Identification) Act, 2022, replacing the colonial-era Identification of Prisoners Act, 1920. Over one lakh DNA profiles have been stored in a central database operated by the National Crime Records Bureau. The Supreme Court also delivered a landmark judgment clarifying provisions of the Digital Personal Data Protection Act, 2023."
        },
      ],
    },
    {
      title: "Government Schemes & Policies",
      items: [
        {
          headline: "PM-Vikas Skill Development Initiative Launched",
          body: "The Ministry of Skill Development launched 'PM-Vikas' (Viksit Kaushal) on June 25 to provide advanced training to rural artisans and traditional craftsmen. The programme integrates digital literacy with traditional craftsmanship, targeting 1 million rural workers by 2027. It aligns with the Atmanirbhar Bharat vision by promoting local manufacturing and preserving India's cultural heritage through modern skill sets."
        },
        {
          headline: "Namo Drone Didi Scheme Expanded to 50,000 Additional SHGs",
          body: "The government announced expansion of the Namo Drone Didi scheme to include 50,000 additional self-help groups across India. The initiative, which empowers women in agriculture through drone technology, provides training and drone kits for agricultural spraying and monitoring. The expansion is expected to revolutionise precision farming and integrate women into the agricultural supply chain."
        },
        {
          headline: "RBI Overhauls Lead Bank Scheme After Review",
          body: "The Reserve Bank of India revamped the Lead Bank Scheme to boost district-level credit planning and financial inclusion. New guidelines released on June 19 enhance credit flow to priority sectors. A three-tier committee structure was introduced to strengthen coordination between banks and government agencies. Lead Banks will now appoint dedicated managers to oversee implementation across all districts."
        },
        {
          headline: "Bharat Taxi Launched in Gujarat as Cooperative Ride Platform",
          body: "Union Home Minister Amit Shah launched 'Bharat Taxi', a cooperative-based ride-hailing platform in Gujarat, as an alternative to private aggregators. The platform is owned by driver cooperatives and aims to provide fair earnings to drivers while offering competitive pricing to consumers. It aligns with the government's 'Sahkar Se Samriddhi' vision of promoting the cooperative sector."
        },
        {
          headline: "Cabinet Approves Rs 3,630 Crore for Jewar Airport Connectivity",
          body: "The Cabinet Committee on Economic Affairs approved Rs 3,630.77 crore for a 31.42 km greenfield corridor linking Jewar Airport to the Delhi-Mumbai Expressway. The project includes an 11 km elevated highway intersecting with major expressways and the Dedicated Freight Corridor. The Haryana Government will contribute Rs 450 crore toward the elevated section."
        },
      ],
    },
    {
      title: "Important Reports & Indices",
      items: [
        {
          headline: "State of India's Environment 2026 Report Released",
          body: "The Centre for Science and Environment and Down To Earth released 'State of India's Environment 2026: In Figures' on June 4. Key findings: extreme weather on 99% of days in 2025, 97,000 hectares of forestland diverted in five years, seven of nine planetary boundaries breached. Five most populous states (UP, Maharashtra, Bihar, MP, West Bengal) ranked poorly. Goa, Assam, Punjab, Haryana topped state rankings."
        },
        {
          headline: "QS World University Rankings 2027: IIT-Delhi Leads India",
          body: "The QS World University Rankings 2027 placed IIT-Delhi as India's top institution globally at 149th rank. MIT retained the global top spot. India had 45 universities in the rankings, with improved scores in research citations and international faculty ratio. The rankings highlighted India's growing research output but noted gaps in industry-academia collaboration and international student attraction."
        },
        {
          headline: "India Sets Record with Seven Schools in World's Best School Prizes",
          body: "Seven Indian schools were shortlisted for the World's Best School Prizes 2026 (announced June 25), the highest for any country. The shortlisted schools span Delhi, Maharashtra, Karnataka, and Tamil Nadu, recognised for categories including community impact, environmental action, innovation, and overcoming adversity. The awards are organised by T4 Education in partnership with Accenture and American Express."
        },
        {
          headline: "Index of Services Production (ISP) Introduced",
          body: "The government introduced a new Index of Services Production (ISP) to track the performance of India's services sector, mirroring the Index of Industrial Production for manufacturing. The ISP covers 9 major services sectors including trade, hotels, transport, communication, financial services, real estate, and business services. India's services sector grew at 9.3% in FY 2025-26, contributing over 55% to GDP."
        },
        {
          headline: "National Food Security Act Amendment Proposed",
          body: "The government proposed amendments to the National Food Security Act (NFSA) to expand AAY (Antyodaya Anna Yojana) entitlements. The amendments aim to cover additional eligible households and streamline the PDS distribution mechanism using the digitised ration card system. The proposal comes amid debates on nutritional security and the need to align NFSA coverage with the latest population estimates."
        },
      ],
    },
    {
      title: "Awards & Honours",
      items: [
        {
          headline: "Padma Awards 2026 Conferred by President Murmu",
          body: "President Droupadi Murmu conferred the Padma Awards 2026 at the second Civil Investiture Ceremony on June 23. Total 131 awards: 5 Padma Vibhushan (including P. Narayanan for Literature & Education, Justice K.T. Thomas for Social Work), 13 Padma Bhushan (including Vijay Amritraj, Mammootty, Alka Yagnik, Shibu Soren posthumous), and 113 Padma Shri (including Rohit Sharma, R. Madhavan, Shashi Shekhar Vempati)."
        },
        {
          headline: "PM Modi Receives Seychelles' Highest Civilian Honour",
          body: "PM Narendra Modi was conferred the 'Guardian of the Blue Horizon', the highest national honour of Seychelles, by President Patrick Herminie on June 28. The award recognises Modi's leadership in environmental conservation, climate action, sustainable development, and strengthening Indian Ocean Region cooperation. Earlier in June, he also received Slovakia's Order of the White Double Cross, First Class."
        },
        {
          headline: "Jainendra Jain Wins Wolf Prize in Physics",
          body: "Rajasthan-born theoretical physicist Jainendra K. Jain won the 2025 Wolf Prize in Physics, presented by Israeli President Isaac Herzog at a state ceremony. Jain is recognised for his discovery of the composite fermion theory, which revolutionised understanding of the fractional quantum Hall effect. He is currently a professor at Pennsylvania State University."
        },
        {
          headline: "Two Indian Women Win 'Green Oscars' Whitley Awards",
          body: "Two Indian women conservationists won the prestigious Whitley Awards (often called the 'Green Oscars') for environmental conservation in June 2026. The awards, presented by the UK-based Whitley Fund for Nature, recognised their work in community-led conservation and sustainable livelihoods. Each winner received £50,000 in project funding."
        },
        {
          headline: "Sushruta Statue Unveiled at Royal College of Surgeons of Edinburgh",
          body: "A 90-kilogram bronze statue of Maharshi Sushruta, the ancient Indian surgeon and author of the Sushruta Samhita, was unveiled at the Royal College of Surgeons of Edinburgh on June 19. The statue honours Sushruta's foundational contributions to surgery, including plastic surgery and cataract extraction techniques documented over 2,600 years ago."
        },
      ],
    },
    {
      title: "Appointments",
      items: [
        {
          headline: "D.K. Shivakumar Sworn in as 25th Chief Minister of Karnataka",
          body: "Doddalahalli Kempegowda Shivakumar (D.K. Shivakumar) from the Indian National Congress was sworn in as the 25th Chief Minister of Karnataka in June 2026 at Raj Bhavan, Bengaluru. Governor Thawar Chand Gehlot administered the oath of office. He succeeded Siddaramaiah following directions from the Congress high command. Shivakumar, representing the Kanakapura constituency, has been a legislator since 1989."
        },
        {
          headline: "Mette Frederiksen Wins Third Consecutive Term as Denmark PM",
          body: "Mette Frederiksen, leader of the Social Democrats, secured a third consecutive term as Prime Minister of Denmark after forming a new centre-left coalition following the March 2026 parliamentary elections. She becomes one of the longest-serving current European leaders, noted for her welfare state expansion and climate policies."
        },
        {
          headline: "New Chief Election Commissioner Appointed",
          body: "The government appointed a new Chief Election Commissioner following the enactment of the Chief Election Commissioner and Other Election Commissioners (Appointment, Conditions of Service and Term of Office) Act, 2025. The appointment came as the Election Commission prepares for upcoming state assembly elections."
        },
        {
          headline: "Nivedita Shukla Verma Given Additional Charge of Secretary, DoNER",
          body: "Ms. Nivedita Shukla Verma (IAS, UP, 1991) was given additional charge as Secretary of the Ministry of Development of North Eastern Region (DoNER). Several other senior IAS appointments were made in June including new secretaries in MeitY, Ministry of Heavy Industries, and Ministry of Corporate Affairs."
        },
        {
          headline: "Shreyas Iyer Appointed India T20 Captain",
          body: "Shreyas Iyer was appointed as the new captain of the Indian T20 cricket team, marking a new chapter after India's T20 World Cup victory in March 2026. His first assignment was the T20 series against Ireland in June. The BCCI also announced Shubman Gill as vice-captain for the white-ball formats."
        },
      ],
    },
    {
      title: "Obituaries",
      items: [
        {
          headline: "François Englert, Nobel Physicist, Dies at 93",
          body: "François Englert, the Belgian theoretical physicist who won the 2013 Nobel Prize in Physics for the discovery of the Higgs boson mechanism, passed away at 93 in Uccle, Brussels. His work on spontaneous symmetry breaking in particle physics, co-developed with Robert Brout, was foundational to the Standard Model and confirmed by CERN's 2012 discovery of the Higgs particle."
        },
        {
          headline: "David Hockney, Legendary British Artist, Dies at 88",
          body: "David Hockney, one of the most influential British artists of the 20th century, passed away at 88 at his home in London on June 11. Known for his pop art paintings, swimming pool series, and photographic collages, Hockney's work explored perspective, light, and landscape across seven decades. He was awarded the Order of Merit in 2012."
        },
        {
          headline: "Gene Shalit, Iconic American Film Critic, Dies at 100",
          body: "Gene Shalit, the iconic American film critic and television personality known for his distinctive moustache, bow tie, and pun-filled reviews on NBC's Today show, passed away at 100 on June 12. His career spanned over four decades, making him one of the most recognisable faces in entertainment journalism."
        },
        {
          headline: "Ben Stokes Announces International Cricket Retirement",
          body: "Ben Stokes announced his retirement from international cricket, ending his England career after the Trent Bridge Test in June 2026. The all-rounder, who played a pivotal role in England's 2019 World Cup victory and transformed English Test cricket as captain, retires as one of the greatest all-rounders in the game's history."
        },
      ],
    },
    {
      title: "Sports",
      items: [
        {
          headline: "FIFA World Cup 2026 Round of 32 Completed",
          body: "The FIFA World Cup 2026 (hosted by USA, Canada, Mexico) Round of 32 matches were played throughout June, with India not qualifying. Notable results included defending champions Argentina advancing and several upsets. The expanded 48-team tournament featured exciting knockout matches as teams vied for a place in the quarter-finals."
        },
        {
          headline: "Indian Women's Hockey Team Wins FIH Nations Cup 2026",
          body: "The Indian Women's Hockey Team won the FIH Nations Cup 2026, earning promotion to the Pro League. The team defeated the Netherlands in their own backyard in a series of impressive performances. Dilpreet Singh and Jugraj Singh finished as joint-top scorers for the season with four goals each. The London leg featured historic India-Pakistan matches in Pro League history."
        },
        {
          headline: "India Lose T20 Series 2-0 to Ireland in Shreyas Iyer's First Series as Captain",
          body: "India suffered their first T20 series defeat in three years, losing 2-0 to Ireland on June 28. Ireland won the second match by one run at Stormont, Belfast. India debutant Prince Yadav impressed with 3/22. Teenage prodigy Vaibhav Sooryavanshi, who had earlier smashed the fastest List A fifty in history, was not picked for either match. The defeat was India's first bilateral T20 series loss since 2023."
        },
        {
          headline: "Ancy Sojan Breaks 22-Year-Old National Long Jump Record",
          body: "Kerala long jumper Ancy Sojan broke Anju Bobby George's 22-year-old national record in women's long jump, jumping 6.83m at a national meet in June 2026. The 24-year-old's leap qualifies her for the World Athletics Championships 2026 and the 2026 Commonwealth Games."
        },
        {
          headline: "Harmanpreet Kaur Becomes First Cricketer to Play 200 T20Is",
          body: "Harmanpreet Kaur created history by becoming the first cricketer (men's or women's) to play 200 T20 Internationals during India's series in June. Deepti Sharma also became the joint-highest wicket-taker for India in women's T20Is. The women's team continues its preparation for the 2026 Commonwealth Games and 2027 ODI World Cup."
        },
      ],
    },
    {
      title: "Summits, Conferences & Important Days",
      items: [
        {
          headline: "World Environment Day 2026 Hosted by India",
          body: "June 5: India hosted World Environment Day with the theme 'Land Restoration, Desertification and Drought Resilience'. The Ministry of Environment launched the National Biodiversity Conservation Plan 2026-2030 and announced five new potential biosphere reserves. India showcased restoring 26 million hectares of degraded land and launched a SAARC partnership for transboundary landscape restoration in the Hindu Kush Himalayan region."
        },
        {
          headline: "VivaTech 2026: PM Modi Attends Europe's Largest Tech Event",
          body: "PM Modi attended VivaTech 2026 in Paris on June 18, one of Europe's largest gatherings for technology and innovation. The visit was part of the India-France Year of Innovation. Modi inaugurated 'Bharat Innovates' in Nice on June 14, connecting Indian startups with global investors. Indian startups showcased innovations in AI, clean energy, and space technology."
        },
        {
          headline: "International Day Against Drug Abuse and Illicit Trafficking",
          body: "June 26: The day focused on countering the growing opium production in Myanmar, which has replaced Afghanistan as the largest source of illicit opium in Asia. India's Narcotics Control Bureau reported increased seizures and called for stronger regional cooperation under SAARC and BIMSTEC frameworks."
        },
        {
          headline: "World Ocean Day 2026: Focus on Marine Conservation",
          body: "June 8: World Ocean Day was observed with the theme 'The Ocean: Our Shared Heritage'. India announced new Marine Protected Areas in the Andaman and Nicobar Islands and Lakshadweep. The government also launched the 'Indian Ocean Blue Economy Partnership' with support from the Indian Ocean Rim Association."
        },
        {
          headline: "International Yoga Day 2026 Celebrated Globally",
          body: "June 21: The 12th International Day of Yoga was celebrated worldwide with the theme 'Yoga for Self and Society'. PM Modi led the main event at the United Nations Headquarters in New York, marking the first time the flagship celebration was held at the UN. The event saw participation from 190+ countries."
        },
      ],
    },
  ],
};

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
