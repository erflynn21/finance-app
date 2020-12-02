<script>
    import { Page, Navbar } from 'framework7-svelte';
    import List from 'framework7-svelte/components/list.svelte';
    import SwiperItem from '../components/swiperItem.svelte';
    import { baseCurrencySymbol } from '../stores/currenciesStore';
    import { expenses, expensesSum } from '../stores/expensesStore';
    import { incomes, incomesSum } from '../stores/incomesStore';
    import { flip } from 'svelte/animate';
</script>

<Page name="transactions">
    <Navbar title="Transactions" />
    <h1>Expenses:</h1>
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
    </h3>

    <div class="spacer" />
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
