<script>
    import { Page } from 'framework7-svelte';
    import Block from 'framework7-svelte/components/block.svelte';
    import Button from 'framework7-svelte/components/button.svelte';
    import ListItem from 'framework7-svelte/components/list-item.svelte';
    import List from 'framework7-svelte/components/list.svelte';
    import { addCurrencies } from '../js/currencies';
    import CurrenciesList from '../shared/currenciesList.svelte';

    let baseCurrency;
    let currencyOptions;
    let baseSelect;
    let currencyOptionsSelect;

    const setCurrencies = () => {
        const baseCurrencySelect = baseSelect.smartSelectInstance();
        const optionsSelect = currencyOptionsSelect.smartSelectInstance();
        baseCurrency = baseCurrencySelect.getValue();
        currencyOptions = optionsSelect.getValue();
        const currencies = {
            baseCurrency,
            currencyOptions,
        };
        addCurrencies(currencies).then((e) => {
            if (e) {
                f7.dialog.close();
                let errorToast = f7.toast.create({
                    text: e.message,
                    position: 'center',
                    closeTimeout: 2000,
                    cssClass: 'text-align-center',
                });
                errorToast.open();
            } else {
                nextSlide();
            }
        });
    };
</script>

<Page name="set-currencies" noNavbar>
    <Block class="text-align-center">
        Before getting started with budgeting you must select the currency that
        your budget will be in. This is the currency that will show up
        everywhere across your budget and, as such, should probably be there
        currency you use most often. All other currencies selected will be
        converted into this currency. This currency can only be set once, so
        choose carefully. After you've chosen the currrency your budget will
        display in you can also choose the different currencies you'd like
        available to convert from. These can be changed and updated at any time
        if you should choose to add or remove certain currencies.
    </Block>

    <List>
        <ListItem
            title="Budget Currency"
            smartSelect
            bind:this={baseSelect}
            smartSelectParams={{ openIn: 'popover', closeOnSelect: 'true' }}
        >
            <select name="baseCurrency">
                <CurrenciesList />
            </select>
        </ListItem>
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
