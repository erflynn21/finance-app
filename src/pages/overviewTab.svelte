<script>
    import { Page, Navbar } from 'framework7-svelte';
    import { expensesStore } from '../stores/store';
</script>

<Page name="home">
    <!-- Top Navbar -->
    <Navbar title="Overview" />
    {#each $expensesStore as expense}{expense}{/each}
</Page>
