<?php
namespace CRUD;
use Phifty\Bundle;

class CRUD extends Bundle
{
    public function assets()
    {
        return [
            'crud',
            'crudapp',
            'tchooser'
        ];
    }

    public function boot()
    {
    }
}
