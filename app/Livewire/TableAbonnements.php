<?php

namespace App\Livewire;

use App\Models\Abonnement;
use Livewire\Component;
use Livewire\WithPagination;

class TableAbonnements extends Component
{
    use WithPagination;
    

    public int $numberToShow = 10;
    public Abonnement|null $targeted_abonnement = null ;

    
    public function render()
    {
        $allAbonnements = Abonnement::paginate($this->numberToShow);
        return view('livewire.table-abonnements',['allAbonnements'=> $allAbonnements]);
    }


    

    public function setNumberToShow(int $number):void{
        $this->numberToShow = $number ;
    }

    
    public function setDeletedAbonnement(string $abonnement_id):void{
        $this->targeted_abonnement = Abonnement::find($abonnement_id);

    
    }

    public function closeModal(): void{
        $this->targeted_abonnement = null;

    }
    
}
