<?php

namespace App\Http\Controllers;

use App\Models\Airport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AirportController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $airports = Airport::all();
        return response()->json($airports);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $airport = Airport::find($id);
        if (!$airport) {
            return response()->json(['message' => 'Airport not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'nbVan' => 'sometimes|integer',
            'nbFile' => 'sometimes|string|nullable',
            'nbGrandeFile' => 'sometimes|nullable|string',
            'nbPetiteFile' => 'sometimes|nullable|string',
            'attenteBAT' => 'sometimes|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }
        
        // Only apply Orly-specific logic if the airport is Orly
        if ($airport->abbreviation === 'ORLY') {
            if ($request->has('nbGrandeFile') || $request->has('nbPetiteFile')) {
                $airport->nbGrandeFile = $request->input('nbGrandeFile', $airport->nbGrandeFile);
                $airport->nbPetiteFile = $request->input('nbPetiteFile', $airport->nbPetiteFile);
                $airport->nbFile = $airport->nbGrandeFile . ' et ' . $airport->nbPetiteFile;
            }
        }
        // For all other airports (including CDG), update nbFile directly
        else if ($request->has('nbFile')) {
            $airport->nbFile = $request->input('nbFile');
        }

        if ($request->has('nbVan')) {
            $airport->nbVan = $request->input('nbVan');
        }
        
        if ($request->has('attenteBAT')) {
            $airport->attenteBAT = $request->input('attenteBAT');
        }
        
        $airport->save();

        return response()->json($airport);
    }
}
