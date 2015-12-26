<?php
namespace CRUD\Exporter;
use LazyRecord\Schema\DeclareSchema;
use LazyRecord\BaseCollection;
use LazyRecord\Exporter\CSVExporter as BaseCSVExporter;

class CSVExporter extends BaseExporter
{
    /**
     * Export collection to PHP output stream.
     *
     * @param BaseCollection $collection
     */
    public function exportOutput(BaseCollection $collection, $attachmentName = null)
    {
        $filename = $attachmentName ?: $this->schema->getTable() . "-" . time() . ".csv";

        // use "text/csv" according to RFC 4180.
        header("Content-Type: text/csv; charset=UTF-8");
        header("Content-Disposition: attachment; filename=$filename");
        $outputFd = fopen('php://output', 'w');
        $exporter = new BaseCSVExporter($outputFd);
        $exporter->exportCollection($collection, $this->exportFields);
    }

}
