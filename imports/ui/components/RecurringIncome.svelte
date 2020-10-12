<script>
    import { Meteor } from 'meteor/meteor';
    import { userCurrencySymbol } from '../stores/UserCurrencySymbolStore';
    export let monthlyincome;
    import { createEventDispatcher } from 'svelte';
    import ListItem from '../shared/ListItem.svelte';
    import DeletePopUp from '../shared/DeletePopUp.svelte';
    import EditPopUp from '../shared/EditPopUp.svelte';
    let dispatch = createEventDispatcher();

    const deleteIncome = () => {
        Meteor.call('monthlyincomes.remove', monthlyincome._id);
        // dispatch('delete', expense);
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
                <img src="/img/delete.svg" alt="" />
            </button>

            <!-- <span
                datetime={monthlyexpense.date}
                class="date">{monthlyexpense.recurringdate}</span> -->
            <span class="title">{monthlyincome.title}</span>
            {#if monthlyincome.currency !== null}
                <span
                    class="amount">{$userCurrencySymbol}{monthlyincome.amount}</span>
            {:else}
                <span class="amount">{monthlyincome.originalCurrency}
                    {monthlyincome.originalAmount}</span>
            {/if}
            <button class="edit" on:click={toggleEdit}>
                <img src="/img/edit.svg" alt="" />
            </button>
        </div>
    </ListItem>
</div>

{#if editTab === true}
    <EditPopUp on:collapse={toggleEdit} {monthlyincome} />
{/if}

{#if deleteTab === true}
    <div class="deleteTab">
        <DeletePopUp on:collapse={toggleDelete} on:delete={deleteIncome} />
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

    .edit img {
        height: 15px;
    }

    .delete img {
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
