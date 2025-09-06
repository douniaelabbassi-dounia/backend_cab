<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class logout extends Controller
{
    function __construct() {
        $this->middleware(['auth:sanctum']);
    }

    function __invoke(Request $request){
        try {
            $request->user()->currentAccessToken()->delete();
            return response()->json(['message' => 'ok'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'error : '. $e->getMessage()], 500);
        }
    }
}
