<script>
    import { Page, Navbar } from 'framework7-svelte';
    import { expenses } from '../stores/expensesStore';
    import { baseCurrency, currencyOptions } from '../stores/currenciesStore';
</script>

<Page name="home">
    <!-- Top Navbar -->
    <Navbar title="Overview" />
    {#each $expenses as { item, itemId } (itemId)}
        {item.currency}
        {item.title}
        {item.amount}
        {item.category}
        <br />
    {/each}
    {$baseCurrency}
    {$currencyOptions}
</Page>
