<div class="flex flex-col ">
    <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            
            <div class="flex justify-between sm:ms-6">
                <x-dropdown align="left" width="25">
                    <x-slot name="trigger">
                        <button  class="inline-flex items-center px-2  py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none transition ease-in-out duration-150">
                            <div class="text-lg">{{$numberToShow}}</div>

                            <div class="ms-1">
                                <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                                </svg>
                            </div>
                        </button >
                    </x-slot>

                    <x-slot name="content">

                        @foreach ([5,10,15,20] as $number)
                        <x-dropdown-link class="cursor-pointer" wire:click='setNumberToShow({{$number}})'>
                            <div wire:key='{{$number}}'>
                                {{$number}}
                            </div>
                        </x-dropdown-link>
                        @endforeach
                        
                        
                    </x-slot>
                </x-dropdown>

                <a href="{{route('abonnements.create')}}">
                    <button type="button" class="px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Créer</button>
                </a>

            </div>



            <div class="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead class="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th scope="col"
                                class=" text-start px-4 py-3.5 text-sm font-normal rtl:text-right text-gray-500 dark:text-gray-400">
                                Nom
                            </th>
                            <th scope="col"
                                class=" text-start px-4 py-3.5 text-sm font-normal rtl:text-right text-gray-500 dark:text-gray-400">
                                 Type
                            </th>
                            <th scope="col"
                                class=" text-start px-4 py-3.5 text-sm font-normal rtl:text-right text-gray-500 dark:text-gray-400">
                                Prix
                            </th>
                            <th scope="col"
                                class="text-start px-4 py-3.5 text-sm font-normal rtl:text-right text-gray-500 dark:text-gray-400">
                                Est-ce une promotion
                            </th>
                            <th scope="col"
                                class="text-start px-4 py-3.5 text-sm font-normal rtl:text-right text-gray-500 dark:text-gray-400">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                        @foreach ($allAbonnements as $abonnement)
                        <tr wire:key='{{$abonnement->id}}'>
                            <td class="px-4 py-4 text-sm font-medium whitespace-nowrap text-start">
                                <div>
                                    <h2 class="font-medium text-gray-800 dark:text-white ">{{ $abonnement->name }}</h2>
                                </div>
                            </td>
                            <td class="px-4 py-4 text-sm font-medium whitespace-nowrap text-start">
                                <div>
                                    <h2 class="font-medium text-gray-800 dark:text-white ">{{ $abonnement->type }}</h2>
                                </div>
                            </td>
                            <td class="px-4 py-4 text-sm font-medium whitespace-nowrap text-start">
                                <div>
                                    <h2 class="font-medium text-gray-800 dark:text-white ">{{ number_format($abonnement->price, 2)  }} DH</h2>
                                </div>
                            </td>
                            <td class="px-4 py-4 text-sm font-medium whitespace-nowrap text-start">
                                <div>

                                    @if ($abonnement->isPromotion)
                                    <span class="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">Oui</span>
                                    @else
                                        <span class="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300">Non</span>
                                    @endif
                                </div>
                            </td>
                            <td class="px-4 py-4 text-sm whitespace-nowrap">
                                <a href="{{route('abonnements.edit',$abonnement->id)}}">

                                    <button type="button"
                                        class="mr-1 px-3 py-2 text-xs font-medium text-center inline-flex items-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                        <svg class="w-[18px] h-[18px]  text-white" aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            fill="currentColor" viewBox="0 0 24 24">
                                            <path fill-rule="evenodd"
                                                d="M14 4.182A4.136 4.136 0 0 1 16.9 3c1.087 0 2.13.425 2.899 1.182A4.01 4.01 0 0 1 21 7.037c0 1.068-.43 2.092-1.194 2.849L18.5 11.214l-5.8-5.71 1.287-1.31.012-.012Zm-2.717 2.763L6.186 12.13l2.175 2.141 5.063-5.218-2.141-2.108Zm-6.25 6.886-1.98 5.849a.992.992 0 0 0 .245 1.026 1.03 1.03 0 0 0 1.043.242L10.282 19l-5.25-5.168Zm6.954 4.01 5.096-5.186-2.218-2.183-5.063 5.218 2.185 2.15Z"
                                                clip-rule="evenodd" />
                                        </svg>
                                    </button>
                                </a>
                                <button type="button"
                                            wire:click="setDeletedAbonnement(@js($abonnement->id))"
                                            x-on:click.prevent="$dispatch('open-modal', 'confirm-abonnement-deletion')"
                                            class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 px-3 py-2 text-xs font-medium text-center inline-flex items-center rounded-lg dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
                                        <svg class="w-[18px] h-[18px] text-white" aria-hidden="true"
                                             xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                             fill="currentColor" viewBox="0 0 24 24">
                                            <path fill-rule="evenodd"
                                                  d="M8.586 2.586A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4a2 2 0 0 1 .586-1.414ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z"
                                                  clip-rule="evenodd"/>
                                        </svg>
                                </button>
                            </td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        </div>
        <div class="mt-4 px-5 ">
            {{ $allAbonnements->links() }}
        </div>
    </div>



    {{-- modal --}}
    <x-modal name="confirm-abonnement-deletion"  focusable>
        
        <form method="post" action="{{$targeted_abonnement !=null? route('abonnements.destroy',$targeted_abonnement->id) :'' }}" class="p-6">
            @csrf
            @method('delete')

            <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100">
                {{ __('Etes-vous sûr de vouloir supprimer cet abonnement ?') }}
            </h2>

            

            <div class="mt-6 flex justify-end">
                <x-secondary-button wire:click="closeModal" x-on:click="$dispatch('close')">
                    {{ __('Annuler') }}
                </x-secondary-button>

                <x-danger-button class="ms-3">
                    {{ __("Supprimer l'abonnement") }}
                </x-danger-button>
            </div>
        </form>
    </x-modal>
</div>
