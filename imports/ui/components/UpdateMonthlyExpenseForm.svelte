<script>
    import { useTracker } from 'meteor/rdb:svelte-meteor-data';
    import { Budgets } from '../../api/budgets';
    import { UserSettings } from '../../api/usersettings';
    export let monthlyexpense;
    import { createEventDispatcher, onMount } from 'svelte';
    let dispatch = createEventDispatcher();
    import { userCurrency } from '../stores/UserCurrencyStore';

    $: budgets = useTracker(() => Budgets.find({}).fetch());

    $: usersettings = useTracker(() => UserSettings.find({}).fetch());

    let updatedMonthlyExpense = {
        title: monthlyexpense.title,
        recurringdate: monthlyexpense.recurringdate,
        amount: monthlyexpense.amount,
        category: monthlyexpense.category,
        originalAmount: monthlyexpense.originalAmount,
        currency: monthlyexpense.currency,
        originalCurrency: monthlyexpense.originalCurrency,
        _id: monthlyexpense._id,
    };

    async function updateExpense() {
        // update the currency
        Meteor.call(
            'monthlyexpenses.update',
            monthlyexpense._id,
            updatedMonthlyExpense
        );

        // collapse the update menu
        dispatch('collapse');
    }

    const exitUpdate = () => {
        dispatch('collapse');
    };

    onMount(() => {
        Meteor.subscribe('usersettings');
        Meteor.subscribe('budgets');
    });
</script>

<div class="big-title">Edit Monthly Expense</div>
<div class="border" />
<form class="update-expense" on:submit|preventDefault={updateExpense}>
    <div class="date">
        <label for="date">Monthly On: </label>
        <select
            id="recurring-date"
            bind:value={updatedMonthlyExpense.recurringdate}>
            <option value={updatedMonthlyExpense.recurringdate}>
                {updatedMonthlyExpense.recurringdate}
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
    </div>

    <div class="title">
        <label for="title">Expense: </label>
        <input
            type="text"
            placeholder={updatedMonthlyExpense.title}
            bind:value={updatedMonthlyExpense.title} />
    </div>

    <div class="amount">
        <label for="amount">Amount: </label>
        {#if updatedMonthlyExpense.originalCurrency === null}
            <input
                type="number"
                placeholder={updatedMonthlyExpense.amount}
                bind:value={updatedMonthlyExpense.amount} />
        {:else}
            <input
                type="number"
                placeholder={updatedMonthlyExpense.originalAmount}
                bind:value={updatedMonthlyExpense.originalAmount} />
        {/if}
    </div>

    <div class="category">
        <label for="category">Category: </label>
        <select id="category" bind:value={updatedMonthlyExpense.category}>
            <option value={monthlyexpense.category}>
                {monthlyexpense.category}
            </option>
            {#each $budgets as budget (budget._id)}
                {#if budget.category !== monthlyexpense.category}
                    <option value={budget.category}>{budget.category}</option>
                {/if}
            {/each}
        </select>
    </div>

    <div class="currency">
        <label for="currency">Currency: </label>
        <select
            id="expense-currency"
            bind:value={updatedMonthlyExpense.currency}>
            {#if updatedMonthlyExpense.originalCurrency == null}
                {#each $usersettings as usersetting (usersetting._id)}
                    <option value={$userCurrency}>{$userCurrency}</option>
                    {#each usersetting.currencyOptions as currencyOption}
                        <option value={currencyOption}>{currencyOption}</option>
                    {/each}
                {/each}
            {:else}
                {#each $usersettings as usersetting (usersetting._id)}
                    <option value={updatedMonthlyExpense.originalCurrency}>
                        {updatedMonthlyExpense.originalCurrency}
                    </option>
                    <option value={$userCurrency}>{$userCurrency}</option>
                    {#each usersetting.currencyOptions as currencyOption}
                        {#if currencyOption === updatedMonthlyExpense.originalCurrency}
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
            on:click|preventDefault={updateExpense}>Update</button>
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
    .update-expense {
        width: 100%;
        background: white;
    }

    .update-expense div {
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
