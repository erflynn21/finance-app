<script>
    import { Meteor } from 'meteor/meteor';
    import { afterUpdate } from 'svelte';
    import Expense from '../components/Expense.svelte';
    import { userCurrency } from '../stores/UserCurrencyStore';
    import { expensesStore } from '../stores/ExpensesStore';
    import { monthlyExpensesStore } from '../stores/MonthlyExpensesStore';

    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    // check whether or not a recurring expense is already in the expenses db for this month
    async function checkrecurringexpenses() {
        let recurringExpenses = $monthlyExpensesStore;
        let expensesList = $expensesStore;

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

    afterUpdate(() => {
        checkrecurringexpenses();
    });
</script>

<div>
    <!-- List of expenses -->
    {#each $expensesStore as expense (expense._id)}
        <Expense {expense} on:delete on:expenseEdited />
    {/each}
</div>
