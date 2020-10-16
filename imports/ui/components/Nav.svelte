<script>
    import Overview from './Overview.svelte';
    import MonthlyBudget from './MonthlyBudget.svelte';
    import Settings from './Settings.svelte';
    import Transactions from './Transactions.svelte';
    import AddButton from './AddButton.svelte';
    import SetBaseCurrency from './SetBaseCurrency.svelte';
    import Loading from '../shared/Loading.svelte';
    import { afterUpdate } from 'svelte';
    import { userSettingsStore } from '../stores/stores';

    let loading = false;

    let current = 'overview';

    $: baseCurrencySet = null;

    let brave = false;

    const detectBraveBrowser = () => {
        return new Promise((resolve, reject) => {
            if (!navigator.userAgent.includes('Chrome')) {
                return resolve(false);
            }

            const xhr = new XMLHttpRequest();
            const onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    const response = JSON.parse(xhr.responseText);

                    if (!response) {
                        return resolve(false);
                    }
                    if (!response.Answer) {
                        return resolve(false);
                    }
                    if (!response.Answer.includes('Brave')) {
                        return resolve(false);
                    }

                    return resolve(true);
                } else {
                    return reject(JSON.parse(xhr.responseText));
                }
            };

            xhr.onload = onload;
            xhr.open(
                'GET',
                'https://api.duckduckgo.com/?q=useragent&format=json'
            );
            xhr.send();
        });
    };

    detectBraveBrowser()
        .then((isBrave) => {
            console.log('isBrave', isBrave);
        })
        .catch((error) => {
            console.error(error);
        });

    // add in check to see if base currency has been set based on the user currency store
    const checkBaseCurrency = () => {
        if ($userSettingsStore.length === 0) {
            baseCurrencySet = false;
            return;
        }
        if (
            $userSettingsStore[0].baseCurrency === undefined ||
            $userSettingsStore[0].currencyOptions === ''
        ) {
            baseCurrencySet = false;
        } else if (
            $userSettingsStore[0].baseCurrency.length !== undefined &&
            $userSettingsStore[0].currencyOptions.length !== undefined
        ) {
            baseCurrencySet = true;
        }
    };

    let fadedButton = false;

    const fadeButton = () => {
        fadedButton = !fadedButton;
    };

    afterUpdate(() => {
        checkBaseCurrency();
    });
</script>

{#if loading === true}
    <div class="content">
        <Loading />
    </div>
{:else if baseCurrencySet === false}
    <SetBaseCurrency on:currencySet={() => (baseCurrencySet = true)} />
{:else}
    <div class="content">
        {#if current === 'overview'}
            <Overview on:fade={fadeButton} />
        {:else if current === 'budget'}
            <MonthlyBudget />
        {:else if current === 'transactions'}
            <Transactions />
        {:else if current === 'settings'}
            <Settings />
        {/if}
    </div>
{/if}

{#if baseCurrencySet === true}
    <footer>
        <div class:faded={fadedButton === true}>
            <AddButton />
        </div>
        <div class="bottom-nav-container" class:brave={brave === true}>
            <div class="tab-nav-container">
                <button>
                    <div
                        class="tab {current === 'overview' ? 'active' : ''}"
                        on:click={() => (current = 'overview')}>
                        <i class="chart pie icon" />
                    </div>
                </button>

                <button>
                    <div
                        class="tab {current === 'budget' ? 'active' : ''}"
                        on:click={() => (current = 'budget')}>
                        <i class="calculator icon" />
                    </div>
                </button>
                <button>
                    <div
                        class="tab {current === 'transactions' ? 'active' : ''}"
                        on:click={() => (current = 'transactions')}>
                        <i class="dollar sign icon" />
                    </div>
                </button>
                <button>
                    <div
                        class="tab {current === 'settings' ? 'active' : ''}"
                        on:click={() => (current = 'settings')}>
                        <i class="cog icon" />
                    </div>
                </button>
            </div>
        </div>
    </footer>
{/if}

<style>
    .content {
        min-height: calc(100vh - 51px);
        max-height: calc(100vh - 51px);
        background-color: #eeeeeee7;
    }

    @media (pointer: coarse) {
        .content {
            min-height: calc(100vh - 165px);
            max-height: calc(100vh - 165px);
        }
    }

    .brave {
        min-height: calc(100vh - 51px);
        max-height: calc(100vh - 51px);
    }

    .bottom-nav-container {
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        text-align: center;
        margin: 0;
        bottom: 0;
        left: 0;
        padding: 10px 40px;
        position: sticky;
        border-top: 1px solid #e4e0e0;
    }

    .tab-nav-container {
        display: flex;
        justify-content: space-between;
        width: 100%;
    }

    .tab {
        background-color: #ffffff;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
    }

    .tab i {
        font-size: 26px;
        color: rgb(128, 128, 128);
    }

    .active i {
        color: green;
    }

    button,
    button:active,
    button:visited,
    button:enabled,
    button:focus {
        margin: 0;
        padding: 0;
        border: 0;
        background: transparent;
        outline: 0;
        min-width: 0px;
    }

    .faded {
        visibility: hidden;
    }
</style>
