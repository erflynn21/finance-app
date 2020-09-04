<script>
    import { onMount } from 'svelte';
    import ExpenseList from './ExpenseList.svelte';
    import IncomeList from './IncomeList.svelte';
    import { expenseSumStore } from '../stores/ExpenseSumStore';
    import { incomeSumStore } from '../stores/IncomeSumStore';
    import { Expenses } from '../../api/expenses';
    import Heading from '../shared/Heading.svelte';

    // getting summary of total amounts for expenses, income and budgets
    $: expenseSum = 0;
    const calculateExpenses = () => {
        let totalExpenses = Expenses.find({}).fetch();
        let expenses = [];
        totalExpenses.forEach((expense) => {
            expenses = [...expenses, expense.amount];
        });
        expenseSum = expenses.reduce(function (a, b) {
            return a + b;
        }, 0);
        expenseSumStore.set(expenseSum);
    };

    $: incomeSum = 0;
    const recalculateIncomes = (totalIncomes) => {
        incomes = totalIncomes.detail.data;
        incomeSum = incomes.reduce(function (a, b) {
            return a + b;
        }, 0);
        incomeSum = incomes.reduce(function (a, b) {
            return a + b;
        }, 0);
        incomeSumStore.set(incomeSum);
    };

    $: remainingTotal = Number(($incomeSumStore - $expenseSumStore).toFixed(2));

    onMount(() => {
        Meteor.subscribe('expenses', function () {
            calculateExpenses();
        });
    });
</script>

<div class="container">
    <Heading>Transactions</Heading>
    <div>
        <!-- List of expenses -->
        <ExpenseList
            on:delete={calculateExpenses}
            on:expenseEdited={calculateExpenses}
            on:calculate={calculateExpenses} />
        <h3>Total Expenses: {$expenseSumStore}</h3>
        <!-- List of incomes -->
        <IncomeList on:recalculateIncome={recalculateIncomes} />
        <h3>Total Income: {$incomeSumStore}</h3>
        <h3>Remaining Total: {remainingTotal}</h3>
    </div>
</div>
