<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {{ __('Mise à jour Abonnement') }} : <span class="italic font-semibold text-blue-600/100 dark:text-blue-500/100">{{$abonnement->name}}</span>
        </h2>
    </x-slot>
    <form method="post" action="{{ route('abonnements.update', $abonnement->id ) }}" class="mt-6 space-y-6">
        @csrf
        @method('patch')
        <div class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                
                
                @livewire('alert-component', [
                    'open' => session('status') == 'abonnement-updated',
                    'typeAlert' => 'success',
                    'message' => 'Abonnement Mis à jour avec succès. '
                ])

                <div class="  p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                    <div class="flex flex-col gap-7">  
                        <div>
                            <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100">
                                {{ __("Mise à jour des informations d'abonnement") }}
                            </h2>
    
                           
                        </div>
                        <div class="flex flex-col sm:flex-row gap-7">
                            <div class="w-full  sm:w-1/2">
                                <x-input-label for="name" :value="__('Abonnement')" />
                                <x-text-input id="name" name="name" type="text" class="mt-1 block w-full"
                                    :value="old('name',$abonnement->name)" required autofocus autocomplete="name" />
                                <x-input-error class="mt-2" :messages="$errors->get('name')" />
                            </div>
                            <div class="w-full sm:w-1/2">
                                <x-input-label for="type" :value="__('Type')" />
                                <x-text-input id="type" name="type" type="text" class="mt-1 block w-full"
                                    :value="old('type',$abonnement->type)" required autofocus autocomplete="type" />
                                <x-input-error class="mt-2" :messages="$errors->get('type')" />
                            </div>
                        </div>
    
                        <div class="flex flex-col sm:flex-row gap-7">
                            <div class="w-full  sm:w-1/2">
                                <x-input-label for="price" :value="__('Prix')" />
                                <x-text-input id="price" name="price" type="number" class="mt-1 block w-full"
                                    :value="old('price',$abonnement->price)" required autofocus autocomplete="price" step="any" />
                                <x-input-error class="mt-2" :messages="$errors->get('price')" />
                            </div>
                            <div class="w-full sm:w-1/2">
                                <x-input-label  :value="__('Promotion')" />
                                <div>
                                    <ul class="cursor-pointer items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                        <li class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600 ">
                                            <div class="flex items-center ps-3">
                                                <input id="no-promotion-radio" {{$abonnement->isPromotion ? '':'checked'}} type="radio" value="false" name="promotion" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
                                                <label for="no-promotion-radio" class="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">No </label>
                                            </div>
                                        </li>
                                        <li class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                            <div class="flex items-center ps-3 ">
                                                <input id="yes-promotion-radio" {{$abonnement->isPromotion ? 'checked':''}} type="radio" value="true" name="promotion" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
                                                <label for="yes-promotion-radio" class="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Yes</label>
                                            </div>
                                        </li>
                                    </ul>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                    
        

                    <div class="flex justify-end mt-10">
                        <x-primary-button>{{ __('Enregistrer') }}</x-primary-button>
                    </div>
                </div>
            </div>
        </div>



    </form>

    
</x-app-layout>
