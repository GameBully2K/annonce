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

<!-- Wrapper with fixed height and scrolling -->
<div class="drawer-container w-full h-[90vh] overflow-y-auto">
    <div class="w-full p-4 sm:p-6 mx-auto max-w-[80%]">
        <h2 class="h2 text-xl sm:text-2xl md:text-3xl mb-6 sticky top-0 bg-surface-100-800-token z-10 py-2">
            Acheter des crédits
        </h2>
        
        <!-- Pricing Plans -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {#each plans as plan}
                <button 
                    class="card p-4 text-center transition-all duration-300 {selectedPlan === plan ? 'variant-filled-primary shadow-lg' : 'variant-ghost hover:variant-soft-primary'}"
                    on:click={() => selectedPlan = plan}
                >
                    <h3 class="h3 mb-2">{plan.credits} crédits</h3>
                    <p class="text-2xl font-bold mb-1">{plan.pricePerUnit*plan.credits} MAD</p>
                    <p class="text-sm opacity-75">{plan.pricePerUnit} MAD/crédit</p>
                </button>
            {/each}
        </div>

        <!-- Purchase Form -->
        <form method="POST" action="?/purchase" use:enhance class="space-y-6">
            <input type="hidden" name="quantity" value={selectedPlan.credits}>
            <input type="hidden" name="pricePerUnit" value={selectedPlan.pricePerUnit}>
            
            <div class="form-group">
                <label class="label">
                    <span>Votre RIB</span>
                    <input
                        class="input"
                        type="text"
                        name="rib"
                        bind:value={rib}
                        placeholder="Entrez votre RIB"
                        maxlength="24"
                        minlength="24"
                        title="Le RIB doit contenir 24 chiffres"
                        required
                    />
                </label>
                <span class="text-sm opacity-75 mt-1">Format: 24 chiffres sans espaces</span>
            </div>

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

            <!-- Fixed bottom buttons -->
            <div class="sticky bottom-0 bg-surface-100-800-token py-4 flex flex-col sm:flex-row justify-end gap-2 sm:gap-4">
                <button type="button" class="btn variant-ghost" on:click={() => drawerStore.close()}>
                    Annuler
                </button>
                <button type="submit" class="btn variant-filled-primary">
                    Commander
                </button>
            </div>
        </form>
    </div>
</div>

<style>
    .drawer-container {
        /* Smoother scrolling for iOS */
        -webkit-overflow-scrolling: touch;
    }
    
    /* Hide scrollbar for Chrome, Safari and Opera */
    .drawer-container::-webkit-scrollbar {
        display: none;
    }
    
    /* Hide scrollbar for IE, Edge and Firefox */
    .drawer-container {
        -ms-overflow-scrolling: touch;
        scrollbar-width: none;
    }
</style>
