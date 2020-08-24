<script>
    import { useTracker } from 'meteor/rdb:svelte-meteor-data';
    import Expense from './Expense.svelte';
    import { Expenses } from '../api/expenses';
    
    $: expenses = useTracker(() => Expenses.find({}).fetch());
   
  </script>
   
   
  <div class="container">
    <header>
      <h1>Expenses</h1>
    </header>
    <ul>
    {#each $expenses as expense}
      <Expense
        key={expense._id}
        expense={expense}
      />
    {/each}
    </ul>
  </div>