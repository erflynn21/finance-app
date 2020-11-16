<script>
    export let item;
    import ListItem from 'framework7-svelte/components/list-item.svelte';
    import SwipeoutActions from 'framework7-svelte/components/swipeout-actions.svelte';
    import SwipeoutButton from 'framework7-svelte/components/swipeout-button.svelte';
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    console.log(item);
</script>

<ListItem
    swipeout
    title={item.title}
    after={item.amount}
    subtitle="{item.currency}{item.category}"
    onSwipeoutDeleted={() => dispatch('deleted')}>
    <SwipeoutActions left>
        <SwipeoutButton
            overswipe
            color="green"
            onClick={() => console.log('edit')}>
            Edit
        </SwipeoutButton>
    </SwipeoutActions>
    <SwipeoutActions right>
        <SwipeoutButton
            delete
            overswipe
            confirmTitle=" "
            confirmText="Are you sure you want to delete this item?">
            Delete
        </SwipeoutButton>
    </SwipeoutActions>
</ListItem>
