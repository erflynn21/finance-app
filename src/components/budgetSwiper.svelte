<script>
    export let item;
    import {
        baseCurrency,
        baseCurrencySymbol,
    } from '../stores/currenciesStore';
    import { currencyDict } from '../stores/currencyDictStore';
    import ListItem from 'framework7-svelte/components/list-item.svelte';
    import SwipeoutActions from 'framework7-svelte/components/swipeout-actions.svelte';
    import SwipeoutButton from 'framework7-svelte/components/swipeout-button.svelte';
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    let currencySymbol;
    if (item.currency === $baseCurrency) {
        currencySymbol = $baseCurrencySymbol;
    } else {
        currencySymbol = currencyDict[item.currency];
    }
</script>

<ListItem swipeout title={item.category} after="{currencySymbol}{item.amount}">
    <SwipeoutActions left>
        <SwipeoutButton color="green" onClick={() => console.log('edit')}>
            Edit
        </SwipeoutButton>
    </SwipeoutActions>
    <SwipeoutActions right>
        <SwipeoutButton color="red" onClick={() => dispatch('deleted')}>
            Delete
        </SwipeoutButton>
    </SwipeoutActions>
</ListItem>
