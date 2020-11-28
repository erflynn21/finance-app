<script>
    export let item;
    export let itemId;
    import ListInput from 'framework7-svelte/components/list-input.svelte';
    import List from 'framework7-svelte/components/list.svelte';
    import { f7 } from 'framework7-svelte';
    import { updateBudget } from '../stores/budgetsStore';
    import { allCurrencies } from '../stores/currenciesStore';
    import Button from 'framework7-svelte/components/button.svelte';
    import Block from 'framework7-svelte/components/block.svelte';
    import { onDestroy, onMount } from 'svelte';
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    import { Plugins } from '@capacitor/core';
    import Row from 'framework7-svelte/components/row.svelte';
    import Col from 'framework7-svelte/components/col.svelte';
    const { Keyboard } = Plugins;

    let updatedBudget = {
        amount: item.amount,
        category: item.category,
        currency: item.currency,
    };

    const handleUpdateBudget = async () => {
        // validates the different inputs
        f7.input.validate('#editedCategory');
        f7.input.validate('#editedAmount');

        // breaks out of function if any inputs are left blank
        if (updatedBudget.category === null || updatedBudget.amount === null) {
            return;
        }

        f7.dialog.preloader('Updating budget...');
        // formats the amount to a number
        updatedBudget.amount = Number(updatedBudget.amount);

        // updates the budget
        await updateBudget(updatedBudget, itemId).then(() => {
            dispatch('collapse');
        });

        f7.dialog.close();
    };

    let editBudgetCurrencyPicker;

    const initPickers = () => {
        editBudgetCurrencyPicker = f7.picker.create({
            inputEl: '#editBudgetCurrencyPicker',
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
                    updatedBudget.currency = value.value;
                },
            },
        });
    };

    onMount(() => {
        initPickers();
    });

    onDestroy(() => {
        editBudgetCurrencyPicker.destroy();
    });
</script>

<Block>
    <List noHairlines class="modal-form">
        <ListInput
            outline
            floatingLabel
            label="Budget:"
            type="text"
            placeholder="Budget Category"
            autocapitalize="off"
            inputId="editedCategory"
            bind:value={updatedBudget.category}
            clearButton
            required
            on:input={() => f7.input.validate('#editedCategory')}
            errorMessage="Please provide a valid budget category." />

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
                    bind:value={updatedBudget.amount}
                    clearButton
                    required
                    on:input={() => f7.input.validate('#editedAmount')}
                    errorMessage="Please provide a valid amount." />
            </Col>
            <Col width="33">
                <ListInput
                    outline
                    floatingLabel
                    label="Currency"
                    value={updatedBudget.currency}
                    readonly
                    inputId="editBudgetCurrencyPicker" />
            </Col>
        </Row>
    </List>
    <Button on:click={handleUpdateBudget}>Update</Button>
</Block>
