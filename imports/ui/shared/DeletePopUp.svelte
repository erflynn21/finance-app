<script>
    import { fly, fade } from 'svelte/transition';
    import { createEventDispatcher } from 'svelte';
    let dispatch = createEventDispatcher();

    const dispatchDelete = () => {
        dispatch('delete');
    };

    const dispatchCollapse = () => {
        dispatch('collapse');
    };
</script>

<div class="container" transition:fade={{ duration: 100 }}>
    <div class="background" on:click={dispatchCollapse} />
    <div class="delete" transition:fly={{ y: 100 }}>
        <p>Are you sure you want to delete this? This cannot be undone.</p>
        <button class="no" on:click={dispatchCollapse}>No</button>
        <button class="yes" on:click={dispatchDelete}>Yes</button>
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

    .delete {
        position: absolute;
        background: white;
        bottom: 0;
        padding: 20px 30px 15px 30px;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        width: calc(100% - 60px);
        height: 100px;
        text-align: center;
    }

    button {
        width: 30%;
        justify-self: center;
        height: 35px;
        grid-column: 1/3;
        border-radius: 10px;
        cursor: pointer;
        border: 0;
        box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.2);
        color: white;
        margin: 10px;
    }

    .yes {
        background: green;
    }

    .no {
        background: red;
    }
</style>
