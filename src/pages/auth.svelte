<script>
    import { Page, Navbar } from 'framework7-svelte';
    import { userStore } from '../stores/userstore';

    let username, password;

    const signUp = () => {
        userbase
            .signUp({ username, password })
            .then((user) => userStore.set(user));
    };

    const signIn = () => {
        userbase
            .signIn({ username, password })
            .then((user) => userStore.set(user));
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
