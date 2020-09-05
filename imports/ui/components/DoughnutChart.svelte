<script>
    import Chart from 'chart.js';
    import { afterUpdate } from 'svelte';

    let doughnutChart;

    $: categoryLabels = ['Rent', 'General', 'Groceries'];

    $: categoryExpenses = [9000, 500, 200];

    $: categoryColors = [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
    ];

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
                    align: 'start',
                    labels: {
                        boxWidth: 10,
                    },
                },
            },
        });
    };

    afterUpdate(() => {
        initiateChart();
    });
</script>

<canvas id="doughnutChart" width="400px" height="400px" />
