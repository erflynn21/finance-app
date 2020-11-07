<script>
    import { afterUpdate, onMount } from 'svelte';
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
    import Preloader from 'framework7-svelte/components/preloader.svelte';
    import { Plugins } from '@capacitor/core';
    const { SplashScreen } = Plugins;

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

    // initialize Userbase
    import { userStore } from '../stores/userStore.js';
    import Page from 'framework7-svelte/components/page.svelte';

    let initialized, error;
    const initUserbase = () => {
        initialized = userbase
            .init({ appId: '5b975c6f-3f35-48f4-b92f-904372fbcb3b' })
            .then(({ user }) => userStore.set(user))
            .catch((e) => (error = e))
            .finally(() => SplashScreen.hide());
    };

    onMount(() => {
        f7ready(() => {
            // Call F7 APIs here
        });
        initUserbase();
    });
</script>

<App params={f7params}>
    {#await initialized}
        <Page noNavbar class="safe-areas loader">
            <Preloader color="green" size={100} />
        </Page>
    {:then _}
        {#if $userStore}
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
    {/await}
    {#if error}
        <div class="error">{error}</div>
    {/if}
</App>

<style>
    :global(.loader) {
        height: 100vh;
        width: 100vw;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>
