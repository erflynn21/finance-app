<div class="heading">
    <h1>
        <slot />
    </h1>
</div>

<style>
    .heading {
        width: 100%;
        display: flex;
        box-shadow: 0 2px 2px -2px gray;
        align-items: center;
        justify-content: center;
        padding-top: 10px;
        padding-bottom: 10px;
        padding-right: 15px;
        background-color: #9ccc65;
    }

    .heading h1 {
        font-size: 18px;
        font-weight: 400;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
    }
</style>
