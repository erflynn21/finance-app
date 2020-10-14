<script>
    import { Meteor } from 'meteor/meteor';
    import { afterUpdate } from 'svelte';
    import Income from '../components/Income.svelte';
    import { incomesStore } from '../stores/IncomesStore';
    import { monthlyIncomesStore } from '../stores/MonthlyIncomesStore';
    import { userCurrency } from '../stores/UserCurrencyStore';

    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    // check whether or not a recurring income is already in the incomes db for this month
    async function checkrecurringincomes() {
        let recurringIncomes = $monthlyIncomesStore;
        let incomesList = $incomesStore;

        recurringIncomes.forEach(async (recurringIncome) => {
            let incomedate = `${year}-${month}-${recurringIncome.recurringdate}`;
            newIncomeFromRecurring = {
                title: recurringIncome.title,
                amount: recurringIncome.amount,
                category: recurringIncome.category,
                date: incomedate,
                currency: recurringIncome.currency,
                originalAmount: recurringIncome.originalAmount,
                originalCurrency: recurringIncome.originalCurrency,
            };
            const result = incomesList.find(
                (item) => item.title === recurringIncome.title
            );
            if (result === undefined) {
                if (newIncomeFromRecurring.amount === null) {
                    await (async () => {
                        newIncomeFromRecurring.amount =
                            newIncomeFromRecurring.originalAmount;
                        newIncomeFromRecurring.currency =
                            newIncomeFromRecurring.originalCurrency;
                        let url = `https://api.exchangeratesapi.io/${newIncomeFromRecurring.date}?base=${$userCurrency}&symbols=${newIncomeFromRecurring.originalCurrency}`;
                        let response = await fetch(url);
                        let data = await response.json();
                        let rates = JSON.stringify(data.rates);
                        let exchangeRate = Number(
                            rates.replace(/[^\d.-]/g, '')
                        );
                        newIncomeFromRecurring.amount = Number(
                            (
                                newIncomeFromRecurring.originalAmount /
                                exchangeRate
                            ).toFixed(2)
                        );
                        newIncomeFromRecurring.currency = $userCurrency;
                    })();
                }
                Meteor.call('incomes.insert', newIncomeFromRecurring);
            } else {
                return;
            }
        });
    }

    afterUpdate(() => {
        checkrecurringincomes();
    });
</script>

<div>
    <!-- List of incomes -->
    {#each $incomesStore as income (income._id)}
        <Income {income} on:delete on:incomeEdited />
    {/each}
</div>
