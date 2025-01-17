<script lang="ts">
    import { page } from '$app/stores';
    import { enhance } from '$app/forms';
    import type { ActionData } from './$types';
    import { getToastStore } from '@skeletonlabs/skeleton';
    import type { ToastSettings } from '@skeletonlabs/skeleton';
    import PublicationCard from '$components/dashboard/PublicationCard.svelte';
    import { getDrawerStore } from '@skeletonlabs/skeleton';
    
    
    export let form: ActionData;
    const toastStore = getToastStore();

    const drawerStore = getDrawerStore();
    $: if (form?.message.includes("Publication")) {
        drawerStore.close();
    }

    $: if (form?.message) {
        const t: ToastSettings = {
            message: form.message ?? "All Good",
            autohide: true,
            hideDismiss: false,
            background: form?.Success ? 'variant-filled-success' : 'variant-filled-error'
        };
        if (form.message.includes("Reload")) {
            t.action = {
                label: "Reload",
                response: ()=>{location.reload()}
            }
        }
        toastStore.trigger(t);
    }

</script>

<div class="container mx-auto p-4 space-y-8">
    <!-- Welcome Section -->
    <div class="card flex justify-between p-4 variant-glass-surface">
        <h2 class="text-2xl">Welcome, <b>{$page.data.username}</b> </h2>
        <div class="flex gap-2 items-center">
            <p class="opacity-75">Role:</p>
            <p class="badge variant-filled-{$page.data.role == "admin" ? "error" : "warning"}">{$page.data.role}</p>
        </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:{$page.data.role == "admin" ? "grid-cols-4" : "grid-cols-2"} gap-4">
        <div class="card p-4 variant-glass-surface w-">
            <h3 class="h3">Publications Verified</h3>
            <p class="text-4xl font-bold">{$page.data.vPubStat}</p>
        </div>
        <div class="card p-4 variant-glass-surface">
            <h3 class="h3">Purchases Verified</h3>
            <p class="text-4xl font-bold">{$page.data.vPurStat}</p>
        </div>
        {#if $page.data.role == "admin"}
            <div class="card p-4 space-y-2 variant-glass-surface col-span-2">
                <h3 class="h3">Add Agent</h3>
                <form method="POST" action="?/makeAgent" use:enhance class="flex gap-2">
                    <input name="email" placeholder="Email" class="input" type="email" required autocomplete="email">
                    <button class="btn variant-filled-primary w-1/3">Add</button>
                </form>
            </div>
        {/if}

    </div>

    <!-- Tab List -->
    <div class="card variant-glass-surface">
        <!-- Tab Content -->
        <div class="grid {$page.data.role == "admin" ? "grid-cols-3" : "grid-cols-2"} p-4 w-full">
                <div class="space-y-4">
                    <h3 class="h2 w-full text-center">Publications</h3>
                    {#if $page.data.unverifiedPubs.length == 0}
                        <p class="text-center opacity-50">No Publications</p>
                    {/if}
                    {#each $page.data.unverifiedPubs as pub}
                        <PublicationCard 
                            pub={pub}
                            isAdmin={true}
                        />
                    {/each}
                </div>
                <!-- Purchases verification UI here -->
                <div class="space-y-4">
                    <h3 class="h2 w-full text-center">Purchases</h3>
                    {#if $page.data.unverifiedPurshases.length == 0}
                        <p class="text-center opacity-50">No Purchases</p>
                    {/if}
                    {#each $page.data.unverifiedPurshases as purchase}
                        <div class="card p-4 variant-glass-surface">
                            <div class="flex justify-between items-center">
                                <div>
                                    <p class="font-bold">{purchase.quantity} Credits</p>
                                    <p class="text-sm opacity-75">Total: {purchase.totalAmount}DH</p>
                                    <p class="text-xs opacity-50">RIB: {purchase.accountNumber}</p>
                                </div>
                                <div class="flex gap-2">
                                    <form method="POST" action="?/acceptPur" use:enhance>
                                        <input type="hidden" name="id" value={purchase.id}>
                                        <button class="btn variant-filled-success">Accept</button>
                                    </form>
                                    <form method="POST" action="?/rejectPur" use:enhance>
                                        <input type="hidden" name="id" value={purchase.id}>
                                        <button class="btn variant-filled-error">Reject</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    {/each}
                </div>
                {#if $page.data.role == "admin"}
                    <div class="space-y-4">
                        <h3 class="h2 w-full text-center">Agents</h3>
                        {#if $page.data.agents.length > 0}
                            {#each $page.data.agents as user}
                                <div class="card p-4 variant-glass-surface">
                                    <div class="flex justify-between items-center">
                                        <div>
                                            <p class="font-bold">{user.firstName} {user.lastName}</p>
                                            <p class="text-sm opacity-75">{user.username}</p>
                                            <p class="text-xs opacity-50">Role: {user.role}</p>
                                        </div>
                                        <div class="flex gap-2">
                                            <form method="POST" action="?/removeAgent" use:enhance>
                                                <input type="hidden" name="id" value={user.id}>
                                                <button class="btn variant-filled-error">Delete</button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            {/each}
                        {:else}
                            <p class="text-center opacity-50">No Users</p>
                        {/if}
                    </div>
                {/if}
        </div>
    </div>
</div>