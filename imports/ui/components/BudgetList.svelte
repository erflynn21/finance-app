<script>
    import { useTracker } from 'meteor/rdb:svelte-meteor-data';
    import { Budgets } from '../../api/budgets';
    import Budget from './Budget.svelte';

    $: budgets = useTracker(() => Budgets.find({}).fetch());
</script>

<div>
    <h1>Budgets</h1>
    {#each $budgets as budget (budget._id)}
        <Budget {budget} />
    {/each}
</div>
