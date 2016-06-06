<?php
namespace CRUD;

/**
 * This class should be preferred over CRUDReactListApp
 *
 * CRUDReactListApp should be deprecated.
 */
trait CRUDReactListEditor {
    /**
     * @var string The react application name
     */
    protected $reactListApp = 'CRUDReactListEditor';

    /**
     * Export config array for building react list app
     *
     * @return array
     */
    public function buildReactListAppConfig()
    {
        return [
            "crudId"           => $this->crudId,
            "basepath"         => $this->getRoutePrefix(),
            "namespace"        => $this->namespace,
            "model"            => $this->modelName,
            "modelLabel"       => $this->getRecordLabel(),
            "permissions"      => $this->getPermissionConfig(),
            "disableSelection" => $this->disableSelection,
            "controls"         => $this->buildReactListAppControlsConfig(),
        ];
    }

    /**
     * buildReactListAppControlsConfig builds the control definitions 
     * for the react app.
     */
    protected function buildReactListAppControlsConfig()
    {
        $controls = [];
        if ($this->canCreate) {
            $controls[] = [
                "label" => $this->getCreateButtonLabel(),
                "feature" => "create"
            ];
        }
        if ($this->canImport) {
            $controls[] = [
                "label" => "Import",
                "feature" => "import"
            ];
        }
        if ($this->canExport) {
            $controls[] = [
                "label" => "Export",
                "feature" => "export",
            ];
        }
        return $controls;
    }
}

