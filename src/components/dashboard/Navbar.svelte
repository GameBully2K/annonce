<!-- Navbar.svelte -->
<script lang="ts">
    import { page } from '$app/stores';
    import { AppBar } from '@skeletonlabs/skeleton';
    let isMenuOpen = false;
</script>

<AppBar class="bg-surface-100-800-token sticky top-0 z-50">
    <svelte:fragment slot="lead">
        <img src="/logo.png" alt="1000 Annonces" class="h-8" />
    </svelte:fragment>
    <svelte:fragment slot="trail">
        <!-- Mobile Menu Button -->
        <button class="md:hidden btn btn-sm variant-ghost-surface" on:click={() => isMenuOpen = !isMenuOpen}>
            <span class="sr-only">Menu</span>
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
        </button>

        <!-- Desktop Navigation -->
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

<!-- Mobile Navigation Menu -->
{#if isMenuOpen}
    <div class="fixed inset-0 z-40 bg-surface-100-800-token/95 md:hidden">
        <nav class="flex flex-col items-center space-y-4 pt-20 px-4">
            <a href="/dashboard" class="btn w-full variant-ghost-surface" on:click={() => isMenuOpen = false}>Tableau de bord</a>
            <a href="/dashboard/publications" class="btn w-full variant-ghost-surface" on:click={() => isMenuOpen = false}>Mes Publications</a>
            <a href="/dashboard/credits" class="btn w-full variant-ghost-surface" on:click={() => isMenuOpen = false}>Mes Crédits</a>
            {#if $page.data.role === 'ADMIN'}
                <a href="/admin" class="btn w-full variant-ghost-primary" on:click={() => isMenuOpen = false}>Admin</a>
            {:else if $page.data.role === 'AGENT'}
                <a href="/agent" class="btn w-full variant-ghost-primary" on:click={() => isMenuOpen = false}>Agent</a>
            {/if}
            <form action="/logout" method="POST" class="w-full">
                <button type="submit" class="btn w-full variant-filled-error">Déconnexion</button>
            </form>
        </nav>
    </div>
{/if}
