<script lang="ts">
    import { enhance } from '$app/forms';
	import { newPublicationStateStore } from '$lib/stores';
    import { toBeEditedPublicationStore } from '$lib/stores';
	import Dashboard from './Dashboard.svelte';
    import type { Draft } from '$lib/types';

    export let pub: Draft;

</script>

<div class="card p-4 variant-glass-surface">
    <div class="flex justify-between items-start">
        <div>
            <h4 class="h4">{pub.id}</h4>
            <p class="text-sm opacity-75">{pub.publicationType}</p>
            <p class="text-xs opacity-50">{pub.updatedAt}</p>
        </div>
    </div>
    <div class="mt-4 flex gap-2">
        <button class="btn variant-filled-warning" on:click={() => {
                newPublicationStateStore.set(false);
                toBeEditedPublicationStore.set(pub);
                newPublicationStateStore.set(true);
            }} >Modifier
        </button>
        <form method="POST" action="?/deleteDraft" use:enhance>
            <input type="text" name="draftId" value={pub.id} hidden>
            <button class="btn variant-filled-error" type="submit">
                Supprimer
            </button>
        </form>
    </div>
</div>
