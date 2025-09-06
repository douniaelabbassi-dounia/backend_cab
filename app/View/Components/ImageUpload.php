<?php

namespace App\View\Components;

use Illuminate\View\Component;

class ImageUpload extends Component
{
    public $id;
    public $name;
    public $error;
    public $url;
    public $extention;



    /**
     * Create a new component instance.
     *
     * @return void
     */
    public function __construct( $id , $name , $error = null , $url = null, $extention = null )
    {
        $this->id = $id;
        $this->name = $name;
        $this->error = $error;
        $this->url = $url;
        $this->extention = $extention;
    }

    /**
     * Get the view / contents that represent the component.
     *
     * @return \Illuminate\Contracts\View\View|\Closure|string
     */
    public function render()
    {
        return view('components.image-upload');
    }
}
