<script>
    import ListInput from 'framework7-svelte/components/list-input.svelte';
    import List from 'framework7-svelte/components/list.svelte';
    import { f7 } from 'framework7-svelte';
    import { categories } from '../stores/budgetsStore';
    import { allCurrencies, baseCurrency } from '../stores/currenciesStore';
    import Button from 'framework7-svelte/components/button.svelte';
    import Block from 'framework7-svelte/components/block.svelte';
    import { addExpense, expenses } from '../stores/expensesStore';
    import { addMonthlyExpense } from '../stores/monthlyExpensesStore';
    import ListItem from 'framework7-svelte/components/list-item.svelte';
    import { Plugins } from '@capacitor/core';
    import Row from 'framework7-svelte/components/row.svelte';
    import Col from 'framework7-svelte/components/col.svelte';
    import { onDestroy, onMount } from 'svelte';
    import {
        selectedMonth,
        selectedMonthName,
        selectedYear,
    } from '../stores/datesStore';
    const { Keyboard } = Plugins;

    let recurring = false;

    let calendarDate;
    $: if ($selectedMonth) setMonth();
    const setMonth = () => {
        if (new Date().getMonth() + 1 === $selectedMonth) {
            calendarDate = new Intl.DateTimeFormat('en-CA').format(new Date());
        } else {
            calendarDate = `${$selectedYear}-${$selectedMonth}-01`;
        }
    };

    let expense = {};
    // checks to make sure there's a base currency before setting the expense values
    $: if ($baseCurrency !== '' && calendarDate !== undefined) {
        expense = {
            title: null,
            amount: null,
            category: null,
            date: calendarDate,
            currency: $baseCurrency,
            originalAmount: null,
            originalCurrency: null,
        };
    }

    const handleAddExpense = async () => {
        // validates the different inputs
        f7.input.validate('#expenseTitle');
        f7.input.validate('#expenseAmount');
        f7.input.validate('#expenseCategoryPicker');

        // breaks out of function if any inputs are left blank
        if (
            expense.title === null ||
            expense.amount === null ||
            expense.category === null
        ) {
            return;
        }

        f7.dialog.preloader('Adding expense...');
        // formats the amount to a number
        expense.amount = Number(expense.amount);

        // check whether expense needs to be converted to base currency
        if (expense.currency === '' || expense.currency === $baseCurrency) {
            expense.currency = $baseCurrency;
        } else if (recurring === true) {
            expense.currency = expense.currency;
        } else {
            f7.dialog.preloader('Converting to ' + $baseCurrency);
            await convertAmount().then(f7.dialog.close());
        }

        if (recurring === false) {
            // add the expense
            await addExpense(expense).then(() => {
                clearForm();
            });
        } else {
            let recurringExpense = {
                title: expense.title,
                amount: expense.amount,
                category: expense.category,
                currency: expense.currency,
                recurringDate: expense.date.slice(-2),
            };
            // add the recurring expense
            await addMonthlyExpense(recurringExpense).then(() => {
                clearForm();
            });
        }

        f7.dialog.close();
    };

    const clearForm = () => {
        expense.title = null;
        expense.date = new Intl.DateTimeFormat('en-CA').format(new Date());
        expense.amount = null;
        expense.currency = $baseCurrency;
        expense.originalCurrency = null;
        expense.originalAmount = null;
    };

    const convertAmount = async () => {
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
    };

    let expenseCategoryPicker;
    let expenseCurrencyPicker;
    let expenseDateCalendar;

    const initPickers = () => {
        expenseCategoryPicker = f7.picker.create({
            inputEl: '#expenseCategoryPicker',
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

        expenseCurrencyPicker = f7.picker.create({
            inputEl: '#expenseCurrencyPicker',
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

        let minDate = `${$selectedYear}-${$selectedMonth}-01`;
        let maxDate = `${$selectedYear}-${$selectedMonth}-31`;

        expenseDateCalendar = f7.calendar.create({
            inputEl: '#expenseDateCalendar',
            // minDate: new Date(`${$selectedYear}-${$selectedMonth}-01`),
            // maxDate: new Date(`${$selectedYear}-${$selectedMonth}-31`),
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
                    expenseDateCalendar.setYearMonth(
                        $selectedYear,
                        $selectedMonth - 1,
                        0
                    );
                },
                change: function () {
                    expense.date = new Intl.DateTimeFormat('en-CA').format(
                        expenseDateCalendar.value[0]
                    );
                },
            },
        });
    };

    onMount(() => {
        initPickers();
    });

    onDestroy(() => {
        expenseCategoryPicker.destroy();
        expenseCurrencyPicker.destroy();
        expenseDateCalendar.destroy();
    });
</script>

<Block>
    <List noHairlines class="add-form modal-form">
        <ListInput
            outline
            floatingLabel
            label="Date:"
            placeholder="Select Date"
            readonly
            inputId="expenseDateCalendar"
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
            autofocus
            required
            on:input={() => f7.input.validate('#expenseTitle')}
            errorMessage="Please provide a valid expense name." />

        <Row>
            <Col width="66">
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
            </Col>
            <Col width="33">
                <ListInput
                    outline
                    floatingLabel
                    label="Currency"
                    value={expense.currency}
                    readonly
                    inputId="expenseCurrencyPicker" />
            </Col>
        </Row>

        <ListInput
            outline
            floatingLabel
            label="Category"
            placeholder="Category"
            type="text"
            readonly
            value={expense.category}
            inputId="expenseCategoryPicker"
            clearButton
            required
            validateOnBlur
            on:input={() => f7.input.validate('#expenseCategoryPicker')}
            errorMessage="Please select a category." />

        <ListItem
            checkbox
            onChange={() => (recurring = !recurring)}
            title="This is a monthly recurring expense" />
    </List>
    <Button on:click={handleAddExpense}>Add</Button>
</Block>
