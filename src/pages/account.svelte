<script>
    import { Page, Navbar } from 'framework7-svelte';
    import Button from 'framework7-svelte/components/button.svelte';
    import { onMount } from 'svelte';
    import { hideFAB, showFAB } from '../js/fab';
    import Block from 'framework7-svelte/components/block.svelte';
    import List from 'framework7-svelte/components/list.svelte';
    import ListInput from 'framework7-svelte/components/list-input.svelte';
    import { f7 } from 'framework7-svelte';
    import BlockHeader from 'framework7-svelte/components/block-header.svelte';
    import ListButton from 'framework7-svelte/components/list-button.svelte';
    import { deleteUser, updateUser } from '../js/auth';
    import { userStore } from '../stores/userStore';

    let user = {
        username: $userStore.username,
        email: $userStore.email,
        currrentPassword: null,
        newPassword1: null,
        newPassword2: null,
    };

    const deleteAccount = async () => {
        f7.dialog.confirm(
            'Are you sure you want to delete your account? This action cannot be reversed. Once your account is deleted it can never be recovered.',
            async function () {
                f7.dialog.preloader('Deleting your account...');
                await deleteUser().then((e) => {
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
        );
    };

    const updateAccount = async () => {
        f7.input.validate('#username');
        f7.input.validate('#email');

        if (!user.username || !user.email) {
            return;
        } else if (user.newPassword1 !== user.newPassword2) {
            let errorToast = f7.toast.create({
                text: 'Please enter the same password in both fields.',
                position: 'center',
                closeTimeout: 2000,
                cssClass: 'text-align-center',
            });
            errorToast.open();
            return;
        } else {
            f7.dialog.preloader('Updating your account info...');
            await updateUser(user).then((e) => {
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
                    let successToast = f7.toast.create({
                        text: 'Your account has been updated successfully!',
                        position: 'center',
                        closeTimeout: 2000,
                        cssClass: 'text-align-center',
                    });
                    successToast.open();
                    user.currentPassword = '';
                    user.newPassword1 = '';
                    user.newPassword2 = '';
                }
            });
        }
    };

    onMount(() => {
        hideFAB();
    });
</script>

<Page name="account" noToolbar onPageBeforeOut={() => showFAB()}>
    <Navbar title="Account" backLink="Back" on:clickBack={() => showFAB()} />

    <BlockHeader>Update Account Info:</BlockHeader>

    <List form class="account-list">
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
            bind:value={user.username}
            autocapitalize="off"
            errorMessage="Please provide a valid username."
        />
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
            bind:value={user.email}
            autocapitalize="off"
            errorMessage="Please provide a valid email."
        />
        <ListInput
            outline
            floatingLabel
            label="Current Password"
            type="password"
            inputId="currentPassword"
            required
            clearButton
            on:input={() => f7.input.validate('#currentPassword')}
            placeholder="Your Current Password"
            bind:value={user.currentPassword}
            autocapitalize="off"
            errorMessage="Please provide a valid password."
        />
        <ListInput
            outline
            floatingLabel
            label="New Password"
            type="password"
            inputId="newPassword1"
            required
            clearButton
            on:input={() => f7.input.validate('#newPassword1')}
            placeholder="Your New Password"
            bind:value={user.newPassword1}
            autocapitalize="off"
            errorMessage="Please enter a new password."
        />
        <ListInput
            outline
            floatingLabel
            label="Repeat Password"
            type="password"
            inputId="password2"
            required
            clearButton
            on:input={() => f7.input.validate('#password2')}
            placeholder="Repeat Your New Password"
            bind:value={user.newPassword2}
            autocapitalize="off"
            errorMessage="Please enter the same password."
        />

        <ListButton on:click={updateAccount}>Update Account Info</ListButton>
    </List>

    <Block>
        <p class="danger">Danger Zone</p>
        <p>
            By deleting your account, you will lose all access to your data
            permanently. This action becomes irreversible once the account is
            permanently deleted.
        </p>
        <Button on:click={deleteAccount} class="delete-btn"
            >Delete Account</Button
        >
    </Block>
</Page>

<style>
    .danger {
        color: #dc2626;
        font-size: 18px;
        padding-top: 20px;
    }

    :global(.delete-btn) {
        color: #dc2626;
    }

    :global(.account-list) {
        margin-bottom: 10px;
    }

    :global(.account-list ul) {
        background-color: transparent;
    }

    :global(.account-list .item-input-wrap) {
        background-color: white;
    }
</style>
