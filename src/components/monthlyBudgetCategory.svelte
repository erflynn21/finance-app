<script>
    export let item;
    // export let itemId;
    import ListItemCell from 'framework7-svelte/components/list-item-cell.svelte';
    import ListItemRow from 'framework7-svelte/components/list-item-row.svelte';
    import List from 'framework7-svelte/components/list.svelte';
    import { budgetsSum } from '../stores/budgetsStore';
    import { baseCurrencySymbol } from '../stores/currenciesStore';
    import { expenses, expensesSum } from '../stores/expensesStore';
    import { tweened } from 'svelte/motion';
    import { afterUpdate } from 'svelte';

    // sets expenses sum for each category
    $: categorySum = 0;
    const calcCategoryExpenses = () => {
        let categoryExpenses = [];
        $expenses.forEach((expense) => {
            if (expense.item.category === item.category) {
                categoryExpenses = [...categoryExpenses, expense.item.amount];
                // console.log(categoryExpenses);
            }
            categorySum = categoryExpenses.reduce(function (a, b) {
                const sum = a + b;
                const trimmed = Number(sum.toFixed(2));
                return trimmed;
            }, 0);
        });
    };

    $: if ($expenses) calcCategoryExpenses();

    // percentage and tweened values
    $: percentage = Math.floor((100 / item.amount) * categorySum) || 0;
    const tweenedPercentage = tweened(0);
    $: tweenedPercentage.set(percentage);
</script>

<List class="monthly-budget-list">
    <div class="item-content">
        <div class="item-inner item-cell">
            <ListItemRow class="budget-summary-grid">
                <ListItemCell>
                    <h4>{item.category}</h4>
                </ListItemCell>
                <ListItemCell>
                    {$baseCurrencySymbol}{categorySum}
                    of
                    {$baseCurrencySymbol}{item.amount}
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
            </ListItemRow>
        </div>
    </div>
</List>

<style>
    .grid {
        display: grid;
        grid-template-columns: 1fr 0.1fr;
        width: 100%;
        height: 25px;
        margin-top: 10px;
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
