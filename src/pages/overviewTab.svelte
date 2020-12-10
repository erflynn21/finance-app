<script>
    import { Page } from 'framework7-svelte';
    import List from 'framework7-svelte/components/list.svelte';
    import ListItemCell from 'framework7-svelte/components/list-item-cell.svelte';
    import ListItemRow from 'framework7-svelte/components/list-item-row.svelte';
    import { baseCurrencySymbol } from '../stores/currenciesStore';
    import { selectedMonthName, selectedYear } from '../stores/datesStore';
    import { expensesSum } from '../stores/expensesStore';
    import { tweened } from 'svelte/motion';
    import { monthlyBudgetsSum } from '../stores/monthlyBudgetsStore';
    import { incomesSum } from '../stores/incomesStore';
    import DoughnutChart from '../components/doughnutChart.svelte';
    import Icon from 'framework7-svelte/components/icon.svelte';
    import Sheet from 'framework7-svelte/components/sheet.svelte';
    import Toolbar from 'framework7-svelte/components/toolbar.svelte';
    import Link from 'framework7-svelte/components/link.svelte';
    import ChangeMonth from '../components/changeMonth.svelte';

    $: cashflow = Number($incomesSum - $expensesSum).toFixed(2);

    let monthModal;
    let modalOpen = false;
    const openModal = () => {
        modalOpen = true;
        setTimeout(function () {
            const monthModalInstance = monthModal.instance();
            monthModalInstance.open();
        }, 50);
    };

    const closeModal = () => {
        const monthModalInstance = monthModal.instance();
        monthModalInstance.close();
        modalOpen = false;
    };

    // percentage and tweened values
    $: percentage = Math.floor((100 / $monthlyBudgetsSum) * $expensesSum) || 0;
    const tweenedPercentage = tweened(0);
    $: tweenedPercentage.set(percentage);
</script>

<Page name="home">
    <div class="overview-spacer" />
    <div class="background" />
    <div class="heading">
        <h1>Overview</h1>
    </div>

    <List class="overview-list" inset>
        <div class="item-content">
            <div class="item-inner item-cell">
                <ListItemRow class="overview-grid">
                    <ListItemCell>
                        <h3>BUDGET</h3>
                    </ListItemCell>
                    <ListItemCell>
                        <div class="date-picker">
                            {$selectedMonthName},
                            {$selectedYear}
                            <div class="dropdown" on:click={openModal}>
                                {#if modalOpen === false}
                                    <Icon
                                        f7="chevron_down"
                                        size="18"
                                        style="align-self: center"
                                        sheetOpen=".changeMonth" />
                                {:else}
                                    <Icon
                                        f7="chevron_up"
                                        size="18"
                                        style="align-self: center" />
                                {/if}
                            </div>
                        </div>
                    </ListItemCell>
                </ListItemRow>
                <ListItemRow>
                    <div class="grid">
                        <div class="percentage">
                            {#if percentage <= 70}
                                <div
                                    class="percent"
                                    style="width: {$tweenedPercentage}%; background-color: green" />
                                <span>{percentage}%</span>
                            {:else if percentage > 70 && percentage <= 90}
                                <div
                                    class="percent"
                                    style="width: {$tweenedPercentage}%; background-color: yellow" />
                                <span
                                    style="color: #383838">{percentage}%</span>
                            {:else}
                                <div
                                    class="percent"
                                    style="width: {$tweenedPercentage}%; background-color: red" />
                                <span>{percentage}%</span>
                            {/if}
                        </div>
                    </div>
                </ListItemRow>
            </div>
        </div>
    </List>

    <List class="overview-list" inset>
        <div class="item-content">
            <div class="item-inner item-cell">
                <ListItemRow>
                    <h3>CASH FLOW</h3>
                </ListItemRow>
                <div class="grid cash-flow-summary">
                    <div class="exp-inc">
                        <h5>
                            Earned:
                            {$baseCurrencySymbol}{Math.floor($incomesSum)}
                        </h5>
                        <h5>
                            Spent: -{$baseCurrencySymbol}{Math.floor($expensesSum)}
                        </h5>
                    </div>
                    <div class="cash-flow-sum">
                        {#if cashflow >= 0}
                            <h4 style="color: green">
                                {$baseCurrencySymbol}{cashflow}
                            </h4>
                        {:else}
                            <h4 style="color: red">
                                {$baseCurrencySymbol}{cashflow}
                            </h4>
                        {/if}
                    </div>
                </div>
            </div>
        </div>
    </List>

    <List class="overview-list" inset>
        <div class="item-content">
            <div class="item-inner item-cell">
                <ListItemRow>
                    <h3>SPENDING</h3>
                </ListItemRow>
                <div class="doughnut">
                    <DoughnutChart />
                </div>
            </div>
        </div>
    </List>

    <div class="spacer" />

    {#if modalOpen === true}
        <Sheet
            class="changeMonth"
            style="height: auto; max-height: 70vh"
            id="changeMonth"
            swipeToClose
            backdrop
            bind:this={monthModal}>
            <Toolbar>
                <div class="left">Change Budget Month</div>
                <div class="right">
                    <Link sheetClose>Close</Link>
                </div>
            </Toolbar>
            <div class="swipe-handler" />
            <ChangeMonth on:collapse={closeModal} />
        </Sheet>
    {/if}
</Page>

<style>
    .background {
        width: 100vw;
        box-shadow: 0 2px 2px -2px gray;
        background-color: green;
        margin-bottom: 2px;
        position: fixed;
        top: 0;
        z-index: 0;
        height: calc(env(safe-area-inset-top) + 140px);
    }

    .overview-spacer {
        height: calc(env(safe-area-inset-top) + 80px);
        width: 100vw;
        background: transparent;
    }
    .heading {
        padding-top: 10px;
        padding-bottom: 10px;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 2;
        height: calc(env(safe-area-inset-top) + 55px);
        width: 100vw;
        background: green;
    }

    .heading h1 {
        font-size: 30px;
        font-weight: 400;
        width: 100vw;
        color: white;
        padding-left: 20px;
        padding-top: calc(env(safe-area-inset-top) + 15px);
    }
    :global(.overview-grid .item-cell:last-child) {
        text-align: right;
    }

    :global(.overview-grid .item-cell) {
        width: auto;
    }

    .grid {
        display: grid;
        grid-template-columns: 1fr 0.1fr;
        width: 100%;
        height: 25px;
        margin-top: 10px;
    }

    .percentage {
        grid-column: 1/3;
        width: 100%;
        position: relative;
        background-color: lightgray;
        box-sizing: border-box;
        border-radius: 5px;
        display: flex;
        align-items: center;
    }

    span {
        position: absolute;
        color: white;
        padding-left: 5px;
        font-size: 14px;
    }

    .percent {
        height: 100%;
        position: absolute;
        box-sizing: border-box;
        background-color: green;
        border-radius: 5px;
        max-width: 100%;
    }

    h3 {
        font-size: 20px;
        font-weight: 400;
    }

    .cash-flow-summary {
        display: grid;
        grid-template-columns: 1fr 1fr;
        height: auto;
    }

    .exp-inc {
        padding-left: 5px;
    }

    .exp-inc h5 {
        font-size: 16px;
        font-weight: 300;
        margin-bottom: 5px;
        color: gray;
    }

    .cash-flow-sum {
        justify-self: end;
        align-self: center;
    }

    .cash-flow-sum h4 {
        font-size: 18px;
        font-weight: 500;
    }

    .date-picker {
        display: flex;
        justify-content: flex-end;
    }

    .dropdown {
        margin-left: 5px;
    }
</style>
