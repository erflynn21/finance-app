<script>
    import userbase from 'userbase-js';
    import { Page } from 'framework7-svelte';
    import BlockFooter from 'framework7-svelte/components/block-footer.svelte';
    import Button from 'framework7-svelte/components/button.svelte';
    import ListButton from 'framework7-svelte/components/list-button.svelte';
    import ListInput from 'framework7-svelte/components/list-input.svelte';
    import List from 'framework7-svelte/components/list.svelte';
    import LoginScreenTitle from 'framework7-svelte/components/login-screen-title.svelte';
    import { userStore } from '../stores/userStore';
    import { f7 } from 'framework7-svelte';

    let username, email, password, password2, error;

    // sign up
    const signUp = async () => {
        f7.dialog.preloader('Creating an account for you...');
        if (!username || !email || !password) {
            error = 'Please provide a valid username, email, and password';
        } else if (password.length < 8) {
            error = 'Please use a password greater than 8 characters in length';
        } else if (password !== password2) {
            error = 'Passwords must be identical';
        } else {
            await userbase
                .signUp({ username, email, password, rememberMe: 'local' })
                .then((user) => userStore.set(user))
                .catch((e) => (error = e));
        }
        f7.dialog.close();
    };

    // sign in
    const signIn = async () => {
        f7.dialog.preloader('Signing you in...');
        if (!username || !password) {
            error = 'Please provide a username and password';
        } else {
            await userbase
                .signIn({ username, password, rememberMe: 'local' })
                .then((user) => userStore.set(user))
                .catch((e) => (error = e));
        }
        f7.dialog.close();
    };

    let login = true;
</script>

<Page noNavbar loginScreen>
    <LoginScreenTitle>Expats Expenses</LoginScreenTitle>
    {#if login === true}
        <List form>
            <ListInput
                label="Username"
                type="text"
                placeholder="Your Username"
                bind:value={username} />
            <ListInput
                label="Password"
                type="password"
                placeholder="Your Password"
                bind:value={password} />
        </List>
        <List>
            <ListButton on:click={signIn}>Sign In</ListButton>
        </List>
        {#if error}
            <div class="error">{error}</div>
        {/if}
        <BlockFooter>
            Don't have an account?
            <Button on:click={() => (login = false)}>Register</Button>
        </BlockFooter>
    {:else}
        <List form>
            <ListInput
                label="Username"
                type="text"
                placeholder="Your Username"
                bind:value={username} />
            <ListInput
                label="Email"
                type="text"
                placeholder="Your Email"
                bind:value={email} />
            <ListInput
                label="Password"
                type="password"
                placeholder="Your Password"
                bind:value={password} />
            <ListInput
                label="Password"
                type="password"
                placeholder="Your Password Again"
                bind:value={password2} />
        </List>
        <List>
            <ListButton on:click={signUp}>Register</ListButton>
        </List>
        <BlockFooter>
            Already have an account?
            <Button on:click={() => (login = true)}>Sign In</Button>
        </BlockFooter>
    {/if}
</Page>
