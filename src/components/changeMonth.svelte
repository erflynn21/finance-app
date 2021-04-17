<script>
    import Button from 'framework7-svelte/components/button.svelte';
    import ListInput from 'framework7-svelte/components/list-input.svelte';
    import { f7 } from 'framework7-svelte';
    import List from 'framework7-svelte/components/list.svelte';
    import { onDestroy, onMount, createEventDispatcher } from 'svelte';
    import Block from 'framework7-svelte/components/block.svelte';
    import {
        selectedMonthName,
        selectedYear,
        selectedMonth,
    } from '../stores/datesStore';
    import { monthsDict } from '../stores/dictionariesStore';
    import { allExpenses, expensesDatabaseName } from '../stores/expensesStore';
    import { openExpensesDatabase, setExpenses } from '../js/expenses';
    import { allIncomes, incomesDatabaseName } from '../stores/incomesStore';
    import { monthlyBudgetsDatabaseName } from '../stores/monthlyBudgetsStore';
    import { getAllDatabases } from '../js/databases';
    import { allDatabases } from '../stores/userStore';
    import { budgets } from '../stores/budgetsStore';
    import { setMonthlyBudgets } from '../js/budgets';
    import { openIncomesDatabase, setIncomes } from '../js/incomes';
    import { openMonthlyBudgetsDatabase } from '../js/monthlyBudgets';
    const dispatch = createEventDispatcher();

    const changeMonth = () => {
        // check to see if a month exists in the database already
        const databaseName =
            newSelectedYear + '-' + newSelectedMonth + '-monthlyBudgets';
        const result = $allDatabases.databases.filter(
            (database) => database.databaseName === databaseName
        );

        if (result.length === 0) {
            // if it doesn't, show a dialog asking if the user would like to create a budget for that month
            f7.dialog.confirm(
                `It seems like you don\'t have a budget set up for ${
                    monthsDict[newSelectedMonth - 1]
                }, ${newSelectedYear}. Would you like us to get one set up for you?`,
                '',
                () => {
                    switchMonths();
                }
            );
        } else {
            // if it does, just switch to that month
            switchMonths();
        }
    };

    const switchMonths = async () => {
        f7.dialog.preloader(
            `Switching to ${
                monthsDict[newSelectedMonth - 1]
            }, ${newSelectedYear}...`
        );
        // set new selected month, month name, year, and datbase names
        if (selectedYear !== new Date().getFullYear()) {
            selectedYear.set(Number(newSelectedYear));
            expensesDatabaseName.set(newSelectedYear + '-expenses');
            incomesDatabaseName.set(newSelectedYear + '-incomes');
        }
        selectedMonth.set(newSelectedMonth);
        selectedMonthName.set(monthsDict[newSelectedMonth - 1]);

        monthlyBudgetsDatabaseName.set(
            newSelectedYear + '-' + newSelectedMonth + '-monthlyBudgets'
        );

        // open the monthly budgets databases for the selected month
        await openMonthlyBudgetsDatabase();
        if (selectedYear !== new Date().getFullYear()) {
            await openExpensesDatabase();
            await openIncomesDatabase();
        }
        await setMonthlyBudgets($budgets);
        setExpenses($allExpenses);
        setIncomes($allIncomes);
        getAllDatabases();
        f7.dialog.close();
        dispatch('collapse');
    };

    let budgetMonth = `${$selectedMonthName}, ${$selectedYear}`;
    let newSelectedMonth, newSelectedYear;

    let pickerBudgetMonth;
    const initPicker = () => {
        pickerBudgetMonth = f7.picker.create({
            inputEl: '#pickerBudgetMonth',
            cols: [
                {
                    values: '0 1 2 3 4 5 6 7 8 9 10 11'.split(' '),
                    displayValues: 'January February March April May June July August September October November December'.split(
                        ' '
                    ),
                    textAlign: 'left',
                },
                {
                    values: (function createValues() {
                        const arr = [];
                        for (let i = 2021; i <= 2030; i += 1) {
                            arr.push(i);
                        }
                        return arr;
                    })(),
                },
            ],
            on: {
                open: function (value) {
                    pickerBudgetMonth.setValue([
                        String($selectedMonth - 1),
                        String($selectedYear),
                    ]);
                },
                change: function (values) {
                    budgetMonth =
                        monthsDict[values.value[0]] + ', ' + values.value[1];
                    newSelectedMonth = Number(values.value[0]) + 1;
                    // if (newSelectedMonth <= 10) {
                    //     newSelectedMonth = newSelectedMonth;
                    // }
                    newSelectedYear = values.value[1];
                },
            },
        });
    };

    onMount(() => {
        initPicker();
    });

    onDestroy(() => {
        pickerBudgetMonth.destroy();
    });
</script>

<Block>
    <List>
        <ListInput
            outline
            floatingLabel
            label="Select Month"
            readonly
            bind:value={budgetMonth}
            inputId="pickerBudgetMonth"
        />
    </List>
    <Button on:click={changeMonth}>Change Month</Button>
</Block>
