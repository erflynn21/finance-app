<script>
    import {
        f7,
        Page,
        BlockFooter,
        Button,
        ListButton,
        ListInput,
        List,
        LoginScreenTitle,
    } from 'framework7-svelte';
    import userbase from 'userbase-js';
    import { signIn, signUp } from '../js/auth';

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
            await signUp(username, email, password).then((e) => {
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
    };

    // sign in
    const signInUser = async () => {
        f7.input.validate('#username');
        f7.input.validate('#password');

        if (!username || !password) {
            return;
        } else {
            f7.dialog.preloader('Signing you in...');
            await signIn(username, password).then((e) => {
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
    };

    const resetPassword = async () => {
        f7.dialog.confirm(
            'A new password will be sent to your email, would you like to continue?',
            async function () {
                f7.dialog.preloader('Sending email...');
                await userbase
                    .forgotPassword({ username })
                    .then(() => {
                        f7.dialog.close();
                        f7.dialog.alert('Email sent successfully!');
                    })
                    .catch((e) => {
                        f7.dialog.close();
                        let errorToast = f7.toast.create({
                            text: e.message,
                            position: 'center',
                            closeTimeout: 2000,
                            cssClass: 'text-align-center',
                        });
                        errorToast.open();
                    });
            }
        );
    };

    let login = true;
</script>

<Page name="auth" noNavbar loginScreen class="login-bg">
    <LoginScreenTitle>Expat Expenses</LoginScreenTitle>
    <List form class="auth">
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
            errorMessage="Please provide a valid username."
        />
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
                errorMessage="Please provide a valid email."
            />
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
            errorMessage="Please provide a valid password."
        />
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
                errorMessage="Please enter the same password."
            />
        {/if}
    </List>
    {#if login === true}
        <List>
            <ListButton on:click={signInUser} class="white-button"
                >Sign In</ListButton
            >
            <ListButton on:click={resetPassword} class="white-button"
                >Forgot Password</ListButton
            >
        </List>
        <BlockFooter>
            Don't have an account?
            <Button on:click={() => (login = false)} class="white-button"
                >Register</Button
            >
        </BlockFooter>
    {:else}
        <List>
            <ListButton on:click={signUpUser} class="white-button"
                >Register</ListButton
            >
        </List>
        <BlockFooter>
            Already have an account?
            <Button on:click={() => (login = true)} class="white-button"
                >Sign In</Button
            >
        </BlockFooter>
    {/if}
</Page>

<style>
    :global(.login-bg) {
        background: url('../../public/city.jpg') no-repeat center center fixed !important;
        background-size: cover !important;
        color: white !important;
    }

    :global(.login-bg .block-footer) {
        color: white !important;
    }

    :global(.login-screen-content) {
        background: transparent !important;
    }

    :global(.white-button) {
        color: white !important;
    }

    :global(.white-button .list-button) {
        color: white !important;
    }

    :global(.auth .item-floating-label) {
        color: white !important;
        background: transparent !important;
    }

    :global(.auth input) {
        color: white !important;
    }
</style>
