<?php

$colors = ['green', 'red', 'blue', 'yellow'];

if (array_key_exists('sequence', $_GET)){
    $old_sequence = json_decode($_GET['sequence']);
    if (is_array($old_sequence)) {
        if (all_valid_colors($old_sequence)) {
            // add a random color
            $new_sequence = add_color($old_sequence);

            // prepare result object
            $result_object = new StdClass();
            $result_object->status = "okay";
            $result_object->sequence = $new_sequence;

            usleep(400000);

            // send encoded object back to client
            echo json_encode($result_object);

        } else {
            echo "Error: Sequence Array has been passed, but it contains invalid values (only the four given color names given as string are allowed)";
        }
    } else {
        echo "Error: Sequence parameter was passed to script, but it is no JSON-formatted array!";
    }
} else {
    echo "Error: Script must be called with GET-parameter called 'sequence'";
}

function all_valid_colors($sequence) {
    global $colors;
    foreach ($sequence as $color){
        if(!is_string($color) || !in_array($color, $colors)){
            return false;
        }
    }
    return true;
}

function add_color($sequence) {
    if (empty($sequence)){
        // when called for the first time, add two colors
        while(count($sequence) < 2){
            $random_color = draw_color();
            $sequence[] = $random_color;
        }
    } else {
        $random_color = draw_color();
        $sequence[] = $random_color;
    }
    return $sequence;
}

function draw_color() {
    global $colors;
    $random_color_index = array_rand($colors);
    $random_color = $colors[$random_color_index];
    return $random_color;
}