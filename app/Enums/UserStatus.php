<?php

namespace App\Enums;

use Rexlabs\Enum\Enum;

/**
 * The UserStatus enum.
 *
 * @method static self ACTIVE()
 * @method static self O_VALIDATE()
 * @method static self TO_VERIFY()
 * @method static self SUSPENDED()
 */
class UserStatus extends Enum
{
    const ACTIVE = 'active';
    const O_VALIDATE = 'o_validate';
    const TO_VERIFY = 'to_verify';
    const SUSPENDED = 'suspended';
}
