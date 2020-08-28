<script>
    import { Meteor } from 'meteor/meteor';

    let userCurrency = 'CNY';

    let budget = {
        category: '',
        amount: '',
        currency: userCurrency,
        date: new Date().toISOString().substr(0, 10),
    };

    async function handleAddBudget() {
        // check whether budget needs to be converted to base currency
        if (budget.currency !== userCurrency) {
            await convertAmount();
        } else {
            budget.currency = userCurrency;
        }

        // add the budget
        Meteor.call('budgets.insert', budget);

        // clear form
        budget.category = '';
        budget.amount = '';
        budget.currency = userCurrency;
    }

    async function convertAmount() {
        budget.originalAmount = budget.amount;
        budget.originalCurrency = budget.currency;
        let url = `https://api.exchangeratesapi.io/${budget.date}?base=${userCurrency}&symbols=${budget.originalCurrency}`;
        let response = await fetch(url);
        let data = await response.json();
        let rates = JSON.stringify(data.rates);
        let exchangeRate = Number(rates.replace(/[^\d.-]/g, ''));
        budget.amount = Number(
            (budget.originalAmount / exchangeRate).toFixed(2)
        );
        budget.currency = userCurrency;
    }
</script>

<form class="new-budget" on:submit|preventDefault={handleAddBudget}>
    <input
        type="text"
        placeholder="new budget...."
        bind:value={budget.category} />
    <input type="number" placeholder="amount" bind:value={budget.amount} />
    <select id="expense-currency" bind:value={budget.currency}>
        <option value="USD">USD</option>
        <option value="CNY">CNY</option>
    </select>
    <button on:click|preventDefault={handleAddBudget}>Add</button>
</form>
