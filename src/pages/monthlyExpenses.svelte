<script>
    import { Page, Navbar } from 'framework7-svelte';
    import SwiperList from '../components/swiperList.svelte';
    import {
        deleteMonthlyExpense,
        monthlyExpenses,
        updateMonthlyExpense,
    } from '../stores/monthlyExpensesStore';
</script>

<Page name="monthly-expenses">
    <!-- Top Navbar -->
    <Navbar title="Monthly Recurring Expenses" backLink="Back" />
    {#each $monthlyExpenses as { item, itemId } (itemId)}
        <SwiperList {item} on:deleted={() => deleteMonthlyExpense(itemId)} />
    {/each}
</Page>
