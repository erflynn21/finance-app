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
    import { budgetCurrency } from '../stores/currenciesStore';

    let recurring = false;
    let transaction = {
        type: 'expense',
        amount: 0,
        category: '',
        date: new Date(),
        currency: $budgetCurrency,
        originalAmount: null,
        originalCurrency: null,
    };

    const handleAddTransaction = () => {
        console.log('Add transaction', transaction);
        f7.dialog.alert('Transaction added');
    };
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
            value={transaction.date}
        />

        <ListInput
            outline
            floatingLabel
            label="Expense:"
            type="text"
            placeholder="Your Expense"
            autocapitalize="off"
            inputId="expenseTitle"
            bind:value={transaction.title}
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
        </Row>

        <ListInput
            outline
            floatingLabel
            label="Category"
            placeholder="Category"
            type="text"
            readonly
            value={transaction.category}
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
    <Button on:click={handleAddTransaction}>Add</Button>
</Block>
