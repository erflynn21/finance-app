<script>
    import { Meteor } from 'meteor/meteor';
    export let income;
    import { createEventDispatcher } from 'svelte';
    import UpdateIncomeForm from './UpdateIncomeForm.svelte';
    let dispatch = createEventDispatcher();

    const deleteIncome = () => {
        Meteor.call('incomes.remove', income._id);
        dispatch('delete', income);
    };

    let isHidden = true;
</script>

<div>
    {#if income.originalAmount !== null}
        <div>
            <button class="delete" on:click={deleteIncome}>X</button>
            <span>{income.title}</span>
            <span>{income.date}</span>
            <span>{income.currency}{income.amount}</span>
            <!-- <span>
                Original Amount and Currency: {income.originalCurrency}{income.originalAmount}
            </span> -->
        </div>
    {:else}
        <div>
            <button class="delete" on:click={deleteIncome}>X</button>
            <span>{income.title}</span>
            <span>{income.date}</span>
            <span>{income.currency}{income.amount}</span>
        </div>
    {/if}
    <div class:hidden={isHidden}>
        <UpdateIncomeForm {income} on:collapse={() => (isHidden = !isHidden)} />
    </div>
    <button class="edit" on:click={() => (isHidden = !isHidden)}>Edit</button>
</div>
