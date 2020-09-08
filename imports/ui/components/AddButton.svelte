<script>
    import Forms from './Forms.svelte';
</script>

<div class="act-btn">
    <div class="forms">
        <Forms />
    </div>
    <input type="checkbox" id="toggle" />
    <label class="button" for="toggle" />
</div>

<style>
    .act-btn {
        position: absolute;
        bottom: 60px;
        right: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2;
    }

    #toggle {
        -webkit-appearance: none;
    }

    .button {
        width: 50px;
        height: 50px;
        background: green;
        border-radius: 100%;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .button:before {
        position: absolute;
        content: '';
        width: 20px;
        height: 2px;
        background: #fff;
        transform: rotate(90deg);
        transition: all 0.4s ease;
    }

    .button:after {
        position: absolute;
        content: '';
        width: 20px;
        height: 2px;
        background: #fff;
        transition: all 0.4s ease;
    }

    .forms {
        opacity: 1;
        /* display: none; */
        transition: all 0.4s ease-in-out;
        width: 100%;
        background: white;
        transform: translateX(0%);
        position: absolute;
        bottom: 100px;
    }
</style>
