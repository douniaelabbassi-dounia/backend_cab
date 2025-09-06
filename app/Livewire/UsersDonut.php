<?php

namespace App\Livewire;

use Livewire\Component;

class UsersDonut extends Component
{
    public $chartData = [];
    public function render()
    {
        return view('livewire.users-donut');
    }
}
