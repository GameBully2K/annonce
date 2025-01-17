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
	$: if (toBeEditedDraft) {
		newPublicationState = true;
	}

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
</script>

<div class="bg-surface-50-900-token flex min-h-screen flex-col">
	<div class="container mx-auto p-4">
		<div class="mb-8 grid gap-4 md:grid-cols-2">
			<!-- Welcome Section -->
			<div class="card variant-glass-surface flex flex-col justify-evenly p-4">
				<h2 class="h2">Bonjour, {$page.data.firstName ?? $page.data.username}</h2>
				<p class="opacity-75">Bienvenue sur votre tableau de bord</p>
				<StatsCard
					totalPublications={stats.totalPublications}
					pendingPublications={stats.pendingPublications}
					draftsCount={stats.draftsCount}
					totalSpent={stats.totalSpent}
				/>
			</div>

			<!-- Credit Card -->
			<CreditCard {credits} {pendingPurchase} />
		</div>

		<!-- Quick Actions -->
		<div class="card variant-glass-surface mb-8 p-4">
			<div class="flex gap-4">
				<button class="btn variant-filled-primary" on:click={() => (newPublicationState = !newPublicationState)}>
					Nouvelle Publication
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
				<div class="flex gap-4 border-b border-surface-500/30 pb-4">
					<button
						class="btn {activeTab === 'publications' ? 'variant-filled' : 'variant-ghost'}"
						on:click={() => (activeTab = 'publications')}
					>
						Publications récentes
					</button>
					<button
						class="btn {activeTab === 'drafts' ? 'variant-filled' : 'variant-ghost'}"
						on:click={() => (activeTab = 'drafts')}
					>
						Brouillons
					</button>
				</div>

				<!-- Tab Content -->
				{#if activeTab === 'publications'}
					<div class="grid gap-4 md:grid-cols-2">
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
					<div class="grid gap-4 md:grid-cols-2">
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
