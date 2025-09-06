<?php

namespace App\Http\Controllers;

use App\Models\Abonnement;
use Illuminate\Http\Request;

class AbonnementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return view("abonnement.abonnements");
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('abonnement.createAbonnement');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'type' => ['required', 'string', 'max:255'],
            'price' => ['required'],
        ]);
        

        $abonnement = Abonnement::create([
            'name' => $request->name,
            'type' => $request->type,
            'price' =>$request->price,
            'isPromotion' => $request->promotion == 'true'?true:false,
        ]);

        return redirect()->route('abonnements.create')->with(['status'=>'abonnement-created','newAbonnementUrl'=>route('abonnements.edit',$abonnement->id)]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $abonnement = Abonnement::findOrFail($id);
        return view('abonnement.editeAbonnement',['abonnement'=> $abonnement]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'type' => ['required', 'string', 'max:255'],
            'price' => ['required'],
        ]);
        
        $abonnement = Abonnement::find($id);
        if($abonnement){
            $abonnement->name = $request->name;
            $abonnement->type = $request->type;
            $abonnement->price = $request->price;
            $abonnement->isPromotion = $request->promotion == 'true'?true:false;
            $abonnement->save();
            return redirect()->route('abonnements.edit',$abonnement->id)->with(['status'=> 'abonnement-updated']);
        }
        
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        Abonnement::find($id)->delete();
        return redirect()->back()->with(['status'=>'abonnement-deleted']);
    }
}
