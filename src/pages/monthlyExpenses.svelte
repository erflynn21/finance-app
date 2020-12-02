<script>
    import { Page, Navbar } from 'framework7-svelte';
    import Block from 'framework7-svelte/components/block.svelte';
    import List from 'framework7-svelte/components/list.svelte';
    import { onMount } from 'svelte';
    import SettingsSwiper from '../components/settingsSwiper.svelte';
    import { moveFabDown, showFAB } from '../js/fab';
    import { monthlyExpenses } from '../stores/monthlyExpensesStore';
    import { flip } from 'svelte/animate';

    onMount(() => {
        moveFabDown();
    });
</script>

<Page name="monthly-expenses" noToolbar onPageBeforeOut={() => showFAB()}>
    <Navbar
        title="Monthly Recurring Expenses"
        backLink="Back"
        on:clickBack={() => showFAB()} />
    <Block class="text-align-center">
        Expenses below will be automatically added to your budget every month on
        the specified day.
    </Block>
    <List>
        {#each $monthlyExpenses as { item, itemId } (itemId)}
            <div animate:flip={{ duration: 400 }}>
                <SettingsSwiper {item} {itemId} type="monthly expense" />
            </div>
        {/each}
    </List>
</Page>
