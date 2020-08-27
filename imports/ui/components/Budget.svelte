<script>
    import { Budgets } from '../../api/budgets';
    export let budget;
    import { createEventDispatcher } from 'svelte';
    let dispatch = createEventDispatcher();

    const deleteBudget = () => {
        Budgets.remove(budget._id);
        dispatch('delete', budget);
    };
</script>

<div>
    <button class="delete" on:click={deleteBudget}>X</button>
    <span>{budget.category}</span>
    <span>{budget.currency}{budget.amount}</span>
</div>
