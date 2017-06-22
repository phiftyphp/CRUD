<?php
namespace CRUD\Action;
use WebAction\Action;

class ImportExcellAdvanced extends Action
{
    public function schema()
    {
        $this->param('columns')
            ->isa('array')
            ;
    }

    public function run()
    {
        return $this->success('匯入成功', [
            'imported' => 120,
        ]);
    }



}




