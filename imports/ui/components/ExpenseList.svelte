<script>
    import { Meteor } from 'meteor/meteor';
    import { onMount } from 'svelte';
    import { useTracker } from 'meteor/rdb:svelte-meteor-data';
    import { Expenses } from '../../api/expenses';
    import { MonthlyExpenses } from '../../api/monthlyexpenses';
    import Expense from '../components/Expense.svelte';
    import { startDate, endDate } from '../stores/CurrentDateStore';
    import { userCurrency } from '../stores/UserCurrencyStore';
    import { createEventDispatcher } from 'svelte';
    let dispatch = createEventDispatcher();

    $: expenses = useTracker(() =>
        Expenses.find(
            {
                date: { $gte: $startDate, $lte: $endDate },
            },
            { sort: { date: -1 } }
        ).fetch()
    );

    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    // check whether or not a recurring expense is already in the expenses db for this month
    async function checkrecurringexpenses() {
        let recurringExpenses = MonthlyExpenses.find({}).fetch();
        let expensesList = Expenses.find({
            date: { $gte: $startDate, $lte: $endDate },
        }).fetch();

        recurringExpenses.forEach(async (recurringExpense) => {
            let expensedate = `${year}-${month}-${recurringExpense.recurringdate}`;
            newExpenseFromRecurring = {
                title: recurringExpense.title,
                amount: recurringExpense.amount,
                category: recurringExpense.category,
                date: expensedate,
                currency: recurringExpense.currency,
                originalAmount: recurringExpense.originalAmount,
                originalCurrency: recurringExpense.originalCurrency,
            };
            const result = expensesList.find(
                (item) => item.title === recurringExpense.title
            );
            if (result === undefined) {
                if (newExpenseFromRecurring.amount === null) {
                    // console.log('got here');
                    // await convertAmount();
                    await (async () => {
                        newExpenseFromRecurring.amount =
                            newExpenseFromRecurring.originalAmount;
                        newExpenseFromRecurring.currency =
                            newExpenseFromRecurring.originalCurrency;
                        let url = `https://api.exchangeratesapi.io/${newExpenseFromRecurring.date}?base=${$userCurrency}&symbols=${newExpenseFromRecurring.originalCurrency}`;
                        let response = await fetch(url);
                        let data = await response.json();
                        let rates = JSON.stringify(data.rates);
                        let exchangeRate = Number(
                            rates.replace(/[^\d.-]/g, '')
                        );
                        newExpenseFromRecurring.amount = Number(
                            (
                                newExpenseFromRecurring.originalAmount /
                                exchangeRate
                            ).toFixed(2)
                        );
                        newExpenseFromRecurring.currency = $userCurrency;
                    })();
                }
                Meteor.call('expenses.insert', newExpenseFromRecurring);
            } else {
                return;
            }
        });
    }

    const dispatchCalc = () => {
        dispatch('calculateExpenses');
    };

    onMount(() => {
        Meteor.subscribe('expenses');
        Meteor.subscribe('monthlyexpenses', function () {
            checkrecurringexpenses();
        });
    });
</script>

<div>
    <!-- List of expenses -->
    {#each $expenses as expense (expense._id)}
        {#each [dispatchCalc(expense)] as expense}
            <div />
        {/each}
        <Expense {expense} on:delete on:expenseEdited />
    {/each}
</div>
