<?php
namespace CRUD\Exporter;
use LazyRecord\Schema\DeclareSchema;
use LazyRecord\BaseCollection;
use LazyRecord\Exporter\CSVExporter as BaseCSVExporter;
use PHPExcel;
use PHPExcel_IOFactory;
use PHPExcel_Cell;
use Exception;

class ExcelExporter extends BaseExporter
{
    protected $excelFormat = 'Excel2007';

    protected $fileExtension = 'xlsx';

    static public $supportedFormats = [
        'Excel2007' => 'xlsx',
        'Excel5' => 'xls',
        'Excel2003XML' => 'xml',
        'CSV' => 'csv',
    ];

    static public $formatContentHeaders = [
        'Excel2007'    => 'Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Excel5'       => 'Content-Type: application/vnd.ms-excel',
        'Excel2003XML' => 'Content-Type: text/xml',
        'PDF'          => 'Content-Type: application/pdf',
        'ODS'          => 'Content-Type: application/vnd.oasis.opendocument.spreadsheet',
        'CSV'          => ['Content-Type: application/octet-stream', 'Content-Transfer-Encoding: binary'],
        // 'CSV'          => ['Content-Type: text/csv; charset=UTF-16LE'],
    ];

    protected function defaultFilename()
    {
        return $this->schema->getTable() . "-" . time() . "." . $this->fileExtension;
    }

    public function getSupportedFormatNames()
    {
        return array_keys(self::$supportedFormats);
    }

    public function getSupportedFormats()
    {
        return self::$supportedFormats;
    }

    public function isSupportedFormat($format)
    {
        return isset(self::$supportedFormats[$format]);
    }


    public function setFormat($format)
    {
        if ($this->isSupportedFormat($format)) {
            $this->excelFormat = $format;
            $this->fileExtension = self::$supportedFormats[$format];
        } else {
            throw new Exception("Unsupported format $format");
        }
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
        // Redirect output to a client’s web browser

        if (isset(self::$formatContentHeaders[$this->excelFormat])) {
            $headers = (array) self::$formatContentHeaders[$this->excelFormat];
            foreach ($headers as $header) {
                header($header);
            }
        } else {
            header("Content-Type: application/octet-stream");
        }



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

        if ($this->excelFormat == 'CSV') {
            ob_start();
            // $writer->setExcelCompatibility(true);
            $writer->save('php://output');
            $content = ob_get_contents();
            ob_clean();
            echo chr(255).chr(254);
            // echo iconv("UTF-8", "UTF-16LE//IGNORE", $content);
            echo mb_convert_encoding($content,"UTF-16LE","UTF-8");
        } else {
            $writer->save('php://output');
        }
    }

}
