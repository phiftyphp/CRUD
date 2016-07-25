<?php
namespace CRUD;

trait CRUDListActions {

    /**
     * @var array column id list for crud list page.
     */
    public $listColumns;

    /**
     * @var array not so important columns for crud list page.
     */
    public $listRightColumns = array();

    public $listMiddleColumns = array();

    protected $_listColumnNames = array();


    /**
     * Render list panel.
     *
     * The list panel operates the list_inner region with some filter controls.
     */
    public function listRegionAction()
    {
        // init toolbar controls here, because we need to show the panel.
        $this->initToolbarControls();
        $region = $this->createListInnerRegion($_REQUEST);
        $this->assign('listInnerRegion', $region);

        // please note that we will get all items in list region since we don't have constraint
        $collection = $this->getCollection();

        $this->assignCRUDVars([
            // so here is the number of total items
            'NumberOfTotalItems' => $collection->queryCount(),
        ]);

        // If reactApp (CRUDListApp) is defined, render a template to initialize the React App
        if ($this->reactListApp) {
            return $this->render($this->findTemplatePath('react/list.html'), [
                'ReactElementId' => uniqid($this->reactListApp),
                'ReactAppName'   => $this->reactListApp,
                'ReactAppConfig' => $this->buildReactListAppConfig(),
            ]);
        }
        return $this->render($this->findTemplatePath('list.html'), []);
    }

    /**
     * Prepare default/build-in template variable for list region.
     */
    public function listInnerRegionAction()
    {
        // init toolbar controls here, becase we need to handle the logic
        $this->initToolbarControls();
        $collection = $this->getCollection();
        $this->assignCRUDVars(array(
            'Items'   => $collection,
            'Pager'   => $this->createCollectionPager($collection),
            'Columns' => $this->getListColumns(),
        ));
        return $this->render( $this->findTemplatePath('list_inner.html'));
    }

    public function getListRegionPath()
    {
        return $this->getRoutePrefix() . '/crud/list';
    }

    public function getListInnerRegionPath()
    {
        return $this->getRoutePrefix() . '/crud/list_inner';
    }

    /**
     * Returns list title
     *
     * @return string title string for list view.
     */
    public function getListTitle()
    {
        // return __('%1 Management' , $this->getModel()->getLabel() );
        return __('%1 管理' , $this->getModel()->getLabel() );
    }


    /**
     * Get list columns for list view.
     */
    public function getListColumns()
    {
        if ( $this->_listColumnNames ) {
            return $this->_listColumnNames;
        }

        $this->kernel->event->trigger('phifty.crud.list_column_before',$this);

        $columnNames = array();
        if ( $this->listColumns ) {
            $columnNames = array_merge($this->listColumns,
                $this->listMiddleColumns,
                $this->listRightColumns
            );
        } else {
            // $columnNames = $this->getModel()->getColumnNames();
            $columnNames = $this->getModel()->getRenderableColumnNames();
        }

        return $this->_listColumnNames = $columnNames;
    }

}


