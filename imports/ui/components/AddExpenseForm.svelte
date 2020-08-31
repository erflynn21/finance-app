<script>
    import { Meteor } from 'meteor/meteor';
    import { useTracker } from 'meteor/rdb:svelte-meteor-data';
    import { onMount } from 'svelte';
    import { Budgets } from '../../api/budgets';
    import { UserSettings } from '../../api/usersettings';

    $: budgets = useTracker(() => Budgets.find({}).fetch());

    $: usersettings = useTracker(() => UserSettings.find({}).fetch());

    $: userCurrency = '';

    const setUserCurrency = (usersetting) => {
        if (usersetting === undefined) {
            return;
        } else {
            userCurrency = usersetting.baseCurrency;
        }
    };

    let expense = {
        title: '',
        amount: '',
        category: '',
        date: new Date().toISOString().substr(0, 10),
        currency: '',
        originalAmount: null,
        originalCurrency: null,
    };

    async function handleAddExpense() {
        // check whether expense needs to be converted to base currency
        if (expense.currency === '' || expense.currency === userCurrency) {
            expense.currency = userCurrency;
        } else {
            await convertAmount();
        }

        // add the expense
        Meteor.call('expenses.insert', expense);

        // clear form
        expense.title = '';
        expense.date = new Date().toISOString().substr(0, 10);
        expense.amount = '';
        (expense.category = ''), (expense.currency = userCurrency);
        expense.originalCurrency = null;
        expense.originalAmount = null;
    }

    async function convertAmount() {
        expense.originalAmount = expense.amount;
        expense.originalCurrency = expense.currency;
        let url = `https://api.exchangeratesapi.io/${expense.date}?base=${userCurrency}&symbols=${expense.originalCurrency}`;
        let response = await fetch(url);
        let data = await response.json();
        let rates = JSON.stringify(data.rates);
        let exchangeRate = Number(rates.replace(/[^\d.-]/g, ''));
        expense.amount = Number(
            (expense.originalAmount / exchangeRate).toFixed(2)
        );
        expense.currency = userCurrency;
    }

    onMount(() => {
        Meteor.subscribe('usersettings');
        setUserCurrency();
    });
</script>

<form class="new-expense" on:submit|preventDefault={handleAddExpense}>
    <input
        type="text"
        placeholder="new expense..."
        bind:value={expense.title} />
    <input type="date" bind:value={expense.date} />
    <input type="number" placeholder="amount" bind:value={expense.amount} />
    <select id="category" bind:value={expense.category}>
        <option disabled selected value>-- select a category --</option>
        {#each $budgets as budget (budget._id)}
            <option value={budget.category}>{budget.category}</option>
        {/each}
    </select>
    <select id="expense-currency" bind:value={expense.currency}>
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
    <button on:click|preventDefault={handleAddExpense}>Add</button>
</form>
