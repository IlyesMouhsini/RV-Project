    <script lang="ts">
  export let currentStep = 1;
  const steps = [
    { id: 1, label: 'Article' },
    { id: 2, label: 'Estimation' },
    { id: 3, label: 'Dépôt' }
  ];
</script>

<nav aria-label="Progression du dépôt" class="w-full">
  <ol class="flex items-center justify-between">
    {#each steps as s, i}
      <li class="flex items-center {i !== steps.length - 1 ? 'w-full' : ''}">
        <div class="flex flex-col items-center">
          <div
            class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors duration-200
            {currentStep >= s.id
              ? 'bg-stone-900 text-white'
              : 'bg-stone-100 text-stone-400 border border-stone-200'}"
          >
            {s.id}
          </div>
          <span class="text-[11px] font-medium mt-1.5 {currentStep >= s.id ? 'text-stone-900' : 'text-stone-400'}">
            {s.label}
          </span>
        </div>
        {#if i !== steps.length - 1}
          <div
            class="flex-1 h-[2px] mx-3 mb-4 transition-colors duration-200 {currentStep > s.id
              ? 'bg-stone-900'
              : 'bg-stone-200'}"
          ></div>
        {/if}
      </li>
    {/each}
  </ol>
</nav>