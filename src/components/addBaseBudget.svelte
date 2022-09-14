<script>
    import { f7, List, ListInput, ListItem, Button } from 'framework7-svelte';
    import { onMount } from 'svelte';
    import { addBaseBudget } from '../js/baseBudgets';
    import { budgetCurrency, currencyOptions } from '../stores/currenciesStore';
    console.log($budgetCurrency);
    console.log($currencyOptions);

    let baseBudget = {
        amount: null,
        title: '',
        currency: $budgetCurrency,
    };

    const initPickers = () => {
        const currencyPicker = f7.picker.create({
            inputEl: '#transaction-currency',
            value: [$budgetCurrency],
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

    onMount(() => {
        initPickers();
    });
</script>

<List noHairlines class="add-form">
    <ListInput
        class="add-form-input"
        type="number"
        placeholder="Amount"
        bind:value={baseBudget.amount}
        clearButton
        underline
        step="0.01"
        inputmode="decimal"
        pattern="^[0-9]*\.[0-9][0-9]$"
        required
        errorMessage="Please provide a valid amount."
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
        inputId="baseBudgetTitle"
        bind:value={baseBudget.title}
        clearButton
        required
        on:input={() => f7.input.validate('#baseBudgetTitle')}
        errorMessage="Please provide a valid budget title."
    />

    <ListInput
        outline
        floatingLabel
        label="Currency"
        value={baseBudget.currency}
        readonly
        inputId="transaction-currency"
    />

    <Button on:click={() => addBaseBudget(baseBudget)} large>Add</Button>
</List>
