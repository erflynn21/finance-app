<script>
    import { Meteor } from 'meteor/meteor';
    import { onMount } from 'svelte';
    import { useTracker } from 'meteor/rdb:svelte-meteor-data';
    import { Expenses } from '../../api/expenses';
    import Expense from './Expense.svelte';
    export let budget;
    export let month;
    export let year;
    import { createEventDispatcher } from 'svelte';
    import UpdateMonthlyBudgetForm from './UpdateMonthlyBudgetForm.svelte';
    import { MonthlyBudgets } from '../../api/monthlybudgets';
    import { subscribe } from 'svelte/internal';
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

    $: expenses = useTracker(() => Expenses.find({}).fetch());

    // $: monthlybudgets = useTracker(() => MonthlyBudgets.find({}).fetch());

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
        Meteor.subscribe('expenses');
        Meteor.subscribe('monthlybudgets', function () {
            checkMonthlyBudget();
        });
    });

    $: totalExpenses = [];
    let totalExpensesIDs = [];
    const calculateTotal = (expense) => {
        if (totalExpensesIDs.includes(expense._id) === false) {
            totalExpensesIDs = [...totalExpensesIDs, expense._id];
            totalExpenses = [...totalExpenses, expense.amount];
        }
        recalculateExpenses(totalExpenses);
    };

    const updateExpenseInTotal = (expense) => {
        const index = totalExpensesIDs.indexOf(expense.detail._id);
        totalExpenses.splice(index, 1, expense.detail.amount);
        recalculateExpenses(totalExpenses);
    };

    const deleteExpenseFromTotal = (expense) => {
        const index = totalExpensesIDs.indexOf(expense.detail._id);
        totalExpenses.splice(index, 1);
        recalculateExpenses(totalExpenses);
    };

    let expensesSums = {
        sum: 0,
        id: '',
    };
    const recalculateExpenses = (totalExpenses) => {
        if (expensesSums.sum === 0) {
            expensesSums.sum = totalExpenses.reduce(function (a, b) {
                return a + b;
            }, 0);
            expensesSums.id = budget._id;
        } else {
            expensesSums.sum = totalExpenses.reduce(function (a, b) {
                return a + b;
            }, 0);
            expensesSums.id = budget._id;
        }

        dispatch('recalculateExpenses', { data: expensesSums });
    };
</script>

<span>{budget.category} --</span>
<span>
    Budgeted: {monthlyBudget.amount}
    <button class="edit" on:click={() => (isHidden = !isHidden)}>Edit</button>
    <div class:hidden={isHidden}>
        <UpdateMonthlyBudgetForm
            {monthlyBudget}
            on:collapse={() => (isHidden = !isHidden)}
            on:updateBudgets={checkMonthlyBudget} />
    </div>
</span>
<span>Spent: {expensesSums.sum}</span>
<br />
{#each $expenses as expense (expense._id)}
    {#if expense.category === budget.category}
        <Expense
            {expense}
            on:delete={deleteExpenseFromTotal}
            on:expenseEdited={updateExpenseInTotal} />
        {#each [calculateTotal(expense)] as expense}
            <div />
        {/each}
    {/if}
{/each}
<br />
