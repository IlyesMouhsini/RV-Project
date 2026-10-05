export type Category = 'vetement' | 'maroquinerie' | 'chaussures' | 'accessoire';
export type Condition = 'neuf' | 'tres_bon_etat' | 'bon_etat';

export interface DepositForm {
  step: number;
  category: Category;
  brand: string;
  condition: Condition;
  photoUrl: string;
  description: string;
  estimatedPriceMin: number;
  estimatedPriceMax: number;
  sellerGainMin: number;
  sellerGainMax: number;
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  trackingCode: string;
}