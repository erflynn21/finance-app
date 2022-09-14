<script>
    import {
        f7,
        Page,
        Navbar,
        Button,
        List,
        ListItem,
    } from 'framework7-svelte';
    import { signOut } from '../js/auth';

    // sign out
    const signOutUser = async () => {
        f7.dialog.preloader('Signing you out...');
        await signOut().then((e) => {
            if (e) {
                f7.dialog.close();
                let errorToast = f7.toast.create({
                    text: e.message,
                    position: 'center',
                    closeTimeout: 2000,
                    cssClass: 'text-align-center',
                });
                errorToast.open();
            } else {
                f7.dialog.close();
            }
        });
    };
</script>

<Page name="settings">
    <Navbar title="Settings" />
    <List>
        <ListItem title="Currency Options" link="/currency-options/" />
        <ListItem title="Budgets" link="/baseBudgets/" />
        <ListItem
            title="Monthly Recurring Expenses"
            link="/monthly-expenses/"
        />
        <ListItem title="Monthly Recurring Income" link="/monthly-incomes/" />
        <ListItem title="Account" link="/account/" />
    </List>
    <Button on:click={signOutUser}>Sign Out</Button>
</Page>
