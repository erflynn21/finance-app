<div class="heading">
    <h1>
        <slot />
    </h1>
</div>
<div class="spacer" />

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
        background-color: green;
        margin-bottom: 2px;
        position: fixed;
        top: 0;
        z-index: 2;
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

    .spacer {
        height: 41px;
    }
</style>
