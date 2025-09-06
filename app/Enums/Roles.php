<?php

namespace App\Enums;

use Rexlabs\Enum\Enum;

/**
 * The Roles enum.
 *
 * @method static self CHAUFEUR()
 * @method static self ORGANISATEUR()
 * @method static self ADMIN()
 * @method static self SUPER_ADMIN()
 */
class Roles extends Enum
{
    const CHAUFEUR = 'chaufeur';
    const ORGANISATEUR = 'organisateur';
    const ADMIN = 'admin';
    const SUPER_ADMIN = 'super_admin';
}
