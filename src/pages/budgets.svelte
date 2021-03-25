<script>
    import { Page, Navbar } from 'framework7-svelte';
    import Button from 'framework7-svelte/components/button.svelte';
    import List from 'framework7-svelte/components/list.svelte';
    import Sheet from 'framework7-svelte/components/sheet.svelte';
    import { onMount } from 'svelte';
    import AddBudget from '../components/addBudget.svelte';
    import { hideFAB, showFAB } from '../js/fab';
    import { budgets, budgetsSum } from '../stores/budgetsStore';
    import Toolbar from 'framework7-svelte/components/toolbar.svelte';
    import Link from 'framework7-svelte/components/link.svelte';
    import SettingsSwiper from '../components/settingsSwiper.svelte';
    import Block from 'framework7-svelte/components/block.svelte';
    import { flip } from 'svelte/animate';
    import { Plugins } from '@capacitor/core';
    import { onDestroy } from 'svelte';
    import { removeAllListeners } from 'process';
    import { baseCurrencySymbol } from '../stores/currenciesStore';
    const { Keyboard } = Plugins;

    // opens add modal
    let addModal;
    let adding = false;
    const add = () => {
        adding = true;
        setTimeout(function () {
            const addModalInstance = addModal.instance();
            addModalInstance.open();
        }, 100);
    };

    // closes add modal
    const closeModal = () => {
        const addModalInstance = addModal.instance();
        addModalInstance.close();
        adding = false;
    };

    $: if (adding === true) {
        Keyboard.addListener('keyboardWillShow', (info) => {
            if (document.getElementById('add')) {
                document.getElementById('add').style.marginBottom = `${
                    info.keyboardHeight - 20
                }px`;
            }
        });

        Keyboard.addListener('keyboardWillHide', () => {
            if (document.getElementById('add')) {
                document.getElementById('add').style.marginBottom = '0px';
            }
        });
    }

    onDestroy(() => {
        removeAllListeners();
    });

    onMount(() => {
        hideFAB();
    });
</script>

<Page name="budgets" noToolbar onPageBeforeOut={() => showFAB()}>
    <Navbar title="Budgets" backLink="Back" on:clickBack={() => showFAB()} />
    <Block class="text-align-center description">
        Below are the budgets that will be automatically regenerated every month
        to create your monthly budget. You can adjust the amounts and categories
        of each budget and it will be reflected moving forward. Note: Updating a
        budget category will not update the current month's budget category or
        previous month's, only those generated in the future.
    </Block>
    <Block class="text-align-center total">
        Total Budgeted Amount: {$baseCurrencySymbol}{$budgetsSum}
    </Block>
    <List class="budgets">
        {#each $budgets as { item, itemId } (itemId)}
            <div animate:flip={{ duration: 400 }}>
                <SettingsSwiper {item} {itemId} type="budget" />
            </div>
        {/each}
    </List>

    <Button on:click={add}>Add Budget</Button>
    {#if adding === true}
        <Sheet
            class="add-budget"
            style="height: auto;"
            swipeToClose
            id="add"
            backdrop
            bind:this={addModal}
        >
            <Toolbar>
                <div class="left">Add New Budget</div>
                <div class="right">
                    <Link sheetClose on:click={closeModal}>Close</Link>
                </div>
            </Toolbar>
            <div class="swipe-handler" />
            <AddBudget />
        </Sheet>
    {/if}
</Page>

<style>
    :global(.description) {
        margin-bottom: 20px !important;
    }
    :global(.total) {
        margin: 0 !important;
    }
    :global(.budgets) {
        margin-top: 20px !important;
    }
</style>
