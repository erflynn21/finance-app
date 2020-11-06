<script>
    import { Page, Navbar, NavTitleLarge } from 'framework7-svelte';
    import { userAccountStore, userStore } from '../stores/UserAccount';

    const signOut = () => {
        userAccountStore.signOut();
    };
</script>

<Page name="home">
    <!-- Top Navbar -->
    <Navbar title="Overview" />
    <button on:click|preventDefault={signOut}>Sign Out</button>
</Page>
