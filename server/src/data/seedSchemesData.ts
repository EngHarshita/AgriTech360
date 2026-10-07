import { IGovernmentScheme } from '../types';

export const initialSchemesData: Omit<IGovernmentScheme, 'id' | 'createdAt' | 'updatedAt' | 'isBookmarked'>[] = [
  // 1. PM-KISAN
  {
    title: 'Pradhan Mantri Kisan Samman Nidhi',
    shortCode: 'PM-KISAN',
    department: 'Department of Agriculture & Farmers Welfare',
    category: 'Financial Assistance',
    subsidyAmount: '₹6,000 / year (Direct DBT)',
    targetBeneficiaries: 'All landholding farmer families across India',
    description:
      'Direct income support scheme providing ₹6,000 per annum in three equal four-monthly installments directly into bank accounts of eligible farmer families.',
    benefits: [
      '₹2,000 transferred directly every 4 months (April-July, Aug-Nov, Dec-March)',
      '100% centrally funded through direct benefit transfer (DBT)',
      'Aadhaar-linked DBT transfers ensuring complete transparency'
    ],
    eligibility: [
      'Landholding farmer families with cultivable land in revenue records',
      'Valid Aadhaar card and Aadhaar-seeded active bank account',
      'Excludes institutional landholders and constitutional post holders'
    ],
    requiredDocuments: [
      'Aadhaar Card',
      'Land Ownership Record (7/12 / Khatauni / Jamabandi)',
      'Active Bank Passbook',
      'Aadhaar Registered Mobile Number'
    ],
    officialWebsite: 'https://pmkisan.gov.in',
    applicationProcess:
      'Enroll online via PM-KISAN portal (Farmers Corner -> New Farmer Registration) or visit local Common Service Centre (CSC) / State Agriculture Office with land records.',
    deadline: 'Continuous Enrollment 2026-27',
    status: 'Active Enrollment',
    isPopular: true,
    bookmarkCount: 1420,
    eligibilityRules: {
      targetStates: ['All'],
      minLandHolding: 0.1,
      maxLandHolding: 9999,
      targetIrrigationTypes: ['All'],
      targetSoilTypes: ['All']
    }
  },

  // 2. PMFBY
  {
    title: 'Pradhan Mantri Fasal Bima Yojana',
    shortCode: 'PMFBY',
    department: 'Ministry of Agriculture & Farmers Welfare',
    category: 'Crop Insurance',
    subsidyAmount: 'Up to 90% Premium Subsidy by Govt',
    targetBeneficiaries: 'Farmers growing notified Kharif & Rabi crops',
    description:
      'Comprehensive crop insurance protecting farmers against non-preventable natural risks from pre-sowing to post-harvest stages with minimal farmer premium contribution.',
    benefits: [
      'Farmer premium capped at 1.5% for Rabi, 2% for Kharif, 5% for Commercial/Horticulture crops',
      'Full insured sum payout against drought, flood, pests, and unseasonal hail',
      'Mid-season adversity and localized calamity damage cover within 72 hours'
    ],
    eligibility: [
      'All farmers cultivating notified crops in notified areas',
      'Sharecroppers and tenant farmers with land lease agreements are eligible',
      'Both loanee and non-loanee farmers eligible'
    ],
    requiredDocuments: [
      'Land Possession Certificate / Sowing Certificate',
      'Aadhaar Card',
      'Bank Account Passbook',
      'Crop Sowing Self-Declaration'
    ],
    officialWebsite: 'https://pmfby.gov.in',
    applicationProcess:
      'Enroll via National Crop Insurance Portal (NCIP), through designated banks, primary agricultural credit societies (PACS), or CSC centres prior to cut-off dates.',
    deadline: 'July 31 (Kharif) / Dec 31 (Rabi)',
    status: 'Active Enrollment',
    isPopular: true,
    bookmarkCount: 980,
    eligibilityRules: {
      targetStates: ['All'],
      minLandHolding: 0,
      maxLandHolding: 9999,
      targetIrrigationTypes: ['All'],
      targetSoilTypes: ['All']
    }
  },

  // 3. Soil Health Card Scheme
  {
    title: 'Soil Health Card Scheme',
    shortCode: 'Soil Health Card',
    department: 'National Mission for Sustainable Agriculture (NMSA)',
    category: 'Soil & Fertilizers',
    subsidyAmount: '100% Free Soil Testing & Card Issuance',
    targetBeneficiaries: 'All arable landholding farmers',
    description:
      'Assistance scheme to test soil samples and provide printed health cards with crop-wise nutrient recommendations for 12 essential chemical and micro-nutrients.',
    benefits: [
      'Free laboratory testing of soil pH, electrical conductivity, organic carbon, N, P, K, S, Zn, Fe, Cu, Mn, B',
      'Customized fertilizer and organic compost dosage advice per acre',
      'Reduces unnecessary chemical fertilizer costs by 15-25%'
    ],
    eligibility: [
      'All farmers with registered land parcels in India',
      'Soil sample collected by field agriculture assistant every 3 years'
    ],
    requiredDocuments: [
      'Land Identification Number (Khasra/Survey No)',
      'Aadhaar Card',
      'Farmer Mobile Number'
    ],
    officialWebsite: 'https://soilhealth.dac.gov.in',
    applicationProcess:
      'Contact local Village Agriculture Assistant or Krishi Vigyan Kendra (KVK). Soil samples are collected from GPS-tagged field locations.',
    deadline: 'Year-Round Active',
    status: 'Active Enrollment',
    isPopular: true,
    bookmarkCount: 650,
    eligibilityRules: {
      targetStates: ['All'],
      minLandHolding: 0,
      maxLandHolding: 9999,
      targetIrrigationTypes: ['All'],
      targetSoilTypes: ['All']
    }
  },

  // 4. Kisan Credit Card (KCC)
  {
    title: 'Kisan Credit Card Scheme',
    shortCode: 'KCC',
    department: 'Department of Agriculture, Cooperation & Farmers Welfare / NABARD',
    category: 'Credit & Loans',
    subsidyAmount: 'Short-term Crop Loans @ 4% Effective Interest',
    targetBeneficiaries: 'Farmers, Tenant Farmers, Animal Husbandry & Fishery Farmers',
    description:
      'Affordable institutional revolving credit limit for crop cultivation, post-harvest expenses, farm asset maintenance, and allied livestock activities.',
    benefits: [
      'Subsidized loan interest rate of 7%, with 3% prompt repayment incentive lowering net interest to 4%',
      'Collateral-free credit limit up to ₹1.60 Lakh (up to ₹3 Lakh with simplified land hypothecation)',
      'Flexible revolving credit card valid for 5 years with annual review'
    ],
    eligibility: [
      'Individual/joint landholding farmers',
      'Tenant farmers, oral lessees, and sharecroppers',
      'Self Help Groups (SHGs) or Joint Liability Groups (JLGs) of farmers'
    ],
    requiredDocuments: [
      'Completed KCC Application Form',
      'Identity Proof (Aadhaar / Voter ID)',
      'Address Proof',
      'Land Record Record of Rights (RoR)',
      'Recent Passport Photograph'
    ],
    officialWebsite: 'https://www.myscheme.gov.in/schemes/kcc',
    applicationProcess:
      'Apply at any commercial bank, regional rural bank (RRB), or cooperative bank branch, or online via public sector bank portals.',
    deadline: 'Rolling Facility',
    status: 'Active Enrollment',
    isPopular: true,
    bookmarkCount: 1220,
    eligibilityRules: {
      targetStates: ['All'],
      minLandHolding: 0.1,
      maxLandHolding: 9999,
      targetIrrigationTypes: ['All'],
      targetSoilTypes: ['All']
    }
  },

  // 5. Agriculture Infrastructure Fund (AIF)
  {
    title: 'Agriculture Infrastructure Fund',
    shortCode: 'AIF',
    department: 'Ministry of Agriculture & Farmers Welfare',
    category: 'Infrastructure',
    subsidyAmount: '3% Interest Subvention up to ₹2 Crore for 7 Years',
    targetBeneficiaries: 'FPOs, Agri-entrepreneurs, Startups, Primary Agricultural Societies (PACS)',
    description:
      'Medium-to-long term debt financing facility for investment in viable post-harvest management infrastructure and community farming assets.',
    benefits: [
      '3% per annum interest subvention on loans up to ₹2 Crore for a maximum tenure of 7 years',
      'Credit guarantee coverage under CGTMSE for loans up to ₹2 Crore',
      'Moratorium period on repayment from 6 months up to 2 years'
    ],
    eligibility: [
      'Primary Agricultural Credit Societies (PACS), Marketing Cooperative Societies',
      'Farmer Producer Organizations (FPOs), Self Help Groups (SHGs), Joint Liability Groups (JLGs)',
      'Individual Agri-entrepreneurs and Startups setting up cold storage, pack-houses, or sorting units'
    ],
    requiredDocuments: [
      'Detailed Project Report (DPR)',
      'PAN & Aadhaar of Promoters',
      'Land Title or Lease Deed (min 10 years)',
      'Bank Loan In-principle Sanction Letter',
      'Entity Registration Certificate'
    ],
    officialWebsite: 'https://agriinfra.dac.gov.in',
    applicationProcess:
      'Submit Detailed Project Report online on the National AIF portal. Applications are routed to chosen lending institutions for appraisal.',
    deadline: 'Open until 2029-30',
    status: 'Active Enrollment',
    isPopular: false,
    bookmarkCount: 420,
    eligibilityRules: {
      targetStates: ['All'],
      minLandHolding: 0,
      maxLandHolding: 9999,
      targetIrrigationTypes: ['All'],
      targetSoilTypes: ['All']
    }
  },

  // 6. National Mission on Edible Oils - Oil Palm (NMEO-OP)
  {
    title: 'National Mission on Edible Oils - Oil Palm',
    shortCode: 'NMEO-OP',
    department: 'Ministry of Agriculture & Farmers Welfare',
    category: 'Financial Assistance',
    subsidyAmount: '₹29,000 / ha Planting Material Subsidy + Viability Price Assurance',
    targetBeneficiaries: 'Farmers cultivating Oil Palm in notified districts',
    description:
      'Centrally sponsored initiative to expand oil palm plantation acreage, provide planting material subsidies, and guarantee price volatility protection to boost domestic edible oil production.',
    benefits: [
      'Planting material cost subsidy increased from ₹12,000 to ₹29,000 per hectare',
      'Maintenance and inter-cropping assistance of ₹21,000 per ha for 4 years',
      'Viability price formula shielding farmers from international crude palm oil fluctuations'
    ],
    eligibility: [
      'Farmers with assured irrigation in notified agro-climatic zones (Andhra, Telangana, NE States, Maharashtra)',
      'Minimum land parcel of 0.5 hectare with reliable water source'
    ],
    requiredDocuments: [
      'Land Ownership Record (7/12 / Patta)',
      'Irrigation Source Certificate (Borewell / Canal / Drip)',
      'Aadhaar Card & Bank Details'
    ],
    officialWebsite: 'https://nmeo.dac.gov.in',
    applicationProcess:
      'Contact District Horticulture Officer or designated state oil palm processing industry partner to sign tripartite grower agreement.',
    deadline: 'Seasonal Allocation',
    status: 'Active Enrollment',
    isPopular: false,
    bookmarkCount: 290,
    eligibilityRules: {
      targetStates: ['Andhra Pradesh', 'Telangana', 'Maharashtra', 'Karnataka', 'Gujarat', 'Tamil Nadu', 'Assam', 'Tripura', 'Mizoram'],
      minLandHolding: 1.0,
      maxLandHolding: 25.0,
      targetIrrigationTypes: ['Drip', 'Borewell', 'Canal', 'Sprinkler'],
      targetSoilTypes: ['All']
    }
  },

  // 7. National Food Security Mission (NFSM)
  {
    title: 'National Food Security Mission',
    shortCode: 'NFSM',
    department: 'Department of Agriculture, Cooperation & Farmers Welfare',
    category: 'Financial Assistance',
    subsidyAmount: '50% Subsidy on High-Yielding Seeds, Gypsum, & Sprayers',
    targetBeneficiaries: 'Farmers growing Rice, Wheat, Pulses, Coarse Cereals & Nutri-Cereals',
    description:
      'Mission aimed at increasing production of food grains through area expansion, high-yielding seed distribution, and soil ameliorant subsidies.',
    benefits: [
      '50% subsidy on certified high-yielding hybrid seeds',
      '₹7,500/ha demonstration assistance on improved agricultural practices',
      'Financial support for knapsack sprayers, seed drills, and micro-nutrients'
    ],
    eligibility: [
      'All farmers cultivating pulses, wheat, rice, or millets in NFSM identified districts',
      'Priority given to small and marginal farmers and women cultivators'
    ],
    requiredDocuments: [
      'Land Record (Khatauni / 7/12)',
      'Aadhaar Card',
      'Bank Account Passbook',
      'Farmer Registration ID'
    ],
    officialWebsite: 'https://nfsm.gov.in',
    applicationProcess:
      'Register on state agriculture DBT portal (e.g., Mahadbt, UP Agriculture DBT) or obtain permits through Block Agriculture Officer (BAO).',
    deadline: 'Season-based (Kharif/Rabi)',
    status: 'Active Enrollment',
    isPopular: false,
    bookmarkCount: 310,
    eligibilityRules: {
      targetStates: ['All'],
      minLandHolding: 0.2,
      maxLandHolding: 15.0,
      targetIrrigationTypes: ['All'],
      targetSoilTypes: ['All']
    }
  },

  // 8. Micro Irrigation Fund (Per Drop More Crop)
  {
    title: 'Micro Irrigation Fund (Per Drop More Crop - PMKSY)',
    shortCode: 'Micro Irrigation Fund',
    department: 'Department of Agriculture & Farmers Welfare / NABARD',
    category: 'Irrigation & Machinery',
    subsidyAmount: 'Up to 55% Subsidy for Small/Marginal & 45% for Other Farmers',
    targetBeneficiaries: 'Farmers installing Drip and Sprinkler irrigation systems',
    description:
      'Financial support for precision micro-irrigation installations, water-use efficiency improvement, and fertigation infrastructure.',
    benefits: [
      '55% capital cost subsidy for small and marginal farmers (up to 5 Acres)',
      '45% capital cost subsidy for other general farmers',
      'Saves 40-50% water while increasing crop yield by 25-35%'
    ],
    eligibility: [
      'Farmers possessing arable land with functional borewell, open well, or farm pond',
      'Minimum water source discharge sufficient for pressurized emitter networks'
    ],
    requiredDocuments: [
      'Land Record (7/12 / RoR)',
      'Water & Electricity Availability Certificate',
      'Aadhaar Card & Bank Details',
      'Quotation from Empanelled Micro-Irrigation Vendor'
    ],
    officialWebsite: 'https://pmksy.gov.in/microirrigation',
    applicationProcess:
      'Apply online on state micro-irrigation DBT portal. Select empanelled drip vendor, receive pre-sanction inspection, and install system.',
    deadline: 'Annual Target Allotments',
    status: 'Active Enrollment',
    isPopular: true,
    bookmarkCount: 890,
    eligibilityRules: {
      targetStates: ['All'],
      minLandHolding: 0.5,
      maxLandHolding: 25.0,
      targetIrrigationTypes: ['Drip', 'Sprinkler', 'Borewell', 'Canal'],
      targetSoilTypes: ['All']
    }
  },

  // 9. Sub-Mission on Agricultural Mechanization (SMAM)
  {
    title: 'Sub-Mission on Agricultural Mechanization',
    shortCode: 'SMAM',
    department: 'Mechanization & Technology Division, MoA&FW',
    category: 'Irrigation & Machinery',
    subsidyAmount: '40% - 50% Subsidy on Tractors, Harvesters & Implements',
    targetBeneficiaries: 'Individual Farmers, Custom Hiring Centres, and FPOs',
    description:
      'Promotion of farm mechanization through capital subsidies on machinery purchase and establishment of village Custom Hiring Centres (CHC).',
    benefits: [
      '40% to 50% subsidy on purchase of tractors, rotavators, power tillers, and laser land levelers',
      'Up to ₹10 Lakh subsidy (40%) on establishing Custom Hiring Centres (total project ₹25 Lakh)',
      'Reduces manual labor bottleneck during harvest and sowing peak windows'
    ],
    eligibility: [
      'All landholder farmers; special incentive for women, SC, ST, and smallholder farmers',
      'One machine subsidy per farmer family once every 5-7 years'
    ],
    requiredDocuments: [
      'Land Ownership Record',
      'Aadhaar Card',
      'Caste Certificate (if claiming affirmative subsidy)',
      'Driving License (for tractor subsidy applications)',
      'Bank Account Passbook'
    ],
    officialWebsite: 'https://agrimachinery.nic.in',
    applicationProcess:
      'Apply on central DBT Farm Machinery Portal (agrimachinery.nic.in) during state open lottery intake windows.',
    deadline: 'Periodic State Lotteries',
    status: 'Active Enrollment',
    isPopular: true,
    bookmarkCount: 760,
    eligibilityRules: {
      targetStates: ['All'],
      minLandHolding: 0.5,
      maxLandHolding: 50.0,
      targetIrrigationTypes: ['All'],
      targetSoilTypes: ['All']
    }
  },

  // 10. Paramparagat Krishi Vikas Yojana (PKVY)
  {
    title: 'Paramparagat Krishi Vikas Yojana',
    shortCode: 'PKVY',
    department: 'Integrated Nutrient Management Division',
    category: 'Organic Farming',
    subsidyAmount: '₹50,000 / hectare over 3 Years',
    targetBeneficiaries: 'Farmer clusters adopting certified organic farming',
    description:
      'Sub-component of National Mission for Sustainable Agriculture promoting organic farming through cluster approach and Participatory Guarantee System (PGS) certification.',
    benefits: [
      '₹31,000/ha for organic inputs (bio-fertilizers, vermicompost, botanical extracts)',
      '₹8,800/ha for post-harvest packing, labeling, and direct-to-consumer marketing',
      'Free PGS-India organic certification facilitating premium market realization'
    ],
    eligibility: [
      'Farmers forming contiguous cluster of minimum 20 hectares (approx 50 farmers)',
      'Commitment to transition from synthetic chemicals to biological inputs'
    ],
    requiredDocuments: [
      'Cluster Formation Resolution',
      'Individual Farmer Land Records',
      'Aadhaar Card',
      'Farmer Bank Account Details'
    ],
    officialWebsite: 'https://pgsindia-ncof.gov.in',
    applicationProcess:
      'Form cluster through local NGO/Regional Council or register group with District Agriculture Officer / KVK.',
    deadline: 'Cluster-wise cycle',
    status: 'Active Enrollment',
    isPopular: false,
    bookmarkCount: 450,
    eligibilityRules: {
      targetStates: ['All'],
      minLandHolding: 0.5,
      maxLandHolding: 15.0,
      targetIrrigationTypes: ['All'],
      targetSoilTypes: ['All']
    }
  },

  // 11. Formation & Promotion of 10,000 FPOs
  {
    title: 'Formation & Promotion of 10,000 FPOs',
    shortCode: 'FPO Promotion Scheme',
    department: 'Ministry of Agriculture & Farmers Welfare / SFAC / NABARD',
    category: 'Infrastructure',
    subsidyAmount: 'Up to ₹18 Lakh Financial Support per FPO + ₹15 Lakh Equity Grant',
    targetBeneficiaries: 'Farmer Producer Organizations (min 300 plain / 100 hilly members)',
    description:
      'Central sector scheme to build scale, bargaining power, bulk input discounts, and direct market access for small and marginal farmers.',
    benefits: [
      'Financial support up to ₹18 Lakh per FPO for initial 3 years management expenses',
      'Matching equity grant up to ₹2,000 per farmer member (max ₹15 Lakh per FPO)',
      'Credit guarantee cover up to ₹2 Crore bank loan through NABARD/NCDC'
    ],
    eligibility: [
      'Producer companies registered under Companies Act or Cooperative Societies Act',
      'Minimum 300 farmer shareholders in plains (100 in Northeast / Hilly regions)'
    ],
    requiredDocuments: [
      'FPO Certificate of Incorporation',
      'List of Shareholder Farmers with Land Details',
      'Audited Financial Statements (for existing)',
      'FPO Bank Account Passbook'
    ],
    officialWebsite: 'https://sfacindia.com',
    applicationProcess:
      'Apply through Cluster Based Business Organizations (CBBOs) appointed by implementing agencies (SFAC, NABARD, NCDC).',
    deadline: 'Ongoing Target Allotment',
    status: 'Active Enrollment',
    isPopular: false,
    bookmarkCount: 380,
    eligibilityRules: {
      targetStates: ['All'],
      minLandHolding: 0,
      maxLandHolding: 9999,
      targetIrrigationTypes: ['All'],
      targetSoilTypes: ['All']
    }
  },

  // 12. PM-KUSUM (Solar Pumps)
  {
    title: 'Pradhan Mantri Kisan Urja Suraksha evam Utthaan Mahabhiyan',
    shortCode: 'PM-KUSUM',
    department: 'Ministry of New & Renewable Energy (MNRE)',
    category: 'Solar Energy',
    subsidyAmount: 'Up to 60% Capital Subsidy (30% Central + 30% State)',
    targetBeneficiaries: 'Farmers requiring standalone solar irrigation pumps',
    description:
      'Flagship clean energy scheme replacing diesel pumps with standalone solar agricultural pumps and solarizing grid-connected farm feeders.',
    benefits: [
      '60% subsidy on solar pump cost (farmer contributes only 10% cash, 30% bank loan)',
      'Zero electricity bills and daytime irrigation independence from power grid outages',
      'Surplus solar power can be sold back to state distribution companies (DISCOMs)'
    ],
    eligibility: [
      'Individual farmers, panchayats, and cooperatives with land having water source',
      'Priority for areas without existing agricultural electric grid connections'
    ],
    requiredDocuments: [
      'Land Record (7/12 / Khasra)',
      'Water Source Proof (Open Well / Borewell)',
      'Aadhaar Card & Bank Details',
      'No Objection Certificate (NOC) from Local Discom (if applicable)'
    ],
    officialWebsite: 'https://pmkusum.mnre.gov.in',
    applicationProcess:
      'Register on state nodal renewable energy agency portal (e.g. MEDA, UPNEDA, RREC) when annual subsidy quotas open.',
    deadline: 'State Quota Openings',
    status: 'Active Enrollment',
    isPopular: true,
    bookmarkCount: 1150,
    eligibilityRules: {
      targetStates: ['All'],
      minLandHolding: 0.5,
      maxLandHolding: 25.0,
      targetIrrigationTypes: ['Borewell', 'Canal', 'Rainfed', 'Drip', 'Sprinkler'],
      targetSoilTypes: ['All']
    }
  },

  // 13. RKVY-RAFTAAR
  {
    title: 'Rashtriya Krishi Vikas Yojana - RAFTAAR',
    shortCode: 'RKVY-RAFTAAR',
    department: 'Department of Agriculture & Farmers Welfare',
    category: 'Infrastructure',
    subsidyAmount: 'Up to ₹25 Lakh Agri-Startup Grant-in-aid',
    targetBeneficiaries: 'Agri-entrepreneurs, Youth, Farmer Collectives',
    description:
      'Remunerative Approaches for Agriculture and Allied Sectors Rejuvenation promoting agribusiness incubation, post-harvest infrastructure, and innovation.',
    benefits: [
      'Idea-stage seed grant up to ₹5 Lakh for agri-innovators',
      'Scale-stage grant-in-aid up to ₹25 Lakh for technology-driven agri startups',
      'Access to state-of-the-art incubation labs at premier institutions (IARI, MANAGE, CCS HAU)'
    ],
    eligibility: [
      'Agri-entrepreneurs with innovative farm technology, organic processing, or drone services',
      'Indian citizens possessing minimum viable prototype in agriculture'
    ],
    requiredDocuments: [
      'Business Proposal Pitch Deck',
      'Promoter Aadhaar & PAN Cards',
      'Company/LLP Registration Certificate',
      'Bank Account Verification'
    ],
    officialWebsite: 'https://rkvy.nic.in',
    applicationProcess:
      'Apply through RKVY Knowledge Partners and Agribusiness Incubators (R-ABIs) during annual cohort invitation calls.',
    deadline: 'Cohort Openings (Q2/Q4)',
    status: 'Upcoming',
    isPopular: false,
    bookmarkCount: 290,
    eligibilityRules: {
      targetStates: ['All'],
      minLandHolding: 0,
      maxLandHolding: 9999,
      targetIrrigationTypes: ['All'],
      targetSoilTypes: ['All']
    }
  },

  // 14. National Beekeeping & Honey Mission (NBHM)
  {
    title: 'National Beekeeping & Honey Mission',
    shortCode: 'NBHM',
    department: 'National Bee Board (NBB)',
    category: 'Financial Assistance',
    subsidyAmount: 'Up to 50% Subsidy on Beehives, Colonies & Extractors',
    targetBeneficiaries: 'Smallholder Farmers, Landless Laborers, Beekeepers',
    description:
      'Sweet Revolution initiative aimed at overall promotion of scientific beekeeping to increase pollination-driven crop yield and generate supplementary farm income.',
    benefits: [
      '50% subsidy on purchase of bee boxes, colonies, and honey extraction equipment',
      'Financial support for honey testing labs and custom extraction centres',
      'Boosts crop pollination yields by 15-30% in oilseeds, mustard, and orchards'
    ],
    eligibility: [
      'Individual farmers, SHGs, and registered beekeepers',
      'Must complete 7-day scientific beekeeping training from KVK / NBB'
    ],
    requiredDocuments: [
      'Training Completion Certificate',
      'Aadhaar Card',
      'Bank Account Passbook',
      'Land Record or Consent Letter from Orchard Owner'
    ],
    officialWebsite: 'https://nbhm.gov.in',
    applicationProcess:
      'Register with National Bee Board (Madhukranti portal) and apply through District Horticulture Officer.',
    deadline: 'Open Enrollment',
    status: 'Active Enrollment',
    isPopular: false,
    bookmarkCount: 210,
    eligibilityRules: {
      targetStates: ['All'],
      minLandHolding: 0,
      maxLandHolding: 9999,
      targetIrrigationTypes: ['All'],
      targetSoilTypes: ['All']
    }
  },

  // 15. Mission for Integrated Development of Horticulture (MIDH)
  {
    title: 'Mission for Integrated Development of Horticulture',
    shortCode: 'MIDH',
    department: 'Horticulture Division, MoA&FW',
    category: 'Infrastructure',
    subsidyAmount: '40% - 50% Capital Subsidy on Polyhouses & Shade-Nets',
    targetBeneficiaries: 'Horticultural Growers of Fruits, Vegetables & Flowers',
    description:
      'Holistic growth mission for horticulture sector covering protected cultivation (greenhouse/polyhouse), high-density orchards, and cold chain logistics.',
    benefits: [
      '50% subsidy on establishment of naturally ventilated polyhouses (approx ₹4.5 Lakh per 1000 sq m)',
      '50% assistance on shade net houses and plastic mulching sheets',
      'Assistance for high-density fruit orchard plantation (Mango, Guava, Pomegranate, Citrus)'
    ],
    eligibility: [
      'Farmers possessing clear land title and assured perennial water source',
      'Commercial horticulture cultivators'
    ],
    requiredDocuments: [
      '7/12 Land Record',
      'Water Availability Certificate',
      'Polyhouse Vendor Project Quotation',
      'Aadhaar Card & Bank Passbook'
    ],
    officialWebsite: 'https://midh.gov.in',
    applicationProcess:
      'Submit proposal to District Mission Director / District Horticulture Officer (DHO) via state horticulture portal.',
    deadline: 'Annual Target Windows',
    status: 'Active Enrollment',
    isPopular: true,
    bookmarkCount: 680,
    eligibilityRules: {
      targetStates: ['All'],
      minLandHolding: 0.5,
      maxLandHolding: 20.0,
      targetIrrigationTypes: ['Drip', 'Sprinkler', 'Borewell'],
      targetSoilTypes: ['All']
    }
  },

  // 16. Pradhan Mantri Krishi Sinchayee Yojana (Har Khet Ko Pani)
  {
    title: 'Pradhan Mantri Krishi Sinchayee Yojana - Har Khet Ko Pani',
    shortCode: 'PMKSY - HKKP',
    department: 'Department of Water Resources, River Development & Ganga Rejuvenation',
    category: 'Irrigation & Machinery',
    subsidyAmount: 'Government Sponsored Community Water Sourcing',
    targetBeneficiaries: 'Farmers in water-stressed command and rainfed areas',
    description:
      'Component focused on expanding cultivable command areas under assured irrigation by surface minor irrigation, groundwater creation, and repair of traditional water bodies.',
    benefits: [
      'Creation of new community water sources and renovation of check-dams and village ponds',
      'Restoration of traditional water harvesting structures (Jal Kunds / Talabs)',
      'Expands canal outlet distribution to tail-end farms'
    ],
    eligibility: [
      'Farmer groups and water user associations in drought-prone blocks',
      'Rainfed farmers lacking perennial irrigation infrastructure'
    ],
    requiredDocuments: [
      'Gram Panchayat Land Resolution',
      'Farmer Community Consent Form',
      'Village Cadastral Map'
    ],
    officialWebsite: 'https://pmksy.gov.in',
    applicationProcess:
      'Identified and implemented via District Irrigation Plan (DIP) through Gram Panchayat and Minor Irrigation Department.',
    deadline: 'Gram Panchayat Planning Schedule',
    status: 'Active Enrollment',
    isPopular: false,
    bookmarkCount: 320,
    eligibilityRules: {
      targetStates: ['All'],
      minLandHolding: 0,
      maxLandHolding: 9999,
      targetIrrigationTypes: ['Rainfed', 'Canal'],
      targetSoilTypes: ['All']
    }
  },

  // 17. National Livestock Mission (NLM)
  {
    title: 'National Livestock Mission - Fodder & Feed Development',
    shortCode: 'NLM',
    department: 'Department of Animal Husbandry & Dairying',
    category: 'Financial Assistance',
    subsidyAmount: '50% Capital Subsidy up to ₹50 Lakh for Fodder Seed Processing',
    targetBeneficiaries: 'Dairy Farmers, FPOs, Agri-Entrepreneurs',
    description:
      'Mission to ensure sustainable growth of livestock through quality feed, certified fodder seeds, and silage making unit subsidies.',
    benefits: [
      '50% capital subsidy on silage making machines, hay-balers, and total mixed ration (TMR) units',
      'Subsidized distribution of certified perennial fodder seed mini-kits (Barseem, Napier, Sorghum)',
      'Ensures continuous green fodder availability during summer lean months'
    ],
    eligibility: [
      'Farmers maintaining dairy cattle, sheep, or goat herds',
      'Entrepreneurs establishing commercial fodder silage units'
    ],
    requiredDocuments: [
      'Animal Husbandry Registration',
      'Land Lease/Ownership Record',
      'Aadhaar Card',
      'Bank Account Passbook'
    ],
    officialWebsite: 'https://nlm.udyamimitra.in',
    applicationProcess:
      'Apply online on NLM portal (udyamimitra.in) with project DPR. Applications undergo state verification and bank appraisal.',
    deadline: 'Rolling Annual Window',
    status: 'Active Enrollment',
    isPopular: false,
    bookmarkCount: 230,
    eligibilityRules: {
      targetStates: ['All'],
      minLandHolding: 0.5,
      maxLandHolding: 25.0,
      targetIrrigationTypes: ['All'],
      targetSoilTypes: ['All']
    }
  },

  // 18. e-NAM (National Agriculture Market)
  {
    title: 'National Agriculture Market Integration',
    shortCode: 'e-NAM',
    department: 'Small Farmers Agribusiness Consortium (SFAC)',
    category: 'Infrastructure',
    subsidyAmount: 'Zero Registration Fee + Direct e-Payment to Bank',
    targetBeneficiaries: 'All APMC Registered Farmers across India',
    description:
      'Pan-India electronic trading portal networking physical APMC mandis to create a unified national market for agricultural commodities.',
    benefits: [
      'Access to nationwide competitive buyers removing local middleman cartels',
      'Transparent assaying and electronic auctioning based on crop quality lab testing',
      'Direct RTGS/NEFT settlement to farmer bank accounts on same day of auction'
    ],
    eligibility: [
      'Any farmer bringing farm produce to any of the 1,400+ integrated e-NAM APMC mandis'
    ],
    requiredDocuments: [
      'Aadhaar Card',
      'Bank Account Passbook',
      'APMC Gate Entry Pass'
    ],
    officialWebsite: 'https://enam.gov.in',
    applicationProcess:
      'Register at mandi entry gate using e-NAM mobile app or through gate clerk with Aadhaar and bank details.',
    deadline: 'Continuous Daily Trading',
    status: 'Active Enrollment',
    isPopular: true,
    bookmarkCount: 890,
    eligibilityRules: {
      targetStates: ['All'],
      minLandHolding: 0,
      maxLandHolding: 9999,
      targetIrrigationTypes: ['All'],
      targetSoilTypes: ['All']
    }
  },

  // 19. Agricultural Marketing Infrastructure (AMI)
  {
    title: 'Agricultural Marketing Infrastructure Scheme',
    shortCode: 'AMI',
    department: 'Directorate of Marketing & Inspection (DMI) / NABARD',
    category: 'Infrastructure',
    subsidyAmount: '25% - 33.33% Capital Subsidy on Farm Storage Godowns',
    targetBeneficiaries: 'Individual Farmers, Cooperatives, FPOs',
    description:
      'Capital investment subsidy sub-scheme under Integrated Scheme for Agricultural Marketing (ISAM) supporting rural godowns and scientific storage.',
    benefits: [
      '33.33% subsidy for SC/ST and women farmers (max ₹3.33 Crore per project)',
      '25% subsidy for general category farmers on rural storage construction',
      'Enables pledge financing against Negotiable Warehouse Receipts (NWR) preventing distress sales'
    ],
    eligibility: [
      'Farmers constructing minimum 50 MT to maximum 10,000 MT capacity warehouse',
      'Must adhere to WDRA scientific construction standards'
    ],
    requiredDocuments: [
      'Approved Warehouse Engineering Layout',
      'Clear Land Title Deed',
      'Bank Loan Sanction Letter',
      'PAN & Aadhaar'
    ],
    officialWebsite: 'https://dmi.gov.in',
    applicationProcess:
      'Apply through institutional lending bank which files joint subsidy claim with NABARD.',
    deadline: 'Annual Budget Allocations',
    status: 'Active Enrollment',
    isPopular: false,
    bookmarkCount: 310,
    eligibilityRules: {
      targetStates: ['All'],
      minLandHolding: 1.0,
      maxLandHolding: 50.0,
      targetIrrigationTypes: ['All'],
      targetSoilTypes: ['All']
    }
  },

  // 20. Gramin Bhandaran Yojana
  {
    title: 'Gramin Bhandaran Yojana (Rural Godown Scheme)',
    shortCode: 'Gramin Bhandaran',
    department: 'Ministry of Agriculture & Farmers Welfare',
    category: 'Infrastructure',
    subsidyAmount: 'Capital Subsidy up to ₹33.33% of Construction Cost',
    targetBeneficiaries: 'Rural Farmers & Agricultural Cooperative Societies',
    description:
      'Creation of scientific storage capacity with allied facilities in rural areas to meet farmer storage requirements for agricultural produce.',
    benefits: [
      'Prevents post-harvest produce deterioration caused by moisture, rodents, and pests',
      'Allows farmers to store harvested grains during harvest glut and sell during price peaks',
      'Banks provide immediate loans up to 75% value of stored produce on warehouse receipts'
    ],
    eligibility: [
      'Individual farmers, agricultural graduates, cooperatives, and marketing boards',
      'Location outside municipal limits in rural zones'
    ],
    requiredDocuments: [
      'Land Non-Agricultural (NA) or Agricultural Title Deed',
      'Bank Appraisal Report',
      'Civil Engineering Estimates'
    ],
    officialWebsite: 'https://agricoop.nic.in',
    applicationProcess:
      'Submit loan and subsidy application to primary commercial bank or regional rural bank with civil blueprint.',
    deadline: 'Annual Windows',
    status: 'Active Enrollment',
    isPopular: false,
    bookmarkCount: 240,
    eligibilityRules: {
      targetStates: ['All'],
      minLandHolding: 0.5,
      maxLandHolding: 30.0,
      targetIrrigationTypes: ['All'],
      targetSoilTypes: ['All']
    }
  },

  // 21. Interest Subvention Scheme for Short-term Crop Loans
  {
    title: 'Modified Interest Subvention Scheme (MISS)',
    shortCode: 'MISS Crop Loans',
    department: 'Department of Agriculture & Farmers Welfare / RBI',
    category: 'Credit & Loans',
    subsidyAmount: '3% Prompt Repayment Incentive (Effective 4% Loan Rate)',
    targetBeneficiaries: 'All farmers availing short-term crop loans up to ₹3 Lakh',
    description:
      'Central scheme ensuring short term agricultural loans are accessible at concessional rate through 1.5% interest subvention to lending institutions and 3% prompt repayment incentive to farmers.',
    benefits: [
      'Loan interest lowered from 9% to benchmark 7%, and further down to 4% for prompt payers',
      'Covers cultivation expenses for all certified Kharif and Rabi seasonal crops',
      'Provides post-harvest loan relief against warehouse receipts for up to 6 months at 7%'
    ],
    eligibility: [
      'Farmers availing short-term production loans up to ₹3,00,000 via Kisan Credit Card',
      'Must repay dues within 1 year of loan disbursement'
    ],
    requiredDocuments: [
      'Kisan Credit Card Account',
      'Crop Sowing Verification',
      'Aadhaar Linked Bank Account'
    ],
    officialWebsite: 'https://rbi.org.in',
    applicationProcess:
      'Automatically credited to eligible farmer KCC loan accounts by banks upon timely repayment.',
    deadline: 'Annual Renewal Schedule',
    status: 'Active Enrollment',
    isPopular: true,
    bookmarkCount: 840,
    eligibilityRules: {
      targetStates: ['All'],
      minLandHolding: 0.1,
      maxLandHolding: 9999,
      targetIrrigationTypes: ['All'],
      targetSoilTypes: ['All']
    }
  },

  // 22. PM Matsya Sampada Yojana
  {
    title: 'Pradhan Mantri Matsya Sampada Yojana',
    shortCode: 'PMMSY',
    department: 'Department of Fisheries, Ministry of Fisheries & Animal Husbandry',
    category: 'Financial Assistance',
    subsidyAmount: '40% - 60% Subsidy for Inland Farm Ponds & Aquaculture',
    targetBeneficiaries: 'Farmers integrating aquaculture / fish farming with agriculture',
    description:
      'Flagship scheme for focused and sustainable development of the fisheries sector through construction of freshwater farm ponds, re-circulatory aquaculture systems (RAS), and biofloc.',
    benefits: [
      '60% subsidy for women and SC/ST farmers; 40% for general category farmers',
      'Generates lucrative additional income of ₹1.5 - ₹3 Lakh per acre from farm ponds',
      'Subsidized aerators, fingerling seeds, and high-protein pellet feed'
    ],
    eligibility: [
      'Farmers possessing land with soil water retention capacity or lined pond infrastructure',
      'Availability of reliable freshwater supply'
    ],
    requiredDocuments: [
      'Land Record (Khatauni / 7/12)',
      'Water Testing Report',
      'Aadhaar Card & Bank Passbook',
      'Fisheries Training Certificate (preferred)'
    ],
    officialWebsite: 'https://pmmsy.dof.gov.in',
    applicationProcess:
      'Apply online on PMMSY portal or submit physical application to District Fisheries Development Officer (DFDO).',
    deadline: 'Annual District Target Windows',
    status: 'Active Enrollment',
    isPopular: false,
    bookmarkCount: 270,
    eligibilityRules: {
      targetStates: ['All'],
      minLandHolding: 0.5,
      maxLandHolding: 25.0,
      targetIrrigationTypes: ['Canal', 'Borewell', 'Rainfed'],
      targetSoilTypes: ['Clayey', 'Black Soil', 'Alluvial', 'Loamy']
    }
  },

  // 23. PoCRA (Maharashtra Specific)
  {
    title: 'Nanaji Deshmukh Krishi Sanjivani Yojana (PoCRA)',
    shortCode: 'PoCRA',
    department: 'Department of Agriculture, Government of Maharashtra / World Bank',
    category: 'Financial Assistance',
    subsidyAmount: 'Up to 75% Direct DBT for Farm Ponds, Shade-nets & Micro-irrigation',
    targetBeneficiaries: 'Small & Marginal Farmers in 16 Marathwada & Vidarbha Districts',
    description:
      'World Bank-assisted climate resilient agriculture project in Maharashtra supporting smallholders with direct benefit subsidies on farm ponds, shade-nets, sprinklers, and drought-tolerant seed varieties.',
    benefits: [
      '75% subsidy on individual farm pond creation and plastic lining',
      '65% to 75% subsidy on micro-irrigation and shade-net houses',
      'Farmer receives money directly into DBT bank account post geo-tagged mobile verification'
    ],
    eligibility: [
      'Farmers residing in notified 5,142 drought-prone villages of Marathwada and Vidarbha (Maharashtra)',
      'Smallholder and marginal landholders (land holding <= 5 Acres)'
    ],
    requiredDocuments: [
      'Maharashtra 7/12 & 8A Land Extract',
      'Aadhaar Card',
      'Aadhaar-seeded Bank Account Passbook',
      'Caste Certificate (for higher affirmative slab)'
    ],
    officialWebsite: 'https://mahapocra.gov.in',
    applicationProcess:
      'Apply on MahaPoCRA mobile app (Dbt.mahapocra.gov.in) with 7/12 extract. Village committee (VCRMC) verifies application on spot.',
    deadline: 'Active 2026-27',
    status: 'Active Enrollment',
    isPopular: true,
    bookmarkCount: 910,
    eligibilityRules: {
      targetStates: ['Maharashtra'],
      minLandHolding: 0.2,
      maxLandHolding: 5.0,
      targetIrrigationTypes: ['Rainfed', 'Drip', 'Borewell', 'Sprinkler'],
      targetSoilTypes: ['Black Soil', 'Red Soil', 'Loamy']
    }
  },

  // 24. MOVCDNER (North Eastern States)
  {
    title: 'Mission Organic Value Chain Development for North Eastern Region',
    shortCode: 'MOVCDNER',
    department: 'Ministry of Agriculture & Farmers Welfare',
    category: 'Organic Farming',
    subsidyAmount: 'Up to ₹25,000 / ha for Organic Input Production',
    targetBeneficiaries: 'Farmers in 8 North Eastern States',
    description:
      'Development of certified organic production clusters in Northeast India connected with processing, branding, and export logistics.',
    benefits: [
      'Financial support of ₹25,000 per ha for organic seeds, biocontrol agents, and composting',
      'Complete funding for end-to-end organic certification over 3-year gestation',
      'Creation of farmer-owned organic collection and cold-chain hubs'
    ],
    eligibility: [
      'Farmers residing in Arunachal, Assam, Manipur, Meghalaya, Mizoram, Nagaland, Sikkim, or Tripura'
    ],
    requiredDocuments: [
      'Resident & Land Certificate in NE State',
      'Aadhaar Card',
      'Bank Account Passbook'
    ],
    officialWebsite: 'https://movcdner.gov.in',
    applicationProcess:
      'Apply through state organic farming mission agencies (SOFMA) or local Krishi Vigyan Kendra.',
    deadline: 'Cluster Enrollments',
    status: 'Active Enrollment',
    isPopular: false,
    bookmarkCount: 180,
    eligibilityRules: {
      targetStates: ['Assam', 'Arunachal Pradesh', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Sikkim', 'Tripura'],
      minLandHolding: 0.2,
      maxLandHolding: 20.0,
      targetIrrigationTypes: ['All'],
      targetSoilTypes: ['All']
    }
  },

  // 25. National Mission on Natural Farming (NMNF)
  {
    title: 'National Mission on Natural Farming',
    shortCode: 'NMNF',
    department: 'Department of Agriculture & Farmers Welfare',
    category: 'Organic Farming',
    subsidyAmount: '₹15,000 / ha Assistance for On-farm Bio-inputs',
    targetBeneficiaries: 'Farmers adopting Cow-based Chemical-free Natural Farming',
    description:
      'Promotes chemical-free farming utilizing native cow dung and urine based formulations (Jeevamrit, Beejamrit) along with multi-cropping to lower input costs.',
    benefits: [
      '₹15,000 per hectare support over 3 years for setting up on-farm input resource units',
      'Free training and handholding by master trainer Krishi Sakhis',
      'Restores soil microbiology, earthworm populations, and water retention capacity'
    ],
    eligibility: [
      'Farmers committed to zero synthetic chemical pesticide and fertilizer usage',
      'Possession of indigenous/Desi cows or access to cow-based biological inputs'
    ],
    requiredDocuments: [
      'Farmer Land Record',
      'Aadhaar Card',
      'Bank Account Details',
      'Natural Farming Declaration'
    ],
    officialWebsite: 'https://naturalfarming.dac.gov.in',
    applicationProcess:
      'Register on Natural Farming Portal through Village Agriculture Assistant or local block office.',
    deadline: 'Rolling Enrollment',
    status: 'Active Enrollment',
    isPopular: true,
    bookmarkCount: 520,
    eligibilityRules: {
      targetStates: ['All'],
      minLandHolding: 0.1,
      maxLandHolding: 15.0,
      targetIrrigationTypes: ['All'],
      targetSoilTypes: ['All']
    }
  },

  // 26. DBT Agriculture Schemes
  {
    title: 'Direct Benefit Transfer Agriculture Seed & Fertilizer Subsidy',
    shortCode: 'DBT Agriculture',
    department: 'State Agriculture Departments / Ministry of Chemicals & Fertilizers',
    category: 'Soil & Fertilizers',
    subsidyAmount: 'Direct Price Concession on Urea, DAP, MOP & Certified Seeds',
    targetBeneficiaries: 'All verified Indian farmers purchasing inputs through PoS',
    description:
      'Nationwide electronic Aadhaar-authenticated fertilizer subsidy and certified hybrid crop seed subsidy delivered through Point-of-Sale (PoS) retail biometric terminals.',
    benefits: [
      'Subsidized urea provided at statutory fixed MRP of ₹242 per 45 kg bag (govt absorbs remaining ₹2,000+ cost)',
      'Subsidized DAP (Di-Ammonium Phosphate) @ ₹1,350 per bag with nutrient-based subsidy (NBS)',
      'Seed subsidy up to 50% on certified certified varieties at local primary cooperative societies'
    ],
    eligibility: [
      'All farmers purchasing agriculture inputs at licensed cooperative or retail fertilizer dealers',
      'Requires biometric Aadhaar authentication on PoS machine at time of purchase'
    ],
    requiredDocuments: [
      'Aadhaar Card for Biometric Verification',
      'Kisan Credit Card or Land Passbook (for seed subsidy allocation)'
    ],
    officialWebsite: 'https://urvarak.nic.in',
    applicationProcess:
      'Instant verification at local licensed fertilizer retailer via biometric thumb scan on e-PoS device.',
    deadline: 'Daily Operational',
    status: 'Active Enrollment',
    isPopular: true,
    bookmarkCount: 1650,
    eligibilityRules: {
      targetStates: ['All'],
      minLandHolding: 0,
      maxLandHolding: 9999,
      targetIrrigationTypes: ['All'],
      targetSoilTypes: ['All']
    }
  }
];
