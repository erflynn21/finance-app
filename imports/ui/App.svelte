<script>
    import AddExpenseForm from './components/AddExpenseForm.svelte';
    import AddIncomeForm from './components/AddIncomeForm.svelte';
    import ExpenseList from './components/ExpenseList.svelte';
    import IncomeList from './components/IncomeList.svelte';

    // let totalExpenses = [];
    // let expenseSum = 0;
    // let totalIncome = 0;

    // const calculateExpenses = () => {
    //     totalExpenses = [...totalExpenses, expense.amount];
    //     console.log(totalExpenses);
    //     expenseSum = totalExpenses.reduce(function (a, b) {
    //         return a + b;
    //     }, 0);
    // };

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
    </header>
    <div>
        <ExpenseList on:recalculateExpenses={recalculateExpenses} />
        <h3>Total Expenses: {expenseSum}</h3>
        <IncomeList on:recalculateIncome={recalculateIncomes} />
        <h3>Total Income: {incomeSum}</h3>
        <h1>Remaining: {remainingBudget}</h1>
    </div>
</div>
