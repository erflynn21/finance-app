<script>
    import AddExpenseForm from './components/AddExpenseForm.svelte';
    import AddIncomeForm from './components/AddIncomeForm.svelte';
    import AddBudgetForm from './components/AddBudgetForm.svelte';
    import ExpenseList from './components/ExpenseList.svelte';
    import IncomeList from './components/IncomeList.svelte';
    import BudgetList from './components/BudgetList.svelte';

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

    $: remainingBudget = Number((incomeSum - expenseSum).toFixed(2));
</script>

<div class="container">
    <header>
        <h1>Budget</h1>
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
        <h1>Remaining Total: {remainingBudget}</h1>
        <!-- List of budgets -->
        <BudgetList />
    </div>
</div>
