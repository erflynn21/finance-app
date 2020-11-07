<script>
    import { Page, Navbar } from 'framework7-svelte';
    import { userStore } from '../stores/userStore';
    import { f7 } from 'framework7-svelte';
    import Button from 'framework7-svelte/components/button.svelte';

    // sign out
    const signOut = async () => {
        f7.dialog.preloader('Signing you out...');
        await userbase
            .signOut()
            .then(() => userStore.set(null))
            .catch((e) => console.log(e))
            .finally(() => f7.dialog.close());
    };
</script>

<Page name="settings">
    <!-- Top Navbar -->
    <Navbar title="Settings" />
    <Button on:click={signOut}>Sign Out</Button>
</Page>
