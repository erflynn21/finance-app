<script>
    import { useTracker } from 'meteor/rdb:svelte-meteor-data';
    import { Expenses } from '../../api/expenses';
    import Expense from '../components/Expense.svelte';

    $: expenses = useTracker(() =>
        Expenses.find({}, { sort: { date: -1 } }).fetch()
    );
</script>

<div>
    <h1>Expenses:</h1>
    <!-- List of expenses -->
    {#each $expenses as expense (expense._id)}
        <Expense {expense} />
    {/each}
    <h3>Total Expenses:</h3>
</div>
