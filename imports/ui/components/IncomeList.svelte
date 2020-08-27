<script>
    import { useTracker } from 'meteor/rdb:svelte-meteor-data';
    import { Incomes } from '../../api/incomes';
    import Income from '../components/Income.svelte';
    import { createEventDispatcher } from 'svelte';
    let dispatch = createEventDispatcher();

    $: incomes = useTracker(() =>
        Incomes.find({}, { sort: { date: -1 } }).fetch()
    );

    $: totalIncomes = [];
    let totalIncomesIDs = [];
    const calculateTotal = (income) => {
        if (totalIncomesIDs.includes(income._id) === false) {
            totalIncomesIDs = [...totalIncomesIDs, income._id];
            totalIncomes = [...totalIncomes, income.amount];
        }
        dispatch('recalculateIncome', { data: totalIncomes });
    };

    const deleteIncomeFromTotal = (income) => {
        const index = totalIncomesIDs.indexOf(income.detail._id);
        totalIncomes.splice(index, 1);
        totalIncomes = totalIncomes;
        dispatch('recalculateIncome', { data: totalIncomes });
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
</div>
