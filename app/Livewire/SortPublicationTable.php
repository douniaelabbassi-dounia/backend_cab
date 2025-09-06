<?php

namespace App\Livewire;

use App\Models\Publication;
use Livewire\Component;

class SortPublicationTable extends Component
{
    public function render()
    {
        $allPublications =Publication::withCount([
            'publicationViewsClick as total_views' => function ($query) {
                $query->where('type', 'view');
            },
            'publicationViewsClick as total_clicks' => function ($query) {
                $query->where('type', 'click');
            }
        ])
        ->orderBy('order','asc')
        ->get()
        ->all();

        return view('livewire.sort-publication-table',['allPublications'=>$allPublications]);
    }

    public function updatePublicationOrder($items){
        foreach($items as $item){
            $publication = Publication::find($item['value']);
            if($publication){
                $publication->order = $item['order'];
                $publication->save();
            }
        }
    }
}
