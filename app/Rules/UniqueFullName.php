<?php

namespace App\Rules;

use App\Models\User;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class UniqueFullName implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        // Retrieve the firstname and lastname from the request
        $firstname = request()->input('firstname');
        $lastname = request()->input('lastname');

        // Check if a user with the same firstname and lastname exists
        if (User::where('firstname', $firstname)->where('lastname', $lastname)->exists()) {
            $fail('The combination of firstname and lastname must be unique.');
        }
    }
}
