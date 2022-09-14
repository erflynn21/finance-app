<script>
    import { f7, List, ListInput, ListItem, Button } from 'framework7-svelte';
    import { onMount } from 'svelte';
    import { addBaseBudget } from '../js/baseBudgets';
    import { budgetCurrency, currencyOptions } from '../stores/currenciesStore';

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
                    baseBudget.currency = values.value[0];
                },
            },
        });
    };

    onMount(() => {
        initPickers();
    });

    const clearError = () => {
        let error = document.getElementsByClassName(
            'item-input-error-message'
        )[0];
        if (error) {
            error.remove();
        }
    };

    const clearForm = () => {
        baseBudget = {
            amount: null,
            title: '',
            currency: $budgetCurrency,
        };
    };
</script>

<List noHairlines class="add-form">
    <ListInput
        class="add-form-input"
        id="add-form-input"
        type="number"
        placeholder="Amount"
        bind:value={baseBudget.amount}
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
        inputId="baseBudgetTitle"
        bind:value={baseBudget.title}
        clearButton
        required
        validate
    />

    <ListInput
        outline
        floatingLabel
        label="Currency"
        value={baseBudget.currency}
        readonly
        inputId="transaction-currency"
    />

    <Button on:click={() => addBaseBudget(baseBudget).then(clearForm)} large
        >Add</Button
    >
</List>
