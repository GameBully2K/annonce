<script lang="ts">
    import { getDrawerStore } from "@skeletonlabs/skeleton";
    import { enhance } from "$app/forms";
    import { selectedPublicationStore } from "$lib/stores";
    import type { Publication } from "$lib/types";

    const drawerStore = getDrawerStore();
    async function closeDrawer() {
        selectedPublicationStore.set(null);
        drawerStore.close();
    }

    export let pub: Publication;
</script>

<div class="w-full sm:max-w-[90%] md:max-w-[80%] p-4 sm:p-6 md:p-10 mx-auto space-y-4 sm:space-y-8">
    <h2 class="h2 text-xl sm:text-2xl md:text-3xl">Vérification de Publication</h2>
    
    <div class="card variant-ghost p-4 space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <h3 class="font-bold">Titre</h3>
                <p>{pub.title}</p>
            </div>
            <div>
                <h3 class="font-bold">Année</h3>
                <p>{new Date(pub.createdAt).getFullYear()}</p>
            </div>
            <div>
                <h3 class="font-bold">Type de Publication</h3>
                <p>{pub.publicationType}</p>
            </div>
            <div>
                <h3 class="font-bold">Type d'Entreprise</h3>
                <p>{pub.companyType}</p>
            </div>
        </div>

        <!-- Publication Content -->
        <div class="mt-4">
            <h3 class="font-bold mb-2">Contenu</h3>
            <div class="card variant-ghost-surface p-4 max-h-[50vh] sm:max-h-96 overflow-y-auto">
                {pub.body}
            </div>
        </div>
    </div>

    <!-- Approval Actions -->
    <div class="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4">
        <form method="POST" action="?/rejectPub" use:enhance class="contents">
            <input type="hidden" name="pubId" value={pub.id}>
            <button type="submit" class="btn variant-filled-error">Rejeter</button>
        </form>
        <form method="POST" action="?/acceptPub" use:enhance class="contents">
            <input type="hidden" name="pubId" value={pub.id}>
            <button type="submit" class="btn variant-filled-success">Approuver</button>
        </form>
        <button class="btn variant-filled-primary" on:click={closeDrawer}>Fermer</button>
    </div>
</div>