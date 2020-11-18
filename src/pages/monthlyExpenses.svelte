<script>
    import { Page, Navbar } from 'framework7-svelte';
    import List from 'framework7-svelte/components/list.svelte';
    import SwiperItem from '../components/swiperItem.svelte';
    import {
        deleteMonthlyExpense,
        monthlyExpenses,
        updateMonthlyExpense,
    } from '../stores/monthlyExpensesStore';

    const deleted = (itemId) => {
        console.log(itemId);
        deleteMonthlyExpense(itemId);
    };
</script>

<Page name="monthly-expenses">
    <!-- Top Navbar -->
    <Navbar title="Monthly Recurring Expenses" backLink="Back" />
    <List>
        {#each $monthlyExpenses as { item, itemId } (itemId)}
            <SwiperItem {item} on:deleted={() => deleted(itemId)} />
        {/each}
    </List>
</Page>
