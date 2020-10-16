<script>
    import { fly, fade } from 'svelte/transition';
    export let month;
    export let year;
    export let expense;
    export let income;
    export let monthlyBudget;
    export let budget;
    export let monthlyexpense;
    export let monthlyincome;
    import { createEventDispatcher, onMount } from 'svelte';
    import UpdateExpenseForm from '../components/UpdateExpenseForm.svelte';
    import UpdateIncomeForm from '../components/UpdateIncomeForm.svelte';
    import UpdateMonthlyBudgetForm from '../components/UpdateMonthlyBudgetForm.svelte';
    import UpdateBudgetForm from '../components/UpdateBudgetForm.svelte';
    import UpdateMonthlyExpenseForm from '../components/UpdateMonthlyExpenseForm.svelte';
    import UpdateMonthlyIncomeForm from '../components/UpdateMonthlyIncomeForm.svelte';
    let dispatch = createEventDispatcher();

    const dispatchCollapse = () => {
        dispatch('collapse');
    };

    let vh = 0;
    const setHeight = () => {
        vh = window.innerHeight * 1 - 51 + 'px';
        console.log(vh);
    };

    window.addEventListener('resize', () => {
        setHeight();
    });

    onMount(() => {
        setHeight();
    });
</script>

<div class="container" transition:fade={{ duration: 100 }} style="height: {vh}">
    <div class="background" on:click={dispatchCollapse} />
    <div class="edit" transition:fly={{ duration: 200, y: 100 }}>
        {#if expense != undefined}
            <UpdateExpenseForm {expense} on:collapse />
        {:else if income != undefined}
            <UpdateIncomeForm {income} on:collapse on:incomeEdited />
        {:else if monthlyBudget != undefined}
            <UpdateMonthlyBudgetForm
                {monthlyBudget}
                on:collapse
                on:updateBudgets
                {month}
                {year} />
        {:else if budget != undefined}
            <UpdateBudgetForm {budget} on:collapse on:recalculateBudgets />
        {:else if monthlyexpense != undefined}
            <UpdateMonthlyExpenseForm {monthlyexpense} on:collapse />
        {:else if monthlyincome != undefined}
            <UpdateMonthlyIncomeForm {monthlyincome} on:collapse />
        {/if}
    </div>
</div>

<style>
    .container {
        width: 100%;
        position: absolute;
        z-index: 3;
        height: 100vh;
        top: 0;
        left: 0;
    }

    .background {
        height: 100vh;
        background: rgba(0, 0, 0, 0.5);
    }

    .edit {
        position: absolute;
        background: white;
        bottom: 0;
        padding: 20px 30px 15px 30px;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        width: calc(100% - 60px);
    }
</style>
