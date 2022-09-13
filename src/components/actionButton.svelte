<script>
    import {
        Fab,
        Icon,
        Page,
        Popup,
        Navbar,
        NavRight,
        Link,
    } from 'framework7-svelte';
    import AddTransaction from './addTransaction.svelte';

    let popupOpened = false;
</script>

<Fab position="right-bottom" on:click={() => (popupOpened = true)}>
    <Icon ios="f7:plus" md="material:add" />
</Fab>

<Popup
    class="add-transaction"
    opened={popupOpened}
    onPopupClosed={() => (popupOpened = false)}
    swipeToClose
>
    <Page class="add-transactions-page">
        <Navbar title="Add Transaction">
            <NavRight>
                <Link popupClose>Close</Link>
            </NavRight>
        </Navbar>
        <AddTransaction />
    </Page>
</Popup>
