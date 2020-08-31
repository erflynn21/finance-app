<script>
    import { Meteor } from 'meteor/meteor';
    import { useTracker } from 'meteor/rdb:svelte-meteor-data';
    import { onMount } from 'svelte';
    import { UserSettings } from '../../api/usersettings';

    $: usersettings = useTracker(() => UserSettings.find({}).fetch());

    $: userCurrency = '';

    const setUserCurrency = (usersetting) => {
        if (usersetting === undefined) {
            return;
        } else {
            userCurrency = usersetting.baseCurrency;
        }
    };

    let income = {
        title: '',
        amount: null,
        date: new Date().toISOString().substr(0, 10),
        currency: '',
        originalAmount: null,
        originalCurrency: null,
    };

    async function handleAddIncome() {
        // check whether expense needs to be converted to base currency
        if (income.currency === '' || income.currency === userCurrency) {
            income.currency = userCurrency;
        } else {
            await convertAmount();
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

    onMount(() => {
        Meteor.subscribe('usersettings');
        setUserCurrency();
    });
</script>

<form class="new-income" on:submit|preventDefault={handleAddIncome}>
    <input type="text" placeholder="new income..." bind:value={income.title} />
    <input type="date" id="today" bind:value={income.date} />
    <input type="number" placeholder="amount" bind:value={income.amount} />
    <select id="income-currency" bind:value={income.currency}>
        {#each $usersettings as usersetting (usersetting._id)}
            <option value={usersetting.baseCurrency}>
                {usersetting.baseCurrency}
            </option>
            {#each usersetting.currencyOptions as currencyOption}
                <option value={currencyOption}>{currencyOption}</option>
            {/each}
        {/each}
        {#each $usersettings.map(setUserCurrency) as usersetting}
            <div />
        {/each}
    </select>
    <button on:click|preventDefault={handleAddIncome}>Add</button>
</form>
