<script>
    import { Expenses } from '../api/expenses.js';

    export let key;
    export let expense;

    const deleteExpense = () => {
        Expenses.remove(expense._id);
    }
</script>

<div>
    <ul>
        <button class="delete" on:click={deleteExpense}>X</button>
        <li>{expense.title}</li>
        <li>{expense.date}</li>
        <li>{expense.amount}</li>
    </ul>
</div>
