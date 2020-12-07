<script>
    import { Page } from 'framework7-svelte';
    import ListItemCell from 'framework7-svelte/components/list-item-cell.svelte';
    import ListItemRow from 'framework7-svelte/components/list-item-row.svelte';
    import List from 'framework7-svelte/components/list.svelte';
    import SkeletonBlock from 'framework7-svelte/components/skeleton-block.svelte';
</script>

<Page name="loading screen">
    <div class="overview-spacer" />
    <div class="background" />
    <div class="heading">
        <h1>Overview</h1>
    </div>
    <List inset class="skeleton-text skeleton-effect-pulse overview-list">
        <div class="item-content">
            <div class="item-inner item-cell">
                <ListItemRow class="overview-grid">
                    <ListItemCell>
                        <h3>placeholder</h3>
                    </ListItemCell>
                    <ListItemCell>
                        <div class="date-picker">
                            <div class="dropdown" />
                            date picker
                        </div>
                    </ListItemCell>
                </ListItemRow>
                <ListItemRow>
                    <div class="grid">
                        <div class="percentage">Lorem ipsum dolor sit amet</div>
                    </div>
                </ListItemRow>
            </div>
        </div>
    </List>

    <List class="skeleton-text skeleton-effect-pulse overview-list" inset>
        <div class="item-content">
            <div class="item-inner item-cell">
                <ListItemRow>
                    <h3>CASH FLOW</h3>
                </ListItemRow>
                <div class="grid cash-flow-summary">
                    <div class="exp-inc">
                        <h5>placeholder</h5>
                        <h5>placeholder</h5>
                    </div>
                    <div class="cash-flow-sum">placeholder</div>
                </div>
            </div>
        </div>
    </List>

    <List class="skeleton-text skeleton-effect-pulse overview-list" inset>
        <div class="item-content">
            <div class="item-inner item-cell">
                <ListItemRow>
                    <h3>SPENDING</h3>
                </ListItemRow>
                <div class="doughnut">
                    <SkeletonBlock
                        style="width: 300px; height: 300px; border-radius: 50%; text-align-center" />
                </div>
            </div>
        </div>
    </List>
</Page>

<style>
    .background {
        width: 100vw;
        box-shadow: 0 2px 2px -2px gray;
        background-color: green;
        margin-bottom: 2px;
        position: fixed;
        top: 0;
        z-index: 0;
        height: calc(env(safe-area-inset-top) + 140px);
    }

    .overview-spacer {
        height: calc(env(safe-area-inset-top) + 80px);
        width: 100vw;
        background: transparent;
    }
    .heading {
        padding-top: 10px;
        padding-bottom: 10px;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 2;
        height: calc(env(safe-area-inset-top) + 55px);
        width: 100vw;
        background: green;
    }

    .heading h1 {
        font-size: 30px;
        font-weight: 400;
        width: 100vw;
        color: white;
        padding-left: 20px;
        padding-top: calc(env(safe-area-inset-top) + 15px);
    }

    .grid {
        display: grid;
        grid-template-columns: 1fr 0.1fr;
        width: 100%;
        height: 25px;
        margin-top: 10px;
    }

    .percentage {
        grid-column: 1/3;
        width: 100%;
        position: relative;
        background-color: lightgray;
        box-sizing: border-box;
        border-radius: 5px;
        display: flex;
        align-items: center;
    }
    /*     
    span {
        position: absolute;
        color: white;
        padding-left: 5px;
        font-size: 14px;
    }

    .percent {
        height: 100%;
        position: absolute;
        box-sizing: border-box;
        background-color: green;
        border-radius: 5px;
        max-width: 100%;
    } */

    h3 {
        font-size: 20px;
        font-weight: 400;
    }

    .cash-flow-summary {
        display: grid;
        grid-template-columns: 1fr 1fr;
        height: auto;
    }

    .exp-inc {
        padding-left: 5px;
    }

    .exp-inc h5 {
        font-size: 16px;
        font-weight: 300;
        margin-bottom: 5px;
        color: gray;
    }

    .cash-flow-sum {
        justify-self: end;
        align-self: center;
    }

    /* .cash-flow-sum h4 {
        font-size: 18px;
        font-weight: 500;
    } */

    .date-picker {
        display: flex;
        justify-content: flex-end;
    }

    .dropdown {
        margin-left: 5px;
    }
</style>
