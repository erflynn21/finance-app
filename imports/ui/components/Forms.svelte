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
            <ul>
                <li
                    on:click={() => (active = 'expense')}
                    class:active={active === 'expense'}>
                    Expense
                </li>

                <li
                    on:click={() => (active = 'income')}
                    class:active={active === 'income'}>
                    Income
                </li>
            </ul>
        </div>
        <div class="border" />
        {#if active === 'expense'}
            <!-- Form to add expenses-->
            <AddExpenseForm on:collapse on:recalculateExpenses />
        {:else}
            <!-- Form to add incomes -->
            <AddIncomeForm on:collapse />
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

    .selector {
        text-align: center;
        margin-bottom: 10px;
        width: 100%;
    }

    .border {
        border: 1px solid #f2f2f2;
    }

    .selector ul {
        cursor: pointer;
        margin: 0 10px;
        padding: 5px;
        border-radius: 5px;
        display: flex;
        justify-content: center;
    }

    .selector ul li {
        margin: 0 15px;
        font-size: 18px;
    }

    .active {
        color: green;
        border-bottom: 1px solid green;
        padding-bottom: 5px;
    }

    .forms {
        position: absolute;
        background: white;
        bottom: 0;
        padding: 20px 30px 15px 30px;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        width: calc(100% - 60px);
    }
</style>
