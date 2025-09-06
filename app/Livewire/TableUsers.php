<?php

namespace App\Livewire;

use App\Models\User;
use Livewire\Component;
use Livewire\WithPagination;


class TableUsers extends Component
{
    use WithPagination;
    

    public int $numberToShow = 10;
    public User|null $targeted_user = null ;

    public function render()
    {
        $allUsers = User::whereNot('id',auth()->id())->paginate($this->numberToShow); // Change 10 to the number of items you want per page
        return view('livewire.table-users', ['allUsers' => $allUsers]);
    }

    public function setNumberToShow(int $number):void{
        $this->numberToShow = $number ;
    }

    
    public function setDeletedUser(string $user_id):void{
        // dd($user_id);
        $this->targeted_user = User::find($user_id);

    
    }

    public function closeModal(): void{
        $this->targeted_user = null;

    }
    
   
   
  


}
