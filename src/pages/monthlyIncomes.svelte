<script>
    import { Page, Navbar } from 'framework7-svelte';
    import Block from 'framework7-svelte/components/block.svelte';
    import List from 'framework7-svelte/components/list.svelte';
    import { onMount } from 'svelte';
    import SettingsSwiper from '../components/settingsSwiper.svelte';
    import { moveFabDown, showFAB } from '../js/fab';
    import { monthlyIncomes } from '../stores/monthlyIncomesStore';
    import { fade } from 'svelte/transition';
    import { flip } from 'svelte/animate';

    onMount(() => {
        moveFabDown();
    });
</script>

<Page name="monthly-incomes" noToolbar onPageBeforeOut={() => showFAB()}>
    <Navbar
        title="Monthly Recurring Incomes"
        backLink="Back"
        on:clickBack={() => showFAB()} />
    <Block class="text-align-center">
        Incomes below will be automatically added to your budget every month on
        the specified day.
    </Block>
    <List>
        {#each $monthlyIncomes as { item, itemId } (itemId)}
            <div animate:flip={{ duration: 400 }}>
                <SettingsSwiper {item} {itemId} type="monthly income" />
            </div>
        {/each}
    </List>
</Page>
