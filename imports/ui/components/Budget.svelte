<script>
    import { Meteor } from 'meteor/meteor';
    import UpdateBudgetForm from './UpdateBudgetForm.svelte';
    export let budget;
    import { createEventDispatcher } from 'svelte';
    let dispatch = createEventDispatcher();

    const deleteBudget = () => {
        Meteor.call('budgets.remove', budget._id);
        dispatch('recalculateBudgets');
    };

    let isHidden = true;
</script>

<div>
    <button class="delete" on:click={deleteBudget}>X</button>
    <span>{budget.category}</span>
    <span>{budget.currency}{budget.amount}</span>
</div>
<div class:hidden={isHidden}>
    <UpdateBudgetForm
        {budget}
        on:collapse={() => (isHidden = !isHidden)}
        on:recalculateBudgets />
</div>
<button class="edit" on:click={() => (isHidden = !isHidden)}>Edit</button>
