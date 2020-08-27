<script>
    import { useTracker } from 'meteor/rdb:svelte-meteor-data';
    import { Incomes } from '../../api/incomes';
    import Income from '../components/Income.svelte';

    $: incomes = useTracker(() =>
        Incomes.find({}, { sort: { date: -1 } }).fetch()
    );

    $: incomeSum = totalIncomes.reduce(function (a, b) {
        return a + b;
    }, 0);

    $: totalIncomes = [];
    let totalIncomesIDs = [];
    const calculateTotal = (income) => {
        if (totalIncomesIDs.includes(income._id) === false) {
            totalIncomesIDs = [...totalIncomesIDs, income._id];
            totalIncomes = [...totalIncomes, income.amount];
        }
    };

    const deleteIncomeFromTotal = (income) => {
        const index = totalIncomesIDs.indexOf(income.detail._id);
        totalIncomes.splice(index, 1);
        totalIncomes = totalIncomes;
    };
</script>

<div>
    <h1>Incomes:</h1>
    <!-- List of incomes -->
    {#each $incomes.map(calculateTotal) as income}
        <div />
    {/each}
    {#each $incomes as income (income._id)}
        <Income {income} on:delete={deleteIncomeFromTotal} />
    {/each}
    <h3>Total Income: {incomeSum}</h3>
</div>
