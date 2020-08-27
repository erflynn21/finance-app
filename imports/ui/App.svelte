<script>
    import { useTracker } from 'meteor/rdb:svelte-meteor-data';
    import Expense from './components/Expense.svelte';
    import Income from './components/Income.svelte';
    import AddExpenseForm from './components/AddExpenseForm.svelte';
    import AddIncomeForm from './components/AddIncomeForm.svelte';
    import { Expenses } from '../api/expenses';
    import { Incomes } from '../api/incomes';

    $: expenses = useTracker(() =>
        Expenses.find({}, { sort: { date: -1 } }).fetch()
    );

    $: incomes = useTracker(() =>
        Incomes.find({}, { sort: { date: -1 } }).fetch()
    );

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
    <h1>Expenses:</h1>
    <!-- List of expenses -->
    {#each $expenses as expense (expense._id)}
        <Expense {expense} />
    {/each}
    <h3>Total Expenses:</h3>
    <h1>Incomes:</h1>
    <!-- List of incomes -->
    {#each $incomes as income (income._id)}
        <Income {income} />
    {/each}
    <h3>Total Income:</h3>
    <h1>Remaining:</h1>

</div>
