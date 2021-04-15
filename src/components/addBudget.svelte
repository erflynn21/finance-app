<script>
    import ListInput from 'framework7-svelte/components/list-input.svelte';
    import List from 'framework7-svelte/components/list.svelte';
    import { f7 } from 'framework7-svelte';
    import Button from 'framework7-svelte/components/button.svelte';
    import Block from 'framework7-svelte/components/block.svelte';
    import { Plugins } from '@capacitor/core';
    import Row from 'framework7-svelte/components/row.svelte';
    import Col from 'framework7-svelte/components/col.svelte';
    const { Keyboard } = Plugins;
    import { baseCurrency, allCurrencies } from '../stores/currenciesStore';
    import { onMount } from 'svelte';
    import { addBudget } from '../js/budgets';

    let budget = {};
    // checks to make sure there's a base currency before setting the expense values
    $: if ($baseCurrency !== '') {
        budget = {
            category: null,
            amount: null,
            currency: $baseCurrency,
        };
    }

    const handleAddBudget = async () => {
        // validates the different inputs
        f7.input.validate('#budgetCategory');
        f7.input.validate('#budgetAmount');

        // breaks out of function if any inputs are left blank
        if (
            budget.title === null ||
            budget.amount === null ||
            budget.category === null
        ) {
            return;
        }

        f7.dialog.preloader('Adding budget...');
        // formats the amount to a number
        budget.amount = Number(budget.amount);

        // add the budget
        await addBudget(budget).then((e) => {
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
                // clear form
                budget.category = null;
                budget.amount = null;
                budget.currency = $baseCurrency;
            }
        });

        f7.dialog.close();
    };

    let budgetCurrencyPicker;
    const initPickers = () => {
        console.log('inited');
        budgetCurrencyPicker = f7.picker.create({
            inputEl: '#budgetCurrencyPicker',
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
                    budget.currency = value.value;
                    budget.currency = budget.currency[0];
                },
            },
        });
    };

    onMount(() => {
        if ($allCurrencies.length > 0) {
            initPickers();
        }
    });
</script>

<Block>
    <List noHairlines class="add-form modal-form">
        <ListInput
            outline
            floatingLabel
            label="Category:"
            type="text"
            placeholder="New Budget Category"
            autocapitalize="off"
            inputId="budgetCategory"
            bind:value={budget.category}
            clearButton
            required
            autofocus
            on:input={() => f7.input.validate('#budgetCategory')}
            errorMessage="Please provide a valid category name."
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
                    inputId="budgetAmount"
                    step="0.01"
                    inputmode="decimal"
                    pattern="[0-9]*"
                    bind:value={budget.amount}
                    clearButton
                    required
                    on:input={() => f7.input.validate('#budgetAmount')}
                    errorMessage="Please provide a valid amount."
                />
            </Col>
            <Col width="33">
                <ListInput
                    outline
                    floatingLabel
                    label="Currency"
                    value={budget.currency}
                    readonly
                    inputId="budgetCurrencyPicker"
                />
            </Col>
        </Row>
    </List>
    <Button on:click={handleAddBudget}>Add</Button>
</Block>
