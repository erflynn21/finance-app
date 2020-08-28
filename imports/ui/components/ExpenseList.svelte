<script>
    import { onMount } from 'svelte';
    import { useTracker } from 'meteor/rdb:svelte-meteor-data';
    import { Expenses } from '../../api/expenses';
    import Expense from '../components/Expense.svelte';
    import { createEventDispatcher } from 'svelte';
    let dispatch = createEventDispatcher();

    $: expenses = useTracker(() =>
        Expenses.find({}, { sort: { date: -1 } }).fetch()
    );

    $: totalExpenses = [];
    let totalExpensesIDs = [];
    const calculateTotal = (expense) => {
        if (totalExpensesIDs.includes(expense._id) === false) {
            totalExpensesIDs = [...totalExpensesIDs, expense._id];
            totalExpenses = [...totalExpenses, expense.amount];
        }
        dispatch('recalculateExpenses', { data: totalExpenses });
    };

    const deleteExpenseFromTotal = (expense) => {
        const index = totalExpensesIDs.indexOf(expense.detail._id);
        totalExpenses.splice(index, 1);
        totalExpenses = totalExpenses;
        dispatch('recalculateExpenses', { data: totalExpenses });
    };

    onMount(() => {
        dispatch('recalculateExpenses', { data: totalExpenses });
    });
</script>

<div>
    <h1>Expenses:</h1>
    <!-- List of expenses -->
    {#each $expenses.map(calculateTotal) as expense}
        <div />
    {/each}
    {#each $expenses as expense (expense._id)}
        <Expense {expense} on:delete={deleteExpenseFromTotal} />
    {/each}
</div>
