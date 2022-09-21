<script>
    export let item;
    // export let itemId;
    import { ListItem } from 'framework7-svelte';
    import { formatAmount } from '../js/currencies';
    import { budgetCurrency } from '../stores/currenciesStore';

    let icon = '';
    let color = '';

    if (item.type === 'Expense') {
        icon = 'minus_circle';
        color = 'red';
    } else if (item.type === 'Income') {
        icon = 'plus_circle';
        color = 'green';
    } else if (item.type === 'Savings') {
        icon = 'arrow_down';
        color = 'green';
    } else if (item.type === 'Investment') {
        icon = 'graph_circle';
        color = 'green';
    }
</script>

<ListItem
    header={new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        weekday: 'long',
    }).format(new Date(item.date))}
    title={item.title}
    after={formatAmount(item.amount, $budgetCurrency)}
>
    <i slot="media" class="icon f7-icons" style:color>{icon}</i>
</ListItem>
