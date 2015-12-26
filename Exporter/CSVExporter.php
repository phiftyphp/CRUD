<?php
namespace CRUD\Exporter;
use LazyRecord\Schema\DeclareSchema;
use LazyRecord\BaseCollection;
use LazyRecord\Exporter\CSVExporter as BaseCSVExporter;

class CSVExporter extends BaseExporter
{

    protected $fileExtension = 'csv';

    protected function defaultFilename()
    {
        return $this->schema->getTable() . "-" . time() . "." . $this->fileExtension;
    }

    /**
     * Export collection to PHP output stream.
     *
     * @param BaseCollection $collection
     */
    public function exportOutput(BaseCollection $collection, $attachmentName = null)
    {
        $filename = $attachmentName ?: $this->defaultFilename();

        // use "text/csv" according to RFC 4180.
        header("Content-Type: text/csv; charset=UTF-8");
        header("Content-Disposition: attachment; filename=$filename");
        $outputFd = fopen('php://output', 'w');
        $exporter = new BaseCSVExporter($outputFd);
        $exporter->exportCollection($collection, $this->exportFields);
    }

}
