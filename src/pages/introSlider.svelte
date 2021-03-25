<script>
    import Block from 'framework7-svelte/components/block.svelte';
    import Button from 'framework7-svelte/components/button.svelte';
    import ListItem from 'framework7-svelte/components/list-item.svelte';
    import List from 'framework7-svelte/components/list.svelte';
    import { f7 } from 'framework7-svelte';
    import Page from 'framework7-svelte/components/page.svelte';
    import SwiperSlide from 'framework7-svelte/components/swiper-slide.svelte';
    import Swiper from 'framework7-svelte/components/swiper.svelte';
    import CurrenciesList from '../shared/currenciesList.svelte';
    import { addCurrencies } from '../stores/currenciesStore';
    import SettingsSwiper from '../components/settingsSwiper.svelte';
    import { budgets } from '../stores/budgetsStore';
    import { setUpDone } from '../stores/userStore';
    import { flip } from 'svelte/animate';
    import Navbar from 'framework7-svelte/components/navbar.svelte';
    import { Plugins } from '@capacitor/core';
    import Sheet from 'framework7-svelte/components/sheet.svelte';
    import Toolbar from 'framework7-svelte/components/toolbar.svelte';
    import Link from 'framework7-svelte/components/link.svelte';
    import AddBudget from '../components/addBudget.svelte';
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

    let newBaseCurrency;
    let newCurrencyOptions;
    let baseSelect;
    let currencyOptionsSelect;

    const setCurrencies = () => {
        f7.dialog.preloader('Setting up currencies...');
        const baseCurrencySelect = baseSelect.smartSelectInstance();
        const optionsSelect = currencyOptionsSelect.smartSelectInstance();
        newBaseCurrency = baseCurrencySelect.getValue();
        newCurrencyOptions = optionsSelect.getValue();
        const currencies = {
            newBaseCurrency,
            newCurrencyOptions,
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
        f7.dialog.close();
    };

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

    const finishIntro = () => {
        setUpDone();
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
                    carefully. After you've chosen the currrency your budget
                    will display in you can also choose the different currencies
                    you'd like available to convert from. These can be changed
                    and updated at any time in the "Currency Options" page
                    within the "Settings" tab if you should choose to add or
                    remove certain currencies.
                </p>
            </Block>

            <List>
                <ListItem
                    title="Budget Currency"
                    smartSelect
                    bind:this={baseSelect}
                    smartSelectParams={{
                        openIn: 'popover',
                        closeOnSelect: 'true',
                    }}
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
        </SwiperSlide>
        <SwiperSlide>
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
                {#each $budgets as { item, itemId } (itemId)}
                    <div animate:flip={{ duration: 400 }}>
                        <SettingsSwiper {item} {itemId} type="budget" />
                    </div>
                {/each}
            </List>

            <Button on:click={add} large>Add A Budget Category</Button>
            {#if $budgets.length > 0}
                <Button on:click={nextSlide} large>Next</Button>
            {/if}
        </SwiperSlide>
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

            <Button on:click={finishIntro} large>Done</Button>
        </SwiperSlide>
    </Swiper>
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
    :global(.intro-page .page-content) {
        padding-bottom: 0;
    }
    :global(.intro-swiper) {
        font-weight: 300;
        width: 100%;
        height: 100%;
        display: -webkit-box;
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        -webkit-justify-content: center;
        justify-content: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        -webkit-align-items: center;
        align-items: center;
        background: #fff;
        color: #000;
    }

    p {
        font-size: 16px;
    }
</style>
