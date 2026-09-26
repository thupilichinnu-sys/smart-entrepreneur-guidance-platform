export interface BusinessCategoryInfo {
  id: string;
  name: string;
  category: string;
  icon: string;
  tagline: string;
  avgMarginNeeded: string;
  demandTrend: 'High' | 'Medium' | 'Rapidly Growing' | 'Emerging';
  typicalScale: string;
  ruralRelevance: string;
}

export const BUSINESS_CATEGORIES: BusinessCategoryInfo[] = [
  {
    id: 'dairy',
    name: 'Dairy & Milk Products',
    category: 'Agriculture & FoodTech',
    icon: 'Milk',
    tagline: 'High daily local consumption, milk cooperative tie-ups, value-added ghee/paneer.',
    avgMarginNeeded: '₹50K - ₹2L',
    demandTrend: 'High',
    typicalScale: '2 to 10 milch cattle with chilling/can unit',
    ruralRelevance: 'Primary income stabilizer across rural India.'
  },
  {
    id: 'food_processing',
    name: 'Food Processing & Flour Mill',
    category: 'FoodTech',
    icon: 'Wheat',
    tagline: 'Milling, pulse de-husking, spice grinding, and local snack manufacturing.',
    avgMarginNeeded: '₹75K - ₹3L',
    demandTrend: 'High',
    typicalScale: 'Mini pulse/spice mill with packaging sealer',
    ruralRelevance: 'Retains agricultural value locally, reducing transport wastage.'
  },
  {
    id: 'poultry',
    name: 'Poultry & Egg Broiler Unit',
    category: 'Livestock & Agriculture',
    icon: 'Egg',
    tagline: 'Quick 45-day cycle return, local hotel demand, contract farming options.',
    avgMarginNeeded: '₹50K - ₹2.5L',
    demandTrend: 'Rapidly Growing',
    typicalScale: '1,000 to 3,000 birds broiler shed',
    ruralRelevance: 'Fast turnaround and high protein demand in village clusters.'
  },
  {
    id: 'goat_farming',
    name: 'Goat Rearing & Breeding',
    category: 'Livestock',
    icon: 'HeartPulse',
    tagline: 'Low initial capital, high resilience, thriving livestock haat demand.',
    avgMarginNeeded: '₹30K - ₹1.5L',
    demandTrend: 'High',
    typicalScale: '10 to 25 female goats + 1 breeding buck',
    ruralRelevance: 'Known as the poor person\'s cow; drought-resilient.'
  },
  {
    id: 'retail_kirana',
    name: 'Modern Rural Kirana & General Store',
    category: 'Retail & Commerce',
    icon: 'Store',
    tagline: 'FMCG essentials, digital payments, direct wholesale procurement.',
    avgMarginNeeded: '₹40K - ₹1.5L',
    demandTrend: 'High',
    typicalScale: '250 sq ft village center shopfront',
    ruralRelevance: 'Steady daily cashflow; anchors village marketplace.'
  },
  {
    id: 'tailoring_textiles',
    name: 'Tailoring & Garment Boutique',
    category: 'Textiles & Crafts',
    icon: 'Scissors',
    tagline: 'Custom stitching, school uniforms, festive wear, women empowerment.',
    avgMarginNeeded: '₹25K - ₹1L',
    demandTrend: 'Medium',
    typicalScale: '2-4 motorized stitching machines with cutting bench',
    ruralRelevance: 'Extremely popular for self-help groups and women artisans.'
  },
  {
    id: 'handicrafts',
    name: 'Rural Handicrafts & Pottery',
    category: 'Art & Heritage',
    icon: 'Palette',
    tagline: 'Traditional terracotta, bamboo weaving, eco-friendly lifestyle decor.',
    avgMarginNeeded: '₹20K - ₹80K',
    demandTrend: 'Medium',
    typicalScale: 'Artisan workshop with kiln/shaping tools',
    ruralRelevance: 'Preserves heritage while tapping urban fair exhibitions.'
  },
  {
    id: 'agro_inputs',
    name: 'Agri Inputs & Fertilizer Depot',
    category: 'Agriculture Supply',
    icon: 'Sprout',
    tagline: 'Certified seeds, bio-fertilizers, micro-nutrients, pest advisory.',
    avgMarginNeeded: '₹80K - ₹3.5L',
    demandTrend: 'High',
    typicalScale: 'Licensed dealership shop with storage godown',
    ruralRelevance: 'Essential seasonal lifeline for surrounding farming community.'
  },
  {
    id: 'vegetable_trading',
    name: 'Cold Storage & Vegetable Aggregation',
    category: 'Agri-Logistics',
    icon: 'Carrot',
    tagline: 'Direct farmgate sourcing, weekly mandi supplies, zero middleman margin.',
    avgMarginNeeded: '₹40K - ₹2L',
    demandTrend: 'High',
    typicalScale: 'Pick-up utility vehicle or 2-ton solar cold room',
    ruralRelevance: 'Prevents distress sales by farmers during harvest glut.'
  },
  {
    id: 'food_stall',
    name: 'Healthy Snacks & Millet Eatery',
    category: 'Food Services',
    icon: 'Coffee',
    tagline: 'Millet dosas, tiffin center near bus stands and primary health centers.',
    avgMarginNeeded: '₹25K - ₹90K',
    demandTrend: 'Rapidly Growing',
    typicalScale: 'Clean mobile food cart or permanent highway counter',
    ruralRelevance: 'High volume cash sales with rising health awareness.'
  },
  {
    id: 'transport_services',
    name: 'Rural Cargo & Passenger E-Rickshaw',
    category: 'Mobility & Logistics',
    icon: 'Truck',
    tagline: 'First/last mile village connectivity to railway junctions and mandis.',
    avgMarginNeeded: '₹40K - ₹1.8L',
    demandTrend: 'High',
    typicalScale: 'Electric 3-wheeler cargo or passenger vehicle',
    ruralRelevance: 'Green energy transition with very low running costs.'
  },
  {
    id: 'repair_services',
    name: 'Agri Equipment & Solar Pump Repair',
    category: 'Technical Services',
    icon: 'Wrench',
    tagline: 'Tractor maintenance, motor rewinding, submersible pump servicing.',
    avgMarginNeeded: '₹35K - ₹1.2L',
    demandTrend: 'High',
    typicalScale: 'Equipped service garage with diagnostic toolkit',
    ruralRelevance: 'High repeat business; reduces farmer machine downtime.'
  },
  {
    id: 'digital_services',
    name: 'Common Service Center (CSC) & Cyber Kiosk',
    category: 'Digital Services',
    icon: 'Laptop',
    tagline: 'DBT schemes, Aadhaar banking, document printing, student exam forms.',
    avgMarginNeeded: '₹30K - ₹1.1L',
    demandTrend: 'High',
    typicalScale: 'Computer, scanner, solar backup, fingerprint reader',
    ruralRelevance: 'Critical governance delivery point for illiterate/elderly citizens.'
  },
  {
    id: 'rural_tourism',
    name: 'Agro-Tourism & Village Homestay',
    category: 'Hospitality',
    icon: 'Compass',
    tagline: 'Farm visits, organic dining, traditional village living experience.',
    avgMarginNeeded: '₹1L - ₹4L',
    demandTrend: 'Emerging',
    typicalScale: '2-3 guest rooms within organic fruit orchard',
    ruralRelevance: 'High margin weekend retreat for urban families.'
  }
];
