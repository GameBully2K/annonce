<script lang="ts">
    import { page } from '$app/stores';
    import LandingPage from '$components/LandingPage.svelte';
    import Dashboard from '$components/dashboard/Dashboard.svelte';
	import type { ActionData } from './$types';
    import { getToastStore, getDrawerStore } from '@skeletonlabs/skeleton';
    import type { ToastSettings } from '@skeletonlabs/skeleton';
	import { newPublicationStateStore, toBeEditedPublicationStore } from '$lib/stores';

    const drawerStore = getDrawerStore();
    const toastStore = getToastStore();

    interface Draft {
		id: string;
		userId: string;
		title: string;
		companyType: string;
		publicationType: string;
		body: string;
		createdAt: number;
		updatedAt: number;
	}

	export let form: ActionData;

    $: if ($newPublicationStateStore && $toBeEditedPublicationStore) {
        const t: ToastSettings = {
            message: "Publication Chargée",
            autohide: true,
            hideDismiss: false,
            background:  'variant-filled-success'
        };
        toastStore.trigger(t);
	}

    $: if (form?.message == "Achat enregistré") {
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
        toastStore.trigger(t);}
    // Mock data - replace with actual data from your backend
</script>

<main>
    {#if $page.data.username}
        <Dashboard 
            credits={$page.data.credits}    
            recentPublications={$page.data.publications}
            draftPublications={$page.data.drafts}
            pendingPurchase={$page.data.pendingPurchase}
            stats={$page.data.stats}
        />
    {:else}
        <LandingPage/>
    {/if}
</main>