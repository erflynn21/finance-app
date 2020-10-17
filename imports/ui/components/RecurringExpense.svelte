<script>
    import { Meteor } from 'meteor/meteor';
    import { userCurrencySymbol } from '../stores/stores';
    export let monthlyexpense;
    import ListItem from '../shared/ListItem.svelte';
    import DeletePopUp from '../shared/DeletePopUp.svelte';
    import EditPopUp from '../shared/EditPopUp.svelte';

    const deleteExpense = () => {
        Meteor.call('monthlyexpenses.remove', monthlyexpense._id);
    };

    const toggleDelete = () => {
        deleteTab = !deleteTab;
    };

    let deleteTab = false;

    const toggleEdit = () => {
        editTab = !editTab;
    };

    let editTab = false;
</script>

<div class="container">
    <ListItem>
        <div class="expense">
            <button class="delete" on:click={toggleDelete}>
                <i class="trash alternate outline icon" />
            </button>
            <span class="title">{monthlyexpense.title}</span>
            {#if monthlyexpense.currency !== null}
                <span
                    class="amount">{$userCurrencySymbol}{monthlyexpense.amount}</span>
            {:else}
                <span class="amount">{monthlyexpense.originalCurrency}
                    {monthlyexpense.originalAmount}</span>
            {/if}
            <button class="edit" on:click={toggleEdit}>
                <i class="edit outline icon" />
            </button>
        </div>
    </ListItem>
</div>

{#if editTab === true}
    <EditPopUp on:collapse={toggleEdit} {monthlyexpense} />
{/if}

{#if deleteTab === true}
    <div class="deleteTab">
        <DeletePopUp on:collapse={toggleDelete} on:delete={deleteExpense} />
    </div>
{/if}

<style>
    .container {
        max-width: 100vw;
        position: relative;
    }
    .container::after {
        content: '';
        position: relative;
        display: block;
        border-bottom: 1px solid lightgray;
        left: -20px;
        width: 110vw;
    }
    .expense {
        display: grid;
        grid-template-columns: 0.15fr 1fr 0.6fr 0.15fr;
        gap: 10px;
        justify-items: start;
        align-items: center;
        width: calc(100vw - 25px);
        margin-left: -5px;
    }

    .amount {
        justify-self: end;
    }

    .edit {
        justify-self: end;
    }

    .edit i {
        height: 15px;
    }

    .delete i {
        height: 20px;
    }

    button,
    button:active,
    button:visited,
    button:enabled,
    button:focus {
        margin: 0;
        padding: 0;
        border: 0;
        background: transparent;
        outline: 0;
        min-width: 0px;
    }
</style>
