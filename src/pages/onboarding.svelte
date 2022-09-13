<script>
    import {
        f7,
        Page,
        Navbar,
        Swiper,
        SwiperSlide,
        Block,
        List,
        ListItem,
        Button,
    } from 'framework7-svelte';
    import { flip } from 'svelte/animate';
    import CurrenciesList from '../components/currenciesList.svelte';
    import { baseBudgets } from '../stores/baseBudgetsStore';
    import { finishOnboarding } from '../js/auth';
    import { addCurrencies } from '../js/currencies';

    let swiper;
    setTimeout(() => {
        swiper = f7.swiper.get('.intro-swiper');
        swiper.allowSlideNext = false;
        swiper.allowSlidePrev = false;
    }, 50);

    const nextSlide = () => {
        swiper.allowSlideNext = true;
        swiper.slideNext();
        swiper.allowSlideNext = false;
    };

    let budgetCurrencySelector;
    let currencyOptionsSelector;
    let spendingCurrencySelector;

    let currencies = {
        budgetCurrency: '',
        currencyOptions: [],
        spendingCurrency: '',
    };

    const saveCurrencies = () => {
        f7.dialog.preloader('Saving your currencies...');
        currencies = {
            budgetCurrency: budgetCurrencySelector
                .smartSelectInstance()
                .getValue(),
            currencyOptions: currencyOptionsSelector
                .smartSelectInstance()
                .getValue(),
            spendingCurrency: spendingCurrencySelector
                .smartSelectInstance()
                .getValue(),
        };
        addCurrencies(currencies).then(() => {
            f7.dialog.close();
            nextSlide();
        });
    };
</script>

<Page name="intro-slider" class="intro-page" id="intro-page">
    <Navbar title="Set Up" />
    <Swiper class="intro-swiper" init={true}>
        <SwiperSlide>
            <Block>
                <Block class="text-align-center">
                    <p>
                        Welcome! Expat Expenses is the #1 choice for expats who
                        want a secure, fast and easy way to budget in multiple
                        currencies. First, we'll help you set up a couple things
                        and we'll be all set! Enjoy!
                    </p>
                </Block>
                <Button on:click={nextSlide} large>Next</Button>
            </Block>
        </SwiperSlide>
        <SwiperSlide>
            <Block class="text-align-center">
                <p>
                    Let's first set up your budget currency. This is the
                    currency that will show up everywhere across your budget
                    and, as such, should probably be the currency you use most
                    often. All other currencies selected will be converted into
                    this currency. This currency can only be set once, so choose
                    carefully.
                </p>
                <p>
                    Next select your default spending currency. This is the
                    currency that all transactions will default to and, as such,
                    should be the currency you most often spend money in.
                </p>
                <p>
                    Last, you can add any other currencies you would like under
                    "Currency Options". Your default spending currency and
                    currency options can be changed and updated at any time in
                    the "Currencies" page within the "Settings" tab if you want
                    to add or remove certain currencies.
                </p>
            </Block>

            <List>
                <ListItem
                    title="Budget Currency"
                    smartSelect
                    smartSelectParams={{
                        openIn: 'popup',
                        searchbar: true,
                        searchbarPlaceholder: 'Search Currencies',
                        closeOnSelect: 'true',
                    }}
                    bind:this={budgetCurrencySelector}
                >
                    <select name="budgetCurrency">
                        <CurrenciesList />
                    </select>
                </ListItem>

                <ListItem
                    title="Main Spending Currency"
                    smartSelect
                    multiple
                    smartSelectParams={{
                        openIn: 'popup',
                        searchbar: true,
                        searchbarPlaceholder: 'Search Currencies',
                        closeOnSelect: 'true',
                    }}
                    bind:this={spendingCurrencySelector}
                >
                    <select name="spendingCurrency">
                        <CurrenciesList />
                    </select>
                </ListItem>

                <ListItem
                    title="Currency Options"
                    smartSelect
                    multiple
                    smartSelectParams={{
                        openIn: 'popup',
                        searchbar: true,
                        searchbarPlaceholder: 'Search Currencies',
                        closeOnSelect: 'true',
                    }}
                    bind:this={currencyOptionsSelector}
                >
                    <select name="currencyOptions" multiple>
                        <CurrenciesList />
                    </select>
                </ListItem>
            </List>

            <Button on:click={saveCurrencies} large>Save</Button>
        </SwiperSlide>
        <!-- <SwiperSlide>
            <Block class="text-align-center">
                <p>
                    Awesome! We've got your currencies all set up now. Next,
                    let's set up some budget categories. At the beginning of
                    each month we'll create a new budget for you based on the
                    budget categories that you set here. You can change the
                    budget categories in the "Budget" tab and it won't effect
                    these budget categories. If you'd like to add, update or
                    delete a category going forward you can do so from the
                    "Budgets" page within the "Settings" tab.
                </p>
            </Block>

            <List>
                {#each $baseBudgets as { item, itemId } (itemId)}
                    <div animate:flip={{ duration: 400 }}>
                        <ListItem title={item.category}>
                        </ListItem>
                    </div>
                {/each}
            </List>

            <Button on:click={add} large>Add A Budget Category</Button>
            {#if $baseBudgets.length > 0}
                <Button on:click={nextSlide} large>Next</Button>
            {/if}
        </SwiperSlide> -->
        <SwiperSlide>
            <Block class="text-align-center">
                <p>
                    Great! You're all set up and ready to get budgeting! You'll
                    find lots of great features within the app to enjoy and we
                    hope this helps your budgeting experience. If you have any
                    questions, need help, or think of a great new feature you'd
                    like us to add, feel free to reach out to
                    support@expatexpenses.com. Enjoy!
                </p>
            </Block>

            <Button on:click={finishOnboarding} large>Done</Button>
        </SwiperSlide>
    </Swiper>
    <!-- {#if adding === true}
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
    {/if} -->
</Page>
