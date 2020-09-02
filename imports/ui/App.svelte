<script>
    import { Meteor } from 'meteor/meteor';
    import { useTracker } from 'meteor/rdb:svelte-meteor-data';
    import Nav from './components/Nav.svelte';
    import { BlazeTemplate } from 'meteor/svelte:blaze-integration';

    $: currentUser = useTracker(() => Meteor.user());
</script>

{#if $currentUser}
    <Nav />
{:else}
    <!-- Add in landing page component -->
    <div>Please log in</div>
    <BlazeTemplate template="loginButtons" />
{/if}
