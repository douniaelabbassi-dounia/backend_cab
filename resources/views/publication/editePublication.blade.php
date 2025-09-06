
@php
    $type = $publication->media()->first()->type;
    $url = asset($publication->media()->first()->url);
@endphp
<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {{ __('Mise à jour de la publicité') }}
        </h2>
    </x-slot>
    <form method="post" action="{{ route('publications.update',$publication->id) }}" class="mt-6 space-y-6" enctype="multipart/form-data">
        @csrf
        @method('patch')
        <div class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                
            
                @livewire('alert-component', [
                    'open' => session('status') == 'publication-updated',
                    'typeAlert' => 'success',
                    'message' => 'Publication Mis à jour avec succès. '
                ])

                <div class="  p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                    <div class="flex flex-col gap-7">  
                        <div>
                            <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100">
                                {{ __('Les informations de la publicité') }}
                            </h2>
    
                            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                {{ __('Mise à jour des informations de Publication ') }}
                            </p>
                        </div>
                        <div class="flex flex-col sm:flex-row gap-7">
                            <div class="w-full  sm:w-1/2">
                                <x-input-label for="title" :value="__('Titre')" />
                                <x-text-input id="title" name="title" type="text" class="mt-1 block w-full"
                                    :value="old('title',$publication->title)" required autofocus autocomplete="title" />
                                <x-input-error class="mt-2" :messages="$errors->get('title')" />
                            </div>
                            <div class="w-full  sm:w-1/2">
                                <x-input-label for="view_number" :value="__('Active')" />
                                <div>
                                    <ul class="cursor-pointer items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                        <li class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600 ">
                                            <div class="flex items-center ps-3">
                                                <input id="no-active-radio" type="radio" value="false" name="active" {{$publication->active == 1 ? '':'checked'}} class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
                                                <label for="no-active-radio" class="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Non </label>
                                            </div>
                                        </li>
                                        <li class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                            <div class="flex items-center ps-3 ">
                                                <input id="yes-active-radio" type="radio" value="true" name="active" {{$publication->active == 1 ? 'checked':''}} class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
                                                <label for="yes-active-radio" class="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Oui</label>
                                            </div>
                                        </li>
                                    </ul>
                                    
                                </div>
                            </div>
                            
                        </div>
    
                        <div class="flex flex-col sm:flex-row gap-7">
                            
                            <div class="w-full  sm:w-1/2">
                                <x-input-label for="view_number" :value="__('Nombre de vues')" />
                                <x-text-input id="view_number" name="view_number" type="number" class="mt-1 block w-full"
                                    :value="old('view_number',$publication->view_number)" required autofocus autocomplete="view_number" />
                                <x-input-error class="mt-2" :messages="$errors->get('view_number')" />
                            </div>
                            <div class="w-full  sm:w-1/2">
                                <x-input-label for="click_number" :value="__('Nombre de clics')" />
                                <x-text-input id="click_number" name="click_number" type="number" class="mt-1 block w-full"
                                    :value="old('click_number',$publication->click_number)" required autofocus autocomplete="click_number" />
                                <x-input-error class="mt-2" :messages="$errors->get('click_number')" />
                            </div>
                            
                        </div>
                        
                        <div>
                            <x-image-upload :extention="$type" :url="$url" :name="'media'" :id="'image-upload'" :error="$errors->get('media')"  />
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
