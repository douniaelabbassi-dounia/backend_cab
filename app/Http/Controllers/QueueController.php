<?php

namespace App\Http\Controllers;

use App\Models\QueueUserPosition;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class QueueController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth:sanctum']);
    }

    /**
     * Update the authenticated user's position in a specific queue.
     */
    public function updatePosition(Request $request, $station_point_id)
    {
        $request->validate([
            'lat' => 'required|numeric',
            'lng' => 'required|numeric',
        ]);

        $user = Auth::user();

        QueueUserPosition::updateOrCreate(
            ['user_id' => $user->id, 'station_point_id' => $station_point_id],
            ['lat' => $request->lat, 'lng' => $request->lng]
        );

        return response()->json(['status' => 'success', 'message' => 'Position updated.']);
    }

    /**
     * Get all active user positions for a specific queue.
     */
    public function getPositions($station_point_id)
    {
        // Delete positions that are older than 2 minutes to remove inactive users.
        QueueUserPosition::where('updated_at', '<', Carbon::now()->subMinutes(2))->delete();

        $positions = QueueUserPosition::where('station_point_id', $station_point_id)->get(['user_id', 'lat', 'lng']);

        return response()->json($positions);
    }

    /**
     * Remove the authenticated user from a queue.
     */
    public function leaveQueue($station_point_id)
    {
        $user = Auth::user();
        QueueUserPosition::where('user_id', $user->id)
            ->where('station_point_id', $station_point_id)
            ->delete();

        return response()->json(['status' => 'success', 'message' => 'User removed from queue.']);
    }
}