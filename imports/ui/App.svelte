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

    const checkLoading = () => {
        if ($userSettingsStore.length === 0) {
            loading = true;
        } else {
            loading = false;
        }
    };

    onMount(() => {
        checkLoading();
    });

    afterUpdate(() => {
        checkLoading();
    });
</script>

<Data />
{#if loading === true}
    <div class="content" style="height: 100vh">
        <Loading />
    </div>
{:else if $currentUser}
    <Nav />
{:else}
    <Auth />
{/if}
