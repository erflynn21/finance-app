<script>
    import { Page, Navbar } from 'framework7-svelte';
    import List from 'framework7-svelte/components/list.svelte';
    import { onMount } from 'svelte';
    import SettingsSwiper from '../components/settingsSwiper.svelte';
    import { hideFAB, showFAB } from '../js/fab';
    import {
        deleteMonthlyIncome,
        monthlyIncomes,
    } from '../stores/monthlyIncomesStore';

    onMount(() => {
        hideFAB();
    });
</script>

<Page name="monthly-incomes" noToolbar>
    <!-- Top Navbar -->
    <Navbar
        title="Monthly Recurring Incomes"
        backLink="Back"
        on:clickBack={() => showFAB()} />
    <List>
        {#each $monthlyIncomes as { item, itemId } (itemId)}
            <SettingsSwiper
                {item}
                {itemId}
                type="monthlyIncome"
                on:deleted={() => deleteMonthlyIncome(itemId)} />
        {/each}
    </List>
</Page>
