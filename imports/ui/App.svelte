<script>
    import { Meteor } from 'meteor/meteor';
    import { useTracker } from 'meteor/rdb:svelte-meteor-data';
    import { UserSettings } from '../api/usersettings';
    import Auth from './components/Auth.svelte';
    import Initializer from './components/Initializer.svelte';
    import Nav from './components/Nav.svelte';

    $: currentUser = useTracker(() => Meteor.user());
</script>

{#if $currentUser}
    <Initializer />
    <Nav />
{:else}
    <Auth />
{/if}
