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
    public $infoRequired;
    public $autofocus;
    public $placeholder;
    /**
     * Create a new component instance.
     *
     * @return void
     */
    public function __construct(
        $type = '',
        $name = '',
        $value = null,
        $required = false,
        $autofocus = false,
        $label,
        $infoRequired = false,
        $placeholder = ''
    ) {
        $this->type = $type;
        $this->name = $name;
        $this->value = $value;
        $this->required = $required;
        $this->autofocus = $autofocus;
        $this->label = $label;
        $this->infoRequired = $infoRequired;
        $this->placeholder = $placeholder;
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
