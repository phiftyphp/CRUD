<?php
namespace CRUD;
use Exception;

class TabPanel
{
    /**
     * @var string $title Tab title
     */
    public $title;

    public $attributes = array();

    /**
     * Content renderer
     */
    public $contentRender;

    public $handler;

    public function __construct($title,$contentRender)
    {
        $this->title = $title;
        $this->contentRender = $contentRender;

        // generate default random id 
        $this->setId( 'tab-' . rand() );
    }

    public function getId()
    {
        if( isset( $this->attributes['id'] ) )
            return $this->attributes['id'];
    }

    public function setId($id)
    {
        $this->attributes['id'] = $id;
        return $this;
    }

    public function __set($key,$name) {
        $this->attributes[$key] = $name;
    }

    public function setHandler($handler)
    {
        $this->handler = $handler;
    }

    public function renderContent()
    {
        if( is_array($this->contentRender)
            && is_a($this->contentRender[0],'CRUD\\CRUDHandler',true) ) 
        {
            $handler = new $this->contentRender[0];
            $handler->before();
            $response = call_user_func(array($handler, $this->contentRender[1]),$this);
            $handler->after();
            return $response;
        }
        elseif( is_callable($this->contentRender) ) {
            return call_user_func($this->contentRender, $this);
        }
        elseif( is_string($this->contentRender) ) {
            return $this->contentRender;
        } else {
            throw new Exception('unknown type render method');
        }
    }
}


