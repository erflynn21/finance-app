<script>
    import { Page, Navbar } from 'framework7-svelte';
    import BlockHeader from 'framework7-svelte/components/block-header.svelte';
    import BlockTitle from 'framework7-svelte/components/block-title.svelte';
    import List from 'framework7-svelte/components/list.svelte';
    import SwiperItem from '../components/swiperItem.svelte';
    import {
        deleteExpense,
        expenses,
        expensesSum,
    } from '../stores/expensesStore';
    import { deleteIncome, incomes, incomesSum } from '../stores/incomesStore';
</script>

<Page name="transactions">
    <Navbar title="Transactions" />
    <h1>Expenses:</h1>
    <h3>Total Expenses: {$expensesSum}</h3>

    <List>
        {#each $expenses as { item, itemId } (itemId)}
            <SwiperItem {item} on:deleted={() => deleteExpense(itemId)} />
        {/each}
    </List>
    <h1>Income:</h1>
    <h3>Total Income: {$incomesSum}</h3>

    <List>
        {#each $incomes as { item, itemId } (itemId)}
            <SwiperItem {item} on:deleted={() => deleteIncome(itemId)} />
        {/each}
    </List>
</Page>

<style>
    h1 {
        font-size: 16px;
        color: black;
        font-weight: 400;
        text-align: center;
        margin: 10px 0;
    }

    h3 {
        font-size: 14px;
        color: black;
        font-weight: 400;
        text-align: center;
        margin: 10px 0;
    }
</style>
