<script>
    export let item;
    export let itemId;
    import ListInput from 'framework7-svelte/components/list-input.svelte';
    import List from 'framework7-svelte/components/list.svelte';
    import { f7 } from 'framework7-svelte';
    import { allCurrencies, baseCurrency } from '../stores/currenciesStore';
    import Button from 'framework7-svelte/components/button.svelte';
    import Block from 'framework7-svelte/components/block.svelte';
    import { onDestroy, onMount } from 'svelte';
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    import { Plugins } from '@capacitor/core';
    import Row from 'framework7-svelte/components/row.svelte';
    import Col from 'framework7-svelte/components/col.svelte';
    import { updateIncome } from '../stores/incomesStore';
    const { Keyboard } = Plugins;

    let updatedIncome = {
        title: item.title,
        date: item.date,
        amount: item.amount,
        originalAmount: item.originalAmount,
        currency: item.currency,
        originalCurrency: item.originalCurrency,
    };

    const handleUpdateIncome = async () => {
        // validates the different inputs
        f7.input.validate('#editedTitle');
        f7.input.validate('#editedAmount');

        // breaks out of function if any inputs are left blank
        if (updatedIncome.title === null || updatedIncome.amount === null) {
            return;
        }

        f7.dialog.preloader('Updating expense...');
        // formats the amount to a number
        updatedIncome.amount = Number(updatedIncome.amount);

        // check whether expense needs to be converted to base currency
        if (
            updatedIncome.originalAmount !== item.originalAmount ||
            (updateIncome.date !== item.date &&
                updateIncome.currency !== $baseCurrency)
        ) {
            f7.dialog.preloader('Converting to ' + $baseCurrency);
            updatedIncome.amount = updatedIncome.originalAmount;
            updatedIncome.currency = updatedIncome.originalCurrency;
            await convertAmount();
        }

        // add the expense
        updateIncome(updatedIncome, itemId).then(() => {
            dispatch('collapse');
            f7.dialog.close();
        });

        f7.dialog.close();
    };

    const convertAmount = async () => {
        let url = `https://api.exchangeratesapi.io/${updatedIncome.date}?base=${$baseCurrency}&symbols=${updatedIncome.originalCurrency}`;
        let response = await fetch(url);
        let data = await response.json();
        let rates = JSON.stringify(data.rates);
        let exchangeRate = Number(rates.replace(/[^\d.-]/g, ''));
        updatedIncome.amount = Number(
            (updatedIncome.originalAmount / exchangeRate).toFixed(2)
        );
        updatedIncome.currency = $baseCurrency;
    };

    let editIncomeCurrencyPicker;
    let editIncomeDateCalendar;

    const initPickers = () => {
        editIncomeCurrencyPicker = f7.picker.create({
            inputEl: '#editIncomeCurrencyPicker',
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
                    updatedIncome.currency = value.value;
                },
            },
        });

        editIncomeDateCalendar = f7.calendar.create({
            inputEl: '#editIncomeDateCalendar',
            on: {
                open: function () {
                    Keyboard.hide();
                },
                change: function () {
                    updatedIncome.date = new Intl.DateTimeFormat(
                        'en-CA'
                    ).format(editIncomeDateCalendar.value[0]);
                },
            },
        });
    };

    onMount(() => {
        initPickers();
    });

    onDestroy(() => {
        editIncomeCurrencyPicker.destroy();
        editIncomeDateCalendar.destroy();
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
            inputId="editIncomeDateCalendar"
            value={updatedIncome.date} />

        <ListInput
            outline
            floatingLabel
            label="Income:"
            type="text"
            placeholder="Your Income"
            autocapitalize="off"
            inputId="editedTitle"
            bind:value={updatedIncome.title}
            clearButton
            required
            on:input={() => f7.input.validate('#editedTitle')}
            errorMessage="Please provide a valid income name." />

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
                        bind:value={updatedIncome.originalAmount}
                        clearButton
                        required
                        on:input={() => f7.input.validate('#editedAmount')}
                        errorMessage="Please provide a valid amount." />
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
                        bind:value={updatedIncome.amount}
                        clearButton
                        required
                        on:input={() => f7.input.validate('#editedAmount')}
                        errorMessage="Please provide a valid amount." />
                {/if}
            </Col>
            <Col width="33">
                {#if item.originalCurrency}
                    <ListInput
                        outline
                        floatingLabel
                        label="Currency"
                        value={updatedIncome.originalCurrency}
                        readonly
                        inputId="editIncomeCurrencyPicker" />
                {:else}
                    <ListInput
                        outline
                        floatingLabel
                        label="Currency"
                        value={updatedIncome.currency}
                        readonly
                        inputId="editIncomeCurrencyPicker" />
                {/if}
            </Col>
        </Row>
    </List>
    <Button on:click={handleUpdateIncome}>Update</Button>
</Block>
