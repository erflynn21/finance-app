<script>
    export let monthlyincome;
    import { createEventDispatcher } from 'svelte';
    let dispatch = createEventDispatcher();
    import { userCurrency, userSettingsStore } from '../stores/stores';

    let updatedMonthlyIncome = {
        title: monthlyincome.title,
        recurringdate: monthlyincome.recurringdate,
        amount: monthlyincome.amount,
        originalAmount: monthlyincome.originalAmount,
        currency: monthlyincome.currency,
        originalCurrency: monthlyincome.originalCurrency,
        _id: monthlyincome._id,
    };

    let error = '';

    async function updateIncome() {
        if (
            updatedMonthlyIncome.title === '' ||
            updatedMonthlyIncome.amount === null
        ) {
            error = `Please fill in all fields before updating this recurring income.`;
            return;
        } else {
            error = '';
        }

        // update the currency
        Meteor.call(
            'monthlyincomes.update',
            monthlyincome._id,
            updatedMonthlyIncome
        );

        dispatch('collapse');
    }

    const exitUpdate = () => {
        dispatch('collapse');
    };
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
            <option value="01">1st</option>
            <option value="02">2nd</option>
            <option value="03">3rd</option>
            <option value="04">4th</option>
            <option value="05">5th</option>
            <option value="06">6th</option>
            <option value="07">7th</option>
            <option value="08">8th</option>
            <option value="09">9th</option>
            <option value="10">10th</option>
            <option value="11">11th</option>
            <option value="12">12th</option>
            <option value="13">13th</option>
            <option value="14">14th</option>
            <option value="15">15th</option>
            <option value="16">16th</option>
            <option value="17">17th</option>
            <option value="18">18th</option>
            <option value="19">19th</option>
            <option value="20">20th</option>
            <option value="21">21st</option>
            <option value="22">22nd</option>
            <option value="23">23th</option>
            <option value="24">24th</option>
            <option value="25">25th</option>
            <option value="26">26th</option>
            <option value="27">27th</option>
            <option value="28">28th</option>
            <option value="29">29th</option>
            <option value="30">30th</option>
            <option value="31">31nd</option>
        </select>
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
                {#each $userSettingsStore as usersetting (usersetting._id)}
                    <option value={$userCurrency}>{$userCurrency}</option>
                    {#each usersetting.currencyOptions as currencyOption}
                        <option value={currencyOption}>{currencyOption}</option>
                    {/each}
                {/each}
            {:else}
                {#each $userSettingsStore as usersetting (usersetting._id)}
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

    <span class="error">
        <p>{error}</p>
    </span>

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
