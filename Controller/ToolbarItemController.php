<?php
namespace CRUD\Controller;
use Phifty\Controller;

abstract class ToolbarItemController extends Controller
{

    protected $_handler;


    /**
     * Control action for rendering control panel.
     */
    abstract public function controlAction();


    public function setHandler($handler)
    {
        $this->view()->assign('CRUDHandler',$handler);
        $this->_handler= $handler;
    }

    public function handleCollection($collection) {  

    }

    public function getHandler()
    {
        return $this->_handler;
    }

}


