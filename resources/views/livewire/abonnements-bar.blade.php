<div class="h-full w-full bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-5">
    <canvas id="myBarChart-abonnments" class="w-full h-full"></canvas>
</div>
<script src="{{ asset('js/helpers.js') }}"></script>

<script>
    var chartData = @json($chartData);
    var background_color = chartData.map((ele, index) => getColor(index).backgroundColor)
    var border_color = chartData.map((ele, index) => getColor(index).borderColor)


    const chart_head_bars = chartData.map(ele => ele.name);
    const chart_values_bars = chartData.map(ele => ele.total_price);

    const myBarChart_abonnments = document.getElementById('myBarChart-abonnments').getContext('2d');
    const myBarChart = new Chart(myBarChart_abonnments, {
        type: 'bar',
        data: {
            labels: chart_head_bars,
            datasets: [{
                label: 'Total Price',
                data: chart_values_bars,
                backgroundColor: background_color,
                borderColor: border_color,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
            tooltip: {
                enabled: true, // Enable or disable the tooltip
                useHTML: true,
                backgroundColor: 'rgba(0, 0, 0, 0.7)', // Background color of the tooltip
                titleColor: '#ffffff', // Color of the title text
                bodyColor: '#ffffff', // Color of the body text
                borderColor: 'rgba(255, 255, 255, 0.8)', // Border color of the tooltip
                borderWidth: 1, // Border width of the tooltip
                callbacks: {
                    label: function(context) {
                        // Customize the label text
                        return 'Total Price: ' + context.raw + ' DH';
                        },
                    title: function(context) {
                        // Customize the title text
                        return context[0].label  ;
                        }
                    }
                }
            }
        }
        
    });
</script>
