<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

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
            // Use firstOrCreate to prevent race condition errors
            $participation = DB::table('user_participation')->where('user_id', $userId)->first();

            if (!$participation) {
                 DB::table('user_participation')->insert([
                    'user_id' => $userId,
                    'current_points' => 30,
                    'max_points' => 50,
                    'last_connection' => now()->toDateString(),
                    'created_at' => now(),
                    'updated_at' => now()
                ]);

                DB::table('participation_history')->insert([
                    'user_id' => $userId,
                    'action_type' => 'initialize',
                    'points_change' => 30,
                    'points_before' => 0,
                    'points_after' => 30,
                    'reason' => 'User initialization',
                    'created_at' => now()
                ]);
            }

            return response()->json([
                'success' => true,
                'currentPoints' => 30
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function updatePoints(Request $request, $userId)
    {
        // This method can still use the stored procedure as it's for adding/removing points
        $points = $request->input('points');
        $action = $request->input('action');

        try {
            if ($action === 'add') {
                $result = DB::select('CALL AddUserPoints(?, ?, ?)', [$userId, $points, $request->input('reason', 'Point addition')]);
            } else {
                $result = DB::select('CALL RemoveUserPoints(?, ?, ?)', [$userId, abs($points), $request->input('reason', 'Point removal')]);
            }

            return response()->json([
                'success' => true,
                'currentPoints' => $result[0]->current_points
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function processDailyReduction(Request $request, $userId)
    {
        try {
            $participation = DB::table('user_participation')->where('user_id', $userId)->first();

            // If user has no record, initialize them and we're done for today.
            if (!$participation) {
                DB::table('user_participation')->insert([
                    'user_id' => $userId,
                    'current_points' => 30,
                    'max_points' => 50,
                    'last_connection' => now()->toDateString(),
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
                return response()->json(['success' => true, 'currentPoints' => 30]);
            }

            // If we are here, the user exists. Let's do the logic in PHP.
            $today = Carbon::today()->toDateString();
            $lastConnection = $participation->last_connection;
            $currentPoints = $participation->current_points;

            // Only reduce points if their last connection was before today.
            if ($lastConnection < $today) {
                $newPoints = max(0, $currentPoints - 1); // Decrease by 1, but not below 0

                DB::table('user_participation')
                    ->where('user_id', $userId)
                    ->update([
                        'current_points' => $newPoints,
                        'last_connection' => $today
                    ]);
                
                return response()->json(['success' => true, 'currentPoints' => $newPoints]);
            }
            
            // If they already connected today, just return their current points without changing anything.
            return response()->json(['success' => true, 'currentPoints' => $currentPoints]);

        } catch (\Exception $e) {
            // Log the detailed error on the server for debugging
            \Log::error("Daily reduction failed for user {$userId}: " . $e->getMessage());
            return response()->json(['error' => 'A server error occurred during daily reduction.'], 500);
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