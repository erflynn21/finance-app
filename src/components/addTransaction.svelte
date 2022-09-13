<script>
    import {
        f7,
        Block,
        List,
        ListInput,
        Row,
        Col,
        ListItem,
        Button,
    } from 'framework7-svelte';
    import { onMount } from 'svelte';
    import { budgetCurrency } from '../stores/currenciesStore';
    import {
        spendingCurrency,
        currencyOptions,
    } from '../stores/currenciesStore';
    import { categories } from '../stores/baseBudgetsStore';

    let recurring = false;
    let transaction = {
        type: 'Expense',
        amount: null,
        title: '',
        category: '',

        date: new Date(),
        currency: $budgetCurrency,
        originalAmount: null,
        originalCurrency: null,
    };

    let displayDate = new Date();

    const handleAddTransaction = () => {
        console.log('Add transaction', transaction);
        f7.dialog.alert('Transaction added');
    };

    const initPickers = () => {
        const datepicker = f7.calendar.create({
            inputEl: '#transaction-date',
            value: [displayDate],
            dateFormat: {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long',
            },
            on: {
                change: (values) => {
                    transaction.displayDate = values[0];
                    transaction.date = values.value[0];
                },
            },
        });

        const typePicker = f7.picker.create({
            inputEl: '#transaction-type',
            cols: [
                {
                    textAlign: 'center',
                    values: ['Expense', 'Income', 'Savings', 'Investment'],
                },
            ],
            on: {
                close: (values) => {
                    transaction.type = values.value[0];
                },
            },
        });

        const currencyPicker = f7.picker.create({
            inputEl: '#transaction-currency',
            value: [$spendingCurrency],
            cols: [
                {
                    textAlign: 'center',
                    values: $currencyOptions,
                },
            ],
            on: {
                close: (values) => {
                    transaction.currency = values.value[0];
                },
            },
        });
    };

    const initCategoryPicker = () => {
        const categoryPicker = f7.picker.create({
            inputEl: '#transaction-category',
            value: [$categories[0]],
            cols: [
                {
                    textAlign: 'center',
                    values: $categories,
                },
            ],
            on: {
                close: (values) => {
                    transaction.category = values.value[0];
                },
            },
        });
    };

    onMount(() => {
        initPickers();
    });
</script>

<List noHairlines class="add-form">
    <ListInput
        class="add-form-input"
        type="number"
        placeholder="Amount"
        bind:value={transaction.amount}
        clearButton
        underline
        step="0.01"
        inputmode="decimal"
        pattern="^[0-9]*\.[0-9][0-9]$"
        required
        errorMessage="Please provide a valid amount"
        inputStyle="text-align: center; font-size: 1.5rem"
        validate
    />

    <ListInput
        outline
        floatingLabel
        label="Title:"
        type="text"
        placeholder="Title of your transaction"
        autocapitalize="off"
        inputId="transactionTitle"
        bind:value={transaction.title}
        clearButton
        required
        on:input={() => f7.input.validate('#transactionTitle')}
        errorMessage="Please provide a valid transaction title."
    />

    <ListInput
        outline
        floatingLabel
        label="Date:"
        placeholder="Select Date"
        readonly
        inputId="transaction-date"
        value={transaction.displayDate}
    />

    <ListInput
        outline
        floatingLabel
        label="Currency"
        value={transaction.currency}
        readonly
        inputId="transaction-currency"
    />

    <ListInput
        outline
        floatingLabel
        label="Transaction Type:"
        value={transaction.type}
        inputId="transaction-type"
        required
        readonly
    />

    <!-- <Row>
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
                bind:value={transaction.amount}
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
                value={transaction.currency}
                readonly
                inputId="expenseCurrencyPicker"
            />
        </Col>
    </Row> -->

    {#if transaction.type === 'Expense'}
        <div use:initCategoryPicker />
        <ListInput
            on:click={initCategoryPicker}
            outline
            floatingLabel
            label="Category:"
            inputId="transaction-category"
            value={transaction.category}
            required
            readOnly
        />
    {/if}

    {#if recurring === false}
        <ListItem
            checkbox
            onChange={() => (recurring = !recurring)}
            title="This is a recurring transaction"
        />
    {:else}
        <ListItem
            checkbox
            checked
            onChange={() => (recurring = !recurring)}
            title="This is a recurring transaction"
        />
    {/if}

    {#if recurring === true}
        <!-- select between monthly and yearly expense -->
    {/if}
    <Button on:click={handleAddTransaction} large>Add</Button>
</List>
