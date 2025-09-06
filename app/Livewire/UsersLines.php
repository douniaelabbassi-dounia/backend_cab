<?php

namespace App\Livewire;

use Livewire\Component;

class UsersLines extends Component
{
    public $chartData = [];
    public function render()
    {
        return view('livewire.users-lines');
    }
}
