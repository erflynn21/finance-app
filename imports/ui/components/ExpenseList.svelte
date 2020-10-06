<script>
    import { Meteor } from 'meteor/meteor';
    import { onMount } from 'svelte';
    import { useTracker } from 'meteor/rdb:svelte-meteor-data';
    import { Expenses } from '../../api/expenses';
    import Expense from '../components/Expense.svelte';
    import { createEventDispatcher } from 'svelte';
    let dispatch = createEventDispatcher();

    // getting current date
    const date = new Date();
    const currentYear = date.getFullYear();
    let currentMonth = '';
    if (date.getMonth() + 1 >= 10) {
        currentMonth = date.getMonth() + 1;
    } else {
        currentMonth = '0' + date.getMonth() + 1;
    }

    let today = '';
    if (date.getDate() >= 10) {
        today = date.getDate();
    } else {
        today = '0' + date.getDate();
    }

    const start = currentYear + '-' + currentMonth + '-01';
    const end = currentYear + '-' + currentMonth + '-' + today;

    $: expenses = useTracker(() =>
        Expenses.find({}, { sort: { date: -1 } }).fetch()
    );

    const dispatchCalc = () => {
        dispatch('calculateExpenses');
    };

    onMount(() => {
        Meteor.subscribe('expenses');
    });
</script>

<div>
    <!-- List of expenses -->
    {#each $expenses as expense (expense._id)}
        {#each [dispatchCalc(expense)] as expense}
            <div />
        {/each}
        <Expense {expense} on:delete on:expenseEdited />
    {/each}
</div>
