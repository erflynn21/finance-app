<script>
    import ListItem from '../shared/ListItem.svelte';
    import { expenseSumStore } from '../stores/ExpenseSumStore';
    import { budgetSumStore } from '../stores/BudgetSumStore';
    import { userCurrencySymbol } from '../stores/UserCurrencySymbolStore';
    import { tweened } from 'svelte/motion';
    import { incomeSumStore } from '../stores/IncomeSumStore';
    import DoughnutChart from './DoughnutChart.svelte';
    import MonthPicker from './MonthPicker.svelte';

    // setting budget month
    const date = new Date();
    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    // percentage and tweened values
    $: percentage = Math.floor((100 / $budgetSumStore) * $expenseSumStore) || 0;
    const tweenedPercentage = tweened(0);
    $: tweenedPercentage.set(percentage);

    $: cashflow = Number($incomeSumStore - $expenseSumStore).toFixed(2);
</script>

<div class="background" />
<div class="heading">
    <h1>Overview</h1>
</div>
<div class="spacer" />
<div class="outer-container">
    <div class="container">
        <div class="budget-summary rounded">
            <ListItem>
                <div class="grid row-one">
                    <div class="budget">
                        <h3>BUDGET</h3>
                    </div>
                    <MonthPicker />
                </div>
                <div class="grid row-two">
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
                            <span style="color: gray">{percentage}%</span>
                        {:else}
                            <div
                                class="percent"
                                style="width: {$tweenedPercentage}%; background-color: red" />
                            <span>{percentage}%</span>
                        {/if}
                    </div>
                </div>
            </ListItem>
        </div>

        <div class="cash-flow rounded">
            <ListItem>
                <div class="grid row-one">
                    <h3>CASH FLOW</h3>
                </div>
                <div class="grid cash-flow-summary">
                    <div class="exp-inc">
                        <h5>
                            Earned:
                            {$userCurrencySymbol}{Math.floor($incomeSumStore)}
                        </h5>
                        <h5>
                            Spent: -{$userCurrencySymbol}{Math.floor($expenseSumStore)}
                        </h5>
                    </div>
                    <div class="cash-flow-sum">
                        {#if cashflow >= 0}
                            <h4 style="color: green">
                                {$userCurrencySymbol}{cashflow}
                            </h4>
                        {:else}
                            <h4 style="color: red">
                                {$userCurrencySymbol}{cashflow}
                            </h4>
                        {/if}
                    </div>
                </div>
            </ListItem>
        </div>

        <div class="spending rounded">
            <ListItem>
                <div class="title">
                    <h3>SPENDING</h3>
                </div>
                <div class="doughnut">
                    <DoughnutChart />
                </div>
            </ListItem>
        </div>
        <div class="small-spacer" />
    </div>
</div>

<style>
    .background {
        width: 100vw;
        box-shadow: 0 2px 2px -2px gray;
        background-color: green;
        margin-bottom: 2px;
        position: fixed;
        top: 0;
        z-index: 0;
        height: 120px;
    }
    .heading {
        padding-top: 10px;
        padding-bottom: 10px;
        position: absolute;
        top: 0;
        z-index: 2;
        height: 55px;
        width: 100vw;
        background: green;
    }

    .heading h1 {
        font-size: 30px;
        font-weight: 400;
        width: 100vw;
        color: white;
        padding-left: 20px;
        padding-top: 15px;
    }

    .spacer {
        height: 80px;
        width: 100vw;
        background: transparent;
    }

    .outer-container {
        width: 90%;
        display: flex;
        justify-content: center;
        padding: 0 5%;
    }
    .container {
        width: 100%;
        z-index: 1;
    }

    .rounded {
        border-radius: 5px;
    }

    h3 {
        font-size: 20px;
        font-weight: 500;
    }

    .budget-summary {
        margin-bottom: 10px;
    }

    .grid {
        display: grid;
        margin: 5px 0;
        width: calc(100% - 40px);
    }

    .row-one {
        grid-template-columns: 1fr 1fr;
        margin-bottom: 5px;
        width: calc(100% - 25px);
    }

    .row-two {
        grid-template-columns: 1fr 0.1fr;
        width: 100%;
        height: 25px;
    }

    .percentage {
        grid-column: 1/2;
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
    }

    .cash-flow {
        margin-bottom: 10px;
    }

    .row-one h3 {
        margin-bottom: 5px;
    }

    .cash-flow-summary {
        display: grid;
        grid-template-columns: 1fr 1fr;
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

    .doughnut {
        max-width: 100%;
        height: auto;
        margin: 0 20px 0 0;
    }

    .small-spacer {
        height: 70px;
    }
</style>
