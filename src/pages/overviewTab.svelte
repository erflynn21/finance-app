<script>
    import { Page, Navbar } from 'framework7-svelte';
    import {
        deleteExpense,
        expenses,
        expensesSum,
    } from '../stores/expensesStore';
</script>

<Page name="home">
    <Navbar title="Overview" />
    {#each $expenses as { item, itemId } (itemId)}
        {item.currency}
        {item.title}
        {item.amount}
        {item.category}
        <button on:click={() => deleteExpense(itemId)}>X</button>
        <br />
    {/each}
    {$expensesSum}
</Page>
