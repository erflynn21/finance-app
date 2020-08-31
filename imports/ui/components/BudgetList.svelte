<script>
    import { Meteor } from 'meteor/meteor';
    import { onMount } from 'svelte';
    import { useTracker } from 'meteor/rdb:svelte-meteor-data';
    import { Budgets } from '../../api/budgets';
    import Budget from './Budget.svelte';
    import { createEventDispatcher } from 'svelte';
    let dispatch = createEventDispatcher();

    $: budgets = useTracker(() => Budgets.find({}).fetch());

    $: totalBudgets = [];
    let totalBudgetIDs = [];
    const calculateTotal = (budget) => {
        if (totalBudgetIDs.includes(budget._id) === false) {
            totalBudgetIDs = [...totalBudgetIDs, budget._id];
            totalBudgets = [...totalBudgets, budget.amount];
        }
        dispatch('recalculateBudgets', { data: totalBudgets });
    };

    const deleteBudgetFromTotal = (budget) => {
        const index = totalBudgetIDs.indexOf(budget.detail._id);
        totalBudgets.splice(index, 1);
        totalBudgets = totalBudgets;
        dispatch('recalculateBudgets', { data: totalBudgets });
    };

    onMount(() => {
        Meteor.subscribe('budgets');
        dispatch('recalculateBudgets', { data: totalBudgets });
    });
</script>

<div>
    <h1>Base Budgets:</h1>
    {#each $budgets.map(calculateTotal) as expense}
        <div />
    {/each}
    {#each $budgets as budget (budget._id)}
        <Budget {budget} on:delete={deleteBudgetFromTotal} />
    {/each}
</div>
