<script>
    export let item;
    export let itemId;
    import {
        f7,
        List,
        Link,
        ListItemCell,
        ListItemRow,
        SwipeoutActions,
        SwipeoutButton,
        Sheet,
        Toolbar,
        Icon,
    } from 'framework7-svelte';
    import { budgetCurrency } from '../stores/currenciesStore';
    import { expenses } from '../stores/transactionsStore';
    import { tweened } from 'svelte/motion';
    // import EditMonthlyBudget from './editMonthlyBudget.svelte';
    import { deleteMonthlyBudget } from '../js/monthlyBudgets';
    // import SwiperItem from './swiperItem.svelte';
    import { flip } from 'svelte/animate';
    import { formatAmount } from '../js/currencies';
    import { Keyboard } from '@capacitor/keyboard';

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

    let dropdown = false;

    // sets expenses sum and category expenses for each category
    $: categorySum = 0;
    let categoryExpenses;
    const calcCategoryExpenses = () => {
        categorySum = 0;
        categoryExpenses = [];
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

    const deleteBudget = (itemId) => {
        f7.dialog.confirm(
            'Are you sure you want to delete this budget?',
            ' ',
            () => {
                deleteMonthlyBudget(itemId);
            }
        );
    };

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
    $: percentage = Math.ceil((100 / item.amount) * categorySum) || 0;
    const tweenedPercentage = tweened(0);
    $: tweenedPercentage.set(percentage);
</script>

<List class="monthly-budget-list">
    <li class="swipeout delete-callback">
        <div class="swipeout-content item-content">
            <div class="item-inner item-cell">
                <ListItemRow class="budget-summary-grid">
                    <ListItemCell>
                        <h4>{item.title}</h4>
                    </ListItemCell>
                    <ListItemCell>
                        {formatAmount(categorySum, $budgetCurrency)}
                        of
                        {formatAmount(item.amount, $budgetCurrency)}
                    </ListItemCell>
                </ListItemRow>
                <ListItemRow>
                    <div class="grid">
                        <div class="percentage">
                            {#if percentage <= 70}
                                <div
                                    class="percent"
                                    style="width: {$tweenedPercentage}%; background: linear-gradient(90deg, rgba(6,95,70,1) 0%, rgba(5,150,105,1) 100%);"
                                />
                                <span>{percentage}%</span>
                            {:else if percentage > 70 && percentage <= 90}
                                <div
                                    class="percent"
                                    style="width: {$tweenedPercentage}%; background: linear-gradient(90deg, rgba(202,138,4,1) 0%, rgba(250,204,21,1) 100%);"
                                />
                                <span>{percentage}%</span>
                            {:else}
                                <div
                                    class="percent"
                                    style="width: {$tweenedPercentage}%; background: linear-gradient(90deg, rgba(153,27,27,1) 0%, rgba(220,38,38,1) 100%);"
                                />
                                <span>{percentage}%</span>
                            {/if}
                        </div>
                        <div
                            class="dropdown"
                            on:click={() => (dropdown = !dropdown)}
                        >
                            {#if dropdown === false}
                                <Icon
                                    f7="chevron_down"
                                    size="20"
                                    style="align-self: center"
                                />
                            {:else}
                                <Icon
                                    f7="chevron_up"
                                    size="20"
                                    style="align-self: center"
                                />
                            {/if}
                        </div>
                    </div>
                </ListItemRow>
            </div>
        </div>
        <SwipeoutActions right>
            <SwipeoutButton on:click={edit}>Edit</SwipeoutButton>
            <SwipeoutButton color="red" on:click={deleteBudget(itemId)}>
                Delete
            </SwipeoutButton>
        </SwipeoutActions>
    </li>

    {#if dropdown === true}
        {#each categoryExpenses as { item, itemId } (itemId)}
            <div animate:flip={{ delay: 400, duration: 400 }}>
                {item.title}
                <!-- <SwiperItem {item} {itemId} type="expense" /> -->
            </div>
        {/each}
    {/if}
</List>

<!-- {#if editing === true}
    <Sheet
        class="edit"
        style="height: auto; max-height: 70vh"
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
        <EditMonthlyBudget {item} {itemId} on:collapse={closeModal} />
    </Sheet>
{/if} -->
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
        max-width: 100%;
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
        max-width: 100%;
    }

    .dropdown {
        grid-column: 2/3;
        justify-self: end;
    }
</style>
