<script>
    export let item;
    export let itemId;
    import ListInput from 'framework7-svelte/components/list-input.svelte';
    import List from 'framework7-svelte/components/list.svelte';
    import { f7 } from 'framework7-svelte';
    import { categories } from '../stores/budgetsStore';
    import { allCurrencies, baseCurrency } from '../stores/currenciesStore';
    import Button from 'framework7-svelte/components/button.svelte';
    import Block from 'framework7-svelte/components/block.svelte';
    import { onDestroy, onMount } from 'svelte';
    import { updateExpense } from '../stores/expensesStore';
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    import { Plugins } from '@capacitor/core';
    import Row from 'framework7-svelte/components/row.svelte';
    import Col from 'framework7-svelte/components/col.svelte';
    const { Keyboard } = Plugins;

    let updatedExpense = {
        title: item.title,
        date: item.date,
        amount: item.amount,
        category: item.category,
        originalAmount: item.originalAmount,
        currency: item.currency,
        originalCurrency: item.originalCurrency,
    };

    async function handleAddExpense() {
        // validates the different inputs
        f7.input.validate('#editedTitle');
        f7.input.validate('#editedAmount');
        f7.input.validate('#editCategoryPicker');

        // breaks out of function if any inputs are left blank
        if (
            updatedExpense.title === null ||
            updatedExpense.amount === null ||
            updatedExpense.category === null
        ) {
            return;
        }

        f7.dialog.preloader('Updating expense...');
        // formats the amount to a number
        updatedExpense.amount = Number(updatedExpense.amount);

        // check whether expense needs to be converted to base currency
        if (updatedExpense.originalAmount !== item.originalAmount) {
            f7.dialog.preloader('Converting to ' + $baseCurrency);
            updatedExpense.amount = updatedExpense.originalAmount;
            updatedExpense.currency = updatedExpense.originalCurrency;
            await convertAmount();
        }

        // add the expense
        updateExpense(updatedExpense, itemId).then(() => {
            dispatch('collapse');
            f7.dialog.close();
        });

        f7.dialog.close();
    }

    async function convertAmount() {
        let url = `https://api.exchangeratesapi.io/${updatedExpense.date}?base=${$baseCurrency}&symbols=${updatedExpense.originalCurrency}`;
        let response = await fetch(url);
        let data = await response.json();
        let rates = JSON.stringify(data.rates);
        let exchangeRate = Number(rates.replace(/[^\d.-]/g, ''));
        updatedExpense.amount = Number(
            (updatedExpense.originalAmount / exchangeRate).toFixed(2)
        );
        updatedExpense.currency = $baseCurrency;
    }

    let editCategoryPicker;
    let editCurrencyPicker;
    let editDateCalendar;

    const initPickers = () => {
        editCategoryPicker = f7.picker.create({
            inputEl: '#editCategoryPicker',
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
                    updatedExpense.category = value.value;
                    updatedExpense.category = updatedExpense.category[0];
                },
            },
        });

        editCurrencyPicker = f7.picker.create({
            inputEl: '#editCurrencyPicker',
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
                    updatedExpense.currency = value.value;
                },
            },
        });

        editDateCalendar = f7.calendar.create({
            inputEl: '#editDateCalendar',
            on: {
                open: function () {
                    Keyboard.hide();
                },
                change: function () {
                    updatedExpense.date = editDateCalendar.value[0]
                        .toISOString()
                        .substr(0, 10);
                },
            },
        });
    };

    onMount(() => {
        initPickers();
    });

    onDestroy(() => {
        editCategoryPicker.destroy();
        editCurrencyPicker.destroy();
        editDateCalendar.destroy();
    });
</script>

<Block>
    <List noHairlines class="add-expense-form modal-form">
        <ListInput
            outline
            floatingLabel
            label="Date:"
            placeholder="Select Date"
            readonly
            inputId="editDateCalendar"
            value={updatedExpense.date} />

        <ListInput
            outline
            floatingLabel
            label="Expense:"
            type="text"
            placeholder="Your Expense"
            autocapitalize="off"
            inputId="expenseTitle"
            bind:value={updatedExpense.title}
            clearButton
            required
            on:input={() => f7.input.validate('#expenseTitle')}
            errorMessage="Please provide a valid expense name." />

        <Row>
            <Col>
                {#if item.originalCurrency}
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
                        bind:value={updatedExpense.originalAmount}
                        clearButton
                        required
                        on:input={() => f7.input.validate('#expenseAmount')}
                        errorMessage="Please provide a valid amount." />
                {:else}
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
                        bind:value={updatedExpense.amount}
                        clearButton
                        required
                        on:input={() => f7.input.validate('#expenseAmount')}
                        errorMessage="Please provide a valid amount." />
                {/if}
            </Col>
            <Col>
                {#if item.originalCurrency}
                    <ListInput
                        outline
                        floatingLabel
                        label="Currency"
                        value={updatedExpense.originalCurrency}
                        readonly
                        inputId="editCurrencyPicker" />
                {:else}
                    <ListInput
                        outline
                        floatingLabel
                        label="Currency"
                        value={updatedExpense.currency}
                        readonly
                        inputId="editCurrencyPicker" />
                {/if}
            </Col>
        </Row>

        <ListInput
            outline
            floatingLabel
            label="Category"
            placeholder="Category"
            type="text"
            readonly
            value={updatedExpense.category}
            inputId="editCategoryPicker"
            clearButton
            required
            validateOnBlur
            on:input={() => f7.input.validate('#editCategoryPicker')}
            errorMessage="Please select a category." />
    </List>
    <Button on:click={handleAddExpense}>Update</Button>
</Block>
