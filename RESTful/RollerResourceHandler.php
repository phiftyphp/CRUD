<?php
namespace CRUD\RESTful;
use Roller\Plugin\RESTful\ResourceHandler as BaseResourceHandler;

class RollerResourceHandler extends BaseResourceHandler
{
    public $recordClass;

    public function createCollection() 
    {
        return $this->createModel()->asCollection();
    }

    public function createModel() 
    {
        return new $this->recordClass;
    }

    public function loadRecord($id)
    {
        $record = $this->createModel();
        $ret = $record->load($id);
        $this->checkRecordResult($ret);
        return $record;
    }

    public function checkRecordResult($result) 
    {
        if ( ! $result->success ) {
            $this->codeForbidden();
            die($result->message);
        }
    }



    /**
     * retrieve record list
     */
    public function find() {
        $collection = $this->createCollection();
        // $count = $collection->queryCount();
        if ( isset( $_GET['page'] ) ) {
            $collection->page( $_GET['page'] );
        }
        return $collection->toArray();
    }

    /**
     * create new record
     */
    public function create() {

    }

    /**
     * delete record
     */
    public function delete($id) {

    }


    /**
     * update record 
     */
    public function update($id) {
        $record = $this->loadRecord($id);
        $put = $this->parseInput();
        $ret = $record->update($put);
        $this->checkRecordResult($ret);
        return $record->toArray();
    }

    public function load($id) {
        $record = $this->loadRecord($id);
        return $record->toArray();
    }
}


