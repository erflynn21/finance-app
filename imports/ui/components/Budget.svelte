<script>
    import { Budgets } from '../../api/budgets';
    export let budget;

    const deleteBudget = () => {
        Budgets.remove(budget._id);
    };
</script>

<div>
    <button class="delete" on:click={deleteBudget}>X</button>
    <span>{budget.category}</span>
    <span>{budget.currency}{budget.amount}</span>
</div>
