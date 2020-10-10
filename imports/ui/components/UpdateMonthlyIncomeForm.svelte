<script>
    import { useTracker } from 'meteor/rdb:svelte-meteor-data';
    import { Budgets } from '../../api/budgets';
    import { UserSettings } from '../../api/usersettings';
    export let monthlyincome;
    import { createEventDispatcher, onMount } from 'svelte';
    let dispatch = createEventDispatcher();
    import { userCurrency } from '../stores/UserCurrencyStore';

    $: budgets = useTracker(() => Budgets.find({}).fetch());

    $: usersettings = useTracker(() => UserSettings.find({}).fetch());

    let updatedMonthlyIncome = {
        title: monthlyincome.title,
        recurringdate: monthlyincome.recurringdate,
        amount: monthlyincome.amount,
        originalAmount: monthlyincome.originalAmount,
        currency: monthlyincome.currency,
        originalCurrency: monthlyincome.originalCurrency,
        _id: monthlyincome._id,
    };

    async function updateIncome() {
        // check whether expense needs to be converted;

        // update the currency
        Meteor.call(
            'monthlyincomes.update',
            monthlyincome._id,
            updatedMonthlyIncome
        );
        // dispatch('expenseEdited', updatedMonthlyExpense);

        // collapse the update menu
        dispatch('collapse');
    }

    // async function convertAmount() {
    //     if (updatedMonthlyExpense.originalAmount === null) {
    //         updatedMonthlyExpense.originalAmount = updatedMonthlyExpense.amount;
    //         updatedMonthlyExpense.originalCurrency =
    //             updatedMonthlyExpense.currency;
    //     }
    //     let url = `https://api.exchangeratesapi.io/${updatedMonthlyExpense.date}?base=${$userCurrency}&symbols=${updatedMonthlyExpense.originalCurrency}`;
    //     let response = await fetch(url);
    //     let data = await response.json();
    //     let rates = JSON.stringify(data.rates);
    //     let exchangeRate = Number(rates.replace(/[^\d.-]/g, ''));
    //     updatedMonthlyExpense.amount = Number(
    //         (updatedMonthlyExpense.originalAmount / exchangeRate).toFixed(2)
    //     );
    //     console.log(updatedMonthlyExpense.amount);
    //     updatedMonthlyExpense.currency = $userCurrency;
    // }

    const exitUpdate = () => {
        dispatch('collapse');
    };

    onMount(() => {
        Meteor.subscribe('usersettings');
        Meteor.subscribe('budgets');
    });
</script>

<div class="big-title">Edit Monthly Income</div>
<div class="border" />
<form class="update-income" on:submit|preventDefault={updateIncome}>
    <div class="date">
        <label for="date">Monthly On: </label>
        <select
            id="recurring-date"
            bind:value={updatedMonthlyIncome.recurringdate}>
            <option value={updatedMonthlyIncome.recurringdate}>
                {updatedMonthlyIncome.recurringdate}
            </option>
            <option value="01">01</option>
            <option value="02">02</option>
            <option value="03">03</option>
            <option value="03">03</option>
            <option value="04">04</option>
            <option value="05">05</option>
            <option value="06">06</option>
            <option value="07">07</option>
            <option value="08">08</option>
            <option value="09">09</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
            <option value="13">13</option>
            <option value="14">14</option>
            <option value="15">15</option>
            <option value="16">16</option>
            <option value="17">17</option>
            <option value="18">18</option>
            <option value="19">19</option>
            <option value="20">20</option>
            <option value="21">21</option>
            <option value="22">22</option>
            <option value="23">23</option>
            <option value="24">24</option>
            <option value="25">25</option>
            <option value="26">26</option>
            <option value="27">27</option>
            <option value="28">28</option>
            <option value="29">29</option>
            <option value="30">30</option>
            <option value="31">31</option>
        </select>
        <!-- <input
            type="text"
            bind:value={updatedMonthlyExpense.recurringdate}
            placeholder={updatedMonthlyExpense.recurringdate} /> -->
    </div>

    <div class="title">
        <label for="title">Expense: </label>
        <input
            type="text"
            placeholder={updatedMonthlyIncome.title}
            bind:value={updatedMonthlyIncome.title} />
    </div>

    <div class="amount">
        <label for="amount">Amount: </label>
        {#if updatedMonthlyIncome.originalCurrency === null}
            <input
                type="number"
                placeholder={updatedMonthlyIncome.amount}
                bind:value={updatedMonthlyIncome.amount} />
        {:else}
            <input
                type="number"
                placeholder={updatedMonthlyIncome.originalAmount}
                bind:value={updatedMonthlyIncome.originalAmount} />
        {/if}
    </div>

    <div class="currency">
        <label for="currency">Currency: </label>
        <select id="income-currency" bind:value={updatedMonthlyIncome.currency}>
            {#if updatedMonthlyIncome.originalCurrency == null}
                {#each $usersettings as usersetting (usersetting._id)}
                    <option value={$userCurrency}>{$userCurrency}</option>
                    {#each usersetting.currencyOptions as currencyOption}
                        <option value={currencyOption}>{currencyOption}</option>
                    {/each}
                {/each}
            {:else}
                {#each $usersettings as usersetting (usersetting._id)}
                    <option value={updatedMonthlyIncome.originalCurrency}>
                        {updatedMonthlyIncome.originalCurrency}
                    </option>
                    <option value={$userCurrency}>{$userCurrency}</option>
                    {#each usersetting.currencyOptions as currencyOption}
                        {#if currencyOption === updatedMonthlyIncome.originalCurrency}
                            <div />
                        {:else}
                            <option value={currencyOption}>
                                {currencyOption}
                            </option>
                        {/if}
                    {/each}
                {/each}
            {/if}
        </select>
    </div>
    <span class="buttons">
        <button class="no" on:click|preventDefault={exitUpdate}>Exit</button>
        <button
            class="yes"
            on:click|preventDefault={updateIncome}>Update</button>
    </span>
</form>

<style>
    .big-title {
        text-align: center;
        margin-bottom: 10px;
        width: 100%;
        font-size: 18px;
    }

    .border {
        border: 1px solid #f2f2f2;
    }
    .update-income {
        width: 100%;
        background: white;
    }

    .update-income div {
        margin: 15px 0 10px 0;
        display: grid;
        grid-template-columns: 0.5fr 1fr;
    }

    input {
        border: none;
        background: transparent;
    }

    select {
        background: transparent;
    }

    input:active {
        border: none;
    }

    .date select {
        width: 30%;
        border: 1px solid rgba(0, 0, 0, 0.2);
    }

    .title input {
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        padding-bottom: 5px;
    }

    .amount input {
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        padding-bottom: 5px;
    }

    .category select {
        width: 80%;
        border: 1px solid rgba(0, 0, 0, 0.2);
    }

    .currency select {
        width: 30%;
        border: 1px solid rgba(0, 0, 0, 0.2);
    }

    .currency {
        padding-bottom: 15px;
    }

    .buttons {
        display: grid;
        grid-template-columns: 1fr 1fr;
    }

    button {
        width: 80%;
        height: 35px;
        border-radius: 10px;
        cursor: pointer;
        border: 0;
        box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.2);
        color: white;
        margin: 10px;
    }

    .yes {
        background: green;
    }

    .no {
        background: red;
    }
</style>
