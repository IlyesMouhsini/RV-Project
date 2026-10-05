<script lang="ts">
  import type { DepositForm } from '$lib/types';
  import { resetStore } from '$lib/stores/depositStore';

  export let data: DepositForm;

  const handleRestart = () => {
    resetStore();
    window.location.reload();
  };
</script>

<div class="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
  <div class="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-stone-200 text-center">
    <div class="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
      ✓
    </div>

    <h2 class="text-2xl font-serif font-medium text-stone-900">Dépôt initié avec succès !</h2>
    <p class="text-xs text-stone-500 mt-1">
      Un email récapitulatif a été transmis à <strong class="text-stone-700">{data.email}</strong>.
    </p>

    <!-- Carte de suivi -->
    <div class="my-6 p-4 bg-stone-50 rounded-xl border border-stone-200/80 text-left space-y-2">
      <div class="flex justify-between items-center text-xs">
        <span class="text-stone-500">Numéro de référence :</span>
        <span class="font-mono font-bold text-stone-900 bg-white px-2 py-0.5 rounded border border-stone-200">
          {data.trackingCode}
        </span>
      </div>
      <div class="flex justify-between items-center text-xs">
        <span class="text-stone-500">Article :</span>
        <span class="font-medium text-stone-900 capitalize">{data.brand} ({data.category})</span>
      </div>
      <div class="flex justify-between items-center text-xs">
        <span class="text-stone-500">Gain net estimé :</span>
        <span class="font-bold text-emerald-800">{data.sellerGainMin} € – {data.sellerGainMax} €</span>
      </div>
    </div>

    <div class="text-left bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-100 mb-6">
      <p class="text-xs font-semibold text-emerald-950 mb-1">Prochaines étapes :</p>
      <ol class="text-[11px] text-emerald-800 list-decimal pl-4 space-y-1">
        <li>Téléchargez votre étiquette Colissimo reçue par email.</li>
        <li>Glissez votre pièce dans un colis propre.</li>
        <li>Déposez-le en bureau de poste ou boîte aux lettres normalisée.</li>
      </ol>
    </div>

    <button
      type="button"
      on:click={handleRestart}
      class="w-full py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs transition"
    >
      Estimer un autre article
    </button>
  </div>
</div>