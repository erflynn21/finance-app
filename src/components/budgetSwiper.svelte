<script>
    export let item;
    export let itemId;
    import {
        baseCurrency,
        baseCurrencySymbol,
    } from '../stores/currenciesStore';
    import { currencyDict } from '../stores/currencyDictStore';
    import ListItem from 'framework7-svelte/components/list-item.svelte';
    import SwipeoutActions from 'framework7-svelte/components/swipeout-actions.svelte';
    import SwipeoutButton from 'framework7-svelte/components/swipeout-button.svelte';
    import Sheet from 'framework7-svelte/components/sheet.svelte';
    import Toolbar from 'framework7-svelte/components/toolbar.svelte';
    import Link from 'framework7-svelte/components/link.svelte';
    import { createEventDispatcher } from 'svelte';
    import EditBudget from './editBudget.svelte';
    const dispatch = createEventDispatcher();

    let currencySymbol;
    if (item.currency === $baseCurrency) {
        currencySymbol = $baseCurrencySymbol;
    } else {
        currencySymbol = currencyDict[item.currency];
    }

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
</script>

<ListItem
    swipeout
    title={item.category}
    after="{currencySymbol}{item.amount}"
    on:swipeoutDelete={() => dispatch('deleted')}>
    <SwipeoutActions right>
        <SwipeoutButton on:click={edit}>Edit</SwipeoutButton>
        <SwipeoutButton
            delete
            color="red"
            overswipe
            confirmText="Are you sure you want to delete this budget?"
            confirmTitle=" ">
            Delete
        </SwipeoutButton>
    </SwipeoutActions>
</ListItem>

{#if editing === true}
    <Sheet
        class="edit"
        style="height: auto; max-height: 80vh"
        backdrop
        bind:this={editModal}
        {item}
        {itemId}>
        <Toolbar>
            <div class="left">Edit Expense</div>
            <div class="right">
                <Link sheetClose on:click={() => (editing = false)}>Close</Link>
            </div>
        </Toolbar>
        <div class="swipe-handler" />
        <EditBudget {item} {itemId} on:collapse={closeModal} />
    </Sheet>
{/if}
