<?php

namespace App\Livewire;

use App\Models\Publication;
use App\Models\PublicationUserView;
use Livewire\Component;

class PublicationsLines extends Component
{
    
    public function render()
    {   
        $chartData = [];
        $all_publication = Publication::all();

        foreach ($all_publication as $publication) {
            $required_data = $this->get_data_for_one_publication($publication->id) ;
            $chartData[] = [
                'id'=> $publication->id,
                'title'=> $publication->title,

                'total_view'=>$required_data['total_view'],
                'dates_view'=>$required_data['dates_view'],
                'values_view'=>$required_data['values_view'],

                'total_click'=>$required_data['total_click'],
                'dates_click'=>$required_data['dates_click'],
                'values_click'=>$required_data['values_click'],
            ];
        }
        
        return view('livewire.publications-lines',['chartData'=>$chartData]);
    }

    public function get_data_for_one_publication($publication_id)
    {
        $required_data = [
            'total_view' => 0,
            'dates_view' => [],
            'values_view' => [],

            'total_click' => 0,
            'dates_click' => [],
            'values_click' => [],
        ];

        
        // Get total views based on provided dates or all dates
        $query_views = PublicationUserView::where('publication_id', $publication_id)->where('type','view');

        $total_view = $query_views->count();
        $required_data['total_view'] = $total_view;

        // Get views grouped by date based on provided dates or all dates
        $views_by_date = $query_views->selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Prepare dates and values arrays
        foreach ($views_by_date as $view) {
            $required_data['dates_view'][] = $view->date;
            $required_data['values_view'][] = $view->count;
        }

        // --------------------------------------------------------------------------------

        // Get total click based on provided dates or all dates
        $query_clicks = PublicationUserView::where('publication_id', $publication_id)->where('type','click');

        $total_click = $query_clicks->count();
        $required_data['total_click'] = $total_click;

        // Get clicks grouped by date based on provided dates or all dates
        $clicks_by_date = $query_clicks->selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Prepare dates and values arrays
        foreach ($clicks_by_date as $click) {
            $required_data['dates_click'][] = $click->date;
            $required_data['values_click'][] = $click->count;
        }

        return $required_data;
    }

    
}
