<script>
    import { useTracker } from 'meteor/rdb:svelte-meteor-data';
    import { Incomes } from '../../api/incomes';
    import Income from '../components/Income.svelte';

    $: incomes = useTracker(() =>
        Incomes.find({}, { sort: { date: -1 } }).fetch()
    );
</script>

<div>
    <h1>Incomes:</h1>
    <!-- List of incomes -->
    {#each $incomes as income (income._id)}
        <Income {income} />
    {/each}
    <h3>Total Income:</h3>
</div>
