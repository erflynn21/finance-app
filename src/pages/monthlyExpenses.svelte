<script>
    import { Page, Navbar } from 'framework7-svelte';
    import { get } from 'svelte/store';
    import {
        deleteMonthlyExpense,
        monthlyExpenses,
    } from '../stores/monthlyExpensesStore';
</script>

<Page name="monthly-expenses">
    <!-- Top Navbar -->
    <Navbar title="Monthly Recurring Expenses" backLink="Back" />
    {#each $monthlyExpenses as { item, itemId } (itemId)}
        {item.currency}
        {item.title}
        {item.amount}
        {item.category}
        <button on:click={() => deleteMonthlyExpense(itemId)}>X</button>
        <br />
    {/each}
    hi
</Page>
