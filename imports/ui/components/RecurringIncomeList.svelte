<script>
    import RecurringIncome from './RecurringIncome.svelte';
    import { monthlyIncomesStore } from '../stores/MonthlyIncomesStore';
</script>

<div>
    <h1>Monthly Incomes:</h1>
    {#each $monthlyIncomesStore as monthlyincome (monthlyincome._id)}
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
