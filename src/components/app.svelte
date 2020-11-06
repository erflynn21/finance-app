<script>
    import { onMount } from 'svelte';
    import {
        f7ready,
        App,
        Views,
        View,
        Toolbar,
        Link,
    } from 'framework7-svelte';
    import routes from '../js/routes';
    import Auth from '../pages/auth.svelte';
    const userbase = window.userbase;

    // Framework7 Parameters
    let f7params = {
        name: 'Expat Expenses', // App name
        theme: 'auto', // Automatic theme detection

        // App routes
        routes: routes,
        // Register service worker
        serviceWorker: {
            path: '/service-worker.js',
        },
    };

    // State
    import { userAccountStore } from '../stores/UserAccount.js';
    $: initialized = $userAccountStore.initialized;
    $: signedIn = $userAccountStore.signedIn;
    $: username = $userAccountStore.username;
    $: error = $userAccountStore.error;

    onMount(() => {
        f7ready(() => {
            // Call F7 APIs here
        });
        userAccountStore.initialize();
    });
</script>

<App params={f7params}>
    {#if initialized}
        {#if signedIn}
            <!-- Views/Tabs container -->
            <Views tabs class="safe-areas">
                <!-- Tabbar for switching views-tabs -->
                <Toolbar tabbar labels bottom>
                    <Link
                        tabLink="#view-overview"
                        tabLinkActive
                        iconF7="chart_pie"
                        text="Overview" />
                    <Link
                        tabLink="#view-budget"
                        iconF7="doc_text"
                        text="Budget" />
                    <Link
                        tabLink="#view-transactions"
                        iconF7="money_dollar_circle"
                        text="Transactions" />
                    <Link
                        tabLink="#view-settings"
                        iconF7="gear"
                        text="Settings" />
                </Toolbar>

                <!-- Your main view/tab, should have "view-main" class. It also has "tabActive" prop -->
                <View id="view-overview" main tab tabActive url="/" />

                <!-- Budget View -->
                <View id="view-budget" name="budget" tab url="/budget/" />

                <!-- Transactions View -->
                <View
                    id="view-transactions"
                    name="transactions"
                    tab
                    url="/transactions/" />

                <!-- Settings View -->
                <View id="view-settings" name="settings" tab url="/settings/" />
            </Views>
        {:else}
            <Auth />
        {/if}
    {:else}Loading...{/if}

    {#if error}
        <div class="error">{error}</div>
    {/if}
</App>
