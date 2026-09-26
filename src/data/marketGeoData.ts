import { CompetitorData } from '../types/business';

export interface LocationGeoCenter {
  name: string;
  state: string;
  district: string;
  gramPanchayat: string;
  lat: number;
  lng: number;
  population: number;
  households: number;
  avgMonthlyIncome: number;
  dairyDemandLitersDay: number;
}

export const DEMO_LOCATION_GEO: LocationGeoCenter = {
  name: 'Penukonda Gram Panchayat',
  state: 'Andhra Pradesh',
  district: 'Sri Sathya Sai (Anantapur region)',
  gramPanchayat: 'Penukonda GP',
  lat: 14.0833,
  lng: 77.5936,
  population: 14250,
  households: 2980,
  avgMonthlyIncome: 18500,
  dairyDemandLitersDay: 3200
};

export const DEMO_COMPETITORS: CompetitorData[] = [
  {
    id: 'comp_1',
    name: 'Sri Krishna Milk Center',
    category: 'Dairy Producer',
    distanceKm: 2.1,
    estimatedVolume: '250 L/day',
    priceLevel: 'Budget',
    coordinates: [14.092, 77.601],
    address: 'Near Old Bus Stand, Main Road',
    keyGaps: 'No refrigerated storage; irregular evening milk supply; cash-only.'
  },
  {
    id: 'comp_2',
    name: 'Heritage Milk Collection Point',
    category: 'Corporate Dairy Franchise',
    distanceKm: 4.8,
    estimatedVolume: '800 L/day',
    priceLevel: 'Competitive',
    coordinates: [14.071, 77.582],
    address: 'Mandi Road, Village Outskirts',
    keyGaps: 'Long queue times for small farmers; strict fat testing disputes; no value-added products (curd/paneer).'
  },
  {
    id: 'comp_3',
    name: 'Balaji Sweet & Dairy Stall',
    category: 'Sweet & Ghee Retailer',
    distanceKm: 3.4,
    estimatedVolume: '150 L/day',
    priceLevel: 'Premium',
    coordinates: [14.098, 77.589],
    address: 'Bazaar Street, Near Temple',
    keyGaps: 'Expensive retail pricing; does not buy directly from grassroots producers.'
  },
  {
    id: 'comp_4',
    name: 'Gowthami Farm Fresh Milk',
    category: 'Unorganized Farm Gate',
    distanceKm: 6.2,
    estimatedVolume: '320 L/day',
    priceLevel: 'Budget',
    coordinates: [14.062, 77.615],
    address: 'NH-44 Feeder Road',
    keyGaps: 'Lack of hygienic testing, no home delivery route into the main village.'
  }
];

export const DEMO_LOCAL_HUBS = [
  {
    id: 'hub_1',
    name: 'Penukonda Agricultural Produce Market (Mandi)',
    type: 'Weekly Agricultural Haat',
    distanceKm: 1.8,
    coordinates: [14.086, 77.598],
    description: 'Bustling twice-weekly agricultural market with over 5,000 visiting farmers and traders.'
  },
  {
    id: 'hub_2',
    name: 'District Veterinary Care & Insemination Center',
    type: 'Government Animal Husbandry Service',
    distanceKm: 3.2,
    coordinates: [14.078, 77.588],
    description: 'Subsidized vaccination, artificial insemination, and fodder seed distribution.'
  },
  {
    id: 'hub_3',
    name: 'Gramin Bank / District Cooperative Central Bank',
    type: 'Financial Institution',
    distanceKm: 1.2,
    coordinates: [14.082, 77.591],
    description: 'Local nodal branch for MoSJE scheme routing and credit sanction disbursement.'
  }
];
