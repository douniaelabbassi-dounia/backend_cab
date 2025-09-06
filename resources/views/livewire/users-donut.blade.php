<div class="h-full w-full bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-5">
    <canvas id="myDonutChart" class="w-full h-full"></canvas>
</div>

<script>
    var chartData = @json($chartData);
    var ctx = document.getElementById('myDonutChart').getContext('2d');
    var myDonutChart = new Chart(ctx, {
        type: 'doughnut', // Specify the chart type as 'doughnut'
        data: {
            labels: ['Admin', 'Chauffeur', 'Organisateur'],
            datasets: [{
                label: 'Total User',
                data: [chartData.admin || 0, chartData.chauffeur || 0, chartData.organisateur || 0],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.2)',
                    'rgb(220 252 231)',
                    'rgba(255, 206, 86, 0.2)'
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgb(31 87 52 / 92%)',
                    'rgba(255, 206, 86, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    enabled: true
                }
            }
        }
    });
</script>
