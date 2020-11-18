<script>
    import { onMount } from 'svelte';
    import {
        f7ready,
        App,
        Views,
        View,
        Toolbar,
        Link,
        Page,
        Preloader,
    } from 'framework7-svelte';
    import routes from '../js/routes';
    import { userStore, initialized } from '../stores/userStore.js';
    import {
        currencies,
        openCurrenciesDatabase,
    } from '../stores/currenciesStore';
    import Fab from 'framework7-svelte/components/fab.svelte';
    import Icon from 'framework7-svelte/components/icon.svelte';
    import FabButtons from 'framework7-svelte/components/fab-buttons.svelte';
    import FabButton from 'framework7-svelte/components/fab-button.svelte';
    import FabBackdrop from 'framework7-svelte/components/fab-backdrop.svelte';
    import Sheet from 'framework7-svelte/components/sheet.svelte';
    import Button from 'framework7-svelte/components/button.svelte';
    import AddExpense from './addExpense.svelte';
    import AddIncome from './addIncome.svelte';
    import { openExpensesDatabase } from '../stores/expensesStore';
    import { openBudgetsDatabase } from '../stores/budgetsStore';
    import { openIncomesDatabase } from '../stores/incomesStore';
    import { openMonthlyIncomesDatabase } from '../stores/monthlyIncomesStore';
    import { openMonthlyBudgetsDatabase } from '../stores/monthlyBudgetsStore';
    import { openMonthlyExpensesDatabase } from '../stores/monthlyExpensesStore';

    // Framework7 Parameters
    let f7params = {
        name: 'looking', // App name
        theme: 'auto', // Automatic theme detection

        // App routes
        routes: routes,
        // Register service worker
        // serviceWorker: {
        //     path: '/service-worker.js',
        // },
    };

    // checking if user has set base currency and currency options
    let currenciesSet;
    const checkBaseCurrency = () => {
        if ($currencies.length === 0) {
            currenciesSet = false;
        } else {
            currenciesSet = true;
        }
    };
    $: if ($currencies) checkBaseCurrency();

    const initDatabases = () => {
        openBudgetsDatabase();
        openCurrenciesDatabase();
        openExpensesDatabase();
        openIncomesDatabase();
        openMonthlyBudgetsDatabase();
        openMonthlyExpensesDatabase();
        openMonthlyIncomesDatabase();
    };

    $: if ($userStore) initDatabases();

    onMount(() => {
        f7ready(() => {});
    });
</script>

<!-- <SetCurrencies on:CurrencySet={checkBaseCurrency} /> -->
<App params={f7params}>
    <!-- Views/Tabs container -->
    <Views tabs class="safe-areas">
        {#if $initialized === false && !localStorage.userbaseCurrentSession}
            <Page noNavbar class="safe-areas loader">
                <Preloader color="green" size={100} />
            </Page>
        {:else if $initialized === false && localStorage.userbaseCurrentSession}
            <View url="/loading-screen/" class="safe-areas" />
        {:else if $userStore}
            {#if $currencies === null}
                <View url="/loading-screen/" class="safe-areas" />
                <!-- <Page noNavbar class="safe-areas loader">
                    <Preloader color="green" size={100} />
                </Page> -->
            {:else if currenciesSet === false}
                <View url="/set-currencies/" class="safe-areas" />
            {/if}
        {:else}
            <View url="/auth/" class="safe-areas" />
        {/if}

        <!-- Tabbar for switching views-tabs -->
        {#if $initialized === true && $userStore !== null && currenciesSet === true}
            <FabBackdrop />
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

        {#if $initialized === true && $userStore && currenciesSet === true}
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
