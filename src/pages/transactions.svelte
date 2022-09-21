<script>
    import { Page, Navbar, List } from 'framework7-svelte';
    import {
        transactions,
        expenses,
        expensesSum,
        income,
        incomeSum,
    } from '../stores/transactionsStore';
    import { flip } from 'svelte/animate';
    import Transaction from '../components/transaction.svelte';
    import AddTransactionButton from '../components/addTransactionButton.svelte';
</script>

<Page name="transactions">
    <Navbar title="Transactions" />

    <List class="transactions-list">
        {#each $transactions as { item, itemId } (itemId)}
            <!-- <div animate:flip={{ duration: 400 }}> -->
            <Transaction {item} {itemId} />
            <!-- </div> -->
        {/each}
    </List>

    <!-- <h1>Expenses:</h1>
    <h3>Total Expenses: {$baseCurrencySymbol}{$expensesSum}</h3>

    <List class="transactions-list">
        {#each $expenses as { item, itemId } (itemId)}
            <div animate:flip={{ duration: 400 }}>
                <SwiperItem {item} {itemId} type="expense" />
            </div>
        {/each}
    </List>
    <h1>Income:</h1>
    <h3>Total Income: {$baseCurrencySymbol}{$incomesSum}</h3>

    <List class="transactions-list">
        {#each $incomes as { item, itemId } (itemId)}
            <div animate:flip={{ duration: 400 }}>
                <SwiperItem {item} {itemId} type="income" />
            </div>
        {/each}
    </List>

    <h3>
        Remaining:
        {$baseCurrencySymbol}{($incomesSum - $expensesSum).toFixed(2)}
    </h3> -->

    <div class="spacer" />

    <!-- <AddTransactionButton /> -->
</Page>

<!-- <style>
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
</style> -->
