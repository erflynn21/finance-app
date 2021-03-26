<script>
    import Chart from 'chart.js';
    import { afterUpdate, onMount } from 'svelte';
    import { budgetsSum } from '../stores/budgetsStore';
    import { expenses } from '../stores/expensesStore';
    import { monthlyBudgets } from '../stores/monthlyBudgetsStore';

    $: categoryLabels = [];

    $: categoryExpenses = [];

    $: categoryColors = [
        '#DC2626',
        '#9333EA',
        '#2563EB',
        '#0D9488',
        '#CA8A04',
        '#EA580C',
        '#DB2777',
        '#7C3AED',
        '#0891B2',
        '#D97706',
        '#4F46E5',
        '#16A34A',
        '#D97706',
        '#0284C7',
        '#65A30D',
        '#059669',
        '#991B1B',
        '#6B21A8',
        '#1E40AF',
        '#115E59',
        '#854D0E',
        '#9A3412',
        '#9D174D',
        '#5B21B6',
        '#155E75',
        '#92400E',
        '#3730A3',
        '#166534',
        '#92400E',
        '#075985',
        '#3F6212',
        '#065F46',
        '#F87171',
        '#C084FC',
        '#60A5FA',
        '#2DD4BF',
        '#FACC15',
        '#FB923C',
        '#F472B6',
        '#A78BFA',
        '#22D3EE',
        '#FBBF24',
        '#818CF8',
        '#4ADE80',
        '#FBBF24',
        '#38BDF8',
        '#A3E635',
        '#34D399',
    ];

    const initateLabels = () => {
        if ($budgetsSum === 0) {
            return;
        }
        let budgets = $monthlyBudgets;
        categoryLabels = [];
        categoryExpenses = [];
        budgets.forEach((budget) => {
            categoryLabels = [...categoryLabels, budget.item.category];
        });

        let categoryExpenseTotal = 0;

        budgets.forEach((budget) => {
            $expenses.forEach((expense) => {
                if (expense.item.category === budget.item.category) {
                    categoryExpenseTotal =
                        categoryExpenseTotal + expense.item.amount;
                }
            });
            categoryExpenseTotal = Number(categoryExpenseTotal).toFixed(2);
            categoryExpenses = [...categoryExpenses, categoryExpenseTotal];
            categoryExpenseTotal = 0;
        });

        doughnutChart.data.labels = categoryLabels;
        doughnutChart.data.datasets[0].backgroundColor = categoryColors;
        doughnutChart.data.datasets[0].data = categoryExpenses;

        doughnutChart.update();
    };

    let doughnutChart;
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
                    position: 'bottom',
                    align: 'center',
                    labels: {
                        boxWidth: 10,
                    },
                },
            },
        });
    };

    onMount(() => {
        initiateChart();
    });

    afterUpdate(() => {
        initateLabels();
    });
</script>

<canvas
    id="doughnutChart"
    width="400px"
    height="400px"
    v-if="loaded"
    sortedStats="data"
/>

<style>
    #doughnutChart {
        max-width: 100%;
    }
</style>
