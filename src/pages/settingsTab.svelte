<script>
    import { Page, Navbar } from 'framework7-svelte';
    import { signOut } from '../stores/userStore';
    import { f7 } from 'framework7-svelte';
    import Button from 'framework7-svelte/components/button.svelte';
    import List from 'framework7-svelte/components/list.svelte';
    import ListItem from 'framework7-svelte/components/list-item.svelte';

    // sign out
    const signOutUser = async () => {
        f7.dialog.preloader('Signing you out...');
        await signOut().then(() => f7.dialog.close());
    };
</script>

<Page name="settings">
    <Navbar title="Settings" />
    <List>
        <ListItem title="Currency Options" link="/currency-options/" />
        <ListItem title="Budgets" link="/budgets/" />
        <ListItem
            title="Monthly Recurring Expenses"
            link="/monthly-expenses/" />
        <ListItem title="Monthly Recurring Income" link="/monthly-incomes/" />
    </List>
    <Button on:click={signOutUser}>Sign Out</Button>
</Page>

<style>
</style>
