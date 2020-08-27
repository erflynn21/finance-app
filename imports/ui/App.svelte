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
        <ExpenseList />
        <IncomeList />
        <h1>Remaining:</h1>
    </div>
</div>
