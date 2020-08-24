<script>
    import { useTracker } from 'meteor/rdb:svelte-meteor-data';
    import Expense from './Expense.svelte';
    import { Expenses } from '../api/expenses';

    let userCurrency = 'CNY';

    let expense = {
        title: '',
        amount: null,
        date: new Date().toISOString().substr(0, 10),
        currency: userCurrency,
    }

   
    $: expenses = useTracker(() => Expenses.find({}, { sort: { date: -1 } }).fetch());

    const handleSubmit = () => {
        // insert new expense
        if (expense.currency === userCurrency) {
            Expenses.insert({
                title: expense.title,
                date: expense.date,
                amount: expense.amount,
                currency: expense.currency,
            });
            console.log(expense.amount);
        } else {
            convertCurrency()
        }
        

        // clear form
        title = '';
        date = new Date().toISOString().substr(0, 10);
        amount = '';
    }

    async function convertCurrency() {
        let url = `https://api.exchangeratesapi.io/${expense.date}?base=${userCurrency}&symbols=${expense.currency}`;
        let response = await fetch(url);
        let data = await response.json();
        let rates = JSON.stringify(data.rates);
        let exchangeRate = Number(rates.replace(/[^\d.-]/g, ''));
        let convertedAmount = (expense.amount / exchangeRate);
        Expenses.insert({
            title: expense.title,
            date: expense.date,
            amount: convertedAmount,
            currency: expense.currency,
        })
    }

   
  </script>
   
   
  <div class="container">
    <header>
      <h1>Expenses</h1>
      <form class="new-expense" on:submit|preventDefault={handleSubmit}>
          <input type="text" placeholder='new expense...' bind:value={expense.title}>
          <input type="date" id='today' bind:value={expense.date}>
          <input type="number" placeholder='amount' bind:value={expense.amount}>
          <select id="currency" bind:value={expense.currency}>
              <option value="USD">USD</option>
              <option value="CNY">CNY</option>
          </select>
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