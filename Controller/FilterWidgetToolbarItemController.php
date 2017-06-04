<?php
namespace CRUD\Controller;
use Phifty\Routing\Controller;
use Exception;

class FilterWidgetToolbarItemController extends ToolbarItemController
{
    protected $_fieldName;

    public function __construct($fieldName)
    {
        $this->_fieldName = $fieldName;
        $this->init();
    }

    public function getFieldName()
    {
        return $this->_fieldName;
    }

    public function controlAction() 
    {
        $fieldName = $this->getFieldName();
        $handler = $this->getHandler();
        $model = $handler->getModel();
        $action = $model->asCreateAction();

        $param = $action->getParam( $fieldName );
        if (!$param) {
            throw new Exception("$fieldName param is not defined in action: " . get_class($action) );
        }
        $widget = $param->createWidget(null,array( 'allow_empty' => true ));
        $widget->name = '_filter_' . $fieldName;
        return $this->render('@CRUD/filter.html',array( 'widget' => $widget ));
    }

    public function handleCollection($collection) 
    {
        $fieldName = $this->getFieldName();
        $handler = $this->getHandler();
        $value = $handler->request->param('_filter_' . $fieldName);
        if ( $value !== null && $value !== "" ) {
            $collection->where()->equal($fieldName, $value);
        }
    }

}
