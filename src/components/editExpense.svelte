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
    import {
        selectedMonth,
        selectedMonthName,
        selectedYear,
    } from '../stores/datesStore';
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

    const handleUpdateExpense = async () => {
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
        if (
            (updatedExpense.originalCurrency !== null &&
                updatedExpense.date !== item.date) ||
            updatedExpense.originalAmount !== item.originalAmount ||
            (updatedExpense.originalCurrency !== item.originalCurrency &&
                updatedExpense.originalCurrency !== $baseCurrency)
        ) {
            f7.dialog.preloader('Converting to ' + $baseCurrency);
            await convertAmount();
        } else if (updatedExpense.originalCurrency === $baseCurrency) {
            updatedExpense.originalCurrency = null;
            updatedExpense.amount = updatedExpense.originalAmount;
            updatedExpense.originalAmount = null;
        }

        // add the expense
        await updateExpense(updatedExpense, itemId).then((e) => {
            if (e) {
                f7.dialog.close();
                let errorToast = f7.toast.create({
                    text: e.message,
                    position: 'center',
                    closeTimeout: 2000,
                    cssClass: 'text-align-center',
                });
                errorToast.open();
            } else {
                dispatch('collapse');
                f7.dialog.close();
            }
        });

        f7.dialog.close();
    };

    const convertAmount = async () => {
        if (updatedExpense.originalAmount === null) {
            updatedExpense.originalAmount = updatedExpense.amount;
            updatedExpense.originalCurrency = updatedExpense.currency;
        }
        let url = `https://api.exchangeratesapi.io/${updatedExpense.date}?base=${$baseCurrency}&symbols=${updatedExpense.originalCurrency}`;
        let response = await fetch(url);
        let data = await response.json();
        let rates = JSON.stringify(data.rates);
        let exchangeRate = Number(rates.replace(/[^\d.-]/g, ''));
        updatedExpense.amount = Number(
            (updatedExpense.originalAmount / exchangeRate).toFixed(2)
        );
        updatedExpense.currency = $baseCurrency;
    };

    let editExpenseCategoryPicker;
    let editExpenseCurrencyPicker;
    let editExpenseDateCalendar;

    const initPickers = () => {
        editExpenseCategoryPicker = f7.picker.create({
            inputEl: '#editExpenseCategoryPicker',
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

        editExpenseCurrencyPicker = f7.picker.create({
            inputEl: '#editExpenseCurrencyPicker',
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
                    if (updatedExpense.originalCurrency !== null) {
                        updatedExpense.originalCurrency = value.value[0];
                    } else {
                        updatedExpense.currency = value.value[0];
                    }
                },
            },
        });

        let minDate = `${$selectedYear}-01-01`;
        let maxDate = `${$selectedYear}-12-31`;
        editExpenseDateCalendar = f7.calendar.create({
            inputEl: '#editExpenseDateCalendar',
            disabled(date) {
                if (new Intl.DateTimeFormat('en-CA').format(date) < minDate)
                    return true;
                if (new Intl.DateTimeFormat('en-CA').format(date) > maxDate)
                    return true;
                return false;
            },
            headerPlaceholder: `${$selectedMonthName}, ${$selectedYear}`,
            on: {
                open: function () {
                    Keyboard.hide();
                    editExpenseDateCalendar.setYearMonth(
                        $selectedYear,
                        $selectedMonth - 1,
                        0
                    );
                },
                change: function () {
                    updatedExpense.date = new Intl.DateTimeFormat(
                        'en-CA'
                    ).format(editExpenseDateCalendar.value[0]);
                },
            },
        });
    };

    onMount(() => {
        initPickers();
    });

    onDestroy(() => {
        editExpenseCategoryPicker.destroy();
        editExpenseCurrencyPicker.destroy();
        editExpenseDateCalendar.destroy();
    });
</script>

<Block>
    <List noHairlines class="modal-form">
        <ListInput
            outline
            floatingLabel
            label="Date:"
            placeholder="Select Date"
            readonly
            inputId="editExpenseDateCalendar"
            value={updatedExpense.date}
        />

        <ListInput
            outline
            floatingLabel
            label="Expense:"
            type="text"
            placeholder="Your Expense"
            autocapitalize="off"
            inputId="editedTitle"
            bind:value={updatedExpense.title}
            clearButton
            required
            on:input={() => f7.input.validate('#editedTitle')}
            errorMessage="Please provide a valid expense name."
        />

        <Row>
            <Col width="66">
                {#if item.originalCurrency}
                    <ListInput
                        outline
                        floatingLabel
                        label="Amount:"
                        type="number"
                        placeholder="Amount"
                        autocapitalize="off"
                        inputId="editedAmount"
                        step="0.01"
                        inputmode="decimal"
                        pattern="[0-9]*"
                        bind:value={updatedExpense.originalAmount}
                        clearButton
                        required
                        on:input={() => f7.input.validate('#editedAmount')}
                        errorMessage="Please provide a valid amount."
                    />
                {:else}
                    <ListInput
                        outline
                        floatingLabel
                        label="Amount:"
                        type="number"
                        placeholder="Amount"
                        autocapitalize="off"
                        inputId="editedAmount"
                        step="0.01"
                        inputmode="decimal"
                        pattern="[0-9]*"
                        bind:value={updatedExpense.amount}
                        clearButton
                        required
                        on:input={() => f7.input.validate('#editedAmount')}
                        errorMessage="Please provide a valid amount."
                    />
                {/if}
            </Col>
            <Col width="33">
                {#if item.originalCurrency}
                    <ListInput
                        outline
                        floatingLabel
                        label="Currency"
                        value={updatedExpense.originalCurrency}
                        readonly
                        inputId="editExpenseCurrencyPicker"
                    />
                {:else}
                    <ListInput
                        outline
                        floatingLabel
                        label="Currency"
                        value={updatedExpense.currency}
                        readonly
                        inputId="editExpenseCurrencyPicker"
                    />
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
            inputId="editExpenseCategoryPicker"
            clearButton
            required
            validateOnBlur
            on:input={() => f7.input.validate('#editExpenseCategoryPicker')}
            errorMessage="Please select a category."
        />
    </List>
    <Button on:click={handleUpdateExpense}>Update</Button>
</Block>
