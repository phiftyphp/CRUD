<?php

namespace CRUD;

use LazyRecord\BaseModel;
use ActionKit\Action;

trait CRUDReactHasManyEditor
{
    public function buildReactHasManyEditorConfig(BaseModel $parentRecord, $relationId)
    {
        $modelClass = $this->getModelClass();
        $model = new $modelClass();
        $schema = $model->getSchema();

        // The base config
        $config = [
            'title' => $schema->getLabel(),
            'basepath' => '/bs/'.$this->crudId, // TODO: remove this dependency, is there a way to predefine this?
            'crudId' => $this->crudId,
            'parentAction' => $parentRecord->id ? 'edit' : 'create',
        ];

        $config['itemDesc'] = $this->itemDesc();

        $config['schema'] = ['primaryKey' => $schema->primaryKey];

        $parentSchema = $parentRecord->getSchema();
        $relationship = $parentSchema->getRelation($relationId);
        $config['references'][ $relationship['foreign_column'] ] = [
            'record' => $parentRecord->toArray(),
            'key' => $relationship['self_column'],
            'referedRelationship' => $relationship->accessor,
        ];

        if ($this->canDelete) {
            // Always delete record by primary key
            $deleteActionClass = $this->getModelActionClass($model, 'Delete');
            $config['delete'] = [
                'action' => str_replace('\\', '::', $deleteActionClass),
                'confirm' => '確認刪除?',
            ];
        }

        return $config;
    }
}
