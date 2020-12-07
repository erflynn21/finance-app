<script>
    import { Plugins } from '@capacitor/core';
    import {
        App,
        f7ready,
        Link,
        Page,
        Preloader,
        Toolbar,
        View,
        Views,
    } from 'framework7-svelte';
    import { onMount } from 'svelte';
    import routes from '../js/routes';
    import { currencies } from '../stores/currenciesStore';
    import { initialized, userSetUp, userStore } from '../stores/userStore.js';
    import ActionButton from './actionButton.svelte';

    const { Keyboard } = Plugins;

    // Framework7 Parameters
    let f7params = {
        name: 'Expat Expenses', // App name
        theme: 'auto', // Automatic theme detection

        // App routes
        routes: routes,
        // Register service worker
        // serviceWorker: {
        //     path: '/serÇ◊±¿M JMvice-worker.js',
        // },

        calendar: {
            closeOnSelect: true,
            openIn: 'customModal',
            dateFormat: 'yyyy-mm-dd',
            backdrop: true,
            header: true,
            toolbar: false,
            touchMove: false,
        },
    };

    Keyboard.setAccessoryBarVisible({ isVisible: true });

    onMount(() => {
        f7ready(() => {});
    });
</script>

<App params={f7params}>
    <!-- Views/Tabs container -->
    <Views tabs class="safe-areas">
        {#if $initialized === false}
            <View
                id="view-loading-screen"
                url="/loading-screen/"
                class="safe-areas" />
            <!-- <Page noNavbar class="safe-areas loader">
                <Preloader color="green" size={100} />
            </Page> -->
        {:else if $userStore}
            {#if $userSetUp === false}
                <View
                    id="view-intro-slider"
                    url="/intro-slider/"
                    class="safe-areas" />
            {:else if $currencies === null}
                <View
                    id="view-loading-screen"
                    url="/loading-screen/"
                    class="safe-areas" />
                <!-- <Page noNavbar class="safe-areas loader">
                    <Preloader color="green" size={100} />
                </Page> -->
            {/if}
        {:else}
            <View id="view-auth" url="/auth/" class="safe-areas" />
        {/if}

        <!-- Tabbar for switching views-tabs -->
        {#if $initialized === true && $userStore !== null && $userSetUp === true}
            <Toolbar tabbar bottom bgColor="white">
                <Link
                    tabLink="#view-overview"
                    tabLinkActive
                    iconF7="chart_pie"
                    iconColor="gray"
                    iconSize="30px" />
                <Link
                    tabLink="#view-budget"
                    iconF7="doc_text"
                    iconColor="gray"
                    iconSize="30px" />
                <Link
                    tabLink="#view-transactions"
                    iconF7="money_dollar_circle"
                    iconColor="gray"
                    iconSize="30px" />
                <Link
                    tabLink="#view-settings"
                    iconF7="gear"
                    iconColor="gray"
                    iconSize="30px" />
            </Toolbar>

            <ActionButton />
        {/if}

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
</App>

<style>
    :global(.loader) {
        height: 100vh;
        width: 100vw;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    /* :global(.toolbar-inner) {
        padding-top: 15px;
    } */

    :global(.tab-link-active .icon) {
        color: #008000;
    }

    :global(.fab-right-bottom) {
        z-index: 5002;
        bottom: calc(var(--f7-fab-margin) + var(--f7-safe-area-bottom));
    }

    :global(.fab-backdrop) {
        z-index: 5002;
    }

    :global(.fab > a, .fab-buttons a) {
        box-shadow: none;
        transition-delay: 0;
        transition-duration: 200ms;
    }
</style>
