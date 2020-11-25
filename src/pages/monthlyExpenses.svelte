<script>
    import { Page, Navbar } from 'framework7-svelte';
    import Block from 'framework7-svelte/components/block.svelte';
    import List from 'framework7-svelte/components/list.svelte';
    import { onMount } from 'svelte';
    import SettingsSwiper from '../components/settingsSwiper.svelte';
    import { hideFAB, showFAB } from '../js/fab';
    import {
        deleteMonthlyExpense,
        monthlyExpenses,
    } from '../stores/monthlyExpensesStore';

    onMount(() => {
        hideFAB();
    });
</script>

<Page name="monthly-expenses" noToolbar>
    <Navbar
        title="Monthly Recurring Expenses"
        backLink="Back"
        on:clickBack={() => showFAB()} />
    <Block class="text-align-center">
        Expenses below will be automatically added to your budget every month on
        the specified day.
    </Block>
    <List>
        {#each $monthlyExpenses as { item, itemId } (itemId)}
            <SettingsSwiper
                {item}
                {itemId}
                type="monthlyExpense"
                on:deleted={() => deleteMonthlyExpense(itemId)} />
        {/each}
    </List>
</Page>
