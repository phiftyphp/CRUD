<?php
namespace CRUD\Action;
use ActionKit\Action;
use CRUD\Importer\ExcelImporter;
use LazyRecord\BaseModel;

abstract class ImportSimple extends Action
{
    /**
     * @var LazyRecord\BaseModel
     */
    protected $recordClass;

    /**
     * @var array $importFields
     */
    protected $importFields;

    public function run()
    {
        $kernel = kernel();
        $currentUser = $kernel->currentUser;
        if (!$currentUser->isLogged()) {
            return $this->error('權限不足。');
        }

        // get the current upload file
        $session = kernel()->session;
        $excelPath = $session->get('_current_upload');
        if (!$excelPath) {
            return $this->error('無上傳檔案。');
        }

        // TODO: currently we only support excel files
        $recordClass = $this->recordClass;
        $record = new $recordClass;
        $importer = new ExcelImporter($record->getSchema(), $this->importFields);
        list($imported, $skipped, $records) = $importer->import($excelPath);
        $numOfRecords = count($records);
        return $this->success('匯入成功，共 ' . $numOfRecords . ' 筆資料匯入。 ' . $skipped . ' 筆重複資料。', [
            'number_of_records' => $numOfRecords,
            'imported'          => $imported,
            'skipped'           => $skipped,
        ]);
    }
}

