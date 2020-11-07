<script>
    import { Page, Navbar } from 'framework7-svelte';
    import { userStore } from '../stores/userStore';

    const signOut = () => {
        userbase
            .signOut()
            .then(() => userStore.set(null))
            .catch((e) => console.log(e));
    };
</script>

<Page name="home">
    <!-- Top Navbar -->
    <Navbar title="Overview" />
    <button on:click|preventDefault={signOut}>Sign Out</button>
</Page>
