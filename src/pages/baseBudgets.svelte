<script>
    import {
        Page,
        Navbar,
        Block,
        List,
        ListItem,
        Button,
        Popup,
        NavRight,
        Link,
    } from 'framework7-svelte';
    import AddBaseBudget from '../components/addBaseBudget.svelte';
    import { formatAmount } from '../js/currencies';
    import { baseBudgets } from '../stores/baseBudgetsStore';
</script>

<Page name="baseBudgets" noToolbar>
    <Navbar title="Budgets" backLink="Back" />
    <Block class="text-align-center description">
        Below are the budgets that will be automatically regenerated every month
        to create your monthly budget. You can adjust the amounts and categories
        of each budget and it will be reflected moving forward.
    </Block>
    <Block class="text-align-center description">
        Note: Updating a budget category will not update the current month's
        budget category or previous month's, only those generated in the future.
    </Block>
    <List class="budgets">
        {#each $baseBudgets as { item, itemId } (itemId)}
            <ListItem
                title={item.title}
                after={formatAmount(item.amount, item.currency)}
            />
            <!-- <div animate:flip={{ duration: 400 }}>
                <SettingsSwiper {item} {itemId} type="budget" />
            </div> -->
        {/each}
    </List>

    <Button popupOpen=".add-budget">Add Budget</Button>

    <Popup class="add-budget">
        <Page>
            <Navbar title="Add Budget">
                <NavRight>
                    <Link popupClose>Close</Link>
                </NavRight>
            </Navbar>
            <AddBaseBudget />
        </Page>
    </Popup>
</Page>
