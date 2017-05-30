<?php

namespace CRUD;

trait CRUDUploadActions
{
    protected $uploadActionClass = 'CRUD\\Action\\UploadExcelFile';

    public function importUploadRegionAction()
    {
        $uploadActionClass = $this->uploadActionClass;
        $upload = new $uploadActionClass;
        $uploadView = $upload->asView($this->actionViewClass, [
            'ajax' => true,
            'submit_btn' => false,
            'close_btn' => false,
            '_form_controls' => false,
        ]);
        return $this->render($this->findTemplate('import_upload.html.twig'), [
            'upload' => $upload,
            'uploadView' => $uploadView,
        ]);
    }

    public function importSampleDownloadAction()
    {
        $schema = $this->getModelSchema();

        $importer = new ExcelImporter($schema, $this->importFields);
        $excel = $importer->createSampleExcel();

        $filename = "sample_{$this->crudId}.xlsx";
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
        $excelWriter = PHPExcel_IOFactory::createWriter($excel, 'Excel2007');
        $excelWriter->save('php://output');
        exit;
    }

    public function importColumnMapRegionAction()
    {
        $session = $this->kernel->session;
        $uploadedFile = $session->get('_current_upload');

        $schema = $this->getModelSchema();
        $columnDefinitions = $schema->getColumns();

        $columnOptions = [];
        foreach ($columnDefinitions as $definition) {
            if (!$definition->label) {
                continue;
            }
            $columnOptions[$definition->label] = $definition->name;
        }

        $columnHeaders = [];
        $previewRows = [];

        if (preg_match('/\.csv$/', $uploadedFile)) {
            $fp = fopen($uploadedFile, 'r');
            if ($_columnHeaders = fgetcsv($fp)) {
                $columnHeaders = $_columnHeaders;

                $i = 5;
                while ($i-- && $row = fgetcsv($fp)) {
                    $previewRows[] = $row;
                }
            }
            fclose($fp);

        } else if (preg_match('#.xls(x)?$#', $uploadedFile)) {

            $importer = new ExcelImporter($schema, $this->importFields);
            $preview = $importer->preview($uploadedFile);
            $columnHeaders = $preview['headers'];
            $previewRows = $preview['rows'];

        } else {
            // TODO: show error message
        }

        $columnSelect = new SelectInput('columns[]', [
            'options' => $columnOptions,
            'allow_empty' => [0, "-- 請選擇 --"],
        ]);

        return $this->render($this->findTemplate('import_column_map.html.twig'), [
            'columnSelect'  => $columnSelect,
            'columnHeaders' => $columnHeaders,
            'previewRows'   => $previewRows,
        ]);
    }
}
