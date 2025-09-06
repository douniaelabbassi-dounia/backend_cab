<?php

namespace App\Enums;

use Rexlabs\Enum\Enum;

/**
 * The DocumentType enum.
 *
 * @method static self IMAGE()
 * @method static self DOCUMENT()
 */
class DocumentType extends Enum
{
    const IMAGE = 'image';
    const DOCUMENT = 'document';
}
