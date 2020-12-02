<script>
    export let item;
    export let itemId;
    export let type;
    import {
        baseCurrency,
        baseCurrencySymbol,
    } from '../stores/currenciesStore';
    import { currencyDict } from '../stores/dictionariesStore';
    import ListItem from 'framework7-svelte/components/list-item.svelte';
    import SwipeoutActions from 'framework7-svelte/components/swipeout-actions.svelte';
    import SwipeoutButton from 'framework7-svelte/components/swipeout-button.svelte';
    import Sheet from 'framework7-svelte/components/sheet.svelte';
    import Toolbar from 'framework7-svelte/components/toolbar.svelte';
    import Link from 'framework7-svelte/components/link.svelte';
    import { createEventDispatcher, onDestroy } from 'svelte';
    import EditBudget from './editBudget.svelte';
    import EditMonthlyExpense from './editMonthlyExpense.svelte';
    import EditMonthlyIncome from './editMonthlyIncome.svelte';
    const dispatch = createEventDispatcher();
    import { Plugins } from '@capacitor/core';
    import { removeAllListeners } from 'process';
    const { Keyboard } = Plugins;

    $: if (editing === true) {
        Keyboard.addListener('keyboardWillShow', (info) => {
            document.getElementById('edit').style.marginBottom = `${
                info.keyboardHeight - 20
            }px`;
        });

        Keyboard.addListener('keyboardWillHide', () => {
            document.getElementById('edit').style.marginBottom = '0px';
        });
    }

    onDestroy(() => {
        removeAllListeners();
    });

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

{#if type === 'budget'}
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
{:else}
    <ListItem
        swipeout
        title={item.title}
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
{/if}

{#if editing === true && type === 'budget'}
    <Sheet
        class="edit"
        style="height: auto; max-height: 80vh"
        id="edit"
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

{#if editing === true && type === 'monthlyExpense'}
    <Sheet
        class="edit"
        style="height: auto; max-height: 70vh"
        id="edit"
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
        <EditMonthlyExpense {item} {itemId} on:collapse={closeModal} />
    </Sheet>
{/if}

{#if editing === true && type === 'monthlyIncome'}
    <Sheet
        class="edit"
        style="height: auto; max-height: 70vh"
        id="edit"
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
        <EditMonthlyIncome {item} {itemId} on:collapse={closeModal} />
    </Sheet>
{/if}
