<!-- Dashboard.svelte -->
<script lang="ts">
	import CreditCard from './CreditCard.svelte';
	import PublicationCard from './PublicationCard.svelte';
	import DraftCard from './DraftCard.svelte';
	import PublicationForm from './PublicationForm.svelte';
	import StatsCard from './StatsCard.svelte';
	import { page } from '$app/stores';

	//triggers
	let newPublicationState = false;

	// publication interface
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
	// draft interface
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

	// edit publication States
	export let toBeEditedDraft: Draft | null = null;
	$:if (toBeEditedDraft) {
			newPublicationState = false;
			newPublicationState = true;
		};

	export let credits = 0;
	export let recentPublications = [] as Publication[];
	export let draftPublications = [] as Draft[];
	export let pendingPurchase: purchaseTransaction;
	export let stats: {
		totalPublications: number;
		pendingPublications: number;
		draftsCount: number;
		totalSpent: number;
	};

	// Add new state for active tab
	let activeTab: 'publications' | 'drafts' = 'publications';

	async function handleNewPublication() {
		if (toBeEditedDraft && newPublicationState) {
			toBeEditedDraft = null;
			newPublicationState = false;
			await new Promise(resolve => setTimeout(resolve, 5));
			newPublicationState = true;
		} else {
			newPublicationState = !newPublicationState;
		}
	}
</script>

<div class="bg-surface-50-900-token min-h-screen">
	<div class="container mx-auto p-2 sm:p-4">
		<!-- Welcome and Stats Section -->
		<div class="mb-4 sm:mb-8 grid gap-4">
			<!-- Welcome Section -->
			<div class="card variant-glass-surface p-4">
				<h2 class="h2 text-xl sm:text-2xl md:text-3xl">Bonjour, {$page.data.firstName ?? $page.data.username}</h2>
				<p class="opacity-75">Bienvenue sur votre tableau de bord</p>
				<StatsCard
					totalPublications={stats.totalPublications}
					pendingPublications={stats.pendingPublications}
					draftsCount={stats.draftsCount}
					totalSpent={stats.totalSpent}
				/>
			</div>

			<!-- Credit Card -->
			<div class="w-full">
				<CreditCard {credits} {pendingPurchase} />
			</div>
		</div>

		<!-- Quick Actions -->
		<div class="card variant-glass-surface mb-4 sm:mb-8 p-4">
			<div class="flex flex-col sm:flex-row gap-4 justify-between items-center">
				<button class="btn variant-filled-primary w-full sm:w-auto" on:click={async () => handleNewPublication()}>
					Nouvelle Publication
				</button>
				<button class="btn-icon variant-soft-primary hover:variant-filled-secondary" on:click={() => location.reload()}>
					<svg class="w-4 h-4" viewBox="0 0 438.529 438.528" fill="white">
						<path d="M433.109,23.694c-3.614-3.612-7.898-5.424-12.848-5.424c-4.948,0-9.226,1.812-12.847,5.424l-37.113,36.835 c-20.365-19.226-43.684-34.123-69.948-44.684C274.091,5.283,247.056,0.003,219.266,0.003c-52.344,0-98.022,15.843-137.042,47.536 C43.203,79.228,17.509,120.574,5.137,171.587v1.997c0,2.474,0.903,4.617,2.712,6.423c1.809,1.809,3.949,2.712,6.423,2.712h56.814 c4.189,0,7.042-2.19,8.566-6.565c7.993-19.032,13.035-30.166,15.131-33.403c13.322-21.698,31.023-38.734,53.103-51.106 c22.082-12.371,45.873-18.559,71.376-18.559c38.261,0,71.473,13.039,99.645,39.115l-39.406,39.397 c-3.607,3.617-5.421,7.902-5.421,12.851c0,4.948,1.813,9.231,5.421,12.847c3.621,3.617,7.905,5.424,12.854,5.424h127.906 c4.949,0,9.233-1.807,12.848-5.424c3.613-3.616,5.42-7.898,5.42-12.847V36.542C438.529,31.593,436.733,27.312,433.109,23.694z"/>
						<path d="M422.253,255.813h-54.816c-4.188,0-7.043,2.187-8.562,6.566c-7.99,19.034-13.038,30.163-15.129,33.4 c-13.326,21.693-31.028,38.735-53.102,51.106c-22.083,12.375-45.874,18.556-71.378,18.556c-18.461,0-36.259-3.423-53.387-10.273 c-17.13-6.858-32.454-16.567-45.966-29.13l39.115-39.112c3.615-3.613,5.424-7.901,5.424-12.847c0-4.948-1.809-9.236-5.424-12.847 c-3.617-3.62-7.898-5.431-12.847-5.431H18.274c-4.952,0-9.235,1.811-12.851,5.431C1.807,264.844,0,269.132,0,274.08v127.907 c0,4.945,1.807,9.232,5.424,12.847c3.619,3.61,7.902,5.428,12.851,5.428c4.948,0,9.229-1.817,12.847-5.428l36.829-36.833 c20.367,19.41,43.542,34.355,69.523,44.823c25.981,10.472,52.866,15.701,80.653,15.701c52.155,0,97.643-15.845,136.471-47.534 c38.828-31.688,64.333-73.042,76.52-124.05c0.191-0.38,0.281-1.047,0.281-1.995c0-2.478-0.907-4.612-2.715-6.427 C426.874,256.72,424.731,255.813,422.253,255.813z"/>
					</svg>
				</button>
			</div>
		</div>

		{#if newPublicationState}
			<div class="card variant-glass-surface mb-8 p-4">
				<PublicationForm draft={toBeEditedDraft} />
			</div>
		{/if}

		<!-- Publications and Drafts Section -->
		<div class="card variant-glass-surface p-0">
			<div class="flex flex-col gap-4 p-4">
				<!-- Tab Navigation -->
				<div class="flex gap-2 sm:gap-4 border-b border-surface-500/30 pb-4 overflow-x-auto">
					<button
						class="btn btn-sm sm:btn-md {activeTab === 'publications' ? 'variant-filled' : 'variant-ghost'}"
						on:click={() => (activeTab = 'publications')}
					>
						Publications
					</button>
					<button
						class="btn btn-sm sm:btn-md {activeTab === 'drafts' ? 'variant-filled' : 'variant-ghost'}"
						on:click={() => (activeTab = 'drafts')}
					>
						Brouillons
					</button>
				</div>

				<!-- Tab Content -->
				{#if activeTab === 'publications'}
					<div class="grid gap-4 grid-cols-1 md:grid-cols-2">
						{#each recentPublications as pub}
							<PublicationCard
								pub={pub}
								isAdmin={false}
							/>
						{:else}
							<p class="col-span-2 text-center opacity-50">Aucune publication récente</p>
						{/each}
					</div>
				{:else}
					<div class="grid gap-4 grid-cols-1 md:grid-cols-2">
						{#each draftPublications as draft}
							<DraftCard
								pubId={draft.id}
								title={draft.title}
								date={new Date(draft.updatedAt).toLocaleDateString()}
								type={draft.publicationType}
							/>
						{:else}
							<p class="text-center opacity-50">Aucun brouillon</p>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
