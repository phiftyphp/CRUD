<?php
namespace CRUD\Action;
use ActionKit\Action;

class UploadSessionFile extends Action
{
    public function schema()
    {
        $this->param('file', 'File')
            ->putIn('upload');
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
        return $this->success('上傳成功');
    }
}










