<!-- CreditCard.svelte -->
<script lang="ts">
    import { getDrawerStore } from '@skeletonlabs/skeleton';
    import type { DrawerSettings } from '@skeletonlabs/skeleton';

    interface purchaseTransaction {
        id: string;
        userId: string;
        creditTransactionId: string;
        quantity: number;
        pricePerCredit?: number;
        totalAmount?: number;
        status: 'pending' | 'verified' | 'rejected';
        paymentMethod?: 'bank_transfer' | 'card';
        accountNumber?: string;
        createdAt: number;
        updatedAt: number;
    }

    const drawerStore = getDrawerStore();
    const settings: DrawerSettings = {
        id: 'purchase',
        position: 'bottom',
        width: 'w-full md:w-full',
        height: 'h-7/8',
        padding: 'p-4',
    };
    export let credits: number = 0;
    export let pendingPurchase: purchaseTransaction;


</script>

<div class="card flex flex-col justify-evenly p-4 variant-glass-surface">
    <div class="flex justify-between items-center">
        <div>
            <h3 class="h3">Mes Crédits</h3>
            <p class="text-sm opacity-75">Crédits disponibles</p>
        </div>
        <div class="text-right">
            <span class="text-4xl font-bold">{credits}</span>
            <p class="text-sm opacity-75">crédits</p>
        </div>
    </div>
    <div class="mt-4">
        {#if pendingPurchase}
            <div class="card variant-ghost p-4">
                <div class="flex flex-col gap-2">
                    <div class="flex justify-between items-center">
                        <span class="font-semibold">Achat en attente</span>
                        <div class="flex gap-2">
                            <span class="badge variant-filled-success">{pendingPurchase.quantity} {pendingPurchase.quantity>1?"Credits":"Credit"}</span>
                            <span class="badge variant-filled-warning">En attente</span>
                        </div>
                    </div>
                    <div class="text-sm">
                        <div class="flex justify-between">
                            <span>Montant:</span>
                            <span class="font-semibold">{pendingPurchase.totalAmount} MAD</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Date:</span>
                            <span>{new Date(pendingPurchase.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <p class="text-sm opacity-75 mt-2">
                        Votre achat est en cours de validation. Une fois le paiement vérifié, vos crédits seront ajoutés à votre compte.
                    </p>
                </div>
            </div>
        {:else}
            <a href="/" class="btn variant-filled-primary w-full" on:click|preventDefault={()=>drawerStore.open(settings)}>Acheter des crédits</a>
        {/if}
    </div>
</div>
