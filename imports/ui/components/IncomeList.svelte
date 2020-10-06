<script>
    import { Meteor } from 'meteor/meteor';
    import { onMount } from 'svelte';
    import { useTracker } from 'meteor/rdb:svelte-meteor-data';
    import { Incomes } from '../../api/incomes';
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

    const dispatchCalc = () => {
        dispatch('calculateIncomes');
    };

    onMount(() => {
        Meteor.subscribe('incomes');
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
