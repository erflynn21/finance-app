<script>
    import { Meteor } from 'meteor/meteor';
    import { onMount } from 'svelte';
    import { useTracker } from 'meteor/rdb:svelte-meteor-data';
    import { Expenses } from '../../api/expenses';
    import Expense from './Expense.svelte';
    export let budget;
    export let month;
    export let year;
    import UpdateMonthlyBudgetForm from './UpdateMonthlyBudgetForm.svelte';
    import { MonthlyBudgets } from '../../api/monthlybudgets';
    import { createEventDispatcher } from 'svelte';
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
</script>

<span>{budget.category} --</span>
<span>
    Budgeted: {monthlyBudget.amount}
    <button class="edit" on:click={() => (isHidden = !isHidden)}>Edit</button>
    <div class:hidden={isHidden}>
        <UpdateMonthlyBudgetForm
            {monthlyBudget}
            on:collapse={() => (isHidden = !isHidden)}
            on:updateBudgets={calculateCategoryExpenses} />
    </div>
</span>
<span>Spent: {expenseSum}</span>
<br />
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
