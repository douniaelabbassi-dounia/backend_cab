<?php

namespace App\Enums;

use Rexlabs\Enum\Enum;

/**
 * The UserNotification enum.
 *
 * @method static self ALL()
 * @method static self DIRECTS()
 * @method static self LEVEL_3_AND_4()
 * @method static self DISABLED()
 */
class UserNotification extends Enum
{
    const ALL = 'all';
    const DIRECTS = 'directs';
    const LEVEL_3_AND_4 = 'level_3_and_4';
    const DISABLED = 'disabled';
}
