<?php

namespace App\View\Components\Forms;

use Illuminate\View\Component;

class ButtonPrimary extends Component
{
    public $label;
    public $type;
    /**
     * Create a new component instance.
     */
    public function __construct( $type = 'button', $label = '')
    { 
        $this->label = $label;
        $this->type = $type; 
    }

    /**
     * Get the view / contents that represent the component.
     *
     * @return \Illuminate\Contracts\View\View|\Closure|string
     */
    public function render()
    {
        return view('components.forms.button-primary');
    }
}
