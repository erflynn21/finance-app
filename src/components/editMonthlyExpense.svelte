<script>
    export let item;
    export let itemId;
    import ListInput from 'framework7-svelte/components/list-input.svelte';
    import List from 'framework7-svelte/components/list.svelte';
    import { f7 } from 'framework7-svelte';
    import { categories } from '../stores/budgetsStore';
    import { allCurrencies } from '../stores/currenciesStore';
    import Button from 'framework7-svelte/components/button.svelte';
    import Block from 'framework7-svelte/components/block.svelte';
    import { onDestroy, onMount } from 'svelte';
    import { createEventDispatcher } from 'svelte';
    import { updateMonthlyExpense } from '../stores/monthlyExpensesStore';
    const dispatch = createEventDispatcher();
    import { Plugins } from '@capacitor/core';
    import Row from 'framework7-svelte/components/row.svelte';
    import Col from 'framework7-svelte/components/col.svelte';
    const { Keyboard } = Plugins;

    let updatedMonthlyExpense = {
        title: item.title,
        recurringDate: item.recurringDate,
        amount: item.amount,
        category: item.category,
        currency: item.currency,
    };

    const handleUpdateMonthlyExpense = async () => {
        // validates the different inputs
        f7.input.validate('#editedTitle');
        f7.input.validate('#editedAmount');
        f7.input.validate('#editMonthlyExpenseCategoryPicker');

        // breaks out of function if any inputs are left blank
        if (
            updatedMonthlyExpense.title === null ||
            updatedMonthlyExpense.amount === null ||
            updatedMonthlyExpense.category === null
        ) {
            return;
        }

        f7.dialog.preloader('Updating expense...');
        // formats the amount to a number
        updatedMonthlyExpense.amount = Number(updatedMonthlyExpense.amount);

        // update the monthly expense
        await updateMonthlyExpense(updatedMonthlyExpense, itemId).then((e) => {
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
            }
        });

        f7.dialog.close();
    };

    let editMonthlyExpenseCategoryPicker;
    let editMonthlyExpenseCurrencyPicker;
    let editMonthlyExpenseDatePicker;

    const initPickers = () => {
        editMonthlyExpenseCategoryPicker = f7.picker.create({
            inputEl: '#editMonthlyExpenseCategoryPicker',
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
                    updatedMonthlyExpense.category = value.value;
                    updatedMonthlyExpense.category =
                        updatedMonthlyExpense.category[0];
                },
            },
        });

        editMonthlyExpenseCurrencyPicker = f7.picker.create({
            inputEl: '#editMonthlyExpenseCurrencyPicker',
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
                    updatedMonthlyExpense.currency = value.value;
                },
            },
        });

        editMonthlyExpenseDatePicker = f7.picker.create({
            inputEl: '#editMonthlyExpenseDatePicker',
            cols: [
                {
                    textAlign: 'center',
                    values: [
                        '01',
                        '02',
                        '03',
                        '04',
                        '05',
                        '06',
                        '07',
                        '08',
                        '09',
                        '10',
                        '11',
                        '12',
                        '13',
                        '14',
                        '15',
                        '16',
                        '17',
                        '18',
                        '19',
                        '20',
                        '21',
                        '22',
                        '23',
                        '24',
                        '25',
                        '26',
                        '27',
                        '28',
                        '29',
                        '30',
                        '31',
                    ],
                    displayValues: [
                        '1st',
                        '2nd',
                        '3rd',
                        '4th',
                        '5th',
                        '6th',
                        '7th',
                        '8th',
                        '9th',
                        '10th',
                        '11th',
                        '12th',
                        '13th',
                        '14th',
                        '15th',
                        '16th',
                        '17th',
                        '18th',
                        '19th',
                        '20th',
                        '21st',
                        '22nd',
                        '23rd',
                        '24th',
                        '25th',
                        '26st',
                        '27th',
                        '28th',
                        '29th',
                        '30th',
                        '31st',
                    ],
                },
            ],
            on: {
                open: function () {
                    Keyboard.hide();
                },
                change: function (value) {
                    updatedMonthlyExpense.recurringDate = value.value[0];
                },
            },
        });
    };

    onMount(() => {
        initPickers();
    });

    onDestroy(() => {
        editMonthlyExpenseCategoryPicker.destroy();
        editMonthlyExpenseCurrencyPicker.destroy();
        editMonthlyExpenseDatePicker.destroy();
    });
</script>

<Block>
    <List noHairlines class="modal-form">
        <ListInput
            outline
            floatingLabel
            label="Monthly On:"
            placeholder="Select Date"
            readonly
            inputId="editMonthlyExpenseDatePicker"
            value={updatedMonthlyExpense.recurringDate}
        />

        <ListInput
            outline
            floatingLabel
            label="Expense:"
            type="text"
            placeholder="Your Expense"
            autocapitalize="off"
            inputId="editedTitle"
            bind:value={updatedMonthlyExpense.title}
            clearButton
            required
            on:input={() => f7.input.validate('#editedTitle')}
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
                    inputId="editedAmount"
                    step="0.01"
                    inputmode="decimal"
                    pattern="[0-9]*"
                    bind:value={updatedMonthlyExpense.amount}
                    clearButton
                    required
                    on:input={() => f7.input.validate('#editedAmount')}
                    errorMessage="Please provide a valid amount."
                />
            </Col>
            <Col width="33">
                <ListInput
                    outline
                    floatingLabel
                    label="Currency"
                    value={updatedMonthlyExpense.currency}
                    readonly
                    inputId="editMonthlyExpenseCurrencyPicker"
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
            value={updatedMonthlyExpense.category}
            inputId="editMonthlyExpenseCategoryPicker"
            clearButton
            required
            validateOnBlur
            on:input={() =>
                f7.input.validate('#editMonthlyExpenseCategoryPicker')}
            errorMessage="Please select a category."
        />
    </List>
    <Button on:click={handleUpdateMonthlyExpense}>Update</Button>
</Block>
