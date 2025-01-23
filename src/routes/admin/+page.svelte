<script lang="ts">
    import { page } from '$app/stores';
    import { enhance } from '$app/forms';
    import type { ActionData } from './$types';
    import { getToastStore } from '@skeletonlabs/skeleton';
    import type { ToastSettings } from '@skeletonlabs/skeleton';
    import PublicationCard from '$components/dashboard/PublicationCard.svelte';
    import { getDrawerStore } from '@skeletonlabs/skeleton';
    import { Tab, TabGroup } from '@skeletonlabs/skeleton';
    
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

    let tabSet = 0;
</script>

<div class="container mx-auto p-4 space-y-8">
    <!-- Welcome Section -->
    <div class="card flex justify-between p-4 variant-glass-surface">
        <h2 class="text-2xl">Bienvenue, <b>{$page.data.username}</b> </h2>
        <div class="flex gap-2 items-center">
            <p class="opacity-75">Rôle:</p>
            <p class="badge variant-filled-{$page.data.role == "admin" ? "error" : "warning"}">{$page.data.role}</p>
            <button class="btn-icon variant-soft-primary hover:variant-filled-secondary " on:click={() => location.reload()}>
                <svg class="w-4 h-4" viewBox="0 0 438.529 438.528" fill="white">
                    <path d="M433.109,23.694c-3.614-3.612-7.898-5.424-12.848-5.424c-4.948,0-9.226,1.812-12.847,5.424l-37.113,36.835 c-20.365-19.226-43.684-34.123-69.948-44.684C274.091,5.283,247.056,0.003,219.266,0.003c-52.344,0-98.022,15.843-137.042,47.536 C43.203,79.228,17.509,120.574,5.137,171.587v1.997c0,2.474,0.903,4.617,2.712,6.423c1.809,1.809,3.949,2.712,6.423,2.712h56.814 c4.189,0,7.042-2.19,8.566-6.565c7.993-19.032,13.035-30.166,15.131-33.403c13.322-21.698,31.023-38.734,53.103-51.106 c22.082-12.371,45.873-18.559,71.376-18.559c38.261,0,71.473,13.039,99.645,39.115l-39.406,39.397 c-3.607,3.617-5.421,7.902-5.421,12.851c0,4.948,1.813,9.231,5.421,12.847c3.621,3.617,7.905,5.424,12.854,5.424h127.906 c4.949,0,9.233-1.807,12.848-5.424c3.613-3.616,5.42-7.898,5.42-12.847V36.542C438.529,31.593,436.733,27.312,433.109,23.694z"/>
                    <path d="M422.253,255.813h-54.816c-4.188,0-7.043,2.187-8.562,6.566c-7.99,19.034-13.038,30.163-15.129,33.4 c-13.326,21.693-31.028,38.735-53.102,51.106c-22.083,12.375-45.874,18.556-71.378,18.556c-18.461,0-36.259-3.423-53.387-10.273 c-17.13-6.858-32.454-16.567-45.966-29.13l39.115-39.112c3.615-3.613,5.424-7.901,5.424-12.847c0-4.948-1.809-9.236-5.424-12.847 c-3.617-3.62-7.898-5.431-12.847-5.431H18.274c-4.952,0-9.235,1.811-12.851,5.431C1.807,264.844,0,269.132,0,274.08v127.907 c0,4.945,1.807,9.232,5.424,12.847c3.619,3.61,7.902,5.428,12.851,5.428c4.948,0,9.229-1.817,12.847-5.428l36.829-36.833 c20.367,19.41,43.542,34.355,69.523,44.823c25.981,10.472,52.866,15.701,80.653,15.701c52.155,0,97.643-15.845,136.471-47.534 c38.828-31.688,64.333-73.042,76.52-124.05c0.191-0.38,0.281-1.047,0.281-1.995c0-2.478-0.907-4.612-2.715-6.427 C426.874,256.72,424.731,255.813,422.253,255.813z"/>
                </svg>
            </button>
            </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:{$page.data.role == "admin" ? "grid-cols-4" : "grid-cols-2"} gap-4">
        <div class="card p-4 variant-glass-surface w-">
            <h3 class="h3">Publications Vérifiées</h3>
            <p class="text-4xl font-bold">{$page.data.vPubStat}</p>
        </div>
        <div class="card p-4 variant-glass-surface">
            <h3 class="h3">Achats Vérifiés</h3>
            <p class="text-4xl font-bold">{$page.data.vPurStat}</p>
        </div>
        {#if $page.data.role == "admin"}
            <div class="card p-4 space-y-2 variant-glass-surface col-span-2">
                <h3 class="h3">Ajouter un Agent</h3>
                <form method="POST" action="?/makeAgent" use:enhance class="flex gap-2">
                    <input name="email" placeholder="Email" class="input" type="email" required autocomplete="email">
                    <button class="btn variant-filled-primary w-1/3">Ajouter</button>
                </form>
            </div>
        {/if}

    </div>

    <!-- Tab List -->
    <div class="card variant-glass-surface">
        <!-- Mobile Tabs -->
        <div class="md:hidden">
            <TabGroup>
                <Tab bind:group={tabSet} name="tab1" value={0}>Publications</Tab>
                <Tab bind:group={tabSet} name="tab2" value={1}>Achats</Tab>
                {#if $page.data.role == "admin"}
                    <Tab bind:group={tabSet} name="tab3" value={2}>Agents</Tab>
                {/if}
                
                <!-- Tab Panels -->
                <svelte:fragment slot="panel">
                    {#if tabSet === 0}
                        <div class="space-y-4 p-4">
                            <h3 class="h2 w-full text-center">Publications</h3>
                            {#if $page.data.unverifiedPubs.length == 0}
                                <p class="text-center opacity-50">Aucune Publication</p>
                            {/if}
                            {#each $page.data.unverifiedPubs as pub}
                                <PublicationCard 
                                    pub={pub}
                                    isAdmin={true}
                                />
                            {/each}
                        </div>
                    {:else if tabSet === 1}
                        <div class="space-y-4 p-4">
                            <h3 class="h2 w-full text-center">Achats</h3>
                            {#if $page.data.unverifiedPurshases.length == 0}
                                <p class="text-center opacity-50">Aucun Achat</p>
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
                                                <button class="btn variant-filled-success">Accepter</button>
                                            </form>
                                            <form method="POST" action="?/rejectPur" use:enhance>
                                                <input type="hidden" name="id" value={purchase.id}>
                                                <button class="btn variant-filled-error">Refuser</button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            {/each}
                        </div>
                    {:else if tabSet === 2 && $page.data.role == "admin"}
                        <div class="space-y-4 p-4">
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
                                <p class="text-center opacity-50">Aucun Utilisateur</p>
                            {/if}
                        </div>
                    {/if}
                </svelte:fragment>
            </TabGroup>
        </div>

        <!-- Desktop Grid -->
        <div class="hidden md:grid {$page.data.role == "admin" ? "grid-cols-3" : "grid-cols-2"} p-4 w-full">
            <div class="space-y-4">
                <h3 class="h2 w-full text-center">Publications</h3>
                {#if $page.data.unverifiedPubs.length == 0}
                    <p class="text-center opacity-50">Aucune Publication</p>
                {/if}
                {#each $page.data.unverifiedPubs as pub}
                    <PublicationCard 
                        pub={pub}
                        isAdmin={true}
                    />
                {/each}
            </div>
            <div class="space-y-4">
                <h3 class="h2 w-full text-center">Achats</h3>
                {#if $page.data.unverifiedPurshases.length == 0}
                    <p class="text-center opacity-50">Aucun Achat</p>
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
                                    <button class="btn variant-filled-success">Accepter</button>
                                </form>
                                <form method="POST" action="?/rejectPur" use:enhance>
                                    <input type="hidden" name="id" value={purchase.id}>
                                    <button class="btn variant-filled-error">Refuser</button>
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
                        <p class="text-center opacity-50">Aucun Utilisateur</p>
                    {/if}
                </div>
            {/if}
        </div>
    </div>
</div>