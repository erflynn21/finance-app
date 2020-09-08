<script>
    import Chart from 'chart.js';
    import { afterUpdate, onMount } from 'svelte';
    import { Expenses } from '../../api/expenses';
    import { MonthlyBudgets } from '../../api/monthlybudgets';

    // let doughnutChart;

    $: categoryLabels = [];

    $: categoryExpenses = [];

    $: categoryColors = [];

    const initateLabels = () => {
        let budgets = MonthlyBudgets.find({}).fetch();
        budgets.forEach((budget) => {
            categoryLabels = [...categoryLabels, budget.category];
            categoryColors = [...categoryColors, budget.color];
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
