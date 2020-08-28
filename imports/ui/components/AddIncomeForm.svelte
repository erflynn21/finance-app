<script>
    import { Meteor } from 'meteor/meteor';

    let userCurrency = 'CNY';

    let income = {
        title: '',
        amount: null,
        date: new Date().toISOString().substr(0, 10),
        currency: userCurrency,
        originalAmount: null,
        originalCurrency: null,
    };

    async function handleAddIncome() {
        // check whether expense needs to be converted to base currency
        if (income.currency !== userCurrency) {
            await convertAmount();
        } else {
            income.currency = userCurrency;
        }

        // add the income
        Meteor.call('incomes.insert', income);

        // clear form
        income.title = '';
        income.date = new Date().toISOString().substr(0, 10);
        income.amount = null;
        income.currency = userCurrency;
        income.originalCurrency = null;
        income.originalAmount = null;
    }

    async function convertAmount() {
        income.originalAmount = income.amount;
        income.originalCurrency = income.currency;
        let url = `https://api.exchangeratesapi.io/${income.date}?base=${userCurrency}&symbols=${income.originalCurrency}`;
        let response = await fetch(url);
        let data = await response.json();
        let rates = JSON.stringify(data.rates);
        let exchangeRate = Number(rates.replace(/[^\d.-]/g, ''));
        income.amount = Number(
            (income.originalAmount / exchangeRate).toFixed(2)
        );
        income.currency = userCurrency;
    }
</script>

<form class="new-income" on:submit|preventDefault={handleAddIncome}>
    <input type="text" placeholder="new income..." bind:value={income.title} />
    <input type="date" id="today" bind:value={income.date} />
    <input type="number" placeholder="amount" bind:value={income.amount} />
    <select id="income-currency" bind:value={income.currency}>
        <option value="USD">USD</option>
        <option value="CNY">CNY</option>
    </select>
    <button on:click|preventDefault={handleAddIncome}>Add</button>
</form>
