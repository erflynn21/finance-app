<script>
    import { Meteor } from 'meteor/meteor';
    import UpdateBudgetForm from './UpdateBudgetForm.svelte';
    export let budget;
    import ListItem from '../shared/ListItem.svelte';
    import DeletePopUp from '../shared/DeletePopUp.svelte';
    import EditPopUp from '../shared/EditPopUp.svelte';
    import { userCurrencySymbol } from '../stores/stores';

    const deleteBudget = () => {
        Meteor.call('budgets.remove', budget._id);
    };

    let deleteTab = false;
    const toggleDelete = () => {
        deleteTab = !deleteTab;
    };

    let editTab = false;
    const toggleEdit = () => {
        editTab = !editTab;
    };

    let isHidden = true;
</script>

<div class="container">
    <ListItem>
        <div class="budget">
            <button class="delete" on:click={toggleDelete}>
                <i class="trash alternate outline icon" />
            </button>

            <span class="category">{budget.category}</span>
            <span class="amount">{$userCurrencySymbol}{budget.amount}</span>

            <div class:hidden={isHidden} class="update-budget">
                <UpdateBudgetForm
                    {budget}
                    on:collapse={() => (isHidden = !isHidden)} />
            </div>

            <button class="edit" on:click={toggleEdit}>
                <i class="edit outline icon" />
            </button>
        </div>
    </ListItem>
</div>

{#if editTab === true}
    <EditPopUp on:collapse={toggleEdit} {budget} />
{/if}

{#if deleteTab === true}
    <div class="deleteTab">
        <DeletePopUp on:collapse={toggleDelete} on:delete={deleteBudget} />
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
    .budget {
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

    .update-budget {
        grid-column: 1/5;
        grid-row: 2;
    }
</style>
