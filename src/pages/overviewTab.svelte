<script>
    import { Page, Navbar } from 'framework7-svelte';
    import { expenses } from '../stores/expensesStore';
</script>

<Page name="home">
    <Navbar title="Overview" />
    {#each $expenses as { item, itemId } (itemId)}
        {item.currency}
        {item.title}
        {item.amount}
        {item.category}
        <br />
    {/each}
</Page>
