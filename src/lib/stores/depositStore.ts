import { writable } from 'svelte/store';
import type { DepositForm } from '$lib/types';

export const initialDepositState: DepositForm = {
  step: 1,
  category: 'vetement',
  brand: '',
  condition: 'tres_bon_etat',
  photoUrl: '',
  description: '',
  estimatedPriceMin: 0,
  estimatedPriceMax: 0,
  sellerGainMin: 0,
  sellerGainMax: 0,
  firstName: '',
  lastName: '',
  email: '',
  city: '',
  trackingCode: ''
};

export const depositStore = writable<DepositForm>(initialDepositState);

export const resetStore = () => depositStore.set({ ...initialDepositState });