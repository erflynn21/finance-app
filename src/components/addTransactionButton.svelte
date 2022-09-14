<script>
    import {
        Fab,
        Icon,
        Page,
        Popup,
        Navbar,
        NavRight,
        Link,
        f7,
        List,
        ListInput,
        ListItem,
        Button,
    } from 'framework7-svelte';
    import {
        budgetCurrency,
        spendingCurrency,
        currencyOptions,
    } from '../stores/currenciesStore';
    import { categories } from '../stores/baseBudgetsStore';
    import { addTransaction } from '../js/transactions';

    let popupOpened = false;

    let recurring = false;
    let transaction = {
        type: 'Expense',
        amount: null,
        title: '',
        category: '',
        date: new Date(),
        currency: $spendingCurrency,
        originalAmount: null,
        originalCurrency: null,
    };

    let displayDate = new Date();

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
            closeOnSelect: true,
            backdrop: true,
            on: {
                change: (values) => {
                    transaction.displayDate = values[0];
                    transaction.date = values.value[0];
                },
            },
        });

        const typePicker = f7.picker.create({
            inputEl: '#transaction-type',
            backdrop: true,
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
            backdrop: true,
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
            backdrop: true,
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

    const clearForm = () => {
        transaction = {
            type: 'Expense',
            amount: null,
            title: '',
            category: '',
            date: new Date(),
            currency: $spendingCurrency,
            originalAmount: null,
            originalCurrency: null,
        };
        displayDate = new Date();
    };

    const clearError = () => {
        let input = document.getElementById('add-form-input');
        let error = input.getElementsByClassName('item-input-error-message')[0];
        if (error) {
            error.remove();
        }
    };
</script>

<Fab position="right-bottom" on:click={() => (popupOpened = true)}>
    <Icon ios="f7:plus" md="material:add" />
</Fab>

<Popup
    class="add-transaction"
    opened={popupOpened}
    onPopupClosed={() => {
        clearForm(), (popupOpened = false);
    }}
    swipeToClose
>
    <Page class="add-transactions-page">
        <Navbar title="Add Transaction">
            <NavRight>
                <Link popupClose>Close</Link>
            </NavRight>
        </Navbar>
        {#if $spendingCurrency && $currencyOptions}
            <div use:initPickers />
        {/if}
        <List noHairlines class="add-form">
            <ListInput
                class="add-form-input"
                id="add-form-input"
                type="number"
                placeholder="Amount"
                bind:value={transaction.amount}
                inputId="transaction-amount"
                clearButton
                underline
                step="0.01"
                inputmode="decimal"
                pattern="^[0-9]*\.[0-9][0-9]$"
                required
                inputStyle="text-align: center; font-size: 1.5rem"
                validate
                onValidate={(isValid) => {
                    if (isValid) {
                        clearError();
                    }
                }}
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
                validate
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
                    class="last-item"
                    checkbox
                    onChange={() => (recurring = !recurring)}
                    title="This is a recurring transaction"
                />
            {:else}
                <ListItem
                    class="last-item"
                    checkbox
                    checked
                    onChange={() => (recurring = !recurring)}
                    title="This is a recurring transaction"
                />
            {/if}

            {#if recurring === true}
                <!-- select between monthly and yearly expense -->
            {/if}
            <Button
                on:click={() => addTransaction(transaction).then(clearForm)}
                large>Add</Button
            >
        </List>
    </Page>
</Popup>
