<script>
    export let item;
    export let itemId;
    import ListItemCell from 'framework7-svelte/components/list-item-cell.svelte';
    import ListItemRow from 'framework7-svelte/components/list-item-row.svelte';
    import List from 'framework7-svelte/components/list.svelte';
    import { baseCurrencySymbol } from '../stores/currenciesStore';
    import { deleteExpense, expenses } from '../stores/expensesStore';
    import { tweened } from 'svelte/motion';
    import SwipeoutActions from 'framework7-svelte/components/swipeout-actions.svelte';
    import SwipeoutButton from 'framework7-svelte/components/swipeout-button.svelte';
    import Sheet from 'framework7-svelte/components/sheet.svelte';
    import Toolbar from 'framework7-svelte/components/toolbar.svelte';
    import Link from 'framework7-svelte/components/link.svelte';
    import EditMonthlyBudget from './editMonthlyBudget.svelte';
    import { deleteMonthlyBudget } from '../stores/monthlyBudgetsStore';
    import SwiperItem from './swiperItem.svelte';
    import Icon from 'framework7-svelte/components/icon.svelte';
    import Button from 'framework7-svelte/components/button.svelte';

    let dropdown = false;

    // const openMenu = () => {
    //     dropdown = !dropdown;
    //     console.log(dropdown);
    // };

    // sets expenses sum and category expenses for each category
    $: categorySum = 0;
    $: categoryExpenses = [];
    const calcCategoryExpenses = () => {
        let categoryExpensesAmounts = [];
        $expenses.forEach((expense) => {
            if (expense.item.category === item.category) {
                categoryExpensesAmounts = [
                    ...categoryExpensesAmounts,
                    expense.item.amount,
                ];
                categoryExpenses = [...categoryExpenses, expense];
            }
            categorySum = categoryExpensesAmounts.reduce(function (a, b) {
                const sum = a + b;
                const trimmed = Number(sum.toFixed(2));
                return trimmed;
            }, 0);
        });
    };
    $: if ($expenses) calcCategoryExpenses();

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

    // percentage and tweened values
    $: percentage = Math.floor((100 / item.amount) * categorySum) || 0;
    const tweenedPercentage = tweened(0);
    $: tweenedPercentage.set(percentage);
</script>

<!-- swipeout on:swipeoutDelete={() => deleteMonthlyBudget(itemId)} -->
<List class="monthly-budget-list">
    <li class="swipeout delete-callback">
        <div class="swipeout-content item-content">
            <div class="item-inner item-cell">
                <ListItemRow class="budget-summary-grid">
                    <ListItemCell>
                        <h4>{item.category}</h4>
                    </ListItemCell>
                    <ListItemCell>
                        {$baseCurrencySymbol}{categorySum}
                        of
                        {$baseCurrencySymbol}{item.amount}
                    </ListItemCell>
                </ListItemRow>
                <ListItemRow>
                    <div class="grid">
                        <div class="percentage">
                            {#if percentage <= 70}
                                <div
                                    class="percent"
                                    style="width: {$tweenedPercentage}%; background-color: green" />
                                <span>{percentage}%</span>
                            {:else if percentage > 70 && percentage <= 90}
                                <div
                                    class="percent"
                                    style="width: {$tweenedPercentage}%; background-color: yellow" />
                                <span
                                    style="color: #383838">{percentage}%</span>
                            {:else}
                                <div
                                    class="percent"
                                    style="width: {$tweenedPercentage}%; background-color: red" />
                                <span>{percentage}%</span>
                            {/if}
                        </div>
                        <!-- <div on:click={openMenu}>
                            
                        </div> -->
                        <div
                            class="dropdown"
                            on:click={() => (dropdown = !dropdown)}>
                            {#if dropdown === false}
                                <Icon
                                    f7="chevron_down"
                                    size="20"
                                    style="align-self: center" />
                            {:else}
                                <Icon
                                    f7="chevron_up"
                                    size="20"
                                    style="align-self: center" />
                            {/if}
                        </div>
                    </div>
                </ListItemRow>
            </div>
        </div>
        <SwipeoutActions right>
            <SwipeoutButton on:click={edit}>Edit</SwipeoutButton>
            <!-- <SwipeoutButton
                delete
                color="red"
                overswipe
                confirmText="Are you sure you want to delete this budget category?"
                confirmTitle=" ">
                Delete
            </SwipeoutButton> -->
        </SwipeoutActions>
    </li>

    {#if dropdown === true}
        {#each categoryExpenses as { item, itemId } (itemId)}
            <SwiperItem
                {item}
                {itemId}
                type="expense"
                on:deleted={() => deleteExpense(itemId)} />
        {/each}
    {/if}
    <!-- <button on:click={() => deleteMonthlyBudget(itemId)}>X</button> -->
</List>

{#if editing === true}
    <Sheet
        class="edit"
        style="height: auto; max-height: 70vh"
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
        <EditMonthlyBudget {item} {itemId} on:collapse={closeModal} />
    </Sheet>
{/if}

<style>
    .grid {
        display: grid;
        grid-template-columns: 1fr 0.1fr;
        width: 100%;
        height: 25px;
        margin-top: 10px;
    }

    .percentage {
        grid-column: 1/2;
        width: 100%;
        position: relative;
        background-color: lightgray;
        box-sizing: border-box;
        border-radius: 5px;
        display: flex;
        align-items: center;
    }

    span {
        position: absolute;
        color: white;
        padding-left: 5px;
        font-size: 14px;
    }

    .percent {
        height: 100%;
        position: absolute;
        box-sizing: border-box;
        background-color: green;
        border-radius: 5px;
    }

    .dropdown {
        grid-column: 2/3;
        justify-self: end;
    }
</style>