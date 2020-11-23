<script>
    export let item;
    import ListItem from 'framework7-svelte/components/list-item.svelte';
    import SwipeoutActions from 'framework7-svelte/components/swipeout-actions.svelte';
    import SwipeoutButton from 'framework7-svelte/components/swipeout-button.svelte';
    import { createEventDispatcher } from 'svelte';
    import { baseCurrencySymbol } from '../stores/currenciesStore';
    const dispatch = createEventDispatcher();

    let date;
    let date1 = item.date.split('-');
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

<ListItem
    swipeout
    header={date}
    title={item.title}
    after="{$baseCurrencySymbol}{item.amount}"
    on:swipeoutDelete={() => dispatch('deleted')}>
    <SwipeoutActions right>
        <SwipeoutButton onClick={() => console.log('edit')}>
            Edit
        </SwipeoutButton>
        <SwipeoutButton
            delete
            color="red"
            overswipe
            confirmText="Are you sure you want to delete this item?"
            confirmTitle=" ">
            Delete
        </SwipeoutButton>
    </SwipeoutActions>
</ListItem>
