<?php

namespace App\View\Components\Forms;

use Illuminate\View\Component;

class LinkSecondary extends Component
{
    public $label;
    public $link;
    /**
     * Create a new component instance.
     */
    public function __construct($label = "", $link = "")
    {
        $this->label = $label;
        $this->link = $link;
    }

    /**
     * Get the view / contents that represent the component.
     *
     * @return \Illuminate\Contracts\View\View|\Closure|string
     */
    public function render()
    {
        return view('components.forms.link-secondary');
    }
}
