<script>
    import MonthlyBudgetCategory from './MonthlyBudgetCategory.svelte';
    import {
        expenseSumStore,
        budgetSumStore,
        userCurrencySymbol,
        selectedMonth,
        selectedYear,
        monthlyBudgetsStore,
        baseBudgetsStore,
    } from '../stores/stores';
    import Heading from '../shared/Heading.svelte';
    import { tweened } from 'svelte/motion';
    import ListItem from '../shared/ListItem.svelte';

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
</script>

<div class="monthly-overview">
    <Heading>Budget</Heading>

    <div class="budget-summary">
        <ListItem>
            <div class="grid row-one">
                <div class="budget">
                    <h4>{months[$selectedMonth - 1]} {$selectedYear}</h4>
                </div>
                <div class="amount-summary">
                    {$userCurrencySymbol}{$expenseSumStore}
                    of
                    {$userCurrencySymbol}{$budgetSumStore}
                </div>
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
                    <span>{percentage}%</span>
                </div>
            </div>
        </ListItem>
    </div>

    <div class="budget-list">
        {#if month === months[$selectedMonth - 1]}
            {#each $baseBudgetsStore as budget (budget._id)}
                <MonthlyBudgetCategory {budget} {month} {year} />
            {/each}
        {:else}
            {#each $monthlyBudgetsStore as budget (budget._id)}
                <MonthlyBudgetCategory {budget} {month} {year} />
            {/each}
        {/if}
    </div>
</div>

<style>
    .monthly-overview {
        margin-bottom: 60px;
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
        grid-template-columns: 0.75fr 1fr;
        margin-bottom: 5px;
    }

    .amount-summary {
        justify-self: end;
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
</style>
