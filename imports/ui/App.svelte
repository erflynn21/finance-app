<script>
    import { useTracker } from 'meteor/rdb:svelte-meteor-data';
    import Expense from './Expense.svelte';
    import { Expenses } from '../api/expenses';

    let title;
    let amount;
    let date = new Date().toISOString().substr(0, 10);

    $: expenses = useTracker(() => Expenses.find({}, { sort: { date: -1 } }).fetch());

    const handleSubmit = (e) => {
        // insert new expense
        Expenses.insert({
            title: title,
            date: date,
            amount: amount,
        });

        // clear form
        title = '';
        date = new Date().toISOString().substr(0, 10);
        amount = '';
    }
   
  </script>
   
   
  <div class="container">
    <header>
      <h1>Expenses</h1>
      <form class="new-expense" on:submit|preventDefault={handleSubmit}>
          <input type="text" placeholder='new expense...' bind:value={title}>
          <input type="date" id='today' bind:value={date}>
          <input type="text" placeholder='amount' bind:value={amount}>
          <button on:click|preventDefault={handleSubmit}>Add</button>
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