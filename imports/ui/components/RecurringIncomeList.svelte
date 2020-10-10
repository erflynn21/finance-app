<script>
    import { Meteor } from 'meteor/meteor';
    import { onMount } from 'svelte';
    import { useTracker } from 'meteor/rdb:svelte-meteor-data';
    import { MonthlyIncomes } from '../../api/monthlyincomes';
    import { createEventDispatcher } from 'svelte';
    import RecurringIncome from './RecurringIncome.svelte';
    let dispatch = createEventDispatcher();

    $: monthlyincomes = useTracker(() => MonthlyIncomes.find({}).fetch());

    onMount(() => {
        Meteor.subscribe('monthlyincomes');
    });
</script>

<div>
    <h1>Monthly Incomes:</h1>
    {#each $monthlyincomes as monthlyincome (monthlyincome._id)}
        <RecurringIncome {monthlyincome} />
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
