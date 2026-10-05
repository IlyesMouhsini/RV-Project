export interface BrandData {
  name: string;
  tier: 'luxury' | 'premium' | 'contemporary' | 'mainstream';
  basePriceMultiplier: number;
}

export const POPULAR_BRANDS: BrandData[] = [
  { name: 'Sézane', tier: 'premium', basePriceMultiplier: 1.15 },
  { name: 'Sandro', tier: 'premium', basePriceMultiplier: 1.1 },
  { name: 'Maje', tier: 'premium', basePriceMultiplier: 1.1 },
  { name: 'Ba&sh', tier: 'premium', basePriceMultiplier: 1.1 },
  { name: 'Claudie Pierlot', tier: 'premium', basePriceMultiplier: 1.05 },
  { name: 'Zadig & Voltaire', tier: 'premium', basePriceMultiplier: 1.15 },
  { name: 'The Kooples', tier: 'premium', basePriceMultiplier: 1.0 },
  { name: 'Isabel Marant', tier: 'luxury', basePriceMultiplier: 1.35 },
  { name: 'Rouje', tier: 'contemporary', basePriceMultiplier: 1.05 },
  { name: 'Jacquemus', tier: 'luxury', basePriceMultiplier: 1.4 },
  { name: 'Balzac Paris', tier: 'contemporary', basePriceMultiplier: 1.0 },
  { name: 'Soeur', tier: 'contemporary', basePriceMultiplier: 1.05 },
  { name: 'Massimo Dutti', tier: 'mainstream', basePriceMultiplier: 0.85 },
  { name: 'Cos', tier: 'mainstream', basePriceMultiplier: 0.85 },
  { name: '& Other Stories', tier: 'mainstream', basePriceMultiplier: 0.8 },
  { name: 'Zara', tier: 'mainstream', basePriceMultiplier: 0.65 }
];