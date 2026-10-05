<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  import { depositStore } from '$lib/stores/depositStore';
  import { computeEstimation } from '$lib/utils/pricingEngine';

  const dispatch = createEventDispatcher<{ next: void; back: void }>();

  let commissionRate = 30;
  let aiInsight = '';

  onMount(() => {
    const result = computeEstimation(
      $depositStore.category,
      $depositStore.brand,
      $depositStore.condition
    );

    commissionRate = result.commissionRate;
    aiInsight = result.aiInsight;

    depositStore.update((s) => ({
      ...s,
      estimatedPriceMin: result.estimatedPriceMin,
      estimatedPriceMax: result.estimatedPriceMax,
      sellerGainMin: result.sellerGainMin,
      sellerGainMax: result.sellerGainMax
    }));
  });
</script>

<div class="space-y-6">
  <!-- Récapitulatif rapide de la pièce sélectionnée -->
  <div class="flex items-center justify-between p-3.5 bg-stone-50 border border-stone-200/80 rounded-xl text-xs">
    <div class="flex items-center gap-2.5">
      {#if $depositStore.photoUrl}
        <img
          src={$depositStore.photoUrl}
          alt="Aperçu"
          class="w-9 h-9 object-cover rounded-lg border border-stone-200"
        />
      {/if}
      <div>
        <p class="font-semibold text-stone-900 capitalize">{$depositStore.brand}</p>
        <p class="text-stone-500 capitalize">
          {$depositStore.category} • {$depositStore.condition.replace(/_/g, ' ')}
        </p>
      </div>
    </div>
    <button
      type="button"
      on:click={() => dispatch('back')}
      class="text-stone-500 hover:text-stone-900 underline font-medium text-[11px]"
    >
      Modifier
    </button>
  </div>

  <!-- Bloc Valorisation Principale (Gain Net Vendeur) -->
  <div class="bg-emerald-950 text-white p-6 rounded-2xl text-center relative overflow-hidden shadow-sm">
    <div class="absolute -right-6 -bottom-6 w-28 h-28 bg-emerald-800/30 rounded-full blur-2xl pointer-events-none"></div>

    <span class="inline-block text-[10px] uppercase tracking-wider font-semibold bg-emerald-800/80 text-emerald-100 px-2.5 py-0.5 rounded-full mb-3">
      Votre gain net estimé
    </span>

    <div class="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-emerald-50">
      {$depositStore.sellerGainMin} € – {$depositStore.sellerGainMax} €
    </div>

    <p class="text-xs text-emerald-200/70 mt-2">
      Montant net viré sur votre compte bancaire dès la vente validée
    </p>

    <div class="mt-4 pt-4 border-t border-emerald-800/60 flex items-center justify-between text-xs text-emerald-100/90">
      <span>Prix de vente conseillé sur le site :</span>
      <span class="font-medium">{$depositStore.estimatedPriceMin} € – {$depositStore.estimatedPriceMax} €</span>
    </div>
  </div>

  <!-- Recommandation Algorithmique / IA -->
  <div class="p-4 bg-amber-50/70 border border-amber-200/80 rounded-xl">
    <div class="flex items-start gap-2.5">
      <span class="text-base leading-none">✨</span>
      <div>
        <h4 class="text-xs font-semibold uppercase tracking-wider text-amber-900 mb-1">
          Analyse du marché en direct
        </h4>
        <p class="text-xs text-amber-800 leading-relaxed">
          {@html aiInsight.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}
        </p>
      </div>
    </div>
  </div>

  <!-- Transparence du service Jaiio -->
  <div class="border border-stone-200 rounded-xl p-4 bg-white space-y-2.5 text-xs text-stone-600">
    <p class="font-semibold text-stone-800">Ce que comprend la prise en charge :</p>
    <ul class="space-y-1.5 pl-1">
      <li class="flex items-center gap-2">
        <span class="text-emerald-700 font-bold">✓</span> Étiquette d'expédition Colissimo offerte
      </li>
      <li class="flex items-center gap-2">
        <span class="text-emerald-700 font-bold">✓</span> Shooting photo en studio professionnel & mise en ligne
      </li>
      <li class="flex items-center gap-2">
        <span class="text-emerald-700 font-bold">✓</span> Frais de commission intégrés (~{commissionRate}%) uniquement au succès
      </li>
    </ul>
  </div>

  <!-- Navigation -->
  <div class="flex items-center gap-3 pt-2">
    <button
      type="button"
      on:click={() => dispatch('back')}
      class="w-1/3 py-3.5 rounded-xl border border-stone-300 text-stone-700 font-medium text-sm hover:bg-stone-50 transition text-center"
    >
      Retour
    </button>
    <button
      type="button"
      on:click={() => dispatch('next')}
      class="w-2/3 py-3.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-medium text-sm transition shadow-sm flex items-center justify-center gap-2"
    >
      <span>Valider et déposer</span>
      <span>→</span>
    </button>
  </div>
</div>