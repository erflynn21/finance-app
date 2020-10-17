<script>
    import { Meteor } from 'meteor/meteor';
    import { useTracker } from 'meteor/rdb:svelte-meteor-data';
    import Auth from './components/Auth.svelte';
    import Data from './components/Data.svelte';
    import Nav from './components/Nav.svelte';
    import Loading from './shared/Loading.svelte';
    import { afterUpdate, onMount } from 'svelte';
    import { userSettingsStore } from './stores/stores';

    let loading = true;
    $: currentUser = useTracker(() => Meteor.user());

    const checkCurrentUser = () => {
        if ($currentUser === null) {
            loading = false;
        }
    };

    afterUpdate(() => {
        checkCurrentUser();
    });
</script>

{#if loading === true}
    <div class="content" style="height: 100vh">
        <Loading />
    </div>
{:else if $currentUser}
    <Nav />
{:else}
    <Auth />
{/if}
<Data on:dataReady={() => (loading = false)} />
