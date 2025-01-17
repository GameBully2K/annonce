<script lang="ts">
    export let totalPublications: number = 0;
    export let pendingPublications: number = 0;
    export let totalSpent: number = 0;
    export let draftsCount: number = 0;
</script>

<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
    <div class="card p-4 variant-soft-primary text-center">
        <span class="text-3xl font-bold">{totalPublications}</span>
        <p class="text-sm">Publications totales</p>
    </div>
    <div class="card p-4 variant-soft-warning text-center">
        <span class="text-3xl font-bold">{pendingPublications}</span>
        <p class="text-sm">En attente</p>
    </div>
    <div class="card p-4 variant-soft-secondary text-center">
        <span class="text-3xl font-bold">{draftsCount}</span>
        <p class="text-sm">Brouillons</p>
    </div>
    <div class="card p-4 variant-soft-tertiary text-center">
        <span class="text-3xl font-bold">{totalSpent}</span><span class="text-sm pl-1">MAD</span>
        <p class="text-sm">Dépensé</p>
    </div>
</div>
