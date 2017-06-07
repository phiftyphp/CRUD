<?php
namespace CRUD;
use Phifty\Bundle;

class CRUD extends Bundle
{
    public function assets()
    {
        return [
            'reactjs15',
            'modal-manager',
            'jquery-collapse',
            'jquery-easytabs',
            'jquery-bsm-select',
            'holder-js',
            'formkit',
            'fivekit',
            'chosen',
            'crud',
            'crudapp',
            'tchooser'
        ];
    }

    public function boot()
    {
    }
}
