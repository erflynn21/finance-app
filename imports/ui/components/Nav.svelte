<script>
    import { BlazeTemplate } from 'meteor/svelte:blaze-integration';
    let current = 'overview';
</script>

<div class="login">
    <BlazeTemplate template="loginButtons" />
</div>

<div class="bottom-nav-container">
    <div class="tab-nav-container">
        <button>
            <div
                class="tab {current === 'overview' ? 'active' : ''}"
                on:click={() => (current = 'overview')}>
                <img src="/img/overview.svg" alt="" />
                <p>Overview</p>
            </div>
        </button>
        <button>
            <div
                class="tab {current === 'budget' ? 'active' : ''}"
                on:click={() => (current = 'budget')}>
                <img src="/img/budget.svg" alt="" />
                <p>Budget</p>
            </div>
        </button>
        <button>
            <div
                class="tab {current === 'summary' ? 'active' : ''}"
                on:click={() => (current = 'summary')}>
                <img src="/img/wallet.svg" alt="" />
                <p>Summary</p>
            </div>
        </button>
        <button>
            <div
                class="tab {current === 'settings' ? 'active' : ''}"
                on:click={() => (current = 'settings')}>
                <img src="/img/settings.svg" alt="" />
                <p>Settings</p>
            </div>
        </button>
    </div>
</div>

<style>
    .bottom-nav-container {
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        text-align: center;
        margin: 0;
        bottom: 0;
        position: sticky;
        border-top: 1px;
        width: 100%;
    }

    .tab-nav-container {
        display: flex;
        justify-content: space-between;
        padding: 10px 50px 10px 50px;
        width: 500px;
    }

    .tab {
        background-color: #ffffff;
        border-radius: 50px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 30px;
    }

    .tab img {
        height: 30px;
    }

    .tab p {
        font-weight: bold;
        overflow: hidden;
        max-width: 0;
    }

    .tab.active p {
        margin-left: 10px;
        max-width: 200px;
        transition: max-width 0.4s linear;
    }
    button,
    button:active,
    button:visited,
    button:enabled,
    button:focus {
        margin: 0;
        padding: 0;
        border: 0;
        background: transparent;
        outline: 0;
    }
</style>
