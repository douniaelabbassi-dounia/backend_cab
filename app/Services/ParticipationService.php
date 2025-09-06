<?php

namespace App\Services;

use App\Models\User;

class ParticipationService
{
    const MAX_SCORE = 50;

    public function addPointsForAffluence(User $user, int $level): void
    {
        $pointsToAdd = match ($level) {
            1 => 1,
            2 => 5,
            0, 3, 4 => 10,
            default => 0,
        };

        $this->addPoints($user, $pointsToAdd);
    }

    public function addPointsForEvent(User $user): void
    {
        $this->addPoints($user, 3);
    }

    public function addPointsForStation(User $user): void
    {
        $this->addPoints($user, 10);
    }

    public function addPointsForLike(User $user): void
    {
        $this->addPoints($user, 1);
    }

    public function deductPointsForFalseReport(User $user): void
    {
        $this->addPoints($user, -20);
    }

    public function deductPointsForDeletion(User $user, string $pointType, ?int $level = null): void
    {
        $pointsToDeduct = match ($pointType) {
            'red' => match ($level) {
                1 => 1,
                2 => 5,
                0, 3, 4 => 10,
                default => 0,
            },
            'event' => 3,
            'green' => 10,
            default => 0,
        };

        $this->addPoints($user, -$pointsToDeduct);
    }

    private function addPoints(User $user, int $points): void
    {
        $newScore = $user->participation_score + $points;

        if ($newScore > self::MAX_SCORE) {
            $user->participation_score = self::MAX_SCORE;
        } else {
            $user->participation_score = $newScore;
        }

        $user->save();
    }
}