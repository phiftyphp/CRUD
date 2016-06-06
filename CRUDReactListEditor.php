<?php
namespace CRUD;

/**
 * This class should be preferred over CRUDReactListApp
 *
 * CRUDReactListApp should be deprecated.
 */
trait CRUDReactListEditor extends CRUDReactListApp {
    /**
     * @var string The react application name
     */
    protected $reactListApp = 'CRUDReactListEditor';
}

