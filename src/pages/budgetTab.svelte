<script>
    import { Page, Navbar } from 'framework7-svelte';
    import ListItemCell from 'framework7-svelte/components/list-item-cell.svelte';
    import ListItemRow from 'framework7-svelte/components/list-item-row.svelte';
    import List from 'framework7-svelte/components/list.svelte';
    import { baseCurrencySymbol } from '../stores/currenciesStore';
    import { selectedMonthName, selectedYear } from '../stores/datesStore';
    import { expensesSum } from '../stores/expensesStore';
    import { tweened } from 'svelte/motion';
    import {
        monthlyBudgets,
        monthlyBudgetsSum,
    } from '../stores/monthlyBudgetsStore';
    import MonthlyBudgetCategory from '../components/monthlyBudgetCategory.svelte';
    import { fade } from 'svelte/transition';
    import { flip } from 'svelte/animate';

    // percentage and tweened values
    $: percentage = Math.floor((100 / $monthlyBudgetsSum) * $expensesSum) || 0;
    const tweenedPercentage = tweened(0);
    $: tweenedPercentage.set(percentage);
</script>

<Page name="budget">
    <Navbar title="Budget" />
    <List class="budget-summary-list">
        <div class="item-content">
            <div class="item-inner item-cell">
                <ListItemRow class="budget-summary-grid">
                    <ListItemCell>
                        <h4>{$selectedMonthName} {$selectedYear}</h4>
                    </ListItemCell>
                    <ListItemCell>
                        {$baseCurrencySymbol}{$expensesSum}
                        of
                        {$baseCurrencySymbol}{$monthlyBudgetsSum}
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

    <h3>Categories</h3>

    {#each $monthlyBudgets as { item, itemId } (itemId)}
        <div out:fade|local animate:flip={{ duration: 400 }}>
            <MonthlyBudgetCategory {item} {itemId} />
        </div>
    {/each}

    <div class="spacer" />
</Page>

<style>
    :global(.budget-summary-grid) {
        display: grid;
        grid-template-columns: 1fr 1fr;
    }

    :global(.budget-summary-grid .item-cell:first-child) {
        justify-self: start;
        width: 75%;
    }

    :global(.budget-summary-grid .item-cell:last-child) {
        text-align: right;
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

    .spacer {
        height: 65px;
    }

    h3 {
        font-size: 14px;
        color: black;
        font-weight: 400;
        text-align: center;
        margin: 10px 0 10px 0;
    }
</style>
