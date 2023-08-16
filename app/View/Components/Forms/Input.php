<?php

namespace App\View\Components\Forms;

use Illuminate\View\Component;

class Input extends Component
{
    public $label;
    public $type;
    public $name;
    public $value;
    public $required;
    public $autofocus;
    /**
     * Create a new component instance.
     *
     * @return void
     */
    public function __construct(
        $type = 'text',
        $name = '',
        $value = null,
        $required = false,
        $autofocus = false,
        $label
    ) {
        $this->type = $type;
        $this->name = $name;
        $this->value = $value;
        $this->required = $required;
        $this->autofocus = $autofocus;
        $this->label = $label;
    }

    /**
     * Get the view / contents that represent the component.
     *
     * @return \Illuminate\Contracts\View\View|\Closure|string
     */
    public function render()
    {
        return view('components.forms.input');
    }
}
