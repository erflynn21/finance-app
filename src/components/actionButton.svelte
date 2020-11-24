<script>
    import Fab from 'framework7-svelte/components/fab.svelte';
    import Icon from 'framework7-svelte/components/icon.svelte';
    import FabButtons from 'framework7-svelte/components/fab-buttons.svelte';
    import FabButton from 'framework7-svelte/components/fab-button.svelte';
    import Sheet from 'framework7-svelte/components/sheet.svelte';
    import Button from 'framework7-svelte/components/button.svelte';
    import AddExpense from './addExpense.svelte';
    import AddIncome from './addIncome.svelte';
    import FabBackdrop from 'framework7-svelte/components/fab-backdrop.svelte';
    import PageContent from 'framework7-svelte/components/page-content.svelte';
    import Toolbar from 'framework7-svelte/components/toolbar.svelte';
    import Link from 'framework7-svelte/components/link.svelte';
</script>

<FabBackdrop />

<Fab position="right-bottom">
    <Icon ios="f7:plus" md="material:add" />
    <Icon ios="f7:xmark" md="material:close" />
    <FabButtons position="top">
        <FabButton label="Add Expense" fabClose>
            <Button sheetOpen=".add-expense">
                <Icon material="create" />
            </Button>
        </FabButton>
        <FabButton label="Add Income" fabClose>
            <Button sheetOpen=".add-income">
                <Icon material="today" />
            </Button>
        </FabButton>
    </FabButtons>
</Fab>

<Sheet class="add-expense" style="height: auto; max-height: 80vh" backdrop>
    <Toolbar>
        <div class="left">Add New Expense</div>
        <div class="right">
            <Link sheetClose>Close</Link>
        </div>
    </Toolbar>
    <div class="swipe-handler" />
    <AddExpense />
</Sheet>

<Sheet class="add-income" style="height: auto;" swipeToClose backdrop>
    <div class="swipe-handler" />
    <AddIncome />
</Sheet>

<style>
    :global(.fab) {
        transition-delay: 0ms;
    }
</style>
