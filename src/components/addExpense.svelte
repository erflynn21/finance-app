<script>
    import ListInput from 'framework7-svelte/components/list-input.svelte';
    import List from 'framework7-svelte/components/list.svelte';
    import { f7 } from 'framework7-svelte';
    import { categories } from '../stores/budgetsStore';
    import { allCurrencies, baseCurrency } from '../stores/currenciesStore';
    import Button from 'framework7-svelte/components/button.svelte';
    import Block from 'framework7-svelte/components/block.svelte';
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
    import { currentRoute } from '../stores/currentRouteStore';
    import { convert } from '../js/convert';
    import { addExpense } from '../js/expenses';
    import { addMonthlyExpense } from '../js/monthlyExpenses';
    const { Keyboard } = Plugins;

    let recurring = false;

    if ($currentRoute === 'recurring') {
        recurring = true;
    }

    let calendarDate;
    $: if ($selectedMonth) setMonth();
    const setMonth = () => {
        if (new Date().getMonth() + 1 === $selectedMonth) {
            calendarDate = new Intl.DateTimeFormat('en-CA').format(new Date());
        } else {
            if ($selectedMonth < 10) {
                calendarDate = `${$selectedYear}-0${$selectedMonth}-01`;
            } else {
                calendarDate = `${$selectedYear}-${$selectedMonth}-01`;
            }
        }
    };

    let expense = {};
    // checks to make sure there's a base currency before setting the expense values
    $: if ($baseCurrency !== '') {
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
            await convert(expense).then(f7.dialog.close());
        }

        if (recurring === false) {
            // add the expense
            await addExpense(expense).then((e) => {
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
                    clearForm();
                }
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
            await addMonthlyExpense(recurringExpense).then((e) => {
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
                    clearForm();
                }
            });
        }

        f7.dialog.close();
    };

    const clearForm = () => {
        expense.title = null;
        expense.amount = null;
        expense.currency = $baseCurrency;
        expense.originalCurrency = null;
        expense.originalAmount = null;
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

        let minDate = `${$selectedYear}-01-01`;
        let maxDate = `${$selectedYear}-12-31`;
        expenseDateCalendar = f7.calendar.create({
            inputEl: '#expenseDateCalendar',
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
            value={expense.date}
        />

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
            errorMessage="Please provide a valid expense name."
        />

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
                    errorMessage="Please provide a valid amount."
                />
            </Col>
            <Col width="33">
                <ListInput
                    outline
                    floatingLabel
                    label="Currency"
                    value={expense.currency}
                    readonly
                    inputId="expenseCurrencyPicker"
                />
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
            errorMessage="Please select a category."
        />

        {#if recurring === false}
            <ListItem
                checkbox
                onChange={() => (recurring = !recurring)}
                title="This is a monthly recurring expense"
            />
        {:else}
            <ListItem
                checkbox
                checked
                onChange={() => (recurring = !recurring)}
                title="This is a monthly recurring expense"
            />
        {/if}
    </List>
    <Button on:click={handleAddExpense}>Add</Button>
</Block>
