<script>
    import { fly, fade } from 'svelte/transition';
    import { onMount } from 'svelte';
    import { MonthlyBudgets } from '../../api/monthlybudgets';
    import {
        startDate,
        endDate,
        selectedMonth,
        selectedYear,
    } from '../stores/CurrentDateStore';
    import { createEventDispatcher } from 'svelte';
    let dispatch = createEventDispatcher();

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

    let monthNumbers = {
        January: '01',
        February: '02',
        March: '03',
        April: '04',
        May: '05',
        June: '06',
        July: '07',
        August: '08',
        September: '09',
        October: '10',
        November: '11',
        December: '12',
    };
    const day = date.getDay();
    const currentmonth = months[date.getMonth()];
    const year = date.getFullYear();

    let monthOptions = [];
    let option = {};
    let selectedBudget = months[$selectedMonth - 1] + ', ' + $selectedYear;

    const getBudgetOptions = () => {
        let totalMonthlyBudgets = MonthlyBudgets.find({}).fetch();
        totalMonthlyBudgets.forEach((monthlyBudget) => {
            option = {
                month: monthlyBudget.month,
                year: monthlyBudget.year,
            };
            if (
                monthOptions.some(
                    (monthOption) =>
                        monthOption.month === option.month &&
                        monthOption.year === option.year
                )
            ) {
                return;
            } else {
                monthOptions = [...monthOptions, option];
            }
        });
    };

    let pickerOpen = false;
    const togglePicker = () => {
        pickerOpen = true;
    };

    const collapse = () => {
        pickerOpen = false;
    };

    const changeMonth = () => {
        collapse();

        // setting the new month and year parameters
        let month = selectedBudget.split(', ')[0];
        const year = selectedBudget.split(', ')[1];
        month = monthNumbers[month];

        // changing lookup parameters for rest of app

        if ($selectedMonth !== currentmonth) {
            selectedMonth.set(month);
            selectedYear.set(year);
            startDate.set(`${year}-${month}-01`);
            endDate.set(`${year}-${month}-31`);
        } else {
            selectedMonth.set(month);
            selectedYear.set(year);
            startDate.set(`${year}-${month}-01`);
            endDate.set(`${year}-${month}-${day}`);
        }
        dispatch('recalculate');
    };

    onMount(() => {
        Meteor.subscribe('monthlybudgets', function () {
            getBudgetOptions();
        });
    });
</script>

<div class="date">
    <h4>
        {selectedBudget}
        <i class="angle down icon" on:click={togglePicker} />
    </h4>
    {#if pickerOpen === true}
        <div class="container" transition:fade={{ duration: 100 }}>
            <div class="background" on:click={collapse} />
            <div
                class="budget-options"
                transition:fly={{ duration: 200, y: 100 }}>
                <div class="months">
                    <form on:submit|preventDefault={changeMonth}>
                        <label for="months">Select month you'd like to view:
                        </label>
                        <select name="months" id="" bind:value={selectedBudget}>
                            {#each monthOptions as option}
                                <option value="{option.month}, {option.year}">
                                    {option.month},
                                    {option.year}
                                </option>
                            {/each}
                        </select>
                        <button>Select</button>
                    </form>
                </div>
            </div>
        </div>
    {:else}
        <div />
    {/if}
</div>

<style>
    .date {
        justify-self: end;
        align-self: center;
    }
    .date h4 {
        font-size: 16px;
        font-weight: 400;
    }

    .container {
        width: 100%;
        position: absolute;
        z-index: 10;
        height: 100vh;
        top: 0;
        left: 0;
    }

    .background {
        z-index: 500;
        height: 100vh;
        background: rgba(0, 0, 0, 0.5);
    }

    .budget-options {
        position: absolute;
        background: white;
        bottom: 0;
        padding: 20px 30px 15px 30px;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        width: calc(100% - 60px);
        height: 100px;
        text-align: center;
        z-index: 50;
    }

    button {
        width: 80%;
        height: 35px;
        border-radius: 10px;
        cursor: pointer;
        border: 0;
        box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.2);
        color: white;
        margin: 10px;
        background: green;
    }
</style>
