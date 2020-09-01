<script>
    import AddExpenseForm from './AddExpenseForm.svelte';
    import AddIncomeForm from './AddIncomeForm.svelte';
    import AddBudgetForm from './AddBudgetForm.svelte';
    import ExpenseList from './ExpenseList.svelte';
    import IncomeList from './IncomeList.svelte';
    import BudgetList from './BudgetList.svelte';
    import { BlazeTemplate } from 'meteor/svelte:blaze-integration';
    import Settings from './Settings.svelte';
    import MonthlyBudget from './MonthlyBudget.svelte';

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
    <div class="login">
        <BlazeTemplate template="loginButtons" />
    </div>

    <div>
        <MonthlyBudget on:recalculateExpenses={recalculateExpenses} />
    </div>

    <div class="forms">
        <!-- Form to add expenses-->
        <AddExpenseForm />
        <!-- Form to add incomes -->
        <AddIncomeForm />
        <!-- Form to add budgets -->
        <AddBudgetForm />
    </div>
    <div>
        <!--  -->
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
