<script>
    import { Page, Navbar } from 'framework7-svelte';
    import {
        currencies,
        baseCurrency,
        currencyOptions,
        updateCurrencies,
    } from '../stores/currenciesStore';
    import { get } from 'svelte/store';
    import Block from 'framework7-svelte/components/block.svelte';
    import Button from 'framework7-svelte/components/button.svelte';
    import ListItem from 'framework7-svelte/components/list-item.svelte';
    import List from 'framework7-svelte/components/list.svelte';
    import CurrenciesList from '../shared/currenciesList.svelte';
    import { addCurrencies } from '../stores/currenciesStore';
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    let updatedCurrencyOptions;
    let currencyOptionsSelect;

    const setCurrencies = () => {
        const optionsSelect = currencyOptionsSelect.smartSelectInstance();
        updatedCurrencyOptions = optionsSelect.getValue();
        const updatedCurrencies = {
            baseCurrency: get(baseCurrency),
            currencyOptions: updatedCurrencyOptions,
        };
        updateCurrencies(updatedCurrencies, get(currencies)[0].itemId);
    };
</script>

<Page name="currency options" noToolbar>
    <Navbar title="Currency Options" backLink="Back" />

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
            bind:this={currencyOptionsSelect}>
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
