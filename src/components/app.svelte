<script>
    import { onMount } from 'svelte';
    import { getDevice } from 'framework7/lite-bundle';
    import {
        f7,
        f7ready,
        App,
        Views,
        View,
        Toolbar,
        Link,
    } from 'framework7-svelte';

    import { initialized, userStore } from '../stores/userStore';
    import { initUserbase } from '../js/init.js';
    initUserbase();

    import capacitorApp from '../js/capacitor-app';
    import routes from '../js/routes';
    import ActionButton from './actionButton.svelte';

    const device = getDevice();
    // Framework7 Parameters
    let f7params = {
        name: 'Expat Expenses', // App name
        theme: 'auto', // Automatic theme detection

        id: 'com.cumuluscreative.expatexpenses', // App bundle ID

        // App routes
        routes: routes,

        // Input settings
        input: {
            scrollIntoViewOnFocus: device.capacitor,
            scrollIntoViewCentered: device.capacitor,
        },
        // Capacitor Statusbar settings
        statusbar: {
            iosOverlaysWebView: true,
            androidOverlaysWebView: false,
        },
    };

    onMount(() => {
        f7ready(() => {
            // Init capacitor APIs (see capacitor-app.js)
            if (f7.device.capacitor) {
                capacitorApp.init(f7);
            }
            // Call F7 APIs here
        });
    });
</script>

<App {...f7params}>
    <!-- Views/Tabs container -->
    <Views tabs class="safe-areas">
        {#if $initialized === false}
            <View id="view-loading-screen" url="/loading-screen/" />
        {/if}

        {#if $initialized === true && $userStore === null}
            <View
                id="view-auth"
                url="/auth/"
                class="safe-areas"
                style="z-index: 5001;"
            />
        {/if}

        {#if $initialized === true && $userStore.profile.onboardingDone === false}
            <View id="view-onboarding" url="/onboarding/" />
        {/if}

        {#if $userStore !== null && $userStore.profile.onboardingDone === 'true'}
            <Toolbar tabbar labels bottom>
                <Link
                    tabLink="#view-overview"
                    tabLinkActive
                    iconF7="chart_pie"
                    iconColor="gray"
                    iconSize="30px"
                />
                <Link
                    tabLink="#view-budget"
                    iconF7="doc_text"
                    iconColor="gray"
                    iconSize="30px"
                />
                <Link
                    tabLink="#view-transactions"
                    iconF7="money_dollar_circle"
                    iconColor="gray"
                    iconSize="30px"
                />
                <Link
                    tabLink="#view-settings"
                    iconF7="gear"
                    iconColor="gray"
                    iconSize="30px"
                />
            </Toolbar>

            <ActionButton />
        {/if}

        {#if $userStore !== null && $userStore.profile.onboardingDone === 'true'}
            <!-- Your main view/tab, should have "view-main" class. It also has "tabActive" prop -->
            <View id="view-overview" main tab tabActive url="/" />

            <!-- Budget View -->
            <View id="view-budget" name="catalog" tab url="/budget/" />

            <!-- Transactions View -->
            <View
                id="view-transactions"
                name="transactions"
                tab
                url="/transactions/"
            />

            <!-- Settings View -->
            <View id="view-settings" name="settings" tab url="/settings/" />
        {/if}
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

    :global(.tab-link-active .icon) {
        background: rgb(6, 95, 70);
        background: linear-gradient(
            90deg,
            rgba(6, 95, 70, 1) 0%,
            rgba(5, 150, 105, 1) 100%
        );
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
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

    :global(.navbar-bg) {
        background: rgb(6, 95, 70);
        background: linear-gradient(
            90deg,
            rgba(6, 95, 70, 1) 0%,
            rgba(5, 150, 105, 1) 100%
        );
    }
</style>
