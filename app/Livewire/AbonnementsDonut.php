<?php

namespace App\Livewire;

use Livewire\Component;

class AbonnementsDonut extends Component
{

    public $chartData = [];

    public function render()
    {
        return view('livewire.abonnements-donut');
    }
}
