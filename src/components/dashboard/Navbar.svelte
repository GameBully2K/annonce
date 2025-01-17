<!-- Navbar.svelte -->
<script lang="ts">
    import { page } from '$app/stores';
    import { AppBar } from '@skeletonlabs/skeleton';
</script>

<AppBar class="bg-surface-100-800-token">
    <svelte:fragment slot="lead">
        <img src="/logo.png" alt="1000 Annonces" class="h-8" />
    </svelte:fragment>
    <svelte:fragment slot="trail">
        <nav class="hidden md:flex items-center space-x-4">
            <a href="/dashboard" class="btn variant-ghost-surface">Tableau de bord</a>
            <a href="/dashboard/publications" class="btn variant-ghost-surface">Mes Publications</a>
            <a href="/dashboard/credits" class="btn variant-ghost-surface">Mes Crédits</a>
            {#if $page.data.role === 'ADMIN'}
                <a href="/admin" class="btn variant-ghost-primary">Admin</a>
            {:else if $page.data.role === 'AGENT'}
                <a href="/agent" class="btn variant-ghost-primary">Agent</a>
            {/if}
            <form action="/logout" method="POST">
                <button type="submit" class="btn variant-filled-error">Déconnexion</button>
            </form>
        </nav>
    </svelte:fragment>
</AppBar>
