<?php
namespace CRUD;
use PHPExcel_IOFactory;


/**
 * Generates data preview from uploaded excel file.
 */
class ExcellPreviewGenerator
{
    /**
     * @return array [ 'headers' => ..., 'rows' => .... ]
     */
    static public function preview($excelPath, $maxRows = 5)
    {
        $return = [];

        $excel = PHPExcel_IOFactory::load($excelPath);
        $worksheet = $excel->getActiveSheet();
        $sheetTitle = $worksheet->getTitle();
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






