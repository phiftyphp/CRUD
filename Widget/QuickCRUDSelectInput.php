<?php
namespace CRUD\Widget;
use FormKit\Widget\SelectInput;

class QuickCRUDSelectInput extends SelectInput
{
    public $class = array('formkit-widget','formkit-widget-quick-select');
    public $record_class;
    public $dialog_path;

    public function render( $attributes = array() )
    {
        $id = $this->getSerialId();
        $html = parent::render( $attributes );

        $recordClass = $this->record_class;

        $record = new $recordClass;
        $deleteAction = $record->getRecordActionClass('Delete');

        $env = kernel()->twig->env;
        $html .= $env->render('@CRUD/widgets/quick_crud_widget.html',array( 
            // 'createAction' => str_replace('\\','::',$createAction),
            'deleteAction' => str_replace('\\','::',$deleteAction),
            'selectInputId' => $id,
            'dataLabelField' => $record->getDataLabelField(),
            'dataValueField' => $record->getDataValueField(),
            'dialogPath' => $this->dialog_path,
            'self' => $this,
        ));
        return $html;
    }

}



