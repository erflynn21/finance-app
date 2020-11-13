<script>
    import { Page, Navbar } from 'framework7-svelte';
    import { expenses } from '../stores/expensesStore';
</script>

<Page name="home">
    <!-- Top Navbar -->
    <Navbar title="Overview" />
    {#each $expenses as { item, itemId } (itemId)}{item.currency}{/each}
</Page>
