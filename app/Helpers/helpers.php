<?php 


function helper_number_formater(int | float $number,$precision = 1){

    if ($number < 1000) {
        return $number;
    } elseif ($number < 1000000) {
        return round($number / 1000, $precision) . 'K';
    } elseif ($number < 1000000000) {
        return round($number / 1000000, $precision) . 'M';
    } elseif ($number < 1000000000000) {
        return round($number / 1000000000, $precision) . 'B';
    } else {
        return round($number / 1000000000000, $precision) . 'T';
    }

}



