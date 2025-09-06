
<div class="h-full w-full bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-5">
    <canvas id="myDonutChart-abonnement" class="w-full h-full"></canvas>
</div>
<script src="{{asset('js/helpers.js')}}"></script>
<script >
    var chartData = @json($chartData);
    var ctx = document.getElementById('myDonutChart-abonnement').getContext('2d');
    var chart_header = chartData.map(ele=> ele.name || 0 )
    var chart_values = chartData.map(ele=> ele.total || 0 )
    var background_color = chartData.map((ele,index)=> getColor(index).backgroundColor )
    var border_color = chartData.map((ele,index)=> getColor(index).borderColor )

    var myDonutChart_abonnement = new Chart(ctx, {
        type: 'doughnut', // Specify the chart type as 'doughnut'
        data: {
            labels: chart_header,
            datasets: [{
                label: 'Total User',
                data: chart_values,
                backgroundColor:background_color,
                borderColor:border_color,
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

