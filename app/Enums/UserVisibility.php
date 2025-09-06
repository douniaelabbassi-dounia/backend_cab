<?php

namespace App\Enums;

use Rexlabs\Enum\Enum;

/**
 * The UserVisibility enum.
 *
 * @method static self ALL()
 * @method static self FRIENDS()
 * @method static self PRIVATE()
 */
class UserVisibility extends Enum
{
    const ALL = 'all';
    const FRIENDS = 'friends';
    const PRIVATE = 'private';
}
