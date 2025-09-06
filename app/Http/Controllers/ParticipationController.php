<?php

  namespace App\Http\Controllers;

  use Illuminate\Http\Request;
  use Illuminate\Support\Facades\DB;

  class ParticipationController extends Controller
  {
      public function getUserParticipation($userId)
      {
          $user = DB::table('user_participation')
              ->where('user_id', $userId)
              ->first();

          if ($user) {
              return response()->json([
                  'exists' => true,
                  'currentPoints' => $user->current_points,
                  'maxPoints' => $user->max_points,
                  'lastConnection' => $user->last_connection
              ]);
          }

          return response()->json(['exists' => false]);
      }

      public function initializeUser(Request $request, $userId)
      {
          try {
              DB::table('user_participation')->insert([
                  'user_id' => $userId,
                  'current_points' => 40,
                  'max_points' => 50,
                  'last_connection' => now()->toDateString(),
                  'created_at' => now(),
                  'updated_at' => now()
              ]);

              DB::table('participation_history')->insert([
                  'user_id' => $userId,
                  'action_type' => 'initialize',
                  'points_change' => 40,
                  'points_before' => 0,
                  'points_after' => 40,
                  'reason' => 'User initialization',
                  'created_at' => now()
              ]);

              return response()->json([
                  'success' => true,
                  'currentPoints' => 40
              ]);
          } catch (\Exception $e) {
              return response()->json(['error' => $e->getMessage()], 500);
          }
      }

      public function updatePoints(Request $request, $userId)
      {
          $points = $request->input('points');
          $action = $request->input('action');

          try {
              if ($action === 'add') {
                  $result = DB::select('CALL AddUserPoints(?, ?, ?)', [
                      $userId,
                      $points,
                      $request->input('reason', 'Point addition')
                  ]);
              } else {
                  $result = DB::select('CALL RemoveUserPoints(?, ?, ?)', [
                      $userId,
                      abs($points),
                      $request->input('reason', 'Point removal')
                  ]);
              }

              return response()->json([
                  'success' => true,
                  'currentPoints' => $result[0]->current_points
              ]);
          } catch (\Exception $e) {
              return response()->json(['error' => $e->getMessage()], 500);
          }
      }

      public function processDailyReduction($userId)
      {
          try {
              $result = DB::select('CALL ProcessDailyReduction(?)', [$userId]);

              return response()->json([
                  'success' => true,
                  'currentPoints' => $result[0]->current_points
              ]);
          } catch (\Exception $e) {
              return response()->json(['error' => $e->getMessage()], 500);
          }
      }

      public function getHistory($userId)
      {
          $history = DB::table('participation_history')
              ->where('user_id', $userId)
              ->orderBy('created_at', 'desc')
              ->limit(50)
              ->get();

          return response()->json($history);
      }
  }