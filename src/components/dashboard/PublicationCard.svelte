<!-- PublicationCard.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import { selectedPublicationStore } from '$lib/stores';
	import type { DrawerSettings } from '@skeletonlabs/skeleton';
	import { getDrawerStore } from '@skeletonlabs/skeleton';
	import { newPublicationStateStore } from '$lib/stores';
	import { toBeEditedPublicationStore } from '$lib/stores';
	import { onMount } from 'svelte';

	const statusColors = {
		pending: 'variant-ghost-warning',
		verified: 'variant-ghost-success',
		rejected: 'variant-ghost-error'
	};

	const statusText = {
		pending: 'En attente',
		verified: 'Publiée',
		rejected: 'Rejetée'
	};

	interface Publication {
		id: string;
		userId: string;
		title: string;
		companyType: string;
		publicationType: string;
		body: string;
		status: 'pending' | 'verified' | 'rejected';
		reviewedBy?: string;
		reviewedAt?: number;
		feedback?: string;
		createdAt: number;
		updatedAt: number;
	}

	export let pub: Publication;
	export let isAdmin: boolean;

	const drawerStore = getDrawerStore();

	const date = new Date(pub.updatedAt).toDateString();

	async function showPubDetailsDrawer() {
		selectedPublicationStore.set(pub);
		const settings: DrawerSettings = {
			id: 'publication-review',
			position: 'bottom',
			width: 'w-full md:w-full',
			height: 'h-7/8',
			padding: 'p-4'
		};
		drawerStore.open(settings);
	}
    
</script>

<div class="card variant-glass-surface p-4">
	<div class="flex items-start justify-between">
		<div>
			<h4 class="h4">{pub.title}</h4>
			<p class="text-sm opacity-75">{pub.publicationType}</p>
			<p class="text-xs opacity-50">{date}</p>
		</div>
		<div>
			<span class="badge {statusColors[pub.status]}">{statusText[pub.status]}</span>
		</div>
	</div>
	<div class="mt-4 flex gap-2">
		{#if !isAdmin}
			{#if pub.status !== 'verified'}
				<form method="POST" action="?/deletePub" use:enhance>
					<input type="text" name="pubId" value={pub.id} hidden />
					<button class="variant-filled-error btn" type="submit">Annuler</button>
				</form>
				<form method="POST" action="?/pubToDraft" use:enhance>
					<input type="text" name="pubId" value={pub.id} hidden />
					<button
						class="variant-filled-warning btn"
						on:click={async () => {
							newPublicationStateStore.set(false);
						}}
					>
						Modifier
					</button>
				</form>
			{/if}
		{:else}
			<form method="POST" action="?/acceptPub" use:enhance>
				<input type="text" name="pubId" value={pub.id} hidden />
				<button class="variant-filled-success btn" type="submit">Approuver</button>
			</form>
			<form method="POST" action="?/rejectPub" use:enhance>
				<input type="text" name="pubId" value={pub.id} hidden />
				<button class="variant-filled-error btn" type="submit">Rejeter</button>
			</form>
			<button class="variant-filled-warning btn" on:click={showPubDetailsDrawer}>Voir</button>
		{/if}
	</div>
</div>
