<?php

use App\Http\Controllers\AbonnementController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PublicationController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/



Route::redirect('/','/dashboard');

// Test API route in web.php
Route::get('/api/participation-test', function() {
    return response()->json(['message' => 'Participation routes work from web.php!']);
});


Route::middleware(['auth', 'verified'])->group(function(){

    Route::get('/dashboard', [DashboardController::class,'index'])->name('dashboard');

});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    //users CRUD
    Route::resource('users',UserController::class);
    // to update users pasword
    Route::patch('users/{user}/update-password', [UserController::class, 'updatePassword'])->name('users.updatePassword');
    
    //Abonnement CRUD
    Route::resource('abonnements',AbonnementController::class);
    // Route::resource('abonnements',AbonnementController::class)->except(['create', 'update','edit','store']);

    // publication CRUD
    Route::resource('publications',PublicationController::class);

    Route::get('order-publication', function(){
       return view('publication.sortPublication');
    })->name('order-publication');
    
});

require __DIR__.'/auth.php';
