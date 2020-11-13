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
    import Preloader from 'framework7-svelte/components/preloader.svelte';
    import userbase from 'userbase-js';
    import { Plugins } from '@capacitor/core';
    const { SplashScreen } = Plugins;

    // const userbase = window.userbase;

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
    import SetCurrencies from '../pages/setCurrencies.svelte';
    import Fab from 'framework7-svelte/components/fab.svelte';
    import Icon from 'framework7-svelte/components/icon.svelte';
    import FabButtons from 'framework7-svelte/components/fab-buttons.svelte';
    import FabButton from 'framework7-svelte/components/fab-button.svelte';
    import FabBackdrop from 'framework7-svelte/components/fab-backdrop.svelte';
    import Sheet from 'framework7-svelte/components/sheet.svelte';
    import Button from 'framework7-svelte/components/button.svelte';
    import AddExpense from './addExpense.svelte';
    import AddIncome from './addIncome.svelte';

    let initialized, error;
    const initUserbase = () => {
        initialized = userbase
            .init({ appId: '5b975c6f-3f35-48f4-b92f-904372fbcb3b' })
            .then(({ user }) => {
                userStore.set(user);
            })
            .catch((e) => (error = e))
            .finally(() => SplashScreen.hide());
    };

    // checking if user has set base currency and currency options
    let currencies = null;
    let currenciesSet;
    let currenciesDB;
    const databaseName = 'currencies';
    $: if ($userStore)
        currenciesDB = userbase
            .openDatabase({
                databaseName,
                changeHandler: function (items) {
                    currencies = items;
                },
            })
            .then(() => {
                checkBaseCurrency();
            });

    const checkBaseCurrency = () => {
        if (currencies.length === 0) {
            currenciesSet = false;
        } else {
            currenciesSet = true;
        }
    };

    const setCurrency = (e) => {
        const userCurrencies = e.detail;
        userbase.insertItem({ databaseName, item: userCurrencies });
        checkBaseCurrency();
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
            {#await currenciesDB}
                <Page noNavbar class="safe-areas loader">
                    <Preloader color="green" size={100} />
                </Page>
            {:then _}
                {#if currenciesSet === false}
                    <SetCurrencies on:setCurrency={setCurrency} />
                {:else}
                    <!-- Views/Tabs container -->
                    <Views tabs class="safe-areas">
                        <FabBackdrop />

                        <!-- Tabbar for switching views-tabs -->
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

                        <!-- Your main view/tab, should have "view-main" class. It also has "tabActive" prop -->
                        <View id="view-overview" tab tabActive url="/" />

                        <!-- Budget View -->
                        <View
                            id="view-budget"
                            name="budget"
                            tab
                            url="/budget/" />

                        <!-- Transactions View -->
                        <View
                            id="view-transactions"
                            name="transactions"
                            tab
                            url="/transactions/" />

                        <!-- Settings View -->
                        <View
                            id="view-settings"
                            main
                            name="settings"
                            tab
                            url="/settings/" />

                        <Fab position="right-bottom">
                            <Icon ios="f7:plus" md="material:add" />
                            <Icon ios="f7:xmark" md="material:close" />
                            <FabButtons position="top">
                                <FabButton label="Add Expense" fabClose>
                                    <Button sheetOpen=".add-expense">
                                        <Icon material="create" />
                                    </Button>
                                </FabButton>
                                <FabButton label="Add Income" fabClose>
                                    <Button sheetOpen=".add-income">
                                        <Icon material="today" />
                                    </Button>
                                </FabButton>
                            </FabButtons>
                        </Fab>

                        <Sheet
                            class="add-expense"
                            style="height: auto;"
                            swipeToClose
                            backdrop>
                            <div class="swipe-handler" />
                            <AddExpense />
                        </Sheet>

                        <Sheet
                            class="add-income"
                            style="height: auto;"
                            swipeToClose
                            backdrop>
                            <div class="swipe-handler" />
                            <AddIncome />
                        </Sheet>
                    </Views>
                {/if}
            {/await}
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

    :global(.toolbar-inner) {
        padding-top: 15px;
    }

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
