<script>
    import { Page, Navbar } from 'framework7-svelte';
    import List from 'framework7-svelte/components/list.svelte';
    import { onMount } from 'svelte';
    import SwiperItem from '../components/swiperItem.svelte';
    import { hideFAB, showFAB } from '../js/fab';
    import {
        deleteMonthlyExpense,
        monthlyExpenses,
        updateMonthlyExpense,
    } from '../stores/monthlyExpensesStore';

    console.log($monthlyExpenses);
    onMount(() => {
        hideFAB();
    });
</script>

<Page name="monthly-expenses" noToolbar>
    <!-- Top Navbar -->
    <Navbar
        title="Monthly Recurring Expenses"
        backLink="Back"
        on:clickBack={() => showFAB()} />
    <List>
        {#each $monthlyExpenses as { item, itemId } (itemId)}
            <SwiperItem
                {item}
                {itemId}
                type="monthlyExpense"
                on:deleted={() => deleteMonthlyExpense(itemId)} />
        {/each}
    </List>
</Page>
