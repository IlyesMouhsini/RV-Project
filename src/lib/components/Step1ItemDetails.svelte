<script lang="ts">
  import { depositStore } from '$lib/stores/depositStore';
  import { POPULAR_BRANDS } from '$lib/data/brands';
  import type { Category, Condition } from '$lib/types';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher<{ next: void }>();

  let brandQuery = $depositStore.brand;
  let isBrandDropdownOpen = false;
  let formError = '';

  const categories: { id: Category; label: string; icon: string }[] = [
    { id: 'vetement', label: 'Vêtement', icon: '👗' },
    { id: 'maroquinerie', label: 'Sacs & Maroquin.', icon: '👜' },
    { id: 'chaussures', label: 'Chaussures', icon: '👠' },
    { id: 'accessoire', label: 'Accessoires', icon: '🧣' }
  ];

  const conditions: { id: Condition; label: string; desc: string; badge: string }[] = [
    {
      id: 'neuf',
      label: 'Neuf avec étiquette',
      desc: 'Jamais porté, étiquette d’origine intacte',
      badge: 'Gain max'
    },
    {
      id: 'tres_bon_etat',
      label: 'Très bon état',
      desc: 'Porté très peu de fois, aucun défaut visible',
      badge: 'Idéal'
    },
    {
      id: 'bon_etat',
      label: 'Bon état',
      desc: 'Signes d’usure mineurs, pièce propre et fonctionnelle',
      badge: 'Standard'
    }
  ];

  $: filteredBrands = brandQuery.trim()
    ? POPULAR_BRANDS.filter((b) =>
        b.name.toLowerCase().includes(brandQuery.toLowerCase())
      )
    : POPULAR_BRANDS.slice(0, 6);

  const selectBrand = (brandName: string) => {
    brandQuery = brandName;
    depositStore.update((s) => ({ ...s, brand: brandName }));
    isBrandDropdownOpen = false;
    formError = '';
  };

  const handlePhotoUpload = (e: Event) => {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        depositStore.update((s) => ({ ...s, photoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateAndProceed = () => {
    if (!brandQuery.trim()) {
      formError = 'Veuillez sélectionner ou renseigner une marque.';
      return;
    }
    depositStore.update((s) => ({ ...s, brand: brandQuery.trim() }));
    dispatch('next');
  };
</script>

<div class="space-y-6">
  <!-- Catégorie -->
  <div>
    <span class="block text-xs uppercase tracking-wider font-semibold text-stone-500 mb-2.5">
      1. Catégorie de pièce
    </span>
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
      {#each categories as cat}
        <button
          type="button"
          on:click={() => depositStore.update((s) => ({ ...s, category: cat.id }))}
          class="flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all duration-150
          {$depositStore.category === cat.id
            ? 'border-stone-900 bg-stone-900 text-white shadow-sm'
            : 'border-stone-200 bg-stone-50/50 hover:bg-stone-100 text-stone-700'}"
        >
          <span class="text-xl mb-1">{cat.icon}</span>
          <span class="text-xs font-medium">{cat.label}</span>
        </button>
      {/each}
    </div>
  </div>

  <!-- Marque avec autocomplétion -->
  <div class="relative">
    <label for="brand-input" class="block text-xs uppercase tracking-wider font-semibold text-stone-500 mb-2">
      2. Marque
    </label>
    <div class="relative">
      <input
        id="brand-input"
        type="text"
        placeholder="Ex : Sézane, Sandro, Ba&sh..."
        autocomplete="off"
        bind:value={brandQuery}
        on:focus={() => (isBrandDropdownOpen = true)}
        on:input={() => {
          isBrandDropdownOpen = true;
          depositStore.update((s) => ({ ...s, brand: brandQuery }));
        }}
        class="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 text-sm transition"
      />
      {#if brandQuery}
        <button
          type="button"
          on:click={() => {
            brandQuery = '';
            depositStore.update((s) => ({ ...s, brand: '' }));
          }}
          class="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600 text-sm"
        >
          ✕
        </button>
      {/if}
    </div>

    <!-- Dropdown suggestions -->
    {#if isBrandDropdownOpen && filteredBrands.length > 0}
      <ul
        class="absolute z-20 w-full mt-1.5 bg-white border border-stone-200 rounded-xl shadow-lg max-h-52 overflow-y-auto divide-y divide-stone-100 text-sm"
      >
        {#each filteredBrands as brand}
          <li>
            <button
              type="button"
              on:click={() => selectBrand(brand.name)}
              class="w-full text-left px-4 py-2.5 hover:bg-stone-50 flex items-center justify-between transition-colors"
            >
              <span class="font-medium text-stone-800">{brand.name}</span>
              <span class="text-[10px] uppercase tracking-wider text-stone-400 bg-stone-100 px-2 py-0.5 rounded-md">
                {brand.tier}
              </span>
            </button>
          </li>
        {/each}
      </ul>
    {/if}

    <!-- Raccourcis marques populaires -->
    <div class="mt-2.5 flex flex-wrap gap-1.5 items-center">
      <span class="text-[11px] text-stone-400">Populaires :</span>
      {#each POPULAR_BRANDS.slice(0, 5) as brand}
        <button
          type="button"
          on:click={() => selectBrand(brand.name)}
          class="text-xs px-2 py-1 rounded-lg border border-stone-200 bg-white hover:border-stone-400 text-stone-600 transition"
        >
          {brand.name}
        </button>
      {/each}
    </div>
  </div>

  <!-- État de la pièce -->
  <div>
    <span class="block text-xs uppercase tracking-wider font-semibold text-stone-500 mb-2.5">
      3. État général
    </span>
    <div class="space-y-2">
      {#each conditions as cond}
        <label
          class="flex items-start justify-between p-3.5 rounded-xl border cursor-pointer transition-all duration-150
          {$depositStore.condition === cond.id
            ? 'border-stone-900 bg-stone-50/70 ring-1 ring-stone-900'
            : 'border-stone-200 hover:border-stone-300 bg-white'}"
        >
          <div class="flex items-start gap-3">
            <input
              type="radio"
              name="condition"
              value={cond.id}
              checked={$depositStore.condition === cond.id}
              on:change={() => depositStore.update((s) => ({ ...s, condition: cond.id }))}
              class="mt-1 accent-stone-900"
            />
            <div>
              <p class="text-sm font-medium text-stone-900 leading-snug">{cond.label}</p>
              <p class="text-xs text-stone-500 mt-0.5">{cond.desc}</p>
            </div>
          </div>
          <span class="text-[10px] font-semibold text-stone-600 bg-stone-200/60 px-2 py-0.5 rounded-md">
            {cond.badge}
          </span>
        </label>
      {/each}
    </div>
  </div>

  <!-- Photo & détails optionnels -->
  <div class="pt-2 border-t border-stone-100">
    <div class="flex items-center justify-between mb-2">
      <label for="details" class="block text-xs uppercase tracking-wider font-semibold text-stone-500 mb-2">
        4. Détails complémentaires <span class="lowercase text-stone-400 font-normal">(optionnel)</span>
      </label>
    </div>

    <input
      id="details"
      type="text"
      placeholder="Modèle exact, taille, matière (ex: Veste Will, Taille 38, Coton bio)"
      bind:value={$depositStore.description}
      class="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-stone-900 transition mb-3"
    />

    <div class="flex items-center gap-3">
      <label class="cursor-pointer inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-stone-300 hover:border-stone-400 bg-stone-50 text-xs font-medium text-stone-600 transition">
        <span>📷</span>
        <span>{$depositStore.photoUrl ? 'Changer la photo' : 'Ajouter une photo'}</span>
        <input type="file" accept="image/*" on:change={handlePhotoUpload} class="hidden" />
      </label>
      {#if $depositStore.photoUrl}
        <img
          src={$depositStore.photoUrl}
          alt="Aperçu article"
          class="w-10 h-10 object-cover rounded-lg border border-stone-200"
        />
      {/if}
    </div>
  </div>

  {#if formError}
    <p class="text-xs text-rose-600 font-medium bg-rose-50 border border-rose-200 px-3 py-2 rounded-lg">
      {formError}
    </p>
  {/if}

  <!-- Bouton Suivant -->
  <button
    type="button"
    on:click={validateAndProceed}
    class="w-full py-3.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-medium text-sm transition shadow-sm flex items-center justify-center gap-2"
  >
    <span>Calculer l'estimation</span>
    <span>→</span>
  </button>
</div>