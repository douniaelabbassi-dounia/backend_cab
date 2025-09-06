<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {{ __('Mise à jour Utilisateurs') }}: <span class="italic font-semibold text-blue-600/100 dark:text-blue-500/100">{{$user->firstName}} {{$user->lastName}}</span>
        </h2>
    </x-slot>
    <form method="post" action="{{ route('users.update', $user->id) }}" class="mt-6 space-y-6">
        @csrf
        @method('patch')
        <div class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">


                @livewire('alert-component', [
                    'open' => session('status') == 'user-InfoUpdated' ||session('status') == 'user-passwordUpdated',
                    'typeAlert' => 'success',
                    'message' =>session('status') == 'user-InfoUpdated' ? "Les informations de l'utilisateur ont été mises à jour avec succès" :'Mot de passe utilisateur mis à jour avec succès',
                ])

                <div class="  p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                    <div class="flex flex-col gap-7">
                        <div>
                            <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100">
                                {{ __("informations de l'utilisateur") }}
                            </h2>

                            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                {{ __("Mettre à jour les informations utilisateur et l'adresse e-mail.") }}
                            </p>
                        </div>
                        <div class="flex flex-col sm:flex-row gap-7">
                            <div class="w-full  sm:w-1/2">
                                <x-input-label for="firstName" :value="__('Prénom')" />
                                <x-text-input id="firstName" name="firstName" type="text" class="mt-1 block w-full"
                                    :value="old('firstName', $user->firstName)" required autofocus autocomplete="firstName" />
                                <x-input-error class="mt-2" :messages="$errors->get('firstName')" />
                            </div>
                            <div class="w-full sm:w-1/2">
                                <x-input-label for="lastName" :value="__('Nom')" />
                                <x-text-input id="lastName" name="lastName" type="text" class="mt-1 block w-full"
                                    :value="old('lastName', $user->lastName)" required autofocus autocomplete="lastName" />
                                <x-input-error class="mt-2" :messages="$errors->get('lastName')" />
                            </div>
                        </div>

                        <div class="">
                            <x-input-label for="email" :value="__('Email')" />
                            <x-text-input id="email" name="email" type="email" class="mt-1 block w-full"
                                :value="old('email', $user->email)" required autocomplete="username" />
                            <x-input-error class="mt-2" :messages="$errors->get('email')" />
                        </div>
                        <div class="">
                            <x-input-label  :value="__('Rôle')" />
                            <ul class="cursor-pointer items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                @foreach ($roles as $role)
                                    <li class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600 ">
                                        <div class="flex items-center ps-3">
                                            <input id="role{{$role->id}}" type="radio" {{old('role',$user->role->id) == $role->id?'checked':''}} value="{{$role->id}}" name="role" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
                                            <label for="role{{$role->id}}" class="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">{{{$role->role_name}}}</label>
                                        </div>
                                    </li>
                                @endforeach
                            </ul>
                            <x-input-error class="mt-2" :messages="$errors->get('role')" />
                        </div>
                    </div>

                    <div class="flex justify-end mt-10">
                        <x-primary-button>{{ __('Enregistrer') }}</x-primary-button>
                    </div>
                </div>
            </div>
        </div>
    </form>
    <form method="post" action="{{ route('users.updatePassword', $user->id) }}" class="mt-6 space-y-6">
        @csrf
        @method('patch')
        <div class="py-5">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">


                @livewire('alert-component', [
                    'open' => session('status') == 'user-updated',
                    'typeAlert' => 'success',
                    'message' => 'Utilisateur créé avec succès. <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Voir les informations</a>',
                ])

                <div class="  p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">

                    <div>
                        <div class="flex flex-col gap-7">
                            <div>
                                <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100">
                                    {{ __('Mot de passe') }}
                                </h2>

                                <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                    {{ __("Assurez-vous d'utiliser un mot de passe long et aléatoire pour rester en sécurité.") }}
                                </p>

                            </div>

                            <div class="flex flex-col sm:flex-row gap-7">
                                <div class="w-full  sm:w-1/2">
                                    <x-input-label for="update_password_password" :value="__('Password')" />
                                    <x-text-input id="update_password_password" name="password" type="password"
                                        class="mt-1 block w-full" autocomplete="new-password" />
                                    <x-input-error :messages="$errors->get('password')" class="mt-2" />
                                </div>

                                <div class="w-full  sm:w-1/2">
                                    <x-input-label for="update_password_password_confirmation" :value="__('Confirmer Password')" />
                                    <x-text-input id="update_password_password_confirmation"
                                        name="password_confirmation" type="password" class="mt-1 block w-full"
                                        autocomplete="new-password" />
                                    <x-input-error :messages="$errors->get('password_confirmation')" class="mt-2" />
                                </div>
                                
                            </div>
                        </div>
                    </div>

                    <div class="flex justify-end mt-10">
                        <x-primary-button>{{ __('Enregistrer Password') }}</x-primary-button>
                    </div>
                </div>
            </div>
        </div>

    </form>


</x-app-layout>
