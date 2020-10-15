<script>
    import RecurringExpense from './RecurringExpense.svelte';
    import { monthlyExpensesStore } from '../stores/MonthlyExpensesStore';
</script>

<div>
    <h1>Monthly Expenses:</h1>
    {#each $monthlyExpensesStore as monthlyexpense (monthlyexpense._id)}
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
