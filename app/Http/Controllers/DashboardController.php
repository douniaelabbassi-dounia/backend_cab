<?php

namespace App\Http\Controllers;

use App\Models\Abonnement;
use App\Models\Publication;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(Request $request)
    {


        $cards_data = $this->GetDashboardCardsData();
        $chart_data = $this->GetDashboardsChartData();
        return view('dashboard', [
            'cards' => $cards_data,
            'charts' => $chart_data
        ]);

    }

    public function GetDashboardCardsData(): array
    {


        $finalData = [
            'users' => [
                [
                    'total' => 0,
                    'roles' => [
                        'admin' => 0,
                        'chauffeur' => 0,
                        'organisateur' => 0,
                    ]
                ],
            ],
            'abonnements' => [
                'total' => 0,
                'top_three_abonnements' => []
            ],
            'publications' => [
                'total' => 0,
                'total_active' => 0,
                'total_unactive' => 0,
            ]

        ];
        //User queries
        $total_users = User::count();
        $total_admin = User::whereHas('role', function ($query) {
            $query->where('role_name', 'admin');
        })->count();
        $total_organisateur = User::whereHas('role', function ($query) {
            $query->where('role_name', 'organisateur');
        })->count();
        $total_chauffeur = User::whereHas('role', function ($query) {
            $query->where('role_name', 'chauffeur');
        })->count();

        $finalData['users']['total'] = helper_number_formater($total_users);
        $finalData['users']['roles']['admin'] = helper_number_formater($total_admin);
        $finalData['users']['roles']['organisateur'] = helper_number_formater($total_organisateur);
        $finalData['users']['roles']['chauffeur'] = helper_number_formater($total_chauffeur);


        //bonnements queries
        $total_bonnements = Abonnement::count();

        $top_three_abonnements = User::select(DB::raw('count(*) as total, abonnements.name'))
            ->join('abonnements', 'users.abonnement_id', '=', 'abonnements.id')
            ->groupBy('abonnements.name', 'abonnement_id')
            ->orderBy('total', 'desc')
            ->limit(3)
            ->get()
            ->toArray();


        $finalData['abonnements']['total'] = helper_number_formater($total_bonnements);
        $finalData['abonnements']['top_three_abonnements'] = array_map(function ($element) {
            return [
                'name' => $element['name'],
                'total' => helper_number_formater($element['total']),
            ];
        }, $top_three_abonnements);

        //publication
        $total_publication = Publication::count();
        $final_publication_active = Publication::where('active', true)->count();
        $final_publication_unActive = Publication::where('active', false)->count();
        $finalData['publications']['total'] = helper_number_formater($total_publication);
        $finalData['publications']['total_active'] = helper_number_formater($final_publication_active);
        $finalData['publications']['total_unactive'] = helper_number_formater($final_publication_unActive);


        return $finalData;


    }

    public function GetDashboardsChartData(): array
    {
        $chart_data = [
            //user
            'user_line' => [
                'roles' => [
                    'admin' => [

                    ],
                    'organisateur' => [

                    ],
                    'chauffeur' => [

                    ]
                ]
            ],
            //abonnment
            'abonnement_donut' => [

            ],
            'abonnement_bar' => [

            ],


        ];

        $line_admin = User::select(DB::raw('count(*) as total, YEAR(created_at) as year, MONTH(created_at) as month'))
            ->whereHas('role', function ($query) {
                $query->where('role_name', 'admin');
            })
            ->groupBy('year', 'month')
            ->orderBy('year', 'asc')
            ->orderBy('month', 'asc')
            ->get();
        ;

        $line_organisateur = User::select(DB::raw('count(*) as total, YEAR(created_at) as year, MONTH(created_at) as month'))
            ->whereHas('role', function ($query) {
                $query->where('role_name', 'organisateur');
            })
            ->groupBy('year', 'month')
            ->orderBy('year', 'asc')
            ->orderBy('month', 'asc')
            ->get();
        ;

        $line_chauffeur = User::select(DB::raw('count(*) as total, YEAR(created_at) as year, MONTH(created_at) as month'))
            ->whereHas('role', function ($query) {
                $query->where('role_name', 'chauffeur');
            })
            ->groupBy('year', 'month')
            ->orderBy('year', 'asc')
            ->orderBy('month', 'asc')
            ->get();
        ;


        $chart_data['user_line']['roles']['admin'] = $line_admin;
        $chart_data['user_line']['roles']['organisateur'] = $line_organisateur;
        $chart_data['user_line']['roles']['chauffeur'] = $line_chauffeur;


        //abonnement
        $total_users_by_abonnements = User::select(DB::raw('count(*) as total, abonnements.name,abonnements.price'))
            ->join('abonnements', 'users.abonnement_id', '=', 'abonnements.id')
            ->groupBy('abonnement_id', 'abonnements.name', 'abonnements.price')
            ->orderBy('total', 'desc')
            ->get()
            ->toArray();
        $chart_data['abonnement_donut'] = array_map(function ($element) {
            return [
                'name' => $element['name'],
                'total' => helper_number_formater($element['total']),
            ];
        }, $total_users_by_abonnements);

        $chart_data['abonnement_bar'] = array_map(function ($element) {
            $price = $element['price'];
            $total_usres = $element['total'];
            $total_price = $price * $total_usres;
            return [
                'name' => $element['name'],
                'total_user' => $total_usres,
                'price' => $price,
                'total_price' => helper_number_formater($total_price),
            ];
        }, $total_users_by_abonnements);


        return $chart_data;
    }
}
