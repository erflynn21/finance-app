<script>
    import AddExpenseForm from './AddExpenseForm.svelte';
    import AddIncomeForm from './AddIncomeForm.svelte';
    import { createEventDispatcher } from 'svelte';
    let dispatch = createEventDispatcher();

    const dispatchCollapse = () => {
        dispatch('collapse');
    };

    let active = 'expense';
</script>

<div class="container">
    <div class="background" on:click={dispatchCollapse} />
    <div class="forms">
        <div class="selector">
            <button on:click={() => (active = 'expense')}>Expense</button>
            <button on:click={() => (active = 'income')}>Income</button>
        </div>
        {#if active === 'expense'}
            <!-- Form to add expenses-->
            <AddExpenseForm />
        {:else}
            <!-- Form to add incomes -->
            <AddIncomeForm />
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
        height: calc(100vh - 100px);
        background: rgba(0, 0, 0, 0.5);
    }

    .forms {
        position: absolute;
        background: white;
        bottom: 0;
        padding: 20px 20px 50px 20px;
        border-radius: 10px;
        height: 120px;
    }
</style>
