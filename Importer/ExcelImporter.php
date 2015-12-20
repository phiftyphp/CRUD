<?php
namespace CRUD;
use PHPExcel_IOFactory;
use LazyRecord\BaseModel;
use LazyRecord\Schema\DeclareSchema;


/**
 * Generates data preview from uploaded excel file.
 */
class ExcelImporter
{
    protected $model;

    protected $schema;

    protected $filepath;

    public function __construct(BaseModel $model, $filepath)
    {
        $this->model = $model;
        $this->schema = $model->getSchema();
        $this->excelPath = $filepath;
    }

    public function import()
    {

    }

    /**
     * @return array [ 'headers' => ..., 'rows' => .... ]
     */
    public function getPreview($maxRows = 5)
    {
        $return = [];
        $excel = PHPExcel_IOFactory::load($this->filepath);
        $worksheet   = $excel->getActiveSheet();
        $sheetTitle  = $worksheet->getTitle();
        $rowIterator = $worksheet->getRowIterator();

        $headers = array();
        $cellIterator = $rowIterator->current()->getCellIterator();
        $cellIterator->setIterateOnlyExistingCells(false); // Loop all cells, even if it is not set
        foreach ($cellIterator as $cell) {
            $headers[] = $cell->getCalculatedValue();
        }
        $return['headers'] = $headers;

        $rows = [];
        $rowIterator->next(); // skip the header row
        while ($maxRows-- && $rowIterator->valid()) {
            $row = $rowIterator->current();

            $cellIterator = $row->getCellIterator();
            $cellIterator->setIterateOnlyExistingCells(false); // Loop all cells, even if it is not set

            $rowArray = [];
            foreach ($cellIterator as $cell) {
                $rowArray[] = trim($cell->getCalculatedValue());
            }
            $rowIterator->next();
            $rows[] = $rowArray;
        }
        $return['rows'] = $rows;
        return $return;
    }
}






