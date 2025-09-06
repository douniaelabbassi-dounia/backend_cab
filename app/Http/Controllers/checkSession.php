<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class checkSession extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        try{
            return auth()->user();
            $user = auth()->user();
            if(response()->status() == 500){
            return response()->json(['message' => 'you are not authaticate!']);
        }
        return response()->json(['message' => 'you are '. $user]);
    }catch(\Exception $e){
            return response()->json(['message' => 'there is an error : ' .$e->getMessage()]);
        }
    }

    function __construct() {
        $this->middleware(['check_session']);
    }
}
