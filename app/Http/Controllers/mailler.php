<?php

namespace App\Http\Controllers;

use App\Mail\ExampleEmail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class mailler extends Controller
{
    public function __invoke(Request $request){
        $content = $request->content; 
        $senderEmail = $request->sender;
        $subject = $request->subject;
        
        Mail::to($senderEmail)->send(new ExampleEmail($content, $subject, $senderEmail));

        return response()->json(['message' => 'Email sent successfully'], 200);
    }
}
