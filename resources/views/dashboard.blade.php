<x-app-layout>

    @php
        //-------------cards
        $userCard = $cards['users'];
        $abonnementsCard = $cards['abonnements'];
        $publications = $cards['publications'];

        //----------charts
        $userLins = $charts['user_line']['roles'];
        $abonnement_donut = $charts['abonnement_donut'];
        $abonnement_bar = $charts['abonnement_bar'];


    @endphp
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {{ __('Dashboard') }}
        </h2>
    </x-slot>
    <div class="my-5 p-5">
        <div class="w-full flex flex-col sm:flex-row justify-center gap-5  ">

            <div
                class="flex flex-col sm:flex-row w-full sm:w-1/3 max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow  dark:bg-gray-800 dark:border-gray-700 ">

                <div class="w-full sm:w-1/2 sm:text-start text-center">
                    <dt class="mb-2 text-3xl font-extrabold">{{ $userCard['total'] }}</dt>
                    <dd class="text-gray-500 dark:text-gray-400 font-extrabold">Utilisateurs</dd>
                </div>

                <div class="w-full sm:w-1/2">
                    <p class="text-xs text-blue-600/100 dark:text-blue-500/100">Les Rôles :</p>
                    <div class="mt-2">
                        <div class="flex w-full justify-between mb-2">
                            <span
                                class=" bg-blue-100 text-blue-800 sm:text-xs text-[12px] font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">Admin</span>
                            <p class="sm:text-xs text-[12px] font-normal text-gray-700 dark:text-gray-400">
                                {{ $userCard['roles']['admin'] }}</< /p>
                        </div>
                        <div class="flex w-full justify-between mb-2">
                            <span
                                class=" bg-green-100 text-green-800 sm:text-xs text-[12px] font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">Chauffeur</span>
                            <p class="sm:text-xs text-[12px] font-normal text-gray-700 dark:text-gray-400">
                                {{ $userCard['roles']['chauffeur'] }}</p>
                        </div>
                        <div class="flex w-full justify-between mb-2">
                            <span
                                class=" bg-yellow-100 text-yellow-800 sm:text-xs text-[12px] font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-yellow-900 dark:text-yellow-300">Organisateur</span>
                            <p class="sm:text-xs text-[12px] font-normal text-gray-700 dark:text-gray-400">
                                {{ $userCard['roles']['organisateur'] }}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div
                class="flex flex-col sm:flex-row w-full sm:w-1/3 max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow  dark:bg-gray-800 dark:border-gray-700 ">

                <div class="w-full sm:w-1/2 sm:text-start text-center">
                    <dt class="mb-2 text-3xl font-extrabold">{{ $abonnementsCard['total'] }}</dt>
                    <dd class="text-gray-500 dark:text-gray-400 font-extrabold">Abonnements</dd>
                </div>

                <div class="w-full sm:w-1/2">
                    <p class="text-xs text-blue-600/100 dark:text-blue-500/100">Top 3 Abonnements :</p>
                    <div class="mt-2">
                        @for ($i = 0; $i < count($abonnementsCard['top_three_abonnements']); $i++)
                            @php
                                $name = $abonnementsCard['top_three_abonnements'][$i]['name'];
                                $total = $abonnementsCard['top_three_abonnements'][$i]['total'];
                            @endphp
                            <div class="flex w-full justify-between mb-2">

                                @php
                                    $class = '';
                                    switch ($i) {
                                        case 0:
                                            $class = 'dark:bg-blue-900 dark:text-blue-300 bg-blue-100 text-blue-800';
                                            break;
                                        case 1:
                                            $class =
                                                'dark:bg-green-900 dark:text-green-300 bg-green-100 text-green-800';
                                            break;
                                        default:
                                            $class =
                                                'dark:bg-yellow-900 dark:text-yellow-300 bg-yellow-100 text-yellow-800';
                                            break;
                                    }
                                @endphp
                                <span
                                    class="{{ $class }} sm:text-xs text-[12px] font-medium me-2 px-2.5 py-0.5 rounded-full">
                                    {{ $name }}
                                </span>
                                <p class="sm:text-xs text-[12px] font-normal text-gray-700 dark:text-gray-400">
                                    {{ $total }}
                                </p>

                            </div>
                        @endfor

                    </div>
                </div>
            </div>
            <div
                class="flex flex-col sm:flex-row w-full sm:w-1/3 max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow  dark:bg-gray-800 dark:border-gray-700 ">

                <div class="w-full sm:w-1/2 sm:text-start text-center">
                    <dt class="mb-2 text-3xl font-extrabold">{{$publications['total']}}</dt>
                    <dd class="text-gray-500 dark:text-gray-400 font-extrabold">Publicité</dd>
                </div>

                <div class="w-full sm:w-1/2">
                    <p class="text-xs text-blue-600/100 dark:text-blue-500/100">Par l'état :</p>
                    <div class="mt-2">
                        <div class="flex w-full justify-between mb-2">
                            <span
                                class=" bg-blue-100 text-blue-800 sm:text-xs text-[12px] font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">active</span>
                            <p class="sm:text-xs text-[12px] font-normal text-gray-700 dark:text-gray-400">
                                {{ $publications['total_active']}}</< /p>
                        </div>
                        <div class="flex w-full justify-between mb-2">
                            <span
                                class=" bg-green-100 text-green-800 sm:text-xs text-[12px] font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">inactive</span>
                            <p class="sm:text-xs text-[12px] font-normal text-gray-700 dark:text-gray-400">
                                {{ $publications['total_unactive'] }}</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
    {{-- chart users --}}
    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="flex flex-col sm:flex-row  w-full h-fit gap-4">
                <div class="w-full sm:w-2/3">
                    <h2 class="font-semibold text-md text-gray-800 dark:text-gray-200 leading-tight mb-1">
                        {{ __("Nombre total d'utilisateurs par mois") }}
                    </h2>
                    @livewire('users-lines', [
                        'chartData' =>$userLins
                    ])
                </div>
                <div class="w-full sm:w-1/3">
                    <h2 class="font-semibold text-md text-gray-800 dark:text-gray-200 leading-tight mb-1">
                        {{ __('Utilisateurs par rôle') }}
                    </h2>
                    @livewire('users-donut', [
                        'chartData' => $userCard['roles'],
                    ])
                </div>
            </div>
            
        </div>
        {{-- char abonnement --}}
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8 mt-10">
            <div class="flex flex-col sm:flex-row  w-full h-fit gap-4">
                <div class="w-full sm:w-1/3">
                    <h2 class="font-semibold text-md text-gray-800 dark:text-gray-200 leading-tight mb-1">
                        {{ __("Total d'utilisateurs par Abonnements") }}
                    </h2>
                    @livewire('abonnements-donut', [
                        'chartData' => $abonnement_donut,
                    ])
                </div>
                <div class="w-full sm:w-2/3">
                    <h2 class="font-semibold text-md text-gray-800 dark:text-gray-200 leading-tight mb-1">
                        {{ __("Prix total par nombre total d'utilisateurs") }}
                    </h2>
                    @livewire('abonnements-bar', [
                        'chartData' => $abonnement_bar,

                    ])
                </div>
                
            </div>
            
        </div>
        {{-- chart publication --}}
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8 mt-10">
            <div class="flex flex-col sm:flex-row  w-full h-fit gap-4">
                
                <div class="w-full ">
                    <h2 class="font-semibold text-md text-gray-800 dark:text-gray-200 leading-tight mb-1">
                        {{ __("Publication Total View") }}
                    </h2>
                    @livewire('publications-lines')
                </div>
            </div>
            
        </div>
    </div>
    </div>
</x-app-layout>
