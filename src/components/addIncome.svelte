<script>
    import { allCurrencies, baseCurrency } from '../stores/currenciesStore';
    import { f7 } from 'framework7-svelte';
    import Button from 'framework7-svelte/components/button.svelte';
    import Block from 'framework7-svelte/components/block.svelte';
    import ListInput from 'framework7-svelte/components/list-input.svelte';
    import List from 'framework7-svelte/components/list.svelte';
    import { addMonthlyIncome } from '../stores/monthlyIncomesStore';
    import { addIncome } from '../stores/incomesStore';
    import ListItem from 'framework7-svelte/components/list-item.svelte';
    import { Plugins } from '@capacitor/core';
    import Row from 'framework7-svelte/components/row.svelte';
    import Col from 'framework7-svelte/components/col.svelte';
    import { onDestroy, onMount } from 'svelte';
    const { Keyboard } = Plugins;

    let recurring = false;

    let income = {};
    $: if ($baseCurrency !== '') {
        income = {
            title: null,
            amount: null,
            date: new Intl.DateTimeFormat('en-CA').format(new Date()),
            currency: $baseCurrency,
            originalAmount: null,
            originalCurrency: null,
        };
    }

    const handleAddIncome = async () => {
        // validates the different inputs
        f7.input.validate('#incomeTitle');
        f7.input.validate('#incomeAmount');

        // breaks out of function if any inputs are left blank
        if (income.title === null || income.amount === null) {
            return;
        }

        f7.dialog.preloader('Adding income...');
        // formats the amount to a number
        income.amount = Number(income.amount);

        // check whether income needs to be converted to base currency
        if (income.currency === '' || income.currency === $baseCurrency) {
            income.currency = $baseCurrency;
        } else {
            f7.dialog.preloader('Converting to ' + $baseCurrency);
            await convertAmount().then(f7.dialog.close());
        }

        if (recurring === false) {
            // add the income
            await addIncome(income).then(() => {
                clearForm();
            });
        } else {
            let recurringIncome = {
                title: income.title,
                amount: income.amount,
                category: income.category,
                currency: income.currency,
                recurringDate: income.date.slice(-2),
            };
            // add the recurring income
            await addMonthlyIncome(recurringIncome).then(() => {
                clearForm();
            });
        }

        f7.dialog.close();
    };

    const clearForm = () => {
        income.title = null;
        income.date = new Intl.DateTimeFormat('en-CA').format(new Date());
        income.category = null;
        income.amount = null;
        income.currency = $baseCurrency;
        income.originalCurrency = null;
        income.originalAmount = null;
    };

    const convertAmount = async () => {
        income.originalAmount = income.amount;
        income.originalCurrency = income.currency[0];

        let url = `https://api.exchangeratesapi.io/${income.date}?base=${$baseCurrency}&symbols=${income.originalCurrency}`;
        let response = await fetch(url);
        let data = await response.json();
        let rates = JSON.stringify(data.rates);
        let exchangeRate = Number(rates.replace(/[^\d.-]/g, ''));
        income.amount = Number(
            (income.originalAmount / exchangeRate).toFixed(2)
        );
        income.currency = $baseCurrency;
    };

    let incomeCurrencyPicker;
    let incomeDateCalendar;

    const initPickers = () => {
        incomeCurrencyPicker = f7.picker.create({
            inputEl: '#incomeCurrencyPicker',
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
                    income.currency = value.value;
                },
            },
        });

        incomeDateCalendar = f7.calendar.create({
            inputEl: '#incomeDateCalendar',
            on: {
                open: function () {
                    Keyboard.hide();
                },
                change: function () {
                    income.date = new Intl.DateTimeFormat('en-CA').format(
                        incomeDateCalendar.value[0]
                    );
                },
            },
        });
    };

    onMount(() => {
        initPickers();
    });

    onDestroy(() => {
        incomeCurrencyPicker.destroy();
        incomeDateCalendar.destroy();
    });

    // $: if ($categories.length > 0 && $allCurrencies.length > 0) {
    //     initPickers();
    // }
</script>

<Block>
    <List noHairlines class="add-form modal-form">
        <ListInput
            outline
            floatingLabel
            label="Date:"
            placeholder="Select Date"
            readonly
            inputId="incomeDateCalendar"
            value={income.date} />

        <ListInput
            outline
            floatingLabel
            label="Expense:"
            type="text"
            placeholder="Your Expense"
            autocapitalize="off"
            inputId="incomeTitle"
            bind:value={income.title}
            clearButton
            required
            autofocus
            on:input={() => f7.input.validate('#incomeTitle')}
            errorMessage="Please provide a valid income name." />

        <Row>
            <Col width="66">
                <ListInput
                    outline
                    floatingLabel
                    label="Amount:"
                    type="number"
                    placeholder="Amount"
                    autocapitalize="off"
                    inputId="incomeAmount"
                    step="0.01"
                    inputmode="decimal"
                    pattern="[0-9]*"
                    bind:value={income.amount}
                    clearButton
                    required
                    on:input={() => f7.input.validate('#incomeAmount')}
                    errorMessage="Please provide a valid amount." />
            </Col>
            <Col width="33">
                <ListInput
                    outline
                    floatingLabel
                    label="Currency"
                    value={income.currency}
                    readonly
                    inputId="incomeCurrencyPicker" />
            </Col>
        </Row>

        <ListItem
            checkbox
            onChange={() => (recurring = !recurring)}
            title="This is a monthly recurring income" />
    </List>
    <Button on:click={handleAddIncome}>Add</Button>
</Block>
