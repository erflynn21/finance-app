<script>
    import Budget from './Budget.svelte';
    import { baseBudgetSumStore } from '../stores/BaseBudgetSumStore';
    import { baseBudgetsStore } from '../stores/BaseBudgetsStore';
</script>

<div>
    <h1>Base Budgets:</h1>
    {#each $baseBudgetsStore as budget (budget._id)}
        <Budget {budget} />
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
