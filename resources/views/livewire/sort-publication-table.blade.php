<div class="flex flex-col ">
    <style>
        .draggable-mirror {
            cursor: pointer !important;
            background-color: white;
            width: 1150px;
            display: flex !important;
            align-items: center;
            justify-content: space-between !important;
            box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1) !important;
            box-sizing: border-box;
            border-radius: 5px
        }

        @media (max-width: 1276px) {
            .draggable-mirror {
                width: calc(100% - 96px) !important;

            }
        }

        @media (max-width: 638px) {
            .draggable-mirror {
                width: calc(100% - 15px) !important;

            }
        }
    </style>
    <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">

            <div class="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead class="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th class="col">

                            </th>
                            <th scope="col"
                                class=" text-start px-4 py-3.5 text-sm font-normal rtl:text-right text-gray-500 dark:text-gray-400">
                                Title
                            </th>
                            <th scope="col"
                                class=" text-start px-4 py-3.5 text-sm font-normal rtl:text-right text-gray-500 dark:text-gray-400">
                                Nombre de vues
                            </th>
                            <th scope="col"
                                class=" text-start px-4 py-3.5 text-sm font-normal rtl:text-right text-gray-500 dark:text-gray-400">
                                Total des vues par les utilisateurs
                            </th>
                            <th scope="col"
                                class=" text-start px-4 py-3.5 text-sm font-normal rtl:text-right text-gray-500 dark:text-gray-400">
                                Nombre de clics
                            </th>
                            <th scope="col"
                                class=" text-start px-4 py-3.5 text-sm font-normal rtl:text-right text-gray-500 dark:text-gray-400">
                                Total des clics par les utilisateurs
                            </th>
                            <th scope="col"
                                class="text-start px-4 py-3.5 text-sm font-normal rtl:text-right text-gray-500 dark:text-gray-400">
                                active
                            </th>
                            <th scope="col"
                                class="text-start px-4 py-3.5 text-sm font-normal rtl:text-right text-gray-500 dark:text-gray-400">
                                Order
                            </th>

                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900"
                        wire:sortable="updatePublicationOrder" id='sort-table-tbody'>
                        @foreach ($allPublications as $publication)
                            <tr class="hover:bg-gray-50 dark:hover:bg-gray-600"
                                wire:sortable.item="{{ $publication->id }}" wire:key='{{ $publication->id }}'>
                                <td wire:sortable.handle style="cursor: pointer;">
                                    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                        viewBox="0 0 24 24">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-width="2"
                                            d="M5 7h14M5 12h14M5 17h14" />
                                    </svg>

                                </td>
                                <td class="px-4 py-4 text-sm font-medium whitespace-nowrap text-start">
                                    <div>
                                        <h2 class="font-medium text-gray-800 dark:text-white ">{{ $publication->title }}
                                        </h2>
                                    </div>
                                </td>
                                <td class="px-4 py-4 text-sm font-medium whitespace-nowrap text-start">
                                    <div>
                                        <h2 class="font-medium text-gray-800 dark:text-white ">
                                            {{ $publication->view_number }}</h2>
                                    </div>
                                </td>
                                <td class="px-4 py-4 text-sm font-medium whitespace-nowrap text-start">
                                    <div>
                                        <h2 class="font-medium text-gray-800 dark:text-white ">
                                            {{ $publication->total_views }}</h2>
                                    </div>
                                </td>
                                <td class="px-4 py-4 text-sm font-medium whitespace-nowrap text-start">
                                    <div>
                                        <h2 class="font-medium text-gray-800 dark:text-white ">
                                            {{ $publication->click_number }}</h2>
                                    </div>
                                </td>
                                <td class="px-4 py-4 text-sm font-medium whitespace-nowrap text-start">
                                    <div>
                                        <h2 class="font-medium text-gray-800 dark:text-white ">
                                            {{ $publication->total_clicks }}</h2>
                                    </div>
                                </td>
                                <td class="px-4 py-4 text-sm font-medium whitespace-nowrap text-start">
                                    <div>

                                        @if ($publication->active == '1')
                                            <span
                                                class="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">Oui</span>
                                        @else
                                            <span
                                                class="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300">Non</span>
                                        @endif
                                    </div>
                                </td>
                                <td class="px-4 py-4 text-sm font-medium whitespace-nowrap text-start">
                                    <div>
                                        <h2 class="font-medium text-gray-800 dark:text-white ">{{ $publication->order }}
                                        </h2>
                                    </div>
                                </td>

                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        </div>

    </div>


</div>
