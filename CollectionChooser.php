<?php
namespace CRUD;
use Phifty\Controller;
use Pux\Controller\ExpandableController;

/**
 * The CollectionChooser CRUD provides 
 *
 *    /collection.json
 *    /collection.yml
 *    /list.json
 *    /list.yml
 *    /                   - the chooser dialog template
 *
 * For example:
 *
 *    http://phifty.dev/=/product/chooser?target=%23id
 *    http://phifty.dev/=/product/chooser/collection.json
 *    http://phifty.dev/=/product/chooser/list.json
 *
 *    $.get('/=/product/chooser',{ target: '#id' } ,function(html) {   
 *      $(document.body).append(html);  
 *    });
 *
 */
class CollectionChooser extends ExpandableController
{

    public $collectionClass;
    public $valueField;
    public $labelField;
    public $order = array(array('id'));

    public static function expand()
    {
        $class = get_called_class();
        $routeset = new \Roller\RouteSet;
        $routeset->add( '/'            , $class . ':indexAction' );
        $routeset->add( '/list.json'   , $class . ':listJsonAction');
        $routeset->add( '/list.yaml'   , $class . ':listYamlAction');
        $routeset->add( '/collection.json'   , $class . ':jsonAction');
        $routeset->add( '/collection.yml'   , $class . ':yamlAction');
        return $routeset;
    }

    // this is for javascript-end (optional)
    public $target;


    public function getId()
    {
        static $id;
        if($id)
            return $id;
        $id = str_replace('\\','-',get_class($this)) . '-' . uniqid();
        return $id;
    }

    public function getCollection()
    {
        $collection = new $this->collectionClass;
        if( $this->order ) {
            foreach( $this->order as $order ) {
                if( is_array($order) ) {
                    $collection->orderBy($order[0] , @$order[1] ?: 'DESC');
                } else {
                    $collection->orderBy($order);
                }
            }
        }
        return $collection;
    }

    public function yamlAction()
    {
        header('Content-Type: application/yaml; charset=utf-8;');
        return $this->getCollection()->toYAML();
    }

    public function jsonAction() 
    {
        header('Content-Type: application/json; charset=utf-8;');
        return $this->getCollection()->toJSON();
    }

    public function getItemList()
    {
        $collection = $this->getCollection();
        $items = array();
        foreach( $collection as $item ) {
            $label = $this->labelField ? $item->{ $this->labelField } : $item->dataLabel();
            $value = $this->valueField ? $item->{ $this->valueField } : $item->dataValue();
            $items[] = array(
                'label' => $label,
                'value' => $value,
                'data'  => $item->toArray(),
            );
        }
        return $items;
    }

    public function listYamlAction()
    {
        return $this->toYaml( $this->getItemList() );
    }

    public function listJsonAction()
    {
        return $this->toJson( $this->getItemList() );
    }

    public function indexAction() 
    {
        $this->target = $this->request->param('target');
        $items = $this->getItemList();
        return $this->render('@CRUD/chooser.html',array(
            'Chooser' => $this,
            'Collection' => $collection,
            'Items' => $items,
        ));
    }

}

