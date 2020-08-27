<script>
    import { useTracker } from 'meteor/rdb:svelte-meteor-data';
    import { Expenses } from '../../api/expenses';
    import Expense from '../components/Expense.svelte';

    $: expenses = useTracker(() =>
        Expenses.find({}, { sort: { date: -1 } }).fetch()
    );

    $: expenseSum = totalExpenses.reduce(function (a, b) {
        return a + b;
    }, 0);

    let totalExpenses = [];
    let totalExpenseIDs = [];
    const calculateTotal = (expense) => {
        if (totalExpenseIDs.includes(expense._id) === false) {
            totalExpenseIDs = [...totalExpenseIDs, expense._id];
            totalExpenses = [...totalExpenses, expense.amount];
            console.log(totalExpenses);
        }
    };
</script>

<div>
    <h1>Expenses:</h1>
    <!-- List of expenses -->
    {#each $expenses.map(calculateTotal) as expense}
        <div />
    {/each}
    {#each $expenses as expense (expense._id)}
        <Expense {expense} />
    {/each}
    <h3>Total Expenses: {expenseSum}</h3>
</div>
