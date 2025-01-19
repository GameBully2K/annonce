<script lang="ts">
    import { enhance } from '$app/forms';
	import { newPublicationStateStore } from '$lib/stores';
    export let title: string;
    export let date: string;
    export let type: string;
    export let pubId: string;

</script>

<div class="card p-4 variant-glass-surface">
    <div class="flex justify-between items-start">
        <div>
            <h4 class="h4">{title}</h4>
            <p class="text-sm opacity-75">{type}</p>
            <p class="text-xs opacity-50">{date}</p>
        </div>
    </div>
    <div class="mt-4 flex gap-2">
        <form method="POST" action="?/loadPub" use:enhance>
            <input type="text" name="pubId" bind:value={pubId} hidden>
            <input type="text" name="pubType" value="draft" hidden> <!--0 for draft, 1 for publication-->
            <button class="btn variant-filled-warning" type="submit" on:click={() => {
                newPublicationStateStore.set(false);
                }} >Modifier</button>
        </form>
        <form method="POST" action="?/deleteDraft" use:enhance>
            <input type="text" name="draftId" value={pubId} hidden>
            <button class="btn variant-filled-error" type="submit">
                Supprimer
            </button>
    </form>
    </div>
</div>
