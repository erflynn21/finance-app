<script>
    import { Page, Navbar } from 'framework7-svelte';
    import { userAccountStore } from '../stores/UserAccount';

    let username, password;

    const signUp = () => {
        userAccountStore.signUp(username, password, true);
    };

    const signIn = () => {
        userAccountStore.signIn(username, password, true);
    };
</script>

<Page name="auth">
    <Navbar title="Auth" />

    <form>
        <label for="username">Username:</label>
        <input type="text" id="username" bind:value={username} />
        <label for="password">Password:</label>
        <input type="password" id="password" bind:value={password} />

        <button on:click|preventDefault={signUp}>Sign Up</button>
        <button on:click|preventDefault={signIn}>Sign In</button>
    </form>
</Page>
