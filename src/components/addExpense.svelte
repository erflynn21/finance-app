<script>
    import ListInput from 'framework7-svelte/components/list-input.svelte';
    import List from 'framework7-svelte/components/list.svelte';
    import { f7 } from 'framework7-svelte';
    import { categories } from '../stores/budgetsStore';
    import { allCurrencies, baseCurrency } from '../stores/currenciesStore';
    import Button from 'framework7-svelte/components/button.svelte';
    import Block from 'framework7-svelte/components/block.svelte';
    import { addExpense } from '../stores/expensesStore';
    import { addMonthlyExpense } from '../stores/monthlyExpensesStore';
    import ListItem from 'framework7-svelte/components/list-item.svelte';
    import { Plugins } from '@capacitor/core';
    import LoadingScreen from '../pages/loadingScreen.svelte';
    const { Keyboard } = Plugins;

    let recurring = false;
    let loading = false;

    let expense = {};
    // checks to make sure there's a base currency before setting the expense values
    $: if ($baseCurrency !== '') {
        expense = {
            title: null,
            amount: null,
            category: null,
            date: new Date().toISOString().substr(0, 10),
            currency: $baseCurrency,
            originalAmount: null,
            originalCurrency: null,
        };
    }

    async function handleAddExpense() {
        loading = true;
        // validates the different inputs
        f7.input.validate('#expenseTitle');
        f7.input.validate('#expenseAmount');
        f7.input.validate('#categoryPicker');

        // breaks out of function if any inputs are left blank
        if (
            expense.title === null ||
            expense.amount === null ||
            expense.category === null
        ) {
            return;
        }

        // formats the amount to a number
        expense.amount = Number(expense.amount);

        // check whether expense needs to be converted to base currency
        if (expense.currency === '' || expense.currency === $baseCurrency) {
            expense.currency = $baseCurrency;
        } else {
            await convertAmount();
        }

        if (recurring === false) {
            // add the expense
            addExpense(expense).then(() => {
                clearForm();
            });
        } else {
            expense.recurringdate = expense.date.slice(-2);
            // add the recurring expense
            addMonthlyExpense(expense).then(() => {
                clearForm();
            });
        }

        loading = false;
    }

    const clearForm = () => {
        expense.title = null;
        (expense.date = new Date().toISOString().substr(0, 10)),
            (expense.category = null);
        expense.amount = null;
        expense.currency = $baseCurrency;
        expense.originalCurrency = null;
        expense.originalAmount = null;
    };

    async function convertAmount() {
        expense.originalAmount = expense.amount;
        expense.originalCurrency = expense.currency[0];

        let url = `https://api.exchangeratesapi.io/${expense.date}?base=${$baseCurrency}&symbols=${expense.originalCurrency}`;
        let response = await fetch(url);
        let data = await response.json();
        let rates = JSON.stringify(data.rates);
        let exchangeRate = Number(rates.replace(/[^\d.-]/g, ''));
        expense.amount = Number(
            (expense.originalAmount / exchangeRate).toFixed(2)
        );
        expense.currency = $baseCurrency;
    }

    let pickerCategory;
    let pickerCurrency;
    let dateCalendar;

    const initPickers = () => {
        pickerCategory = f7.picker.create({
            inputEl: '#categoryPicker',
            cols: [
                {
                    textAlign: 'center',
                    values: $categories,
                },
            ],
            on: {
                open: function () {
                    Keyboard.hide();
                },
                change: function (value) {
                    expense.category = value.value;
                    expense.category = expense.category[0];
                },
            },
        });

        pickerCurrency = f7.picker.create({
            inputEl: '#currencyPicker',
            cols: [
                {
                    textAlign: 'center',
                    values: $allCurrencies,
                },
            ],
            on: {
                open: function () {
                    Keyboard.hide();
                },
                change: function (value) {
                    expense.currency = value.value;
                },
            },
        });

        dateCalendar = f7.calendar.create({
            inputEl: '#dateCalendar',
            on: {
                open: function () {
                    Keyboard.hide();
                },
                change: function () {
                    expense.date = dateCalendar.value[0]
                        .toISOString()
                        .substr(0, 10);
                },
            },
        });
    };

    $: if ($categories.length > 0 && $allCurrencies.length > 0) {
        initPickers();
    }
</script>

<!-- 
{#if loading}
    <LoadingScreen />
{:else} -->
<Block>
    <List noHairlines class="add-expense-form">
        <ListInput
            outline
            floatingLabel
            label="Date:"
            placeholder="Select Date"
            readonly
            inputId="dateCalendar"
            value={expense.date} />

        <ListInput
            outline
            floatingLabel
            label="Expense:"
            type="text"
            placeholder="Your Expense"
            autocapitalize="off"
            inputId="expenseTitle"
            bind:value={expense.title}
            clearButton
            required
            autofocus
            on:click={Keyboard.show()}
            on:input={() => f7.input.validate('#expenseTitle')}
            errorMessage="Please provide a valid expense name." />

        <ListInput
            outline
            floatingLabel
            label="Amount:"
            type="number"
            placeholder="Amount"
            autocapitalize="off"
            inputId="expenseAmount"
            step="0.01"
            inputmode="decimal"
            pattern="[0-9]*"
            bind:value={expense.amount}
            clearButton
            required
            on:input={() => f7.input.validate('#expenseAmount')}
            errorMessage="Please provide a valid amount." />

        <ListInput
            outline
            floatingLabel
            label="Category"
            placeholder="Category"
            type="text"
            readonly
            value={expense.category}
            inputId="categoryPicker"
            clearButton
            required
            on:input={() => f7.input.validate('#categoryPicker')}
            errorMessage="Please select a category." />

        <ListInput
            outline
            floatingLabel
            label="Currency"
            value={expense.currency}
            readonly
            inputId="currencyPicker" />
        <ListItem
            checkbox
            onChange={() => (recurring = !recurring)}
            title="This is a monthly recurring expense" />
    </List>
    <Button on:click={handleAddExpense}>Add</Button>
</Block>
<!-- {/if} -->
