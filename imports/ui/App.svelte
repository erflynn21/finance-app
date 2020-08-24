<script>
    import Expense from './Expense.svelte';
    
    function getExpenses() {
        return [
          { _id: 1, text: "This is expense 1" },
          { _id: 2, text: "This is expense 2" },
          { _id: 3, text: "This is expense 3" }
        ];
      }
   
  </script>
   
   
  <div class="container">
    <header>
      <h1>Expenses</h1>
    </header>
    <ul>
    {#each getExpenses() as expense}
      <Expense
        key={expense._id}
        expense={expense}
      />
    {/each}
    </ul>
  </div>