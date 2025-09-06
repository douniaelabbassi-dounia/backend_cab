<div class="h-full w-full bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-5">
    <div class="w-full h-fit flex justify-end">
        <div class="px-10">
            <div class="relative flex items-center max-w-[8rem]">
                <button id='button_previous_year' type="button" id="decrement-button"
                    data-input-counter-decrement="quantity-input"
                    class="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none">
                    <svg class="w-3 h-3 text-gray-800 dark:text-white" aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                        viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M5 12h14M5 12l4-4m-4 4 4 4" />
                    </svg>

                </button>
                <input type="text" id="current_year_input" data-input-counter
                    aria-describedby="helper-text-explanation"
                    class="bg-gray-50 border-x-0 border-gray-300 h-11  text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-20 py-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required />
                <button id='button_next_year' type="button" id="increment-button"
                    data-input-counter-increment="quantity-input"
                    class="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none">
                    <svg class="w-3 h-3 text-gray-800 dark:text-white" aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                        viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M19 12H5m14 0-4 4m4-4-4-4" />
                    </svg>

                </button>
            </div>
        </div>

    </div>
    <div class="w-full h-fit">
        <canvas id="myLineChart" class="w-full h-full"></canvas>
    </div>
</div>

<script>
    var chartData = @json($chartData);
    console.log(chartData);

    var admin_data = chartData.admin
    var organisateur_data = chartData.organisateur
    var chauffeur_data = chartData.chauffeur
    var current_year = new Date().getFullYear();
    var input_year_element = document.getElementById('current_year_input');
    input_year_element.value = current_year
    var months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

    var ctx = document.getElementById('myLineChart').getContext('2d');
    var myLineChartUser = new Chart(ctx, {
        type: 'line', // Specify the chart type as 'line'
        data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
                'October', 'November', 'December'
            ],
            datasets: [{
                    label: 'Admin',
                    data: months.map(month => {
                        return admin_data.find(line_data => line_data.month == month && line_data
                            .year == current_year)?.total || 0
                    }), // Replace with your actual data
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    fill: false
                },
                {
                    label: 'Chauffeur',
                    data: months.map(month => {
                        return chauffeur_data.find(line_data => line_data.month == month &&
                            line_data.year == current_year)?.total || 0
                    }), // Replace with your actual data
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    fill: false
                },
                {
                    label: 'Organisateur',
                    data: months.map(month => {
                        return organisateur_data.find(line_data => line_data.month == month &&
                            line_data.year == current_year)?.total || 0
                    }), // Replace with your actual data
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: false
                }
            ]
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
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Month'
                    }
                },

            }
        }
    });

    input_year_element.addEventListener('change', function() {
        var input_value = input_year_element.value
        if (!isNumber(input_value) || input_value.length == 0) {
            input_year_element.value = new Date().getFullYear()
        } else {
            input_year_element.value = parseInt(input_value)
        }
        updateChart_User()
    })
    document.getElementById('button_next_year').addEventListener('click', function() {
        input_year_element.value = parseInt(input_year_element.value) + 1
        updateChart_User()
    })
    document.getElementById('button_previous_year').addEventListener('click', function() {
        input_year_element.value = parseInt(input_year_element.value) - 1
        updateChart_User()
    })

    function isNumber(value) {
        return !isNaN(value) && typeof value !== 'boolean';
    }

    function updateChart_User() {
        var selected_year = input_year_element.value




        // Update the dataset values
        myLineChartUser.data.datasets[0].data = months.map(month => {
            return admin_data.find(line_data => line_data.month == month && line_data.year == selected_year)
                ?.total || 0
        });
        myLineChartUser.data.datasets[1].data = months.map(month => {
            return chauffeur_data.find(line_data => line_data.month == month && line_data.year == selected_year)
                ?.total || 0
        });;
        myLineChartUser.data.datasets[2].data = months.map(month => {
            return organisateur_data.find(line_data => line_data.month == month && line_data.year ==
                selected_year)?.total || 0
        });;


        // Update the chart to reflect the changes
        myLineChartUser.update();
    }
</script>
