<script>
    import { Meteor } from 'meteor/meteor';
    import { afterUpdate } from 'svelte';
    import Expense from './Expense.svelte';
    export let budget;
    export let month;
    export let year;
    import { tweened } from 'svelte/motion';
    import { MonthlyBudgets } from '../../api/monthlybudgets';
    import ListItem from '../shared/ListItem.svelte';
    import { userCurrencySymbol } from '../stores/UserCurrencySymbolStore';
    import EditPopUp from '../shared/EditPopUp.svelte';
    import { expensesStore } from '../stores/ExpensesStore';
    import { monthlyBudgetsStore } from '../stores/MonthlyBudgetsStore';

    $: monthlyBudget = {
        month: month,
        year: year,
        category: budget.category,
        amount: budget.amount,
        currency: budget.currency,
        originalCurrency: budget.originalCurrency,
        originalAmount: budget.originalAmount,
        _id: null,
    };

    const toggleEdit = () => {
        editTab = !editTab;
    };

    let editTab = false;

    let isDropdown = true;

    let monthlybudget = [];
    const checkMonthlyBudget = () => {
        if (monthlyBudget.month === undefined) {
            return;
        } else {
            if ($monthlyBudgetsStore.length !== 0) {
                monthlybudget = $monthlyBudgetsStore.filter(
                    (budget) => budget.category === monthlyBudget.category
                );
                // console.log(monthlybudget[0]);
                if (monthlybudget[0] === undefined) {
                    Meteor.call('monthlybudgets.insert', monthlyBudget);
                    const newmonthlybudget = MonthlyBudgets.findOne({
                        year: year,
                        month: month,
                        category: monthlyBudget.category,
                    });
                    monthlyBudget = {
                        month: newmonthlybudget.month,
                        year: newmonthlybudget.year,
                        category: newmonthlybudget.category,
                        amount: newmonthlybudget.amount,
                        currency: newmonthlybudget.currency,
                        originalCurrency: newmonthlybudget.originalCurrency,
                        _id: newmonthlybudget._id,
                        originalAmount: newmonthlybudget.originalAmount,
                    };
                } else {
                    monthlyBudget = {
                        month: monthlybudget[0].month,
                        year: monthlybudget[0].year,
                        category: monthlybudget[0].category,
                        amount: monthlybudget[0].amount,
                        currency: monthlybudget[0].currency,
                        originalCurrency: monthlybudget[0].originalCurrency,
                        _id: monthlybudget[0]._id,
                        originalAmount: monthlybudget[0].originalAmount,
                    };
                    // console.log(monthlyBudget);
                }
            }
        }
    };

    afterUpdate(() => {
        checkMonthlyBudget();
        calculateCategoryExpenses();
        setPercentages();
    });

    $: expenseSum = 0;
    const calculateCategoryExpenses = () => {
        if (monthlyBudget.amount === undefined) {
        } else {
            let expenses = [];
            $expensesStore.forEach((expense) => {
                if (expense.category === monthlyBudget.category) {
                    expenses = [...expenses, expense.amount];
                }
            });
            expenseSum = expenses.reduce(function (a, b) {
                return a + b;
            }, 0);
        }
    };

    $: percentage = 0;
    const tweenedPercentage = tweened(0);
    $: tweenedPercentage.set(percentage);
    const setPercentages = () => {
        if (monthlyBudget.amount === undefined) {
            return;
        } else {
            percentage =
                Math.floor((100 / monthlyBudget.amount) * expenseSum) || 0;
            tweenedPercentage.set(percentage);
        }
    };
    // percentage and tweened values
</script>

<div class="container">
    <ListItem>
        <div class="grid row-one">
            <div class="category-name">
                <h4>{budget.category}</h4>
            </div>
            <div class="amount-summary">
                {$userCurrencySymbol}{expenseSum}
                of
                {$userCurrencySymbol}{monthlyBudget.amount}
                <button class="edit" on:click={toggleEdit}>
                    <img src="/img/edit.svg" alt="" />
                </button>
            </div>
        </div>
        <div class="grid row-two">
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
                    <span style="color: gray">{percentage}%</span>
                {:else}
                    <div
                        class="percent"
                        style="width: {$tweenedPercentage}%; background-color: red" />
                    <span>{percentage}%</span>
                {/if}
            </div>
            <div class="dropdown" on:click={() => (isDropdown = !isDropdown)}>
                <img src="/img/dropdown.svg" alt="" />
            </div>
        </div>
        <div class:isDropdown class="expense-dropdown">
            {#each $expensesStore as expense (expense._id)}
                {#if expense.category === budget.category}
                    <Expense {expense} />
                    {#each [calculateCategoryExpenses(expense)] as expense}
                        <div />
                    {/each}
                {/if}
            {/each}
            <br />
        </div>
    </ListItem>
</div>

{#if editTab === true}
    <EditPopUp on:collapse={toggleEdit} {monthlyBudget} {month} {year} />
{/if}

<style>
    .container {
        margin-bottom: 10px;
    }
    .grid {
        display: grid;
        margin: 5px 0;
        width: calc(100vw - 25px);
    }

    .row-one {
        grid-template-columns: 0.75fr 1fr;
    }

    .amount-summary {
        justify-self: end;
    }

    .amount-summary button img {
        height: 15px;
    }

    .row-two {
        grid-template-columns: 1fr 0.1fr;
        height: 25px;
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

    .dropdown img {
        height: 20px;
    }

    button,
    button:active,
    button:visited,
    button:enabled,
    button:focus {
        margin: 0;
        padding: 0;
        border: 0;
        background: transparent;
        outline: 0;
        min-width: 0px;
    }

    .expense-dropdown {
        margin-left: -10px;
        margin-bottom: -15px;
    }
</style>
