<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class apiAuth
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request)
    {
        
        return $request->expectsJson() ? response()->json(['message', 'yaaa hala wyaaaa hala!']) : response()->json(['message', 'please authoticate youself!']);
    }
}
