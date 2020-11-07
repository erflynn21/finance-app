<script>
    import { Page, Navbar } from 'framework7-svelte';
    import { userStore } from '../stores/userStore';
    import { f7 } from 'framework7-svelte';

    // sign out
    const signOut = async () => {
        f7.dialog.preloader('Siging you out...');
        await userbase
            .signOut()
            .then(() => userStore.set(null))
            .catch((e) => console.log(e))
            .finally(() => f7.dialog.close());
    };
</script>

<Page name="home">
    <!-- Top Navbar -->
    <Navbar title="Overview" />
    <button on:click|preventDefault={signOut}>Sign Out</button>
</Page>
