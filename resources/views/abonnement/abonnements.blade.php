<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {{ __('Abonnements') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            @livewire('alert-component', [
                    'open' => session('status') == 'abonnement-deleted',
                    'typeAlert' => 'success',
                    'message' => 'Abonnement supprimé avec succès.'
                ])
            <div class="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                <livewire:table-abonnements />
            </div>
        </div>
    </div>
</x-app-layout>