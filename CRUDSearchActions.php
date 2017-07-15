<?php

namespace CRUD;

use Universal\Http\HttpRequest;
use Maghead\Runtime\Collection;

trait CRUDSearchActions {

    /**
     * @var array Fields that are allowed for searching.
     */
    protected $searchQueryFields = [];

    /**
     * @var array model fields for quicksearch
     */
    public $quicksearchFields;


    /**
     * search method applied request query to collection
     */
    protected function search(HttpRequest $request)
    {
        $model = $this->getModel();
        $schema = $model->getSchema();
        $collection = $this->getCollection();
        foreach ($this->searchQueryFields as $field) {
            if ($queryParam = $request->param($field)) {
                $collection->where()
                    ->equal($field, $queryParam)
                    ;
            }
        }
        return $collection;
    }

    /**
     * @param $where Conditions
     */
    protected function appendCollectionConditions($where, $q)
    {
        $c = 0;
        foreach ($this->quicksearchFields as $field) {
            if ($c++ < 1) {
                $where = $where->like( $field , '%' . $q . '%' );
            } else {
                $where = $where->or()->like( $field , '%' . $q . '%' );
            }
        }
    }


    protected function composite(Collection $collection)
    {
        return $collection->toInflatedArray();
    }


    /**
     * Provide the search functionality to return matched collection in JSON
     * format response.
     */
    public function searchAction()
    {
        $collection = $this->search($this->getRequest());
        return $this->toJson($this->composite($collection));
    }
}
