@php
$currentDate = new DateTime();

// Get the date 7 days before
$dateBefore7Days = new DateTime();
$dateBefore7Days->modify('-7 days');


$currentDate_format = $currentDate->format('Y-m-d');
$dateBefore7Days_formate = $dateBefore7Days->format('Y-m-d');
@endphp
<div class="h-full w-full bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-5">
    <div class="w-full h-fit">
        <small class="ms-2 font-semibold text-gray-500 dark:text-gray-400">Touts les Publications :</small>
        <div id='buttons-publication-container'>

        </div>
    </div>
    <hr
        class="my-12 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:via-neutral-400" />
    <div class="w-full h-fit flex justify-between items-center gap-1 mt-5">
        <div style="sm:w-1/2 w-full flex justify-start items-center">
            <button  type="button" id='filter_by_views' class="text-white bg-[#050708] hover:bg-[#050708]/80 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-medium rounded-lg text-sm px-3 p-2 text-center inline-flex items-center dark:hover:bg-[#050708]/40 dark:focus:ring-gray-600 me-2 mb-2">
                <svg class="w-[15px] h-[15px]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-width="2" d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"/>
                    <path stroke="currentColor" stroke-width="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                  </svg>
                  
            </button>
            <button  type="button" id='filter_by_clicks' class="text-gray-900  bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-3 p-2 text-center inline-flex items-center dark:focus:ring-gray-500 me-2 mb-2">
                <svg class="w-[15px] h-[15px]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a28.076 28.076 0 0 1-1.091 9M7.231 4.37a8.994 8.994 0 0 1 12.88 3.73M2.958 15S3 14.577 3 12a8.949 8.949 0 0 1 1.735-5.307m12.84 3.088A5.98 5.98 0 0 1 18 12a30 30 0 0 1-.464 6.232M6 12a6 6 0 0 1 9.352-4.974M4 21a5.964 5.964 0 0 1 1.01-3.328 5.15 5.15 0 0 0 .786-1.926m8.66 2.486a13.96 13.96 0 0 1-.962 2.683M7.5 19.336C9 17.092 9 14.845 9 12a3 3 0 1 1 6 0c0 .749 0 1.521-.031 2.311M12 12c0 3 0 6-2 9"/>
                </svg>
                  
                  
            </button>
        </div>
        <div class="sm:w-1/2 w-full flex justify-end items-center gap-1">
            <button id='search-between-dates' type="button"
                class="py-2 px-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                <svg class="w-[15px] h-[15px] " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24"
                    height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-width="2"
                        d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
                </svg>

            </button>
            <div class="flex items-center gap-1">
                <div class="relative max-w-sm">
                    <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                        </svg>
                    </div>
                    <input id="date-start" datepicker datepicker-buttons datepicker-autoselect-today type="date" value="{{$dateBefore7Days_formate}}"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-1.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Select date">
                </div>
                <span class="mx-2 text-gray-500">
                    <svg class="w-[20px] h-[20px] " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24"
                        height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M19 12H5m14 0-4 4m4-4-4-4" />
                    </svg>
                </span>
                <div class="relative max-w-sm">
                    <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                        </svg>
                    </div>
                    <input id="date-end" datepicker datepicker-buttons datepicker-autoselect-today type="date" value="{{$currentDate_format}}"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-1.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Select date">
                </div>
            </div>
        </div>


    </div>
    <div class="w-full h-fit">
        <canvas id="myLineChart-publication" class="w-full h-full"></canvas>

    </div>
</div>

<script>
    var chartData = @json($chartData) || [];
    console.log(chartData,'check check')
    selected_class =
        "text-white bg-[#050708] hover:bg-[#050708]/80 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-medium rounded-lg text-sm px-3 p-2 text-center inline-flex items-center dark:hover:bg-[#050708]/40 dark:focus:ring-gray-600 me-2 mb-2";
    unselected_class =
        "text-gray-900  bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-3 p-2 text-center inline-flex items-center dark:focus:ring-gray-500 me-2 mb-2"

    //generate buttons---------------
    document.getElementById('buttons-publication-container').innerHTML = ''
    publication_button_container_html = ''
    chartData.map((element, index) => {
        publication_button_container_html += `
                    <button  type="button" data-id="${element.id}"  title="${element.title}" class="button-publication ${index == 0 ?selected_class : unselected_class}">
                        <span class=" max-w-60 w-fit truncate overflow-hidden whitespace-nowrap">${element.title}</span>
                    </button>
            `
    });
    document.getElementById('buttons-publication-container').innerHTML = publication_button_container_html
    //giving events
    var buttons_publications = document.getElementsByClassName('button-publication');
    for (var i = 0; i < buttons_publications.length; i++) {
        buttons_publications[i].addEventListener('click', onButtonPublicationClick);
    }
    // -----------------------------
    //init chart-------------------
    var ctx = document.getElementById('myLineChart-publication').getContext('2d');
    var myLineChart = new Chart(ctx, {
        type: 'line', // Specify the chart type as 'line'
        data: {
            labels: [],
            datasets: [{
                label: '',
                data: [], // Replace with your actual data
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: false
            }],
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
                        text: 'dates'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Total views'
                    }
                },

            }
        }
    });
    var filter_by_what = 'views';
    var current_selected_publication = chartData[0] || null
    var current_selected_publication_dates = current_selected_publication?.dates_view || []
    var current_selected_publication_values = current_selected_publication?.values_view || []
    updateChart(current_selected_publication_dates,current_selected_publication_values,current_selected_publication?.title)
    
    // ----------------------------
    document.getElementById('filter_by_clicks').addEventListener('click', function() {
        when_change_filter_by_view_or_clicks('click')
    })
    document.getElementById('filter_by_views').addEventListener('click', function() {
        when_change_filter_by_view_or_clicks('view')
    })
    //give event to button search
    document.getElementById('search-between-dates').addEventListener('click', function() {
        console.log(current_selected_publication);
        var search_selected_publication_dates =  current_selected_publication[filter_by_what == 'click'?'dates_click':'dates_view']
        var search_selected_publication_values = current_selected_publication[filter_by_what == 'click'?'values_click':'values_view']
        updateChart(search_selected_publication_dates, search_selected_publication_values,
            current_selected_publication?.title)
    })
    //functions
    function when_change_filter_by_view_or_clicks(type){
        filter_by_what = type
        if(type == 'click'){
            document.getElementById('filter_by_clicks').className = selected_class
            document.getElementById('filter_by_views').className = unselected_class
        }else{
            document.getElementById('filter_by_views').className = selected_class
            document.getElementById('filter_by_clicks').className = unselected_class
            
        }

        var search_selected_publication_dates =  current_selected_publication[type == 'click'?'dates_click':'dates_view']
        var search_selected_publication_values = current_selected_publication[type == 'click'?'values_click':'values_view']
        updateChart(search_selected_publication_dates, search_selected_publication_values,
            current_selected_publication?.title)
    }
    

    function onButtonPublicationClick(event) {
        var dom_element = this
        var attr_id = dom_element.getAttribute('data-id');
        var new_selected_publication = chartData.find(element => element.id == attr_id)
        var new_selected_publication_dates = new_selected_publication[filter_by_what == 'click'?'dates_click':'dates_view']
        var new_selected_publication_values = new_selected_publication[filter_by_what == 'click'?'values_click':'values_view']
        current_selected_publication = new_selected_publication
        updateChart(new_selected_publication_dates, new_selected_publication_values, new_selected_publication?.title)

        changingClassWhenClick(attr_id)
    }

    function changingClassWhenClick(selected) {
        for (var i = 0; i < buttons_publications.length; i++) {
            var dom_element2 = buttons_publications[i]
            var attr_id = dom_element2.getAttribute('data-id');
            dom_element2.className = `button-publication ${attr_id == selected ? selected_class:unselected_class}`

        }
    }

    function updateChart(newLabels, newValues, newTitle) {
        var date_start_value = document.getElementById('date-start').value
        var date_end_value = document.getElementById('date-end').value

        var chart_lables = [];
        var chart_values = [];
        if (date_start_value.length > 0 || date_end_value.length > 0) {


            if (date_start_value.length > 0 && date_end_value.length > 0) {
                console.log('here', date_start_value.length, date_end_value.length);

                var object_date_start = new Date(date_start_value);
                var object_date_end = new Date(date_end_value);

                newLabels.map((ele, index) => {
                    var object_date_label = new Date(ele)
                    if (object_date_label >= object_date_start && object_date_label <= object_date_end) {
                        chart_lables.push(ele)
                        chart_values.push(newValues[index])
                    }
                })
            } else if (date_start_value.length > 0) {
                console.log('here 2');

                var object_date_start = new Date(date_start_value);

                newLabels.map((ele, index) => {
                    var object_date_label = new Date(ele)
                    if (object_date_label >= object_date_start) {
                        chart_lables.push(ele)
                        chart_values.push(newValues[index])
                    }
                })
            } else {
                console.log('here 3');

                var object_date_end = new Date(date_end_value);

                newLabels.map((ele, index) => {
                    var object_date_label = new Date(ele)
                    if (object_date_label <= object_date_end) {
                        chart_lables.push(ele)
                        chart_values.push(newValues[index])
                    }
                })
            }
        } else {

            chart_values = newValues;
            chart_lables = newLabels
        }
        console.log(chart_values, 'values');
        console.log(chart_lables, 'lables');

        // Update the labels on the x-axis
        myLineChart.data.labels = chart_lables;

        // Update the dataset values
        myLineChart.data.datasets[0].data = chart_values;

        // Update the dataset label (title)
        myLineChart.data.datasets[0].label = newTitle;

        // Update the chart to reflect the changes
        myLineChart.update();
    }
</script>
