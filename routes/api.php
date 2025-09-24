<?php

  use App\Http\Controllers\AuthController;
  use App\Http\Controllers\checkSession;
  use App\Http\Controllers\logout;
  use App\Http\Controllers\mailler;
  use App\Http\Controllers\PointController;
  use App\Http\Controllers\ParticipationController;
  use App\Http\Controllers\AirportController;
  use App\Http\Controllers\QueueController;
  use Illuminate\Http\Request;
  use Illuminate\Support\Facades\Route;

  // Public routes (no authentication required)
  Route::post('/register', [AuthController::class, 'register']);
  Route::post('/login', [AuthController::class, 'login']);
  Route::post('/sendmail', mailler::class);

  // Test route
  Route::get('/test', function() {
      return response()->json(['message' => 'API is working', 'timestamp' => now()]);
  });

  // Debug route to check user data
  Route::get('/debug-user', function(\Illuminate\Http\Request $request) {
      $email = $request->get('email', 'test@gmail.com');
      $user = \App\Models\User::where('email', $email)->with('role', 'chauffeur')->first();
      return response()->json([
          'user' => $user,
          'password_check' => $user ? \Illuminate\Support\Facades\Hash::check('12345678', $user->password) : false
      ]);
  });

  // Participation test route (no auth required)
  Route::get('/participation-test', function() {
      return response()->json(['message' => 'Participation routes work!']);
  });

  // Force clear cache route
  Route::get('/force-reload', function() {
      \Illuminate\Support\Facades\Artisan::call('route:clear');
      \Illuminate\Support\Facades\Artisan::call('cache:clear');
      return response()->json(['message' => 'Cache cleared via web!']);
  });

  // Protected routes (require authentication)
  Route::middleware(['auth:sanctum'])->group(function () {
      Route::get('/profile', [AuthController::class, 'profile']);

      // point apis
      Route::get('/points/all', [PointController::class, 'getAllPoints']);
      Route::get('/points/my', [PointController::class, 'getAllMyPoints']);
      Route::post('/points/add', [PointController::class, 'newPoint']);
      Route::post('/points/update', [PointController::class, 'updatePoint']);
      Route::post('/points/lvl/update', [PointController::class, 'updateLvlPoint']);
      Route::post('/points/delete', [PointController::class, 'deletePoint']);
      Route::post('/points/detail', [PointController::class, 'getDetailPoint']);
      Route::post('/points/feedback', [PointController::class, 'feedbackPoint']);
      Route::post('/points/disable', [PointController::class, 'disablePoint']);

      //publication
      Route::get('/publications/list',[AuthController::class,'listPublication']);
      Route::post('/publications/pub_action',[AuthController::class,'add_publication_action']);

      // was for test list friends
      Route::get('/friends', [AuthController::class, 'friends']);

      // Participation system APIs
      Route::prefix('participation')->group(function () {
          Route::get('/{userId}', [ParticipationController::class, 'getUserParticipation']);
          Route::post('/{userId}/initialize', [ParticipationController::class, 'initializeUser']);
          Route::post('/{userId}/points', [ParticipationController::class, 'updatePoints']);
          Route::post('/{userId}/daily-reduction', [ParticipationController::class, 'processDailyReduction']);
          Route::get('/{userId}/history', [ParticipationController::class, 'getHistory']);
      });

      // Airport API routes
      Route::get('/airports', [AirportController::class, 'index']);
      Route::post('/airports/{id}', [AirportController::class, 'update']);

      // Queue (Station Polyline) API routes
      Route::prefix('queue')->group(function () {
          Route::post('/{station_point_id}/update', [QueueController::class, 'updatePosition']);
          Route::get('/{station_point_id}/positions', [QueueController::class, 'getPositions']);
          Route::post('/{station_point_id}/leave', [QueueController::class, 'leaveQueue']);
      });

      Route::post('/logout', logout::class);
  });
