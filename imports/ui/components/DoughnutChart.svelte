<script>
    import Chart from 'chart.js';
    import { afterUpdate, onMount } from 'svelte';
    import { Expenses } from '../../api/expenses';
    import { MonthlyBudgets } from '../../api/monthlybudgets';

    $: categoryLabels = [];

    $: categoryExpenses = [];

    $: categoryColors = [
        '#f44336',
        '#9c27b0',
        '#2196f3',
        '#00695f',
        '#ffeb3b',
        '#ff9800',
        '#e91e63',
        '#673ab7',
        '#00bcd4',
        '#ffc107',
        '#2c387e',
        '#4caf50',
        '#ff5722',
        '#03a9f4',
        '#cddc39',
        '#8bc34a',
        '#aa2e25',
        '#6d1b7b',
        '#1769aa',
        '#00695f',
        '#b1a429',
        '#b26a00',
        '#a31545',
        '#482880',
        '#008394',
        '#b28704',
        '#2c387e',
        '#357a38',
        '#b23c17',
        '#0276aa',
        '#8f9a27',
        '#618833',
        '#f6685e',
        '#af52bf',
        '#4dabf5',
        '#33ab9f',
        '#ffef62',
        '#ffac33',
        '#ed4b82',
        '#8561c5',
        '#33c9dc',
        '#ffcd38',
        '#6573c3',
        '#6fbf73',
        '#ff784e',
        '#35baf6',
        '#d7e360',
        '#a2cf6e',
    ];

    // getting current month
    const date = new Date();
    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];
    const currentMonth = months[date.getMonth()];

    const initateLabels = () => {
        let budgets = MonthlyBudgets.find({ month: currentMonth }).fetch();
        budgets.forEach((budget) => {
            categoryLabels = [...categoryLabels, budget.category];
        });

        let expenses = Expenses.find({}).fetch();
        let categoryExpenseTotal = 0;

        budgets.forEach((budget) => {
            expenses.forEach((expense) => {
                if (expense.category === budget.category) {
                    categoryExpenseTotal =
                        categoryExpenseTotal + expense.amount;
                }
            });
            categoryExpenses = [...categoryExpenses, categoryExpenseTotal];
            categoryExpenseTotal = 0;
        });

        doughnutChart.data.labels = categoryLabels;
        doughnutChart.data.datasets[0].backgroundColor = categoryColors;
        doughnutChart.data.datasets[0].data = categoryExpenses;

        doughnutChart.update();
    };

    const initiateChart = () => {
        var ctx = document.getElementById('doughnutChart');
        doughnutChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                datasets: [
                    {
                        label: 'Spending Overview',
                        data: categoryExpenses,
                        backgroundColor: categoryColors,
                    },
                ],
                labels: categoryLabels,
            },
            options: {
                layout: {
                    padding: {
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                    },
                },
                animation: {
                    animateScale: true,
                },
                legend: {
                    position: 'right',
                    align: 'center',
                    labels: {
                        boxWidth: 10,
                    },
                },
            },
        });
    };

    onMount(() => {
        Meteor.subscribe('expenses');
        Meteor.subscribe('monthlybudgets', function () {
            initateLabels();
        });

        initiateChart();
    });

    afterUpdate(() => {
        initiateChart();
    });
</script>

<canvas
    id="doughnutChart"
    width="400px"
    height="400px"
    v-if="loaded"
    sortedStats="data" />

<style>
    #doughnutChart {
        max-width: 100%;
    }
</style>
