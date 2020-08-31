<script>
    import { Meteor } from 'meteor/meteor';
    import AddExpenseForm from './AddExpenseForm.svelte';
    import AddIncomeForm from './AddIncomeForm.svelte';
    import AddBudgetForm from './AddBudgetForm.svelte';
    import ExpenseList from './ExpenseList.svelte';
    import IncomeList from './IncomeList.svelte';
    import BudgetList from './BudgetList.svelte';
    import { BlazeTemplate } from 'meteor/svelte:blaze-integration';
    import Settings from './Settings.svelte';

    // setting budget month
    const date = new Date();
    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    // getting summary of total amounts for expenses, income and budgets
    $: expenseSum = 0;
    const recalculateExpenses = (totalExpenses) => {
        expenses = totalExpenses.detail.data;
        expenseSum = expenses.reduce(function (a, b) {
            return a + b;
        }, 0);
    };

    $: incomeSum = 0;
    const recalculateIncomes = (totalIncomes) => {
        incomes = totalIncomes.detail.data;
        incomeSum = incomes.reduce(function (a, b) {
            return a + b;
        }, 0);
    };

    $: remainingTotal = Number((incomeSum - expenseSum).toFixed(2));

    $: budgetSum = 0;
    const recalculateBudgets = (totalBudgets) => {
        budgets = totalBudgets.detail.data;
        budgetSum = budgets.reduce(function (a, b) {
            return a + b;
        }, 0);
    };

    $: remainingBudget = incomeSum - budgetSum;
</script>

<div class="container">
    <header>
        <BlazeTemplate template="loginButtons" />
        <h1>Budget for {month} {year}</h1>
        <!-- Form to add expenses-->
        <AddExpenseForm />
        <!-- Form to add incomes -->
        <AddIncomeForm />
        <!-- Form to add budgets -->
        <AddBudgetForm />

    </header>
    <div>
        <!-- List of expenses -->
        <ExpenseList on:recalculateExpenses={recalculateExpenses} />
        <h3>Total Expenses: {expenseSum}</h3>
        <!-- List of incomes -->
        <IncomeList on:recalculateIncome={recalculateIncomes} />
        <h3>Total Income: {incomeSum}</h3>
        <h3>Remaining Total: {remainingTotal}</h3>
        <!-- List of budgets -->
        <BudgetList on:recalculateBudgets={recalculateBudgets} />
        <h3>
            Total Budgeted: {budgetSum} out of {incomeSum}. You have {remainingBudget}
            left to budget.
        </h3>
    </div>
    <Settings />
</div>
