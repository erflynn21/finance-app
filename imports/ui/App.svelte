<script>
    import { Meteor } from 'meteor/meteor';
    import { useTracker } from 'meteor/rdb:svelte-meteor-data';
    import Overview from './components/Overview.svelte';
    import { BlazeTemplate } from 'meteor/svelte:blaze-integration';

    $: currentUser = useTracker(() => Meteor.user());
</script>

{#if $currentUser}
    <Overview />
{:else}
    <!-- Add in landing page component -->
    <div>Please log in</div>
    <BlazeTemplate template="loginButtons" />
{/if}
