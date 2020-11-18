<script>
    import { Page, Navbar } from 'framework7-svelte';
    import Button from 'framework7-svelte/components/button.svelte';
    import List from 'framework7-svelte/components/list.svelte';
    import Sheet from 'framework7-svelte/components/sheet.svelte';
    import { onMount } from 'svelte';
    import AddBudget from '../components/addBudget.svelte';
    import BudgetSwiper from '../components/budgetSwiper.svelte';
    import { hideFAB, showFAB } from '../js/fab';
    import { budgets, deleteBudget } from '../stores/budgetsStore';

    onMount(() => {
        hideFAB();
    });
</script>

<Page name="budgets" noToolbar>
    <!-- Top Navbar -->
    <Navbar title="Budgets" backLink="Back" on:clickBack={() => showFAB()} />
    <List>
        {#each $budgets as { item, itemId } (itemId)}
            <BudgetSwiper {item} on:deleted={() => deleteBudget(itemId)} />
        {/each}
    </List>

    <Button sheetOpen=".add-budget">Add Budget</Button>

    <Sheet class="add-budget" style="height: auto;" swipeToClose backdrop>
        <div class="swipe-handler" />
        <AddBudget />
    </Sheet>
</Page>
