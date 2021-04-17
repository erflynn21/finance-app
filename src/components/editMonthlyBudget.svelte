<script>
    export let item;
    export let itemId;
    import ListInput from 'framework7-svelte/components/list-input.svelte';
    import List from 'framework7-svelte/components/list.svelte';
    import { f7 } from 'framework7-svelte';
    import Button from 'framework7-svelte/components/button.svelte';
    import Block from 'framework7-svelte/components/block.svelte';
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    import Row from 'framework7-svelte/components/row.svelte';
    import Col from 'framework7-svelte/components/col.svelte';
    import { updateMonthlyBudget } from '../js/monthlyBudgets';

    let updatedMonthlyBudget = {
        title: item.title,
        date: item.date,
        amount: item.amount,
        category: item.category,
        originalAmount: item.originalAmount,
        currency: item.currency,
        originalCurrency: item.originalCurrency,
    };

    const handleUpdateMonthlyBudget = async () => {
        // validates the different inputs
        f7.input.validate('#editedAmount');

        // breaks out of function if any inputs are left blank
        if (updatedMonthlyBudget.amount === null) {
            return;
        }

        f7.dialog.preloader('Updating budget...');
        // formats the amount to a number
        updatedMonthlyBudget.amount = Number(updatedMonthlyBudget.amount);

        // add the expense
        await updateMonthlyBudget(updatedMonthlyBudget, itemId).then((e) => {
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
                f7.dialog.close();
            }
        });

        f7.dialog.close();
    };
</script>

<Block>
    <List noHairlines class="modal-form">
        <ListInput
            disabled
            outline
            floatingLabel
            label="Category"
            placeholder="Category"
            type="text"
            readonly
            value={updatedMonthlyBudget.category}
            clearButton
            required
            errorMessage="Please select a category."
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
                    bind:value={updatedMonthlyBudget.amount}
                    clearButton
                    autofocus
                    required
                    on:input={() => f7.input.validate('#editedAmount')}
                    errorMessage="Please provide a valid amount."
                />
            </Col>
            <Col width="33">
                <ListInput
                    disabled
                    outline
                    floatingLabel
                    label="Currency"
                    value={updatedMonthlyBudget.currency}
                    readonly
                    inputId="editExpenseCurrencyPicker"
                />
            </Col>
        </Row>
    </List>
    <Button on:click={handleUpdateMonthlyBudget}>Update</Button>
</Block>
