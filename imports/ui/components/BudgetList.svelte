<script>
    import { Meteor } from 'meteor/meteor';
    import { onMount } from 'svelte';
    import { useTracker } from 'meteor/rdb:svelte-meteor-data';
    import { Budgets } from '../../api/budgets';
    import Budget from './Budget.svelte';
    import { baseBudgetSumStore } from '../stores/BaseBudgetSumStore';
    import { createEventDispatcher } from 'svelte';
    let dispatch = createEventDispatcher();

    $: budgets = useTracker(() => Budgets.find({}).fetch());

    const dispatchCalc = () => {
        dispatch('recalculateBudgets');
    };

    onMount(() => {
        Meteor.subscribe('budgets');
    });
</script>

<div>
    <h1>Base Budgets:</h1>
    {#each $budgets as budget (budget._id)}
        {#each [dispatchCalc(budget)] as budget}
            <div />
        {/each}
        <Budget {budget} on:recalculateBudgets />
    {/each}
    <h3>Total Budgeted Monthly: {$baseBudgetSumStore}</h3>
</div>

<style>
    h1 {
        font-size: 20px;
        color: black;
        font-weight: 500;
        text-align: center;
        margin: 10px 0;
    }

    h3 {
        font-size: 16px;
        color: black;
        font-weight: 500;
        margin: 0 0 15px 0;
        padding: 15px 0;
        text-align: center;
        background-color: white;
    }
</style>
