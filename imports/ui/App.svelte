<script>
    import { useTracker } from 'meteor/rdb:svelte-meteor-data';
    import Expense from './Expense.svelte';
    import { Expenses } from '../api/expenses';

    let newExpense = '';
    
    $: expenses = useTracker(() => Expenses.find({}, { sort: { createdAt: -1 } }).fetch());

    const handleSubmit = (e) => {
        // insert new expense
        Expenses.insert({
            text: newExpense,
            createdAt: new Date()
        })

        // clear form
        newExpense = '';
    }
   
  </script>
   
   
  <div class="container">
    <header>
      <h1>Expenses</h1>
      <form class="new-expense" on:submit|preventDefault={handleSubmit}>
          <input type="text" placeholder='new expense...' bind:value={newExpense}>
      </form>
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