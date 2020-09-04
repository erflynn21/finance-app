<script>
    import { Meteor } from 'meteor/meteor';
    import { onMount } from 'svelte';
    import { useTracker } from 'meteor/rdb:svelte-meteor-data';
    import { Expenses } from '../../api/expenses';
    import { userCurrencySymbol } from '../stores/UserCurrencySymbolStore';
    import Expense from './Expense.svelte';
    export let budget;
    export let month;
    export let year;
    import { tweened } from 'svelte/motion';
    import UpdateMonthlyBudgetForm from './UpdateMonthlyBudgetForm.svelte';
    import { MonthlyBudgets } from '../../api/monthlybudgets';
    import { createEventDispatcher } from 'svelte';
    import ListItem from '../shared/ListItem.svelte';
    let dispatch = createEventDispatcher();

    $: monthlyBudget = {
        month: month,
        year: year,
        category: budget.category,
        amount: budget.amount,
        currency: budget.currency,
        id: null,
    };

    let isHidden = true;

    let isDropdown = true;

    $: expenses = useTracker(() => Expenses.find({}).fetch());

    const checkMonthlyBudget = () => {
        let monthlybudget = MonthlyBudgets.findOne({
            year: year,
            month: month,
            category: monthlyBudget.category,
        });

        if (monthlybudget === undefined) {
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
                id: newmonthlybudget._id,
            };
        } else {
            monthlyBudget = {
                month: monthlybudget.month,
                year: monthlybudget.year,
                category: monthlybudget.category,
                amount: monthlybudget.amount,
                currency: monthlybudget.currency,
                id: monthlybudget._id,
            };
        }
    };

    onMount(() => {
        Meteor.subscribe('monthlybudgets', function () {
            checkMonthlyBudget();
        });
        calculateCategoryExpenses();
    });

    $: expenseSum = 0;
    const calculateCategoryExpenses = () => {
        let totalExpenses = Expenses.find({
            category: monthlyBudget.category,
        }).fetch();
        let expenses = [];
        totalExpenses.forEach((expense) => {
            expenses = [...expenses, expense.amount];
        });
        expenseSum = expenses.reduce(function (a, b) {
            return a + b;
        }, 0);
        dispatch('calculate');
    };

    // percentage and tweened values
    $: percentage = Math.floor((100 / monthlyBudget.amount) * expenseSum) || 0;
    const tweenedPercentage = tweened(0);
    $: tweenedPercentage.set(percentage);
</script>

<div class="container">
    <ListItem>
        <div class="grid row-one">
            <div class="category-name">
                <h4>{budget.category}</h4>
            </div>
            <div class="amount-summary">
                <p class="amount">
                    {$userCurrencySymbol}{expenseSum} of {$userCurrencySymbol}{monthlyBudget.amount}
                </p>
                <button class="edit" on:click={() => (isHidden = !isHidden)}>
                    <img src="/img/edit.svg" alt="" />
                </button>
            </div>
        </div>
        <div class:hidden={isHidden}>
            <UpdateMonthlyBudgetForm
                {monthlyBudget}
                on:collapse={() => (isHidden = !isHidden)}
                on:updateBudgets={calculateCategoryExpenses} />
        </div>
        <div class="grid row-two">
            <div class="percentage">
                <div class="percent" style="width: {$tweenedPercentage}%" />
                <span>{percentage}%</span>
            </div>
            <div class="dropdown" on:click={() => (isDropdown = !isDropdown)}>
                <img src="/img/dropdown.svg" alt="" />
            </div>
        </div>
        <div class:isDropdown class="expense-dropdown">
            {#each $expenses as expense (expense._id)}
                {#if expense.category === budget.category}
                    <Expense
                        {expense}
                        on:delete={calculateCategoryExpenses}
                        on:expenseEdited={calculateCategoryExpenses} />
                    {#each [calculateCategoryExpenses(expense)] as expense}
                        <div />
                    {/each}
                {/if}
            {/each}
            <br />
        </div>
    </ListItem>
</div>

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
        grid-template-columns: 1fr 1fr;
    }

    .amount-summary {
        justify-self: end;
        display: flex;
    }

    .amount {
        padding-right: 18px;
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
        background-color: #9ccc65;
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
