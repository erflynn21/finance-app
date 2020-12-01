<script>
    import { Page, Navbar } from 'framework7-svelte';
    import Button from 'framework7-svelte/components/button.svelte';
    import List from 'framework7-svelte/components/list.svelte';
    import Sheet from 'framework7-svelte/components/sheet.svelte';
    import { onMount } from 'svelte';
    import AddBudget from '../components/addBudget.svelte';
    import { hideFAB, showFAB } from '../js/fab';
    import { budgets, deleteBudget } from '../stores/budgetsStore';
    import Toolbar from 'framework7-svelte/components/toolbar.svelte';
    import Link from 'framework7-svelte/components/link.svelte';
    import SettingsSwiper from '../components/settingsSwiper.svelte';
    import Block from 'framework7-svelte/components/block.svelte';

    onMount(() => {
        hideFAB();
    });
</script>

<Page name="budgets" noToolbar onPageBeforeOut={() => showFAB()}>
    <Navbar title="Budgets" backLink="Back" on:clickBack={() => showFAB()} />
    <Block class="text-align-center">
        Below are the budgets that will be automatically regenerated every month
        to create your monthly budget. You can adjust the amounts and categories
        of each budget and it will be reflected moving forward. Note: Updating a
        budget category will not update the current month's budget category or
        previous month's, only those generated in the future.
    </Block>
    <List>
        {#each $budgets as { item, itemId } (itemId)}
            <SettingsSwiper
                {item}
                {itemId}
                type="budget"
                on:deleted={() => deleteBudget(itemId)} />
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
