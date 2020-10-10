<script>
    import { Meteor } from 'meteor/meteor';
    import { onMount } from 'svelte';
    import { useTracker } from 'meteor/rdb:svelte-meteor-data';
    import { MonthlyExpenses } from '../../api/monthlyexpenses';
    import { createEventDispatcher } from 'svelte';
    import RecurringExpense from './RecurringExpense.svelte';
    let dispatch = createEventDispatcher();

    $: monthlyexpenses = useTracker(() => MonthlyExpenses.find({}).fetch());

    onMount(() => {
        Meteor.subscribe('monthlyexpenses');
    });
</script>

<div>
    <h1>Monthly Expenses:</h1>
    {#each $monthlyexpenses as monthlyexpense (monthlyexpense._id)}
        <RecurringExpense {monthlyexpense} />
    {/each}
</div>

<style>
    h1 {
        font-size: 20px;
        color: black;
        font-weight: 500;
        text-align: center;
        margin: 10px 0;
    }
</style>
