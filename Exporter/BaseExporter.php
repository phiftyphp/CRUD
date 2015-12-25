<?php
namespace CRUD\Exporter;
use LazyRecord\Schema\DeclareSchema;
use LazyRecord\BaseCollection;

abstract class BaseExporter
{

    protected $schema;

    protected $exportFields;

    public function __construct($schema, array $exportFields = null)
    {
        $this->schema = $schema;
        $this->exportFields = $exportFields;
    }

    abstract public function exportOutput(BaseCollection $collection);
}
