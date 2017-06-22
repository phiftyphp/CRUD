<?php
namespace CRUD\Action;
use WebAction\Action;

/**
 * UploadSessionFile uploads the file from form and save the uploaded file path
 * in the current session.
 */
class UploadSessionFile extends Action
{
    public function schema()
    {
        $this->param('file', 'File')
            ->label('檔案')
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
        return $this->success('上傳成功', [
            'filepath' => $filePath,
        ]);
    }
}
