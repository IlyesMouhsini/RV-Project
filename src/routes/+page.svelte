<script lang="ts">
  import { depositStore } from '$lib/stores/depositStore';
  import StepProgressBar from '$lib/components/StepProgressBar.svelte';
  import Step1ItemDetails from '$lib/components/Step1ItemDetails.svelte';
  import Step2Estimation from '$lib/components/Step2Estimation.svelte';
  import Step3Contact from '$lib/components/Step3Contact.svelte';
  import ConfirmationModal from '$lib/components/ConfirmationModal.svelte';

  let isSubmitted = $state(false);

  const handleNext = () => {
    depositStore.update((s) => ({ ...s, step: Math.min(s.step + 1, 3) }));
  };

  const handleBack = () => {
    depositStore.update((s) => ({ ...s, step: Math.max(s.step - 1, 1) }));
  };

  const handleSuccess = (trackingCode: string) => {
    depositStore.update((s) => ({ ...s, trackingCode }));
    isSubmitted = true;
  };
</script>

<svelte:head>
  <title>ReValue - Estimation & Dépôt Seconde Main</title>
</svelte:head>

<main class="min-h-screen bg-[#FBF9F5] text-stone-900 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-xl mx-auto">
    <header class="text-center mb-8">
      <span class="text-xs uppercase tracking-widest font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
        Simulateur
      </span>
      <h1 class="text-3xl font-serif font-medium mt-3 tracking-tight">ReValue</h1>
      <p class="text-sm text-stone-600 mt-1">Valorisez vos pièces de mode en quelques clics</p>
    </header>

    <div class="bg-white rounded-2xl shadow-sm border border-stone-200/80 p-6 sm:p-8">
      <StepProgressBar currentStep={$depositStore.step} />

      <div class="mt-8">
        {#if $depositStore.step === 1}
          <Step1ItemDetails onnext={handleNext} on:next={handleNext} />
        {:else if $depositStore.step === 2}
          <Step2Estimation onnext={handleNext} onback={handleBack} on:next={handleNext} on:back={handleBack} />
        {:else if $depositStore.step === 3}
          <Step3Contact onback={handleBack} onsuccess={handleSuccess} on:back={handleBack} on:success={(e) => handleSuccess(e.detail)} />
        {/if}
      </div>
    </div>
  </div>

  {#if isSubmitted}
    <ConfirmationModal data={$depositStore} />
  {/if}
</main>