<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\DB;

class ParticipationService
{
    private function updateUserPoints(User $user, int $pointsChange, string $reason): void
    {
        if ($user) {
            $action = $pointsChange > 0 ? 'AddUserPoints' : 'RemoveUserPoints';
            DB::select("CALL {$action}(?, ?, ?)", [
                $user->id,
                abs($pointsChange),
                $reason
            ]);
        }
    }

    /**
     * Earning points methods
     */
    public function addPointsForAffluence(User $user, $level)
    {
        $points = 0;
        switch (intval($level)) {
            case 0: $points = 10; break;
            case 1: $points = 1; break;
            case 2: $points = 5; break;
            case 3: case 4: $points = 10; break;
        }

        if ($points > 0) {
            $this->updateUserPoints($user, $points, "Reported affluence level {$level}");
        }
    }

    public function addPointsForEvent(User $user)
    {
        $this->updateUserPoints($user, 3, "Reported an event");
    }

    public function addPointsForLike(User $user)
    {
        $this->updateUserPoints($user, 1, "Feedback given (like)");
    }

    public function addPointsForStation(User $user)
    {
        $this->updateUserPoints($user, 10, "Reported a station queue");
    }

    /**
     * Losing points methods
     */
    public function deductPointsForFalseReport(User $user)
    {
        $this->updateUserPoints($user, -20, "Penalized for false affluence report");
    }

    public function deductPointsForDeletion(User $user, string $pointType, $level = null)
    {
        $pointsToDeduct = 0;
        $reason = '';

        switch ($pointType) {
            case 'red': // Affluence
                switch (intval($level)) {
                    case 0: $pointsToDeduct = 10; break;
                    case 1: $pointsToDeduct = 1; break;
                    case 2: $pointsToDeduct = 5; break;
                    case 3: case 4: $pointsToDeduct = 10; break;
                }
                if ($pointsToDeduct > 0) {
                    $reason = "Deleted an affluence report (level {$level})";
                }
                break;
            case 'event':
                $pointsToDeduct = 3;
                $reason = "Deleted an event report";
                break;
            case 'green': // Station
                $pointsToDeduct = 10;
                $reason = "Deleted a station report";
                break;
        }

        if ($pointsToDeduct > 0) {
            $this->updateUserPoints($user, -$pointsToDeduct, $reason);
        }
    }
}