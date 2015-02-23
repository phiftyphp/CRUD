<?php
namespace CRUD;
use Phifty\Web\RegionPager;
use Phifty\Web\Region;
use Phifty\Controller;
use ReflectionClass;
use Closure;
use Roller\RouteSet;
use CRUD\Controller\ToolbarItemController;
use CRUD\Controller\FilterWidgetToolbarItemController;
use LazyRecord\BaseModel;


/**
 * Current CRUD template structure:
 *
 *    {AppName}/templates/
 *       {templateId}/index.html
 *       {templateId}/edit.html
 *       {templateId}/list.html
 *       {templateId}/page.html
 *       {templateId}/dialog.html  (edit record in dialog)
 *
 *
 * Controller Actions (pages):
 *
 *    indexAction
 *    editAction
 *    createAction
 *
 * Controller Actions (regions):
 *
 *    indexRegionAction
 *    editRegionAction
 *    createRegionAction
 *    listRegionAction
 *
 *
 * Front-end path is mounted on /bs/{crudId or templateId}
 *
 */
abstract class CRUDHandler extends BaseCRUDHandler
{


    /*
     * Configurations:
     *
     * canCreate: display create button.
     * canUpdate: display edit button.
     * canDelete: display delete button.
     * canBulkEdit: display checkbox for items and the bulk operation selector.
     * canBulkCopy: show bulk copy action in the bulk action list.
     * canBulkDelete: show bulk delete action in the bulk action list.
     */
    public $canCreate = true;

    public $canUpdate = true;

    public $canDelete = true;


    /**
     * @var boolean Can user do all bulk operations ?
     */
    public $canBulkEdit = false;

    /**
     * @var boolean Can user do bulk copy ?
     */
    public $canBulkCopy = false;


    /**
     * @var boolean Can user delete bulk records ?
     */
    public $canBulkDelete = false;



    /**
     * @var boolean Can user edit record in new window ?
     */
    public $canEditInNewWindow = false;


    /**
     * @var array predefined data for new record
     */
    public $predefined = array();



    /**
     * @var bool use the default template, so you don't have to create template pages.
     */
    public $useDefaultTemplate = false;



    /**
     * @var bool debug flag, currently only output the collection SQL
     *
     * TODO: we may also use firephp to output some debug information to the console.
     */
    public $debug = false;




    /**
     * @var array model fields for quicksearch
     */
    public $quicksearchFields;

    /**
     * Current action object. (created from currentRecord)
     */
    public $currentAction;



    /**
     * Default action view class for editing.
     */
    public $actionViewClass = 'AdminUI\\Action\\View\\StackView';

    /**
     * Default action view options,
     * Use ajax, and show close_button
     */
    public $actionViewOptions = array(
        'ajax' => true,
        'submit_btn' => true,
        'close_btn' => true,
    );


    public $parentRelationship;

    /**
     * @var array register CRUD Action automatically
     */
    public $registerRecordAction = array('Create','Update','Delete','BulkDelete');

    /**
     * @var ToolbarItemController[]
     */
    protected $_toolbarItems = array();

    /**
     * @var Phifty\Model the record object.
     */
    public $currentRecord;


    /**
     * @var integer the default record Limit per page
     */
    public $pageLimit = 15;


    /**
     * @var array template variables.
     */
    public $vars = array();

    /** 
     * @var array the default collection order, which is used by orderCollection method.
     */
    public $defaultOrder = array('id', 'DESC');


    /**
     * @var array The primary fields are defined for the minimal CRUD UI components.
     */
    public $primaryFields;


    /**
     * @var array column id list for crud list page.
     */
    public $listColumns;


    /**
     * Define filter columns to show the filter widgets
     */
    public $filterColumns = array();

    /**
     * @var array not so important columns for crud list page.
     */
    public $listRightColumns = array();

    public $listMiddleColumns = array();

    protected $_listColumnNames = array();

    /**
     * @var array tab panel objects
     */
    public static $tabs = array();


    /**
     * @var array Column value formatters.
     */
    public $formatters = array();

    public $bundle;


    /**
     * Expand routes to RouteSet
     */
    public static function expand()
    {
        // TODO:
        // here we construct the object, so that
        // we will register the CRUD actions.
        // we should move the ModelName extraction to static,
        // so that we won't waste too much resource on creating objects.
        $handler = new static;
        $class = get_class($handler);
        $routes = new \Roller\RouteSet;
        $routes->add('/'            , $class . ':indexAction' );
        $routes->add('/crud/index'  , $class . ':indexRegionAction');
        $routes->add('/crud/create' , $class . ':createRegionAction');
        $routes->add('/crud/edit'   , $class . ':editRegionAction');

        $routes->add('/crud/item'   , $class . ':itemRegionAction');

        $routes->add('/crud/list'   , $class . ':listRegionAction');
        $routes->add('/crud/list_inner'   , $class . ':listInnerRegionAction');
        $routes->add('/crud/modal' , $class . ':modalEditRegionAction');
        $routes->add('/crud/dialog' , $class . ':dialogEditRegionAction');
        $routes->add('/edit'        , $class . ':editAction');
        $routes->add('/create'      , $class . ':createAction');

        if ( $handler->primaryFields ) {
            $routes->add( '/crud/quick_create', $class . ':quickCreateAction' );
        }
        return $routes;
    }



    public function init()
    {
        parent::init();
        $rclass = new ReflectionClass($this);
        $ns = $rclass->getNamespaceName();

        // XXX: currently we use FooBundle\FooBundle as the main bundle class.
        $bundleClass = "$ns\\$ns";
        if ( class_exists($bundleClass) ) {
            $this->bundle = $this->vars['Bundle'] = $bundleClass::getInstance();
        } else {
            $bundleClass = "$ns\\Application";
            $this->bundle = $this->vars['Bundle'] = $bundleClass::getInstance();
        }

        $this->vars['Handler'] = $this;
        $this->vars['Controller'] = $this;

        // anyway, we have the model classname, and the namespace, 
        // we should be able to registerRecordAction automatically, so we don't have to write the code.
        if ( $this->registerRecordAction ) {
            $self = $this;
            kernel()->event->register('phifty.before_action',function() use($self) {
                kernel()->action->registerRecordAction( $self->namespace , $self->modelName , $self->registerRecordAction );
            });
        }

        // Update CRUDHandler properties from config 
        if ( $crudConfig = $this->bundle->config( $rclass->getShortName() ) ) {
            $properties = [ 'canCreate', 'canUpdate', 'canDelete' ];
            foreach( $properties as $key ) {
                $val = $crudConfig->lookup($key);
                if ( $val !== null ) {
                    $this->$key = $val;
                }
            }
        }


        /*
         * TODO:  Move this to before render CRUD page, keep init method simple

        if ( $this->isI18NEnabled() ) {
            $this->primaryFields[] = 'lang';
        }
        */
    }


    // Toolbar related methods (used in indexAction)

    public function addToolbarItem(ToolbarItemController $controller)
    {
        // pass current CRUD handler object to the toolbar item controller.
        $controller->setHandler($this);
        $this->_toolbarItems[] = $controller;
    }

    public function initToolbarControls()
    {
        if ( $this->filterColumns ) {
            foreach( $this->filterColumns as $n ) {
                $this->addToolbarItem(new FilterWidgetToolbarItemController($n));
            }
        }
    }


    public function renderToolbarControls()
    {
        // trigger toolbar render event
        $this->kernel->event->trigger('phifty.crud.toolbar_init',$this);
        foreach( $this->_toolbarItems as $controller ) {
            echo $controller->controlAction();
        }
    }



    // Route related methods

    public function getDialogRegionPath()
    {
        return $this->getRoutePrefix() . '/crud/dialog';
    }

    public function getCreateRegionPath()
    {
        return $this->getRoutePrefix() . '/crud/create';
    }

    public function getEditRegionPath()
    {
        return $this->getRoutePrefix() . '/crud/edit';
    }

    public function getListRegionPath()
    {
        return $this->getRoutePrefix() . '/crud/list';
    }


    public function getListInnerRegionPath()
    {
        return $this->getRoutePrefix() . '/crud/list_inner';
    }


    public function getIndexRegionPath()
    {
        return $this->getRoutePrefix() . '/crud/index';
    }



    public function getRoutePrefix()
    {
        return static::get_mount_path();
    }



    // Region methods
    // =================================================


    public function createListRegion( $args = array())
    {
        $region = Region::create($this->getListRegionPath(), $args);
        $region->container->setAttributeValue('data-effect-class','animated flipInY');
        return $region;
    }

    public function createListInnerRegion( $args = array())
    {
        $region = Region::create($this->getListInnerRegionPath(), $args);
        // $region->container->setAttributeValue('data-effect-class','animated flipInY');
        return $region;
    }

    public function createIndexRegion($args = array())
    {
        return Region::create($this->getIndexRegionPath(), $args);
    }


    public function createEditRegion($args = array())
    {
        return Region::create($this->getEditRegionPath(), $args);
    }





    /**
     * Add tab to editor.
     *
     * @param string $title
     * @param mixed $renderMethod
     */
    public static function addTab($title,$renderMethod)
    {
        $tab = new \CRUD\TabPanel($title,$renderMethod);
        static::$tabs[] = $tab;
        return $tab;
    }

    public function getTabs()
    {
        // because we register tab render method as static methods
        // so we need to set current handler object for rendering. 
        $tabs = static::$tabs;
        foreach ($tabs as $tab) {
            $tab->setHandler($this);
        }
        return $tabs;
    }


    public function getCreateButtonLabel() 
    {
        // TODO: do i18n here.
        return "建立新的" . $this->getModel()->getLabel();
    }


    public function getCurrentPage()
    {
        static $p;
        if ($p) {
            return $p;
        }
        return $p = $this->request->param('page') ?: 1;
    }


    public function getCurrentPageSize()
    {
        static $p;
        if ($p) {
            return $p;
        }
        return $p = $this->request->param('pagenum') ?: $this->pageLimit;
    }





    /**
     * Set column data formatter,
     *
     * @param string $name column name
     * @param Closure formating handler
     */
    public function setFormatter($name,$formatter)
    {
        if ( class_exists('Closure') && method_exists('Closure','bind') ) {
            Closure::bind($formatter, $this);
        }
        $this->formatters[ $name ] = $formatter;
    }

    public function getFormatter($name)
    {
        if ( isset($this->formatters[ $name ]) ) {
            return $this->formatters[ $name ];
        }
    }

    public function hasFormatter($name)
    {
        return isset($this->formatters[ $name ]);
    }

    public function formatColumn($record,$name)
    {
        if ( $formatter = $this->getFormatter($name) ) {
            return call_user_func($formatter,$record);
        }
    }

    public function getTemplateId()
    {
        if ( $this->templateId ) {
            return $this->templateId;
        }
        return $this->crudId;
    }



    /**
     * TODO: we should simply use the interface of View object to assign template variables.
     *
     * Assign multiple variables and merge current variables.
     *
     * @param array $args
     */
    public function assignVars( $args )
    {
        $this->vars = array_merge( $this->vars , $args );
    }


    /**
     * Assign variable to template view.
     *
     * @param string $name template variable name.
     * @param mixed $value template variable value.
     */
    public function assign( $name , $value )
    {
        $this->vars[ $name ] = $value;
    }

    public function get($name)
    {
        if ( isset($this->vars[$name]) ) {
            return $this->vars[$name];
        }
    }

    /**
     * Assign CRUD Vars
     *
     * @param array $args
     */
    public function assignCRUDVars($args)
    {
        foreach( $args as $k => $v ) {
            $this->vars['CRUD'][ $k ] = $v;
        }
    }

    /**
     * Returns edit form title
     *
     * @return string title string for edit view.
     */
    public function getEditTitle(BaseModel $record = NULL)
    {
        if (!$record) {
            $record = $this->getCurrentRecord();
        }
        if (!$record) {
            return '';
        }
        return $record->id
            ? __('Edit %1: %2', $record->getLabel() , $record->dataLabel() )
            : __('Create %1' , $record->getLabel() )
        ;
    }

    /**
     * Returns list title
     *
     * @return string title string for list view.
     */
    public function getListTitle()
    {
        return __('%1 Management' , $this->getModel()->getLabel() );
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



    public function isI18NEnabled()
    {
        return ( kernel()->bundle('I18N')
            && $langColumn = $this->getModel()->getColumn('lang')
            && isset($this->bundle) && $this->bundle->config('with_lang') );
    }



    /**
     * Return the collection for list region.
     *
     * @return LazyRecord\BaseCollection
     */
    public function getCollection()
    {
        $collection = parent::getCollection();

        // find the refer attribute and try to join these table.
        /*
            XXX: since some refer column does not have a relationship, we can not join 
            the table correctly.

        $joined = array();
        foreach ( $model->getSchema()->getColumns() as $column ) {
            if ( $ref = $column->refer) {
                if ( isset($joined[$ref]) )
                    continue;
                $joined[ $ref ] = true;
                $collection->join(new $ref, 'LEFT');
            }
        }
         */
        foreach( $this->_toolbarItems as $controller ) {
            $controller->handleCollection($collection);
        }

        # support for lang query,
        # make sure the model has defined lang column for I18N
        $this->kernel->event->trigger('phifty.crud.collection_filter',$this,$collection);


        if ( $this->quicksearchFields ) {
            if ( $q = $this->request->param('_q') ) {
                $w = $collection->where();
                $c = 0;
                foreach( $this->quicksearchFields as $field ) {
                    if ( $c++ < 1 ) {
                        $w = $w->like( $field , '%' . $q . '%' );
                    } else {
                        $w = $w->or()->like( $field , '%' . $q . '%' );
                    }
                }
            }
        }
        $this->orderCollection($collection);
        return $collection;
    }


    /**
     * Order the current collection
     *
     * If the _order_column and _order_by is defined from http request, then this should override the 
     * default collection ordering.
     *
     * @param BaseCollection
     */
    public function orderCollection($collection)
    {
        $orderColumn = $this->request->param('_order_column');
        $orderBy     = $this->request->param('_order_by');
        if ( $orderColumn && $orderBy ) {
            $collection->order( $orderColumn , $orderBy );
        } elseif ( $this->defaultOrder ) {
            $collection->order( $this->defaultOrder[0], $this->defaultOrder[1]);
        }
    }

    /**
     * Load record from the primary key (id) of current http request.
     *
     * @return mixed Record object.
     */
    public function loadRecord($id = NULL)
    {
        if ($this->currentRecord) {
            return $this->currentRecord;
        }

        $record = $this->getModel();
        if (!$id) {
            $id = $this->request->param('id');
        }
        if ($id) {
            $record->load( (int) $id );
        }
        return $record;
    }


    /**
     * Create collection pager object from collection.
     *
     * @param LazyRecord\BaseCollection collection object.
     * @return RegionPager
     */
    public function createCollectionPager($collection) 
    {
        $page     = $this->getCurrentPage();
        $pageSize = $this->getCurrentPageSize();
        $count    = $collection->queryCount();
        $collection->page( $page ,$pageSize );
        return new RegionPager( $page, $count, $pageSize );
    }


    /**
     * Render template
     *
     * @param string $template template path name.
     * @param array $args template arguments.
     * @param array $engineOptions engine options.
     */
    public function render( $template , $args = array() , $engineOptions = array() )
    {
        // merge variables
        $args = array_merge( $this->vars , $args );

        // render template file
        return parent::render( $template , $args , $engineOptions );
    }

    // renderer helpers
    // =================================================
    public function getCrudTemplatePath($filename)
    {
        if ( $this->useDefaultTemplate ) {
            return "@CRUD/$filename";
        }

        $path = '@' . $this->namespace . '/' . $this->getTemplateId() . '/' . $filename;
        // check the file existence, if the template file is not found, 
        // fallback to default template.
        if ( ! $this->kernel->twig->loader->exists($path) ) {
            $path = "@CRUD/$filename";
        }
        return $path;
    }


    /**
     * Render list region template.
     *
     * @param array $args template arguments
     * @return string template content.
     */
    public function renderList( $args = array() )
    {
        return $this->render( $this->getCrudTemplatePath('list.html') , $args);
    }





    public function renderEditModal($args = array())
    {
        return $this->render($this->getCrudTemplatePath('modal.html') , $args);
    }


    /**
     * Render dialog region tempilate.
     */
    public function renderEditDialog( $args = array() )
    {
        return $this->render($this->getCrudTemplatePath('dialog.html') , $args);
    }

    /**
     * Render edit region template.
     *
     * @param arary $args template arguments.
     * @return string template content.
     */
    public function renderEdit( $args = array() )
    {
        return $this->render( $this->getCrudTemplatePath('edit.html') , $args);
    }


    /**
     * Render general item region for ajax UI update.
     *
     * @param array $args template arguments
     */
    public function renderItem( $args = array() )
    {
        return $this->render( $this->getCrudTemplatePath('item.html') , $args);
    }


    /**
     * Render base page wrapper.
     *
     * current base page content is an empty region page.
     *
     * @param array $args template arguments.
     * @return string template content
     */
    public function renderPageWrapper( $args = array() ) 
    {
        return $this->render( $this->getCrudTemplatePath('page.html') , $args);
    }


    public function renderCrudIndex( $args = array() )
    {
        return $this->render( $this->getCrudTemplatePath('index.html') , $args);
    }







    /**
     * Override this if you need to set default data for the form of record 
     * creating.
     *
     * @return array Form data.
     */
    public function getDefaultData()
    {
        return $this->predefined;
    }

    public function getCurrentRecord()
    {
        if( $this->currentRecord )
            return $this->currentRecord;
        return $this->currentRecord = $this->loadRecord();
    }

    /**
     * Create record action object from record
     *
     * @return ActionKit\RecordAction
     */
    public function getRecordAction($record)
    {
        $action = $record->id 
            ? $record->asUpdateAction()
            : $record->asCreateAction();
        return $action;
    }

    public function getCurrentAction()
    {
        if( $this->currentAction )
            return $this->currentAction;
        $record = $this->getCurrentRecord();
        return $this->currentAction = $this->getRecordAction( $record );
    }

    /**
     *
     */
    public function getActionView()
    {
        if( isset($this->bundle) ) {
            if( $this->bundle->config('with_lang') ) {
                return $this->createActionView($this->currentAction);
            } else {
                return $this->createActionView($this->currentAction,null,array(
                    'skips' => array('lang')
                ));
            }
        } else {
            return $this->createActionView($this->currentAction);
        }
    }

    public function getQuickCreateActionView()
    {
        return $this->createActionView($this->getCurrentAction(),null,array(
            'close_btn' => false,
            'fields' => $this->primaryFields,
            'ajax' => true,
        ));
    }

    public function getModalActionView()
    {
        return $this->createActionView($this->getCurrentAction(),NULL,array(
            'close_btn' => false,
            'submit_btn' => false,
            'ajax' => true,
        ));
    }

    /**
     * Create Action View from Action object.
     *
     * @param ActionKit\RecordAction
     */
    public function createActionView($action, $viewClass = NULL, array $viewOptions = NULL)
    {
        if (! $viewClass) {
            $viewClass = $this->actionViewClass;
        }
        if ($viewOptions) {
            $viewOptions = array_merge($this->actionViewOptions,$viewOptions);
        } else {
            $viewOptions = $this->actionViewOptions;
        }
        // {{ CRUD.Action.asView('AdminUI\\Action\\View\\StackView',{ ajax: true, close_button: true }).render|raw}}
        return $action->asView($viewClass,$viewOptions);
    }

    public function editRegionActionPrepare()
    {
        $record = $this->getCurrentRecord();
        $isCreate = $record->id ? false : true;

        // if the record is not loaded, we can use predefined values
        if( $isCreate ) {
            foreach( $this->getDefaultData() as $k => $v ) {
                $record->{ $k } = $v;
            }
        }
        $this->assignCRUDVars(array(
            'Action' => $this->getCurrentAction(),
            'Record' => $record,
        ));
    }


    public function createRegionAction()
    {
        $record = $this->getCurrentRecord();

        // set predefined data.
        foreach( $this->getDefaultData() as $k => $v ) {
            $record->{ $k } = $v;
        }
        $this->assignCRUDVars(array(
            'Action' => $this->getCurrentAction(),
            'Record' => $record,
        ));
        return $this->renderEdit();
    }


    /* editRegionAction_{{ id }} template must be declare */
    // TODO: Support create with pre-defined value 
    public function editRegionAction()
    {
        $this->editRegionActionPrepare();
        return $this->renderEdit();
    }

    public function itemRegionAction()
    {
        $this->editRegionActionPrepare();
        return $this->renderItem();
    }

    public function dialogEditRegionAction()
    {
        $this->editRegionActionPrepare();
        return $this->renderEditDialog();
    }

    public function modalEditRegionAction()
    {
        $this->editRegionActionPrepare();
        return $this->renderEditModal();
    }

    public function quickCreateAction() 
    {
        return $this->render( $this->getCrudTemplatePath('quick_create.html') , array());
    }


    public function indexRegionAction()
    {
        $tiles = array();
        // the old way: this renders the content in the same request.
        // $tiles[] = $this->editRegionAction();

        // here we clone the request for the region.
        $tiles[] = $listRegion = $this->createListRegion($_REQUEST);
        return $this->renderCrudIndex( array( 
            'tiles' => $tiles,
            'listRegion' => $listRegion,
        ));
    }

    /**
     * Render list panel.
     */
    public function listRegionAction()
    {
        // init toolbar controls here, because we need to show the panel.
        $this->initToolbarControls();
        $region = $this->createListInnerRegion($_REQUEST);
        $this->assign('listInnerRegion', $region);
        return $this->renderList();
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
        return $this->render( $this->getCrudTemplatePath('list_inner.html'));
    }





    // route for pages
    // -----------------------------------
    public function createAction()
    {
        $tiles = array();
        // the old way: this renders the content in the same request.
        // $tiles[] = $this->editRegionAction();

        // here we clone the request for the region.
        $tiles[] = $createRegion = Region::create( $this->getCreateRegionPath(), $_REQUEST );
        return $this->renderPageWrapper(array( 
            'tiles' => $tiles,
            'createRegion' => $createRegion,
        ));
    }


    public function editAction()
    {
        $tiles = array();
        // the old way: this renders the content in the same request.
        // $tiles[] = $this->editRegionAction();

        // here we clone the request for the region.
        $tiles[] = Region::create( $this->getEditRegionPath(), $_REQUEST );
        return $this->renderPageWrapper(array( 'tiles' => $tiles ));
    }

    /* indexAction is a tiled page,
     * you can use tile to push template blocks into it. */
    public function indexAction()
    {
        $tiles   = array();
        $tiles[] = $indexRegion = $this->createIndexRegion();
        return $this->renderPageWrapper(array( 
            'tiles' => $tiles,
            'indexRegion' => $indexRegion,
        ));
    }

}
