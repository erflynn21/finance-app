<script>
    import { addBudget } from '../stores/budgetsStore';
    import { baseCurrency, currencyOptions } from '../stores/currenciesStore';

    let budget = {
        category: '',
        amount: '',
        currency: '',
        date: new Date().toISOString().substr(0, 10),
    };

    let error = '';

    async function handleAddBudget() {
        if (budget.category === '' || budget.amount === null) {
            error = `Please fill in all fields before submitting a budget.`;
            return;
        } else {
            error = '';
        }
        // check whether budget needs to be converted to base currency
        if (budget.currency === '' || budget.currency == $baseCurrency) {
            budget.currency = $baseCurrency;
            budget.originalCurrency = null;
            budget.originalAmount = null;
        } else {
            await convertAmount();
        }

        // add the budget
        addBudget(budget).then(() => {
            // clear form
            budget.category = '';
            budget.amount = '';
            budget.currency = $baseCurrency;
        });
    }

    async function convertAmount() {
        budget.originalAmount = budget.amount;
        budget.originalCurrency = budget.currency;
        let url = `https://api.exchangeratesapi.io/${budget.date}?base=${$baseCurrency}&symbols=${budget.originalCurrency}`;
        let response = await fetch(url);
        let data = await response.json();
        let rates = JSON.stringify(data.rates);
        let exchangeRate = Number(rates.replace(/[^\d.-]/g, ''));
        budget.amount = Number(
            (budget.originalAmount / exchangeRate).toFixed(2)
        );
        budget.currency = $baseCurrency;
    }
</script>

<form class="new-budget" on:submit|preventDefault={handleAddBudget}>
    <div class="title">
        <label for="title">Category: </label>
        <input
            type="text"
            placeholder="New budget category"
            bind:value={budget.category} />
    </div>

    <div class="amount">
        <label for="amount">Amount: </label>
        <input type="number" placeholder="Amount" bind:value={budget.amount} />
    </div>

    <div class="currency">
        <label for="currency">Currency: </label>
        <select id="budget-currency" bind:value={budget.currency}>
            <option value={$baseCurrency}>{$baseCurrency}</option>
            {#each $currencyOptions as currencyOption}
                <option value={currencyOption}>{currencyOption}</option>
            {/each}
        </select>
    </div>

    <span class="error">
        <p>{error}</p>
    </span>

    <div><button on:click|preventDefault={handleAddBudget}>Add</button></div>
</form>

<style>
    .new-budget {
        width: 100%;
        background: white;
    }

    .new-budget div {
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
