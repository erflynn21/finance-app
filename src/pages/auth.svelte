<script>
    import { Page } from 'framework7-svelte';
    import BlockFooter from 'framework7-svelte/components/block-footer.svelte';
    import Button from 'framework7-svelte/components/button.svelte';
    import ListButton from 'framework7-svelte/components/list-button.svelte';
    import ListInput from 'framework7-svelte/components/list-input.svelte';
    import List from 'framework7-svelte/components/list.svelte';
    import LoginScreenTitle from 'framework7-svelte/components/login-screen-title.svelte';
    import { signIn, signUp } from '../stores/userStore';
    import { f7 } from 'framework7-svelte';

    let username, email, password, password2;

    // sign up
    const signUpUser = async () => {
        f7.input.validate('#username');
        f7.input.validate('#email');
        f7.input.validate('#password');
        f7.input.validate('#password2');

        if (!username || !email || !password || !password2) {
            return;
        } else if (password !== password2) {
            let errorToast = f7.toast.create({
                text: 'Please enter the same password in both fields.',
                position: 'center',
                closeTimeout: 2000,
                cssClass: 'text-align-center',
            });
            errorToast.open();
            return;
        } else {
            f7.dialog.preloader('Creating an account for you...');
            await signUp(username, email, password).then(() =>
                f7.dialog.close()
            );
        }
    };

    // sign in
    const signInUser = async () => {
        f7.input.validate('#username');
        f7.input.validate('#password');

        if (!username || !password) {
            return;
        } else {
            f7.dialog.preloader('Signing you in...');
            await signIn(username, password).then(() => f7.dialog.close());
        }
    };

    let login = true;
</script>

<Page noNavbar loginScreen>
    <LoginScreenTitle>Expat Expenses</LoginScreenTitle>
    <List form>
        <ListInput
            outline
            floatingLabel
            label="Username"
            type="text"
            inputId="username"
            required
            clearButton
            on:input={() => f7.input.validate('#username')}
            placeholder="Your Username"
            bind:value={username}
            autocapitalize="off"
            errorMessage="Please provide a valid username." />
        {#if login === false}
            <ListInput
                outline
                floatingLabel
                label="Email"
                type="email"
                inputId="email"
                required
                clearButton
                on:input={() => f7.input.validate('#email')}
                placeholder="Your Email"
                bind:value={email}
                autocapitalize="off"
                errorMessage="Please provide a valid email." />
        {/if}
        <ListInput
            outline
            floatingLabel
            label="Password"
            type="password"
            inputId="password"
            required
            clearButton
            on:input={() => f7.input.validate('#password')}
            placeholder="Your Password"
            bind:value={password}
            autocapitalize="off"
            errorMessage="Please provide a valid password." />
        {#if login === false}
            <ListInput
                outline
                floatingLabel
                label="Repeat Password"
                type="password"
                inputId="password2"
                required
                clearButton
                on:input={() => f7.input.validate('#password2')}
                placeholder="Repeat Your Password"
                bind:value={password2}
                autocapitalize="off"
                errorMessage="Please enter the same password." />
        {/if}
    </List>
    {#if login === true}
        <List>
            <ListButton on:click={signInUser}>Sign In</ListButton>
        </List>
        <BlockFooter>
            Don't have an account?
            <Button on:click={() => (login = false)}>Register</Button>
        </BlockFooter>
    {:else}
        <List>
            <ListButton on:click={signUpUser}>Register</ListButton>
        </List>
        <BlockFooter>
            Already have an account?
            <Button on:click={() => (login = true)}>Sign In</Button>
        </BlockFooter>
    {/if}
</Page>
