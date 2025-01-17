<script lang="ts">
    import { getDrawerStore } from '@skeletonlabs/skeleton';
    import { enhance } from '$app/forms';

    const drawerStore = getDrawerStore();
    
    const plans = [
        { credits: 1,  pricePerUnit: 130 },
        { credits: 20,  pricePerUnit: 120 },
        { credits: 30,  pricePerUnit: 110 },
        { credits: 50,  pricePerUnit: 100 }
    ];

    let selectedPlan = plans[0];
    let rib = '';

    export let companyRib = "123456789012345678901234"; // Replace with actual company RIB
</script>

<div class="max-w-[80%] p-10 mx-auto">
    <h2 class="h2 mb-4">Acheter des crédits</h2>
    
    <!-- Pricing Plans -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {#each plans as plan}
            <button 
                class="card p-4 text-center {selectedPlan === plan ? 'variant-filled-primary' : 'variant-ghost'}"
                on:click={() => selectedPlan = plan}
            >
                <h3 class="h3">{plan.credits} crédits</h3>
                <p class="text-2xl font-bold">{plan.pricePerUnit*plan.credits} MAD</p>
                <p class="text-sm opacity-75">{plan.pricePerUnit} MAD/crédit</p>
            </button>
        {/each}
    </div>

    <!-- Purchase Form -->
    <form method="POST" action="?/purchase" use:enhance>
        <input type="hidden" name="quantity" value={selectedPlan.credits}>
        <input type="hidden" name="pricePerUnit" value={selectedPlan.pricePerUnit}>
        
        <label class="label mb-4">
            <span>Votre RIB</span>
            <input
                class="input"
                type="text"
                name="rib"
                bind:value={rib}
                placeholder="Entrez votre RIB"
                required
            />
        </label>

        <!-- Payment Instructions -->
        <div class="card variant-ghost p-4 mb-4">
            <h3 class="h3 mb-2">Instructions de paiement</h3>
            <p class="mb-2">Pour finaliser votre achat, veuillez effectuer un virement bancaire avec les informations suivantes:</p>
            <ul class="list">
                <li>Montant: {selectedPlan.credits*selectedPlan.pricePerUnit} MAD</li>
                <li>RIB: {companyRib}</li>
                <li>Motif: CREDITS-{selectedPlan.credits}</li>
            </ul>
            <p class="mt-2 text-sm opacity-75">
                Votre compte sera crédité dès que nous aurons vérifié votre paiement (délai habituel: 24-48h ouvrées)
            </p>
        </div>

        <div class="flex justify-end gap-4">
            <button type="button" class="btn variant-ghost" on:click={() => drawerStore.close()}>Annuler</button>
            <button type="submit" class="btn variant-filled-primary">Commander</button>
        </div>
    </form>
</div>
