<script>
    import { baseCurrency, currencyOptions } from '../stores/currenciesStore';
    import { addMonthlyIncome } from '../stores/monthlyIncomesStore';
    import { addIncome } from '../stores/incomesStore';

    let recurring = false;

    let income = {
        title: '',
        amount: '',
        date: new Date().toISOString().substr(0, 10),
        currency: '',
        originalAmount: null,
        originalCurrency: null,
    };

    let error = '';

    async function handleAddIncome() {
        if (income.title === '' || income.amount === null) {
            error = `Please fill in all fields before submitting an income.`;
            return;
        } else {
            error = '';
        }

        // check whether expense needs to be converted to base currency
        if (income.currency === '' || income.currency === $baseCurrency) {
            income.currency = $baseCurrency;
        } else {
            await convertAmount();
        }

        if (recurring === false) {
            // add the income
            addIncome(income).then(() => {
                // clear form
                income.title = '';
                income.date = new Date().toISOString().substr(0, 10);
                income.amount = null;
                income.currency = $baseCurrency;
                income.originalCurrency = null;
                income.originalAmount = null;
            });
        } else {
            income.recurringdate = income.date.slice(-2);

            addMonthlyIncome(income).then(() => {
                // clear form
                income.title = '';
                income.date = new Date().toISOString().substr(0, 10);
                income.amount = null;
                income.currency = $baseCurrency;
                income.originalCurrency = null;
                income.originalAmount = null;
            });
        }
    }

    async function convertAmount() {
        income.originalAmount = income.amount;
        income.originalCurrency = income.currency;
        let url = `https://api.exchangeratesapi.io/${income.date}?base=${$baseCurrency}&symbols=${income.originalCurrency}`;
        let response = await fetch(url);
        let data = await response.json();
        let rates = JSON.stringify(data.rates);
        let exchangeRate = Number(rates.replace(/[^\d.-]/g, ''));
        income.amount = Number(
            (income.originalAmount / exchangeRate).toFixed(2)
        );
        income.currency = $baseCurrency;
    }
</script>

<form class="new-income" on:submit|preventDefault={handleAddIncome}>
    <div class="date">
        <label for="date">Date: </label>
        <input type="date" id="today" bind:value={income.date} />
    </div>

    <div class="title">
        <label for="title">Income: </label>
        <input type="text" placeholder="Name" bind:value={income.title} />
    </div>

    <div class="amount">
        <label for="amount">Amount: </label>
        <input type="number" placeholder="0.00" bind:value={income.amount} />
    </div>

    <div class="currency">
        <label for="currency">Currency: </label>
        <select id="income-currency" bind:value={income.currency}>
            <option value={$baseCurrency}>{$baseCurrency}</option>
            {#each $currencyOptions as currencyOption}
                <option value={currencyOption}>{currencyOption}</option>
            {/each}
        </select>
    </div>

    <span class="recurring">
        <input type="checkbox" bind:value={recurring} />
        <label for="recurring">This is a monthly recurring expense.</label>
    </span>

    <span class="error">
        <p>{error}</p>
    </span>

    <button on:click|preventDefault={handleAddIncome}>Add</button>
</form>

<style>
    .new-income {
        width: 100%;
        background: white;
    }

    .new-income div {
        margin: 15px 0;
        display: grid;
        grid-template-columns: 0.5fr 1fr;
    }

    input {
        border: none;
    }

    input:active {
        border: none;
    }

    .date input {
        width: 65%;
    }

    .title input {
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        padding-bottom: 5px;
    }

    .amount input {
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        padding-bottom: 5px;
    }

    .currency select {
        width: 30%;
        border: 1px solid rgba(0, 0, 0, 0.2);
    }

    .currency {
        padding-bottom: 15px;
    }

    button {
        width: 60%;
        justify-self: center;
        height: 35px;
        grid-column: 1/3;
        border-radius: 10px;
        cursor: pointer;
        border: 0;
        box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.2);
        background: green;
        color: white;
    }
</style>
