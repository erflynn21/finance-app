<script>
    import Heading from '../shared/Heading.svelte';
    import ListItem from '../shared/ListItem.svelte';
    import { expenseSumStore } from '../stores/ExpenseSumStore';
    import { budgetSumStore } from '../stores/BudgetSumStore';
    import { userCurrencySymbol } from '../stores/UserCurrencySymbolStore';
    import { tweened } from 'svelte/motion';
    import { incomeSumStore } from '../stores/IncomeSumStore';

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

    // percentage and tweened values
    $: percentage = Math.floor((100 / $budgetSumStore) * $expenseSumStore) || 0;
    const tweenedPercentage = tweened(0);
    $: tweenedPercentage.set(percentage);

    $: cashflow = Number($incomeSumStore - $expenseSumStore).toFixed(2);
</script>

<div class="container">
    <Heading>Overview</Heading>

    <div class="budget-summary">
        <ListItem>
            <div class="grid row-one">
                <div class="budget">
                    <h3>BUDGETS</h3>
                </div>
                <div class="month">
                    <h4>{month}</h4>
                </div>
            </div>
            <div class="grid row-two">
                <div class="percentage">
                    {#if percentage <= 70}
                        <div
                            class="percent"
                            style="width: {$tweenedPercentage}%; background-color: green" />
                    {:else if percentage > 70 && percentage <= 90}
                        <div
                            class="percent"
                            style="width: {$tweenedPercentage}%; background-color: yellow" />
                    {:else}
                        <div
                            class="percent"
                            style="width: {$tweenedPercentage}%; background-color: red" />
                    {/if}
                    <span>{percentage}%</span>
                </div>
            </div>
        </ListItem>
    </div>

    <div class="cash-flow">
        <ListItem>
            <div class="grid row-one">
                <h3>CASH FLOW</h3>
            </div>
            <div class="grid cash-flow-summary">
                <div class="exp-inc">
                    <h5>{$userCurrencySymbol}{$incomeSumStore} Earned</h5>
                    <h5>-{$userCurrencySymbol}{$expenseSumStore} Spent</h5>
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

    </div>
</div>

<style>
    h3 {
        font-size: 20px;
        font-weight: 500;
    }

    .month {
        justify-self: end;
        align-self: end;
    }
    .month h4 {
        font-size: 16px;
        font-weight: 400;
    }

    .budget-summary {
        margin-bottom: 10px;
    }

    .grid {
        display: grid;
        margin: 5px 0;
        width: calc(100vw - 30px);
    }

    .row-one {
        grid-template-columns: 1fr 1fr;
        margin-bottom: 5px;
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
</style>
