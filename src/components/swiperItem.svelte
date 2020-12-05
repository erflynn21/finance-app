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
    import { afterUpdate, onMount } from 'svelte';
    import EditExpense from './editExpense.svelte';
    import EditIncome from './editIncome.svelte';
    import { Plugins } from '@capacitor/core';
    import { removeAllListeners } from 'process';
    import { f7 } from 'framework7-svelte';
    import { deleteExpense } from '../stores/expensesStore';
    import { deleteIncome } from '../stores/incomesStore';
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

    $: if (editing === false) {
        removeAllListeners();
    }

    let editModalInstance;
    // opens editing modal
    let editModal;
    let editing = false;
    const edit = () => {
        editing = true;
        setTimeout(function () {
            editModalInstance = editModal.instance();
            editModalInstance.open();
        }, 50);
    };

    // closes editing modal
    const closeModal = () => {
        if (editModal !== null) {
            editModalInstance = editModal.instance();
            editModalInstance.close();
        } else {
            document.querySelector('.sheet-backdrop').style.display = 'none';
            document.querySelector('.backdrop-in').style.display = 'none';
        }
        editing = false;
    };

    let date, date1, date2, date3;
    // sets date for date picker
    const setDate = () => {
        date;
        date1 = item.date.split('-');
        date2 = date1[1] + '/' + date1[2];
        if (date2.startsWith('0')) {
            date3 = date2.split('0');
            if (date3[2] === undefined) {
                date = date3[1];
            } else {
                date = date3[1] + date3[2];
            }
        } else {
            date = date2;
        }
    };

    const deleteItem = () => {
        f7.dialog.confirm(
            'Are you sure you want to delete this item?',
            ' ',
            () => {
                f7.dialog.preloader(`Deleting ${type}...`);
                if (type === 'expense') {
                    deleteExpense(itemId).then(() => f7.dialog.close());
                } else if (type === 'income') {
                    deleteIncome(itemId).then(() => f7.dialog.close());
                }
            }
        );
    };

    onMount(() => {
        if (item.date) {
            setDate();
        }
    });
    afterUpdate(() => {
        if (item.date) {
            setDate();
        }
    });
</script>

<ListItem
    swipeout
    header={date}
    title={item.title}
    after="{$baseCurrencySymbol}{item.amount}">
    <SwipeoutActions right>
        <SwipeoutButton on:click={edit}>Edit</SwipeoutButton>
        <SwipeoutButton color="red" overswipe on:click={deleteItem}>
            Delete
        </SwipeoutButton>
    </SwipeoutActions>
</ListItem>

{#if editing === true && type === 'expense'}
    <Sheet
        class="edit"
        style="height: auto; max-height: 80vh"
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
        <EditExpense {item} {itemId} on:collapse={closeModal} />
    </Sheet>
{/if}

{#if editing === true && type === 'income'}
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
        <EditIncome {item} {itemId} on:collapse={closeModal} />
    </Sheet>
{/if}

<style>
    :global(.edit) {
        transition: margin-bottom 100ms ease;
    }
</style>
