<script>
    import { Page, Navbar } from 'framework7-svelte';
    import List from 'framework7-svelte/components/list.svelte';
    import SwiperItem from '../components/swiperItem.svelte';
    import {
        deleteMonthlyExpense,
        monthlyExpenses,
        updateMonthlyExpense,
    } from '../stores/monthlyExpensesStore';
</script>

<Page name="monthly-expenses">
    <!-- Top Navbar -->
    <Navbar title="Monthly Recurring Expenses" backLink="Back" />
    <List>
        {#each $monthlyExpenses as { item, itemId } (itemId)}
            <SwiperItem
                {item}
                on:deleted={() => deleteMonthlyExpense(itemId)} />
        {/each}
    </List>
</Page>
