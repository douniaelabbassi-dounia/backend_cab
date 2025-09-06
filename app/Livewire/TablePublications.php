<?php

namespace App\Livewire;

use App\Models\Publication;
use Livewire\Component;

class TablePublications extends Component
{

    public int $numberToShow = 10;
    public Publication|null $targeted_publication = null ;
    public function render()
    {
        $allPublications = Publication::withCount([
            'publicationViewsClick as total_views' => function ($query) {
                $query->where('type', 'view');
            },
            'publicationViewsClick as total_clicks' => function ($query) {
                $query->where('type', 'click');
            }
        ])
        ->orderBy('order','asc')
        ->paginate($this->numberToShow);
        return view('livewire.table-publications',['allPublications'=>$allPublications]);
    }

    public function setNumberToShow(int $number):void{
        $this->numberToShow = $number ;
    }

    
    public function setDeletedPublication(string $publication_id):void{
        $this->targeted_publication = Publication::find($publication_id);

    
    }

    public function closeModal(): void{
        $this->targeted_publication = null;

    }
}
