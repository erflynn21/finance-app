<script>
    import { Meteor } from 'meteor/meteor';
    import { useTracker } from 'meteor/rdb:svelte-meteor-data';
    import { UserSettings } from '../api/usersettings';
    import Auth from './components/Auth.svelte';
    import Data from './components/Data.svelte';
    import Nav from './components/Nav.svelte';

    $: currentUser = useTracker(() => Meteor.user());
</script>

{#if $currentUser}
    <Data />
    <Nav />
{:else}
    <Auth />
{/if}
