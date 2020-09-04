<script>
    import { Meteor } from 'meteor/meteor';
    import { onMount } from 'svelte';
    import { useTracker } from 'meteor/rdb:svelte-meteor-data';
    import { Expenses } from '../../api/expenses';
    import Expense from '../components/Expense.svelte';
    import { createEventDispatcher } from 'svelte';
    let dispatch = createEventDispatcher();

    $: expenses = useTracker(() =>
        Expenses.find({}, { sort: { date: -1 } }).fetch()
    );

    const dispatchCalc = () => {
        dispatch('calculate');
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
