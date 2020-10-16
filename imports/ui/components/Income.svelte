<script>
    import { Meteor } from 'meteor/meteor';
    import { userCurrencySymbol } from '../stores/stores';
    export let income;
    import ListItem from '../shared/ListItem.svelte';
    import DeletePopUp from '../shared/DeletePopUp.svelte';
    import EditPopUp from '../shared/EditPopUp.svelte';

    const deleteIncome = () => {
        Meteor.call('incomes.remove', income._id);
    };

    const toggleDelete = () => {
        deleteTab = !deleteTab;
    };

    let deleteTab = false;

    const toggleEdit = () => {
        editTab = !editTab;
    };

    let editTab = false;

    let date;
    let date1 = income.date.split('-');
    let date2 = date1[1] + '/' + date1[2];
    if (date2.startsWith('0')) {
        let date3 = date2.split('0');
        if (date3[2] === undefined) {
            date = date3[1];
        } else {
            date = date3[1] + date3[2];
        }
    } else {
        date = date2;
    }
</script>

<div class="container">
    <ListItem>
        <div class="income">
            <button class="delete" on:click={toggleDelete}>
                <i class="trash alternate outline icon" />
            </button>
            <time datetime={income.date} class="date">{date}</time>
            <span class="title">{income.title}</span>
            <span class="amount">{$userCurrencySymbol}{income.amount}</span>
            <button class="edit" on:click={toggleEdit}>
                <i class="edit outline icon" />
            </button>
        </div>
    </ListItem>
</div>

{#if editTab === true}
    <EditPopUp on:collapse={toggleEdit} {income} />
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
    .income {
        display: grid;
        grid-template-columns: 0.15fr 0.3fr 1fr 0.6fr 0.15fr;
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
