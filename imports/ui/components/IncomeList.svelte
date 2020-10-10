<script>
    import { Meteor } from 'meteor/meteor';
    import { onMount } from 'svelte';
    import { useTracker } from 'meteor/rdb:svelte-meteor-data';
    import { Incomes } from '../../api/incomes';
    import { MonthlyIncomes } from '../../api/monthlyincomes';
    import Income from '../components/Income.svelte';
    import { startDate, endDate } from '../stores/CurrentDateStore';
    import { createEventDispatcher } from 'svelte';
    let dispatch = createEventDispatcher();

    $: incomes = useTracker(() =>
        Incomes.find(
            { date: { $gte: $startDate, $lte: $endDate } },
            { sort: { date: -1 } }
        ).fetch()
    );

    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    // check whether or not a recurring income is already in the expenses db for this month
    const checkrecurringincomes = () => {
        let recurringIncomes = MonthlyIncomes.find({}).fetch();
        let incomesList = Incomes.find({
            date: { $gte: $startDate, $lte: $endDate },
        }).fetch();

        recurringIncomes.forEach((recurringIncome) => {
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
                Meteor.call('incomes.insert', newIncomeFromRecurring);
            } else {
                return;
            }
        });
    };

    const dispatchCalc = () => {
        dispatch('calculateIncomes');
    };

    onMount(() => {
        Meteor.subscribe('incomes');
        Meteor.subscribe('monthlyincomes', function () {
            checkrecurringincomes();
        });
    });
</script>

<div>
    <!-- List of incomes -->
    {#each $incomes as income (income._id)}
        {#each [dispatchCalc(income)] as income}
            <div />
        {/each}
        <Income {income} on:delete on:incomeEdited />
    {/each}
</div>
