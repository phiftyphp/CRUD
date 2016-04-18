<?php
namespace CRUD;
use CRUD\Exporter\CSVExporter;
use CRUD\Exporter\ExcelExporter;

trait CRUDExporter {

    // ==================================================================
    // Actions for exporting data
    // ==================================================================
    public function exportCsvAction()
    {
        $model = $this->getModel();
        $schema = $model->getSchema();
        $collection = $this->getCollection();
        // $exporter = new CSVExporter($schema);
        $exporter = new ExcelExporter($schema);
        $exporter->setFormat('CSV');
        $exporter->exportOutput($collection);
    }

    public function exportExcelAction()
    {
        $model = $this->getModel();
        $schema = $model->getSchema();
        $collection = $this->getCollection();
        $exporter = new ExcelExporter($schema);
        $exporter->exportOutput($collection);
    }



}
