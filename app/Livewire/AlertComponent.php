<?php

namespace App\Livewire;

use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Livewire\Component;

class AlertComponent extends Component
{
   
    public bool $open = false;
    public string $typeAlert = '';
    public string $message = '';

    public function mount(bool $open,string $typeAlert,string $message): void
    {
        $this->open = $open;
        $this->typeAlert = $typeAlert;
        $this->message = $message;
    }

    public function render(): Factory|View
    {
        return view('livewire.alert-component');
    }

    public function closeAlert(): void{
        $this->open = false;
        $this->typeAlert = '';
        $this->message = '';
    }
}
