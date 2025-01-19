<script lang="ts">
    import { enhance } from '$app/forms';

    const companyTypes = ['SARL', 'SARLAU', 'SNC', 'SCS', 'SCA', 'SAS', 'SA', 'GIE'];
    const publicationTypes = [
        'Constitution de société',
        'Cessation d\'activité',
        'Dissolution',
        'Clôture de la liquidation',
        'Continuité de l\'activité',
        'Modification de société',
        'Changement de dirigeant',
        'Transfert de siège social',
        'Changement d\'objet social',
        'Changement de dénomination',
        'Transformation de la forme sociale',
        'Cession de parts sociales',
        'Réduction de capital',
        'Augmentation de capital'
    ];

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

    let companyType = '';
    let publicationType = '';
    let publicationTitle = '';
    let body = '';
    let draftId = '';
    let showPreview = false;

    export let draft: Draft | null = null;

    $: if (draft) {
        companyType = draft.companyType;
        publicationType = draft.publicationType;
        publicationTitle = draft.title;
        body = draft.body;
        draftId = draft.id;
        draft = null;
    }


    $: previewText = `${publicationTitle}\n${publicationType} - ${companyType}\n\n${body}`;


</script>

<div class="space-y-4">
    <h3 class="h3 text-lg sm:text-xl md:text-2xl">Nouvelle Publication</h3>
    
    <form method="POST" action="?/publish" use:enhance class="space-y-4">
        {#if draftId}
            <input type="hidden" name="draftId" value={draftId}>
        {/if}

        <div class="form-group">
            <label class="label">
                <span>Type de société</span>
                <select name="companyType" class="select" bind:value={companyType} required>
                    <option value="">Sélectionnez un type</option>
                    {#each companyTypes as type}
                        <option value={type}>{type}</option>
                    {/each}
                </select>
            </label>
        </div>

        <div class="form-group">
            <label class="label">
                <span>Type de publication</span>
                <select name="publicationType" class="select" bind:value={publicationType} required>
                    <option value="">Sélectionnez un type</option>
                    {#each publicationTypes as type}
                        <option value={type}>{type}</option>
                    {/each}
                </select>
            </label>
        </div>

        <div class="form-group">
            <label class="label">
                <span>Titre de la publication</span>
                <input
                    type="text"
                    name="title"
                    class="input"
                    placeholder="Entrez le titre de votre publication..."
                    required
                    bind:value={publicationTitle}
                >
            </label>
        </div>

        <div class="form-group">
            <label class="label">
                <span>Contenu de la publication</span>
                <textarea
                    name="body"
                    class="textarea"
                    rows="6"
                    bind:value={body}
                    placeholder="Entrez le contenu de votre publication..."
                    required
                ></textarea>
            </label>
        </div>

        <div class="flex flex-col sm:flex-row justify-between gap-4">
            <button type="submit" class="btn w-full sm:w-auto variant-filled-primary" formaction="?/saveDraft" on:click={() => draft = null}>
                Enregistrer comme brouillon
            </button>
            <button type="submit" class="btn w-full sm:w-auto variant-filled-success gap-2" on:click={() => draft = null}>
                Publier (1 crédit)
            </button>
        </div>
    </form>

    <div class="form-group">
        <label class="label flex items-center gap-2">
            <input type="checkbox" bind:checked={showPreview} class="checkbox">
            <span>Aperçu de la publication</span>
        </label>
    </div>

    {#if showPreview}
        <div class="card variant-ghost p-4">
            <pre class="whitespace-pre-wrap font-serif">{previewText}</pre>
        </div>
    {/if}
</div>
