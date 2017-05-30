<?php

namespace CRUD;

trait CRUDPermissions
{
    /**
     * Return the config of the current permission items
     */
    public function getPermissionConfig()
    {
        return [
            'canCreate'           => $this->canCreate,
            'canUpdate'           => $this->canUpdate,
            'canDelete'           => $this->canDelete,
            'canExport'           => $this->canExport,
            'canImport'           => $this->canImport,
            'canBulkEdit'         => $this->canBulkEdit,
            'canBulkCopy'         => $this->canBulkCopy,
            'canBulkDelete'       => $this->canBulkDelete,
            'canEditInNewWindow'  => $this->canEditInNewWindow,
        ];
    }
}
