<script>
    import ListInput from 'framework7-svelte/components/list-input.svelte';
    import List from 'framework7-svelte/components/list.svelte';
    import { f7 } from 'framework7-svelte';
    import { categories } from '../stores/budgetsStore';
    import { allCurrencies, baseCurrency } from '../stores/currenciesStore';
    import Button from 'framework7-svelte/components/button.svelte';
    import Block from 'framework7-svelte/components/block.svelte';
    import BlockTitle from 'framework7-svelte/components/block-title.svelte';
    import { addExpense } from '../stores/expensesStore';
    import { addMonthlyExpense } from '../stores/monthlyExpensesStore';
    import ListItem from 'framework7-svelte/components/list-item.svelte';

    let recurring = false;

    let expense = {};
    $: if ($baseCurrency !== '') {
        expense = {
            title: '',
            amount: '',
            category: '',
            date: new Date().toISOString().substr(0, 10),
            currency: $baseCurrency,
            originalAmount: null,
            originalCurrency: null,
        };
    }

    let error = '';

    async function handleAddExpense() {
        expense.category = expense.category[0];
        expense.amount = Number(expense.amount);
        if (
            expense.title === '' ||
            expense.amount === null ||
            expense.category === '-- Select a Category --'
        ) {
            error = `Please fill in all fields before submitting an expense`;
            return;
        } else {
            error = '';
        }

        // check whether expense needs to be converted to base currency
        if (expense.currency === '' || expense.currency === $baseCurrency) {
            expense.currency = $baseCurrency;
        } else {
            await convertAmount();
        }

        if (recurring === false) {
            // add the expense
            addExpense(expense).then(() => {
                // clear form
                expense.title = '';
                expense.date = new Date().toISOString().substr(0, 10);
                expense.category = '';
                expense.amount = '';
                expense.currency = $baseCurrency;
                expense.originalCurrency = null;
                expense.originalAmount = null;
            });
        } else {
            expense.recurringdate = expense.date.slice(-2);
            // add the recurring expense
            addMonthlyExpense(expense).then(() => {
                // clear form
                expense.title = '';
                expense.date = new Date().toISOString().substr(0, 10);
                expense.category = '';
                expense.amount = '';
                expense.currency = $baseCurrency;
                expense.originalCurrency = null;
                expense.originalAmount = null;
            });
        }
    }

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
                change: function (value) {
                    expense.category = value.value;
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
                change: function (value) {
                    expense.currency = value.value;
                },
            },
        });

        dateCalendar = f7.calendar.create({
            inputEl: '#dateCalendar',
            on: {
                change: function () {
                    expense.date = dateCalendar.value[0].toLocaleDateString();
                },
            },
            dateFormat: 'mm/dd/yyyy',
        });
    };

    $: if ($categories.length > 0 && $allCurrencies.length > 0) {
        initPickers();
    }
</script>

<Block>
    <BlockTitle class="text-align-center">Add Expense</BlockTitle>
    <List noHairlines>
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
            bind:value={expense.title}
            autocapitalize="off"
            clearButton />

        <ListInput
            outline
            floatingLabel
            label="Amount:"
            type="number"
            bind:value={expense.amount}
            placeholder="Amount"
            clearButton />
        <ListInput
            outline
            floatingLabel
            label="Category"
            placeholder="Category"
            readonly
            value={expense.category}
            inputId="categoryPicker"
            clearButton />
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
