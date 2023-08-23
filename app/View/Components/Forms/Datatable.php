<?php

namespace App\View\Components\Forms;

use Illuminate\View\Component;

class Datatable extends Component
{

    public $columns;
    public $rows;
    public $urlData;
    public $msgConfirm;

    /**
     * Create a new component instance.
     *
     * @return void
     */
    public function __construct( $columns = [], $rows = [], $urlData = "", $msgConfirm = "")
    {
        $this->columns = $columns;
        $this->rows = $rows;
        $this->urlData = $urlData;
        $this->msgConfirm = $msgConfirm;
    }

    /**
     * Get the view / contents that represent the component.
     *
     * @return \Illuminate\Contracts\View\View|\Closure|string
     */
    public function render()
    {
        return view('components.forms.datatable');
    }
}
