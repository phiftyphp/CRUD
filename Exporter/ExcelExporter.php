<?php
namespace CRUD\Exporter;
use LazyRecord\Schema\DeclareSchema;
use LazyRecord\BaseCollection;
use LazyRecord\Exporter\CSVExporter as BaseCSVExporter;
use PHPExcel;
use PHPExcel_IOFactory;
use PHPExcel_Cell;

class ExcelExporter extends BaseExporter
{

    protected $excelFormat = 'Excel2007';

    protected $fileExtension = 'xlsx';

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
        $excel = new PHPExcel();
        $sheet = $excel->setActiveSheetIndex(0);

        $schema = $this->schema;
        $columnNames = $this->exportFields ?: $schema->getColumnNames();
        $columnNameMap = array_flip($columnNames);

        foreach ($columnNames as $index => $name) {
            $columnKey = PHPExcel_Cell::stringFromColumnIndex($index);
            $sheet->setCellValue($columnKey . '1', $schema->getColumn($name)->name);
        }
        // Generate data block
        $row = 2;
        foreach ($collection as $record) {
            foreach ($columnNames as $index => $columnName) {
                $column = $schema->getColumn($columnName);
                $columnKey = PHPExcel_Cell::stringFromColumnIndex($index);
                $value = $record->getValue($columnName);

                if ($value === null) {
                    $text = '';
                } else if ($column->isa == 'bool') {
                    $text = $value ? '1' : '0';
                } else {
                    $text = (string) $value;
                }
                $sheet->setCellValue($columnKey . $row, $text);
            }
            $row++;
        }

        $filename = $attachmentName ?: $this->defaultFilename();
        // Redirect output to a client’s web browser (Excel2007)
        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Disposition: attachment;filename="'.$filename.'"');
        header('Cache-Control: max-age=0');
        // If you're serving to IE 9, then the following may be needed
        header('Cache-Control: max-age=1');
        // If you're serving to IE over SSL, then the following may be needed
        header ('Expires: Mon, 26 Jul 1997 05:00:00 GMT'); // Date in the past
        header ('Last-Modified: '.gmdate('D, d M Y H:i:s').' GMT'); // always modified
        header ('Cache-Control: cache, must-revalidate'); // HTTP/1.1
        header ('Pragma: public'); // HTTP/1.0
        $writer = PHPExcel_IOFactory::createWriter($excel, $this->excelFormat);
        $writer->save('php://output');
    }

}
