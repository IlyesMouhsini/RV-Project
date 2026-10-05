<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { depositStore } from '$lib/stores/depositStore';
  import { PUBLIC_MAKE_WEBHOOK_URL } from '$env/static/public';

  const dispatch = createEventDispatcher<{
    back: void;
    success: string;
  }>();

  let acceptedTerms = false;
  let isSubmitting = false;
  let errorMessage = '';

  const generateTrackingCode = (): string => {
    const randomHex = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `JAI-${randomHex}`;
  };

  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async () => {
    errorMessage = '';

    // Validations locales
    if (!$depositStore.firstName.trim() \vert{}\vert{} !$depositStore.lastName.trim()) {
      errorMessage = 'Veuillez renseigner votre nom et prénom.';
      return;
    }

    if (!isValidEmail($depositStore.email)) {
      errorMessage = 'Veuillez saisir une adresse email valide.';
      return;
    }

    if (!$depositStore.city.trim()) {
      errorMessage = 'Veuillez préciser votre ville de résidence.';
      return;
    }

    if (!acceptedTerms) {
      errorMessage = 'Veuillez accepter les conditions générales de dépôt.';
      return;
    }

    isSubmitting = true;
    const trackingCode = generateTrackingCode();

    const payload = {
      trackingCode,
      createdAt: new Date().toISOString(),
      item: {
        category: $depositStore.category,
        brand: $depositStore.brand,
        condition: $depositStore.condition,
        description: $depositStore.description || 'Non renseigné',
        photoUrl: $depositStore.photoUrl || ''
      },
      pricing: {
        estimatedPriceMin: $depositStore.estimatedPriceMin,
        estimatedPriceMax: $depositStore.estimatedPriceMax,
        sellerGainMin: $depositStore.sellerGainMin,
        sellerGainMax: $depositStore.sellerGainMax
      },
      seller: {
        firstName: $depositStore.firstName.trim(),
        lastName: $depositStore.lastName.trim(),
        email: $depositStore.email.trim().toLowerCase(),
        city: $depositStore.city.trim()
      }
    };

    try {
      if (PUBLIC_MAKE_WEBHOOK_URL && !PUBLIC_MAKE_WEBHOOK_URL.includes('TON_ID')) {
        const response = await fetch(PUBLIC_MAKE_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
      } else {
        // Simulation locale si le webhook n'est pas encore branché
        console.warn('Webhook Make non configuré. Mode simulation actif.', payload);
        await new Promise((resolve) => setTimeout(resolve, 800));
      }

      dispatch('success', trackingCode);
    } catch (err) {
      console.error('Erreur lors de l’envoi au webhook :', err);
      errorMessage = "Une erreur est survenue lors de l'enregistrement. Veuillez réessayer.";
    } finally {
      isSubmitting = false;
    }
  };
</script>

<div class="space-y-6">
  <div>
    <h3 class="text-sm font-semibold uppercase tracking-wider text-stone-900 mb-1">
      Finalisation de votre dépôt
    </h3>
    <p class="text-xs text-stone-500">
      Renseignez vos coordonnées pour recevoir votre étiquette d'envoi préaffranchie.
    </p>
  </div>

  <div class="space-y-4">
    <!-- Prénom & Nom -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div>
        <label for="firstName" class="block text-xs font-semibold text-stone-600 mb-1">Prénom</label>
        <input
          id="firstName"
          type="text"
          placeholder="Ex: Camille"
          bind:value={$depositStore.firstName}
          class="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-stone-900 transition"
        />
      </div>
      <div>
        <label for="lastName" class="block text-xs font-semibold text-stone-600 mb-1">Nom</label>
        <input
          id="lastName"
          type="text"
          placeholder="Ex: Dupont"
          bind:value={$depositStore.lastName}
          class="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-stone-900 transition"
        />
      </div>
    </div>

    <!-- Email -->
    <div>
      <label for="email" class="block text-xs font-semibold text-stone-600 mb-1">Email</label>
      <input
        id="email"
        type="email"
        placeholder="camille.dupont@email.com"
        bind:value={$depositStore.email}
        class="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-stone-900 transition"
      />
    </div>

    <!-- Ville -->
    <div>
      <label for="city" class="block text-xs font-semibold text-stone-600 mb-1">Ville</label>
      <input
        id="city"
        type="text"
        placeholder="Ex: Paris, Lyon, Bordeaux..."
        bind:value={$depositStore.city}
        class="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-stone-900 transition"
      />
    </div>

    <!-- Acceptation CGU -->
    <div class="pt-2">
      <label class="flex items-start gap-2.5 cursor-pointer">
        <input
          type="checkbox"
          bind:checked={acceptedTerms}
          class="mt-1 rounded border-stone-300 text-stone-900 focus:ring-0 accent-stone-900"
        />
        <span class="text-xs text-stone-600 leading-snug">
          J'accepte les conditions de dépôt-vente de Jaiio et confirme que la pièce est authentique et conforme à la description.
        </span>
      </label>
    </div>
  </div>

  {#if errorMessage}
    <div class="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
      {errorMessage}
    </div>
  {/if}

  <!-- Actions -->
  <div class="flex items-center gap-3 pt-2">
    <button
      type="button"
      on:click={() => dispatch('back')}
      disabled={isSubmitting}
      class="w-1/3 py-3.5 rounded-xl border border-stone-300 text-stone-700 font-medium text-sm hover:bg-stone-50 transition disabled:opacity-50 text-center"
    >
      Retour
    </button>

    <button
      type="button"
      on:click={handleSubmit}
      disabled={isSubmitting}
      class="w-2/3 py-3.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-medium text-sm transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-75"
    >
      {#if isSubmitting}
        <span class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
        <span>Envoi en cours...</span>
      {:else}
        <span>Confirmer mon dépôt</span>
        <span>✓</span>
      {/if}
    </button>
  </div>
</div>