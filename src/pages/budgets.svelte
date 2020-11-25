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
    import Toolbar from 'framework7-svelte/components/toolbar.svelte';
    import Link from 'framework7-svelte/components/link.svelte';

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
    <Sheet class="add-budget" style="height: auto; " swipeToClose backdrop>
        <Toolbar>
            <div class="left">Add New Budget</div>
            <div class="right">
                <Link sheetClose>Close</Link>
            </div>
        </Toolbar>
        <div class="swipe-handler" />
        <AddBudget />
    </Sheet>
</Page>
