<?php
namespace CRUD;
use Pux\Controller\ExpandableController;

abstract class BaseCRUDHandler extends ExpandableController
{
    protected $kernel;

    /**
     * @var string plugin name space
     */
    public $namespace;

    /**
     * @var string Model class, full-qualified model class.
     */
    public $modelClass;

    /**
     * @var string model short class name, optional, can be extracted from 
     *            full-qualified model class name 
     */
    public $modelName;


    /**
     * @var string CRUD ID, which is the namespace of template path or can be used in URL.
     *
     *    /bs/{{ crud_id }}
     *    Templates/{{crud_id}}/edit.html
     *
     */
    public $crudId;


    /**
     * @var string The template path ID (default to crudId)
     */
    public $templateId;


    /**
     * @var string the custom template namespace
     *
     * Fallback to @CRUD namespace if the override template does not exists.
     */
    public $customTemplateNamespace;

    /**
     * @var Phifty\Model model object for cache, please use getModel() method
     */
    protected $_model;


    public function init()
    {
        $this->vars['CRUD']['Object'] = $this;
        $this->kernel = kernel();

        if (! $this->namespace) {
            // extract namespace from model class name
            $parts = explode( '\\', ltrim($this->modelClass,'\\') );
            $this->namespace = $parts[0];
            if ( ! $this->modelName ) {
                $this->modelName = end($parts);
            }
        }

        if (! $this->modelName) {
            $refl = new ReflectionClass( $this->modelClass );
            $this->modelName = $refl->getShortName();
        }

        if ( ! $this->crudId ) {
            $this->crudId = \Phifty\Inflector::getInstance()->underscore($this->modelName);;
        }

        if ( ! $this->templateId ) {
            $this->templateId = $this->crudId;
        }
    }

    /**
     * Get model object.
     *
     * @return Phifty\Model
     */
    public function getModel()
    {
        if ( $this->_model ) {
            return $this->_model;
        }
        return $this->_model = new $this->modelClass;
    }

    public function getModelClass()
    {
        return $this->modelClass;
    }

    /**
     * Return the collection for list region.
     *
     * @return LazyRecord\BaseCollection
     */
    public function getCollection()
    {
        $model = $this->getModel();
        $collection = $model->asCollection();
        if ( $this->debug && class_exists('FB') ) {
            \FB::info( $collection->toSQL() );
        }
        return $collection;
    }


}
