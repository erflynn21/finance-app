<script>
    import { Page, Navbar } from 'framework7-svelte';
    import Block from 'framework7-svelte/components/block.svelte';
    import List from 'framework7-svelte/components/list.svelte';
    import { onMount } from 'svelte';
    import SettingsSwiper from '../components/settingsSwiper.svelte';
    import { moveFabDown, showFAB } from '../js/fab';
    import { monthlyIncomes } from '../stores/monthlyIncomesStore';
    import { flip } from 'svelte/animate';
    import { currentRoute } from '../stores/currentRouteStore';

    onMount(() => {
        moveFabDown();
        currentRoute.set('recurring');
    });

    const onOut = () => {
        showFAB();
        currentRoute.set('not recurring');
    };
</script>

<Page name="monthly-incomes" noToolbar onPageBeforeOut={onOut}>
    <Navbar
        title="Monthly Recurring Incomes"
        backLink="Back"
        on:clickBack={() => showFAB()}
    />
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
