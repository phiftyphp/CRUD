<?php
namespace CRUD;
use Phifty\Bundle;

class CRUD extends Bundle
{
    public function assets()
    {
        return [
            'jquery-collapse',
            'jquery-easytabs',
            'crud',
            'crudapp',
            'tchooser'
        ];
    }

    public function boot()
    {
    }
}
