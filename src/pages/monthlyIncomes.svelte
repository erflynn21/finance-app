<script>
    import { Page, Navbar } from 'framework7-svelte';
    import Block from 'framework7-svelte/components/block.svelte';
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
    <Navbar
        title="Monthly Recurring Incomes"
        backLink="Back"
        on:clickBack={() => showFAB()} />
    <Block class="text-align-center">
        Incomes below will be automatically added to your budget every month on
        the specified day.
    </Block>
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
