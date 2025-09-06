<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\User;
use Illuminate\Validation\Rules;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return view('users.users') ;
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $roles = Role::all();
        return view('users.createUser',['roles'=>$roles]) ;
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'firstName' => ['required', 'string', 'max:255'],
            'lastName' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => ['required'],
        ]);
        

        $user = User::create([
            'firstName' => $request->firstName,
            'lastName' => $request->lastName,
            'email' =>$request->email,
            'password' => Hash::make($request->password),
            'role_id' => $request->role,
        ]);

        return redirect()->route('users.create')->with(['status'=>'user-created','newUserUrl'=>route('users.edit',$user->id)]);
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
        //
        $roles = Role::all();
        
        $user = User::findOrFail($id);
        return view('users.editeUser',['user'=>$user,'roles'=>$roles]) ;

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'firstName' => ['required', 'string', 'max:255'],
            'lastName' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', Rule::unique(User::class)->ignore($id)],
            'role' => ['required'],
            
        ]);

        $user = User::find($id);
        if($user){
            $user->firstName = $request->firstName;
            $user->lastName = $request->lastName;
            $user->email = $request->email;
            $user->role_id= $request->role;
            $user->save();
            return redirect()->route('users.edit',$user->id)->with(['status'=> 'user-InfoUpdated']);

        }
        
        
    }
    //new function 
    public function updatePassword(Request $request, string $id)
    {
        $request->validate([
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::find($id);
        if($user){
            $user->password = Hash::make($request->password);
            $user->save();
            return redirect()->route('users.edit',$user->id)->with(['status'=> 'user-passwordUpdated']);

        }
        
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $deletedUser = User::find($id);
        $deletedUser->delete();
        return redirect()->back()->with(['status'=>'user-deleted']);
    }
}
