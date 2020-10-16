<script>
    import AddExpenseForm from './AddExpenseForm.svelte';
    import AddIncomeForm from './AddIncomeForm.svelte';
    import { fly, fade } from 'svelte/transition';
    import { createEventDispatcher, onMount } from 'svelte';
    import AddBudgetForm from './AddBudgetForm.svelte';
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

    let active = 'expense';
</script>

<div class="container" transition:fade={{ duration: 100 }} style="height: {vh}">
    <div class="background" on:click={dispatchCollapse} />
    <div class="forms" transition:fly={{ duration: 200, y: 100 }}>
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
                <li
                    on:click={() => (active = 'budget')}
                    class:active={active === 'budget'}>
                    Budget
                </li>
            </ul>
        </div>
        <div class="border" />
        {#if active === 'expense'}
            <!-- Form to add expenses-->
            <AddExpenseForm on:collapse />
        {:else if active === 'income'}
            <!-- Form to add incomes -->
            <AddIncomeForm on:collapse />
        {:else}
            <!-- Form to add budget -->
            <AddBudgetForm on:collapse />
        {/if}
    </div>
</div>

<style>
    .container {
        width: 100%;
        position: absolute;
        z-index: 3;
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

    li {
        list-style-type: none;
    }
</style>
