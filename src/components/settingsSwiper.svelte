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
    import EditBudget from './editBudget.svelte';
    import EditMonthlyExpense from './editMonthlyExpense.svelte';
    import EditMonthlyIncome from './editMonthlyIncome.svelte';
    import { Plugins } from '@capacitor/core';
    import { deleteBudget } from '../stores/budgetsStore';
    import { deleteMonthlyExpense } from '../stores/monthlyExpensesStore';
    import { deleteMonthlyIncome } from '../stores/monthlyIncomesStore';
    import { f7 } from 'framework7-svelte';
    const { Keyboard } = Plugins;

    $: if (editing === true) {
        Keyboard.addListener('keyboardWillShow', (info) => {
            if (document.getElementById('edit')) {
                document.getElementById('edit').style.marginBottom = `${
                    info.keyboardHeight - 20
                }px`;
            }
        });

        Keyboard.addListener('keyboardWillHide', () => {
            if (document.getElementById('edit')) {
                document.getElementById('edit').style.marginBottom = '0px';
            }
        });
    }

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

    const deleteItem = () => {
        f7.dialog.confirm(
            'Are you sure you want to delete this item?',
            ' ',
            () => {
                f7.dialog.preloader(`Deleting ${type}...`);
                if (type === 'budget') {
                    deleteBudget(itemId).then(() => f7.dialog.close());
                } else if (type === 'monthly expense') {
                    deleteMonthlyExpense(itemId).then(() => f7.dialog.close());
                } else if (type === 'monthly income') {
                    deleteMonthlyIncome(itemId).then(() => f7.dialog.close());
                }
            }
        );
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
    >
        <SwipeoutActions right>
            <SwipeoutButton on:click={edit}>Edit</SwipeoutButton>
            <SwipeoutButton color="red" on:click={deleteItem}>
                Delete
            </SwipeoutButton>
        </SwipeoutActions>
    </ListItem>
{:else}
    <ListItem swipeout title={item.title} after="{currencySymbol}{item.amount}">
        <SwipeoutActions right>
            <SwipeoutButton on:click={edit}>Edit</SwipeoutButton>
            <SwipeoutButton color="red" on:click={deleteItem}>
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
        {itemId}
    >
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

{#if editing === true && type === 'monthly expense'}
    <Sheet
        class="edit"
        style="height: auto; max-height: 70vh"
        id="edit"
        backdrop
        bind:this={editModal}
        {item}
        {itemId}
        {type}
    >
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

{#if editing === true && type === 'monthly income'}
    <Sheet
        class="edit"
        style="height: auto; max-height: 70vh"
        id="edit"
        backdrop
        bind:this={editModal}
        {item}
        {itemId}
        {type}
    >
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
