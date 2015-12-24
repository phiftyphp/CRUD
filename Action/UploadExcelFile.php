<?php
namespace CRUD\Action;
use ActionKit\Action;

class UploadExcelFile extends Action
{
    public function schema()
    {
        $this->param('file', 'File')
            ->label('檔案')
            ->putIn('upload');

        $this->param('advanced')
            ->label('進階匯入')
            ->renderAs('CheckboxInput')
            ;
    }

    public function run()
    {
        if (!kernel()->currentUser->hasLoggedIn()) {
            return $this->error('無上傳權限。');
        }
        parent::run();
        $filePath = $this->arg('file');
        $session = kernel()->session;
        $session->set('_current_upload', $filePath);
        return $this->success('上傳成功', [
            'filepath' => $filePath,
            'advanced' => intval($this->arg('advanced')),
        ]);
    }
}
