<script>
    import { Expenses } from '../../api/expenses';

    let userCurrency = 'CNY';

    let expense = {
        title: '',
        amount: null,
        date: new Date().toISOString().substr(0, 10),
        currency: userCurrency,
        originalAmount: null,
        originalCurrency: null,
    };

    async function handleAddExpense() {
        // check whether expense needs to be converted to base currency
        if (expense.currency !== userCurrency) {
            await convertAmount();
        } else {
            expense.currency = userCurrency;
        }

        // add the expense
        Expenses.insert({
            title: expense.title,
            date: expense.date,
            amount: expense.amount,
            originalAmount: expense.originalAmount,
            currency: expense.currency,
            originalCurrency: expense.originalCurrency,
        });

        // clear form
        expense.title = '';
        expense.date = new Date().toISOString().substr(0, 10);
        expense.amount = '';
        expense.currency = userCurrency;
        expense.originalCurrency = null;
        expense.originalAmount = null;
    }

    async function convertAmount() {
        let url;
        if (expense.amount !== null) {
            expense.originalAmount = expense.amount;
            expense.originalCurrency = expense.currency;
            url = `https://api.exchangeratesapi.io/${expense.date}?base=${userCurrency}&symbols=${expense.originalCurrency}`;
        } else {
            income.originalAmount = income.amount;
            income.originalCurrency = income.currency;
            url = `https://api.exchangeratesapi.io/${income.date}?base=${userCurrency}&symbols=${income.originalCurrency}`;
        }
        let response = await fetch(url);
        let data = await response.json();
        let rates = JSON.stringify(data.rates);
        let exchangeRate = Number(rates.replace(/[^\d.-]/g, ''));
        if (expense.amount !== null) {
            expense.amount = Number(
                (expense.originalAmount / exchangeRate).toFixed(2)
            );
            expense.currency = userCurrency;
        } else {
            income.amount = Number(
                (income.originalAmount / exchangeRate).toFixed(2)
            );
            income.currency = userCurrency;
        }
    }
</script>

<form class="new-expense" on:submit|preventDefault={handleAddExpense}>
    <input
        type="text"
        placeholder="new expense..."
        bind:value={expense.title} />
    <input type="date" id="today" bind:value={expense.date} />
    <input type="number" placeholder="amount" bind:value={expense.amount} />
    <select id="expense-currency" bind:value={expense.currency}>
        <option value="USD">USD</option>
        <option value="CNY">CNY</option>
    </select>
    <button on:click|preventDefault={handleAddExpense}>Add</button>
</form>
