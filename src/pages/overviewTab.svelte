<script>
    import { Page, Navbar } from 'framework7-svelte';
    import {
        deleteExpense,
        expenses,
        expensesSum,
    } from '../stores/expensesStore';
    import { deleteIncome, incomes, incomesSum } from '../stores/incomesStore';
</script>

<Page name="home">
    <Navbar title="Overview" />
    expenses:
    {#each $expenses as { item, itemId } (itemId)}
        {item.currency}
        {item.title}
        {item.amount}
        {item.category}
        {#if item.originalAmount}
            {item.originalCurrency}
            {item.originalAmount}
        {/if}
        <button on:click={() => deleteExpense(itemId)}>X</button>
        <br />
    {/each}
    {$expensesSum}

    <br />
    incomes:
    {#each $incomes as { item, itemId } (itemId)}
        {item.currency}
        {item.title}
        {item.amount}
        {#if item.originalAmount}
            {item.originalCurrency}
            {item.originalAmount}
        {/if}
        <button on:click={() => deleteIncome(itemId)}>X</button>
        <br />
    {/each}
    {$incomesSum}
</Page>
