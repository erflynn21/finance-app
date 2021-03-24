<script>
    import Fab from 'framework7-svelte/components/fab.svelte';
    import Icon from 'framework7-svelte/components/icon.svelte';
    import FabButtons from 'framework7-svelte/components/fab-buttons.svelte';
    import FabButton from 'framework7-svelte/components/fab-button.svelte';
    import Sheet from 'framework7-svelte/components/sheet.svelte';
    import AddExpense from './addExpense.svelte';
    import AddIncome from './addIncome.svelte';
    import FabBackdrop from 'framework7-svelte/components/fab-backdrop.svelte';
    import Toolbar from 'framework7-svelte/components/toolbar.svelte';
    import Link from 'framework7-svelte/components/link.svelte';
    import { Plugins } from '@capacitor/core';
    const { Keyboard } = Plugins;

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

    // opens add modal
    let addModal;
    let adding = false;
    let type;
    const add = (addType) => {
        adding = true;
        type = addType;
        setTimeout(function () {
            const addModalInstance = addModal.instance();
            addModalInstance.open();
        }, 50);
    };

    // closes add modal
    const closeModal = () => {
        const addModalInstance = addModal.instance();
        addModalInstance.close();
        adding = false;
    };
</script>

<FabBackdrop />

<Fab position="right-bottom">
    <Icon ios="f7:plus" md="material:add" />
    <Icon ios="f7:xmark" md="material:close" />
    <FabButtons position="top">
        <FabButton label="Add Expense" fabClose on:click={() => add('expense')}>
            <Icon f7="minus" />
        </FabButton>
        <FabButton label="Add Income" fabClose on:click={() => add('income')}>
            <Icon f7="plus" />
        </FabButton>
    </FabButtons>
</Fab>

{#if adding === true && type === 'expense'}
    <Sheet
        class="add"
        style="height: auto; max-height: 80vh"
        id="add"
        backdrop
        bind:this={addModal}
    >
        <Toolbar>
            <div class="left">Add New Expense</div>
            <div class="right">
                <Link sheetClose on:click={closeModal}>Close</Link>
            </div>
        </Toolbar>
        <div class="swipe-handler" />
        <AddExpense />
    </Sheet>
{/if}

{#if adding === true && type === 'income'}
    <Sheet
        class="add"
        style="height: auto; max-height: 70vh"
        id="add"
        swipeToClose
        backdrop
        bind:this={addModal}
    >
        <Toolbar>
            <div class="left">Add New Income</div>
            <div class="right">
                <Link sheetClose on:click={closeModal}>Close</Link>
            </div>
        </Toolbar>
        <div class="swipe-handler" />
        <AddIncome />
    </Sheet>
{/if}

<style>
    :global(.fab) {
        transition-delay: 0ms;
    }

    :global(.fab a) {
        background: rgb(6, 95, 70);
        background: linear-gradient(
            90deg,
            rgba(6, 95, 70, 1) 0%,
            rgba(5, 150, 105, 1) 100%
        );
    }

    :global(.add) {
        transition: margin-bottom 100ms ease;
    }
</style>
