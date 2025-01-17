<script lang="ts">
	import '../app.css';
	import { autoModeWatcher } from '@skeletonlabs/skeleton';
	import { setModeCurrent } from '@skeletonlabs/skeleton';
	import { initializeStores, Toast, Drawer} from '@skeletonlabs/skeleton';
	import { getDrawerStore } from "@skeletonlabs/skeleton";
	import { page } from '$app/stores';
	import PurchaseDrawer from '$components/purchase/PurchaseDrawer.svelte';
	import { onMount } from 'svelte';
	import PublicationDrawer from '$components/admin/publicationDrawer.svelte';
	import { selectedPublicationStore } from '$lib/stores';
	initializeStores();
	const drawerStore = getDrawerStore();

	async function logout() {
		const res = await fetch('/api/logout', { method: 'POST' })
		if (res.ok) {
			location.href = '/login';
		} else {
			console.error('Logout failed');
		}
	}


	onMount(() => {
		setModeCurrent(false);
	});
</script>

<svelte:head>{@html '<script>(' + autoModeWatcher.toString() + ')();</script>'}</svelte:head>
<div class="announcement-bar bg-[#335C4C] text-white py-2 px-4 flex items-center justify-between">
    <div class="flex items-center">
        <svg class="h-5 w-5 mr-2 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M2 10a8 8 0 1 1 16 0 8 0 0 1-16 0zM9 5a1 1 0 0 1 2 0v3a1 1 0 1 1-2 0V5zm0 7a1 1 0 0 1 2 0v1a1 1 0 0 1-2 0v-1z" clip-rule="evenodd"/>
        </svg>
        <span class="text-sm">This is a demo app made by <a class="font-bold" href="https://weblion.pro">Weblion</a>  found @ https://weblion.pro</span>
    </div>
	<div class="flex flex-row gap-8 justify-center items-center  px-4">
		{#if $page.data.isAdmin}
			<a href="/admin" class="btn variant-filled-success h-8"><p class="p font-semibold">Admin</p></a>
		{/if}
		{#if $page.data.loggedIn}
			<button class="btn variant-filled-primary h-8" on:click={logout}><p class="p font-semibold">logout</p></button>
		{/if}
        <!--<LightSwitch />-->
    </div>
</div>
<Toast />

<Drawer>
	{#if $drawerStore.id === 'purchase'}
		<PurchaseDrawer />
	{:else if $drawerStore.id === 'publication-review'}
		{#if $selectedPublicationStore}
			<PublicationDrawer
				pub={$selectedPublicationStore}
			/>
		{/if}
	{/if}
</Drawer>

<slot></slot>
