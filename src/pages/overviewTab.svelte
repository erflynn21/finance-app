<script>
    import { Page, Navbar, NavTitleLarge } from 'framework7-svelte';
    import { userStore } from '../stores/userstore';

    const signOut = () => {
        userbase.signOut().then((user) => userStore.set(user));
    };
</script>

<Page name="home">
    <!-- Top Navbar -->
    <Navbar title="Overview" />
    <button on:click|preventDefault={signOut}>Sign Out</button>
</Page>
