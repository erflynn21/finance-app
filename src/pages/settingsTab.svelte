<script>
    import { Page, Navbar } from 'framework7-svelte';
    import { deleteUser, signOut } from '../stores/userStore';
    import { f7 } from 'framework7-svelte';
    import Button from 'framework7-svelte/components/button.svelte';
    import List from 'framework7-svelte/components/list.svelte';
    import ListItem from 'framework7-svelte/components/list-item.svelte';
    import Block from 'framework7-svelte/components/block.svelte';

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

    const deleteAccount = async () => {
        f7.dialog.confirm(
            'Are you sure you want to delete your account? This action cannot be reversed. Once your account is deleted it can never be recovered.',
            async function () {
                f7.dialog.preloader('Deleting your account...');
                await deleteUser().then((e) => {
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
            }
        );
    };
</script>

<Page name="settings">
    <Navbar title="Settings" />
    <List>
        <ListItem title="Currency Options" link="/currency-options/" />
        <ListItem title="Budgets" link="/budgets/" />
        <ListItem
            title="Monthly Recurring Expenses"
            link="/monthly-expenses/"
        />
        <ListItem title="Monthly Recurring Income" link="/monthly-incomes/" />
    </List>
    <Button on:click={signOutUser}>Sign Out</Button>
    <Block>
        <p class="danger">Danger Zone</p>
        <p>
            By deleting your account, you will lose all access to your data
            permanently. This action becomes irreversible once the account is
            permanently deleted.
        </p>
        <Button on:click={deleteAccount} class="delete-btn"
            >Delete Account</Button
        >
    </Block>
</Page>

<style>
    .danger {
        color: #dc2626;
        font-size: 18px;
        padding-top: 20px;
    }

    :global(.delete-btn) {
        color: #dc2626;
    }
</style>
