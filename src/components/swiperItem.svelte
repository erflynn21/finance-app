<script>
    export let item;
    export let itemId;
    export let type;
    import ListItem from 'framework7-svelte/components/list-item.svelte';
    import SwipeoutActions from 'framework7-svelte/components/swipeout-actions.svelte';
    import SwipeoutButton from 'framework7-svelte/components/swipeout-button.svelte';
    import Sheet from 'framework7-svelte/components/sheet.svelte';
    import Toolbar from 'framework7-svelte/components/toolbar.svelte';
    import Link from 'framework7-svelte/components/link.svelte';
    import { baseCurrencySymbol } from '../stores/currenciesStore';
    import { createEventDispatcher } from 'svelte';
    import EditExpense from './editExpense.svelte';
    import EditIncome from './editIncome.svelte';
    const dispatch = createEventDispatcher();

    // opens editing modal
    let editModal;
    let editing = false;
    const edit = () => {
        editing = true;
        setTimeout(function () {
            const editModalInstance = editModal.instance();
            editModalInstance.open();
        }, 50);
    };

    // closes editing modal
    const closeModal = () => {
        const editModalInstance = editModal.instance();
        editModalInstance.close();
        editing = false;
    };

    // sets date for date picker
    let date;
    let date1 = item.date.split('-');
    let date2 = date1[1] + '/' + date1[2];
    if (date2.startsWith('0')) {
        let date3 = date2.split('0');
        if (date3[2] === undefined) {
            date = date3[1];
        } else {
            date = date3[1] + date3[2];
        }
    } else {
        date = date2;
    }
</script>

<ListItem
    swipeout
    header={date}
    title={item.title}
    after="{$baseCurrencySymbol}{item.amount}"
    on:swipeoutDelete={() => dispatch('deleted')}>
    <SwipeoutActions right>
        <SwipeoutButton on:click={edit}>Edit</SwipeoutButton>
        <SwipeoutButton
            delete
            color="red"
            overswipe
            confirmText="Are you sure you want to delete this item?"
            confirmTitle=" ">
            Delete
        </SwipeoutButton>
    </SwipeoutActions>
</ListItem>

{#if editing === true && type === 'expense'}
    <Sheet
        class="edit"
        style="height: auto; max-height: 80vh"
        backdrop
        bind:this={editModal}
        {item}
        {itemId}
        {type}>
        <Toolbar>
            <div class="left">Edit Expense</div>
            <div class="right">
                <Link sheetClose on:click={() => (editing = false)}>Close</Link>
            </div>
        </Toolbar>
        <div class="swipe-handler" />
        <EditExpense {item} {itemId} on:collapse={closeModal} />
    </Sheet>
{/if}

{#if editing === true && type === 'income'}
    <Sheet
        class="edit"
        style="height: auto; max-height: 70vh"
        backdrop
        bind:this={editModal}
        {item}
        {itemId}
        {type}>
        <Toolbar>
            <div class="left">Edit Expense</div>
            <div class="right">
                <Link sheetClose on:click={() => (editing = false)}>Close</Link>
            </div>
        </Toolbar>
        <div class="swipe-handler" />
        <EditIncome {item} {itemId} on:collapse={closeModal} />
    </Sheet>
{/if}
