<script>
    import { Page, Navbar } from 'framework7-svelte';
    import {
        currencies,
        baseCurrency,
        currencyOptions
    } from '../stores/currenciesStore';
    import Block from 'framework7-svelte/components/block.svelte';
    import Button from 'framework7-svelte/components/button.svelte';
    import ListItem from 'framework7-svelte/components/list-item.svelte';
    import List from 'framework7-svelte/components/list.svelte';
    import CurrenciesList from '../shared/currenciesList.svelte';
    import { onMount } from 'svelte';
    import { hideFAB, showFAB } from '../js/fab';
    import { f7 } from 'framework7-svelte';
import { updateCurrencies } from '../js/currencies';

    let updatedCurrencyOptions;
    let currencyOptionsSelect;

    const setCurrencies = () => {
        const optionsSelect = currencyOptionsSelect.smartSelectInstance();
        updatedCurrencyOptions = optionsSelect.getValue();
        if (updatedCurrencyOptions.length === 0) {
            f7.dialog.alert('You must select at least one currency option');
            return;
        }
        const updatedCurrencies = {
            newBaseCurrency: $baseCurrency,
            newCurrencyOptions: updatedCurrencyOptions,
        };
        updateCurrencies(updatedCurrencies, $currencies[0].itemId);
    };

    onMount(() => {
        hideFAB();
    });
</script>

<Page name="currency options" noToolbar onPageBeforeOut={() => showFAB()}>
    <Navbar
        title="Currency Options"
        backLink="Back"
        on:clickBack={() => showFAB()}
    />

    <Block class="text-align-center">
        <h1>Budget Currency: {$baseCurrency}</h1>
        <h1>Available Currencies: {$currencyOptions}</h1>

        <p>
            You can update your available currencies below. These are the
            currencies that will be available to you to convert into the
            currency that your budget is set in.
        </p>
    </Block>

    <List>
        <ListItem
            title="Currency Options"
            smartSelect
            smartSelectParams={{ openIn: 'popover' }}
            bind:this={currencyOptionsSelect}
        >
            <select name="baseCurrency" multiple>
                <CurrenciesList />
            </select>
        </ListItem>
    </List>

    <Button on:click={setCurrencies} large>Update</Button>
</Page>

<style>
    h1 {
        font-size: 16px;
        color: black;
        font-weight: 400;
        text-align: center;
        margin: 10px 0;
    }

    /* h3 {
        font-size: 14px;
        color: black;
        font-weight: 400;
        text-align: center;
        margin: 10px 0;
    } */
</style>
