<?php
namespace CRUD;
// use WebUI\Components\Pager;
use WebUI\Components\Breadcrumbs;
use Phifty\Web\RegionPager;
use Phifty\Web\BootstrapRegionPager;
use Phifty\Web\Region;
use Phifty\Controller;
use Closure;
use CRUD\Controller\ToolbarItemController;
use CRUD\Controller\FilterWidgetToolbarItemController;
use LazyRecord\BaseModel;
use LazyRecord\BaseCollection;
use Pux\Mux;
use ActionKit\Action;
use ReflectionClass;
use Exception;


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
 *    viewAction
 *    createAction
 *
 * Controller Actions (regions):
 *
 *    indexRegionAction
 *    editRegionAction
 *    viewRegionAction
 *    createRegionAction
 *    listRegionAction
 *
 *
 * Front-end path is mounted on /bs/{crudId or templateId}
 *
 */
abstract class CRUDHandler extends BaseCRUDHandler
{
    /**
     * @var string The react application name
     *
     * This is unused for now.
     */
    public $reactApp;



    /**
     * @var string resource id is used for ACL
     */
    public $resourceId;
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

    public $canExport = false;

    public $canImport = false;


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
     * @var bool use the default template defined in CRUD bundle, so you don't
     *           have to create template pages.
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

        // 'form_controls' is not used by any template or action class yet.
        '_form_controls' => true,
    );


    public $parentRelationship;

    /**
     * @var array register CRUD Action automatically
     */
    public $registerRecordAction = array(
        array('prefix' => 'Create'),
        array('prefix' => 'Update'),
        array('prefix' => 'Delete'),
        array('prefix' => 'BulkDelete')
    );

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
    public $pageLimit = 10;


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
     * @var array The navigation stack definition
     */
    protected $navStack = [
        ['label' => 'Dashboard', 'href' => '/bs'],
    ];


    /**
     * Expand routes to RouteSet
     */
    public function expand(array $options = array(), $dynamic = false)
    {
        $this->mux = $mux = new Mux;
        // TODO:
        // here we construct the object, so that
        // we will register the CRUD actions.
        // we should move the ModelName extraction to static,
        // so that we won't waste too much resource on creating objects.
        $class = get_class($this);
        $mux->add(''             , [$class,'indexAction'], $options);

        $mux->add('/summary.json', [$class, 'summaryJsonAction'], $options);

        $mux->add('/crud/index'  , [$class,'indexRegionAction'], $options);
        $mux->add('/crud/create' , [$class,'createRegionAction'], $options);
        $mux->add('/crud/edit'   , [$class,'editRegionAction'], $options);
        $mux->add('/crud/view'   , [$class,'viewRegionAction'], $options);
        $mux->add('/crud/item'   , [$class,'itemRegionAction'], $options);

        $mux->add('/crud/list'       , [$class , 'listRegionAction'], $options);
        $mux->add('/crud/list_inner' , [$class , 'listInnerRegionAction'], $options);
        $mux->add('/crud/modal'      , [$class , 'modalEditRegionAction'], $options);
        $mux->add('/crud/dialog'     , [$class , 'dialogEditRegionAction'], $options);


        $mux->add('/view'            , [$class , 'viewAction'], $options);
        $mux->add('/edit'            , [$class , 'editAction'], $options);
        $mux->add('/create'          , [$class , 'createAction'], $options);

        if ($this->primaryFields) {
            $mux->add( '/crud/quick_create', [$class,'quickCreateAction'], $options);
        }
        return $mux;
    }


    /**
     * init() method will be called when the route is matched.
     */
    public function init()
    {
        parent::init();

        // Derive options from request
        $request = $this->getRequest();
        $useFormControls = $request->param('_form_controls');
        $this->actionViewOptions['submit_btn'] = true;
        $this->actionViewOptions['_form_controls'] = true;

        $rclass = new ReflectionClass($this);
        $ns = $rclass->getNamespaceName();

        // XXX: currently we use FooBundle\FooBundle as the main bundle class.
        $bundleClass = "$ns\\$ns";
        if (class_exists($bundleClass)) {
            $this->bundle = $this->vars['Bundle'] = $bundleClass::getInstance();
        } else {
            $bundleClass = "$ns\\Application";
            $this->bundle = $this->vars['Bundle'] = $bundleClass::getInstance();
        }

        $this->vars['Handler'] = $this;
        $this->vars['Controller'] = $this;

        // anyway, we have the model classname, and the namespace, 
        // we should be able to registerRecordAction automatically, so we don't have to write the code.
        if ($this->registerRecordAction) {
            $self = $this;
            $this->kernel->event->register('phifty.before_action',function() use($self) {
                kernel()->action->registerAction('RecordActionTemplate', array(
                    'namespace' => $self->namespace,
                    'model' => $self->modelName,
                    'types' => (array) $self->registerRecordAction
                ));
            });
        }

        if ($this->resourceId) {

            $currentUser = $this->kernel->currentUser;

            $this->canCreate = $this->kernel->accessControl->can('create', $this->resourceId) || $currentUser->isAdmin();

            $this->canUpdate = $this->kernel->accessControl->can('edit', $this->resourceId) || $currentUser->isAdmin();

            $this->canDelete = $this->kernel->accessControl->can('delete', $this->resourceId) || $currentUser->isAdmin();

        } else if ($crudConfig = $this->bundle->config($rclass->getShortName())) {

            // Update CRUDHandler properties from config 
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
        $this->navStack[] = [
            'label' => $this->getListTitle(),
            'href'  => $this->getRoutePrefix(),
        ];
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
        if ($this->filterColumns) {
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


    /**
     * route prefix is extracted from $this->matchedRoute, which depends on 
     * where this CRUDHandler was mount.
     *
     * @return string mount path
     */
    public function getRoutePrefix()
    {
        if (!isset($this->matchedRoute[3]['mount_path'])) {
            echo '<pre>';
            debug_print_backtrace();
            echo '</pre>';
            throw new \Exception('mount_path is not set in matchedRoute');
        }
        return $this->matchedRoute[3]['mount_path'];
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

    public function getViewRegionPath()
    {
        return $this->getRoutePrefix() . '/crud/view';
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




    /**
     *
     * @return URL return the url of create page
     */
    public function getCreatePageUrl()
    {
        return $this->getRoutePrefix() . '/create';
    }


    /**
     *
     * @return URL return the url of create page
     */
    public function getEditPageUrl(BaseModel $record)
    {
        return $this->getRoutePrefix() . '/edit?' . http_build_query(['id' => $record->id]);
    }


    /**
     *
     * @return URL return the url of create page
     */
    public function getViewPageUrl(BaseModel $record)
    {
        return $this->getRoutePrefix() . '/view?' . http_build_query(['id' => $record->id]);
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

    public function createViewRegion($args = array())
    {
        return Region::create($this->getViewRegionPath(), $args);
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
    public function setFormatter($name, $formatter)
    {
        if (class_exists('Closure') && method_exists('Closure','bind')) {
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
        if ($this->templateId) {
            return $this->templateId;
        }
        return $this->crudId;
    }

    public function getCustomTemplateNamespace()
    {
        // If it's defined in CRUDHandler scope, we should use it.
        if ($this->customTemplateNamespace) {
            return $this->customTemplateNamespace;
        }
        // or we can use the template namespace for system wide config
        return CRUD::getInstance()->config('TemplateNamespace');
    }

    public function getDefaultTemplateNamespace()
    {
        return 'CRUD';
    }

    public function getNavigationBar()
    {
        $nav = new Breadcrumbs;
        foreach ($this->navStack as $navItem) {
            $nav->appendLink($navItem['label'], $navItem['href']);
        }
        return $nav;
    }


    /**
     * TODO: we should simply use the interface of View object to assign template variables.
     *
     * Assign multiple variables and merge current variables.
     *
     * @param array $args
     */
    public function assignVars(array $args)
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
    public function assignCRUDVars(array $args)
    {
        foreach ($args as $k => $v) {
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
            ? __('編輯 %1: %2', $record->getLabel() , $record->dataLabel() )
            : __('新建 %1' , $record->getLabel() )
        ;
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
        foreach ($model->getSchema()->getColumns() as $column ) {
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


        if ($this->quicksearchFields) {
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
    public function orderCollection(BaseCollection $collection)
    {
        $orderColumn = $this->request->param('_order_column');
        $orderBy     = $this->request->param('_order_by');
        if ( $orderColumn && $orderBy ) {
            $collection->orderBy( $orderColumn , $orderBy );
        } elseif ( $this->defaultOrder ) {
            $collection->orderBy( $this->defaultOrder[0], $this->defaultOrder[1]);
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
            $id = intval($this->request->param('id'));
        }
        if ($id) {
            $record->load(intval($id));
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
        // return new RegionPager( $page, $count, $pageSize );
        return new BootstrapRegionPager($page, $count, $pageSize );
    }


    /**
     * Render template
     *
     * @param string $template template path name.
     * @param array $args template arguments.
     * @param array $engineOptions engine options.
     */
    public function render($template , array $args = array(), array $engineOptions = array() )
    {
        // merge variables
        $args = array_merge($this->vars , $args);

        // render template file
        return parent::render($template , $args , $engineOptions);
    }

    // renderer helpers
    // =================================================
    public function findTemplatePath($filename)
    {
        if ($this->useDefaultTemplate) {
            return '@' . $this->getDefaultTemplateNamespace() . DIRECTORY_SEPARATOR . $filename;
        }

        $loader = $this->kernel->twig->loader;

        // Check the template file existence for the current bundle, if the
        // template file is not found in the current bundle, it fallback to
        // default template to use the default one.

        // If we're app bundle
        $customTemplatePath = '@' . $this->namespace . DIRECTORY_SEPARATOR . $this->getTemplateId() . DIRECTORY_SEPARATOR . $filename;
        if ($loader->exists($customTemplatePath)) {
            return $customTemplatePath;
        }

        // find the custom template path for CRUD base templates
        $customTemplatePath = '@' . $this->getCustomTemplateNamespace() . DIRECTORY_SEPARATOR . $filename;
        // $customTemplatePath = '@' . $this->getCustomTemplateNamespace() . DIRECTORY_SEPARATOR . $this->getTemplateId() . DIRECTORY_SEPARATOR . $filename;
        if ($loader->exists($customTemplatePath)) {
            return $customTemplatePath;
        }

        // Fallback template path
        return '@' . $this->getDefaultTemplateNamespace() . DIRECTORY_SEPARATOR . $filename;
    }


    /**
     * Render list region template.
     *
     * @param array $args template arguments
     * @return string template content.
     */
    public function renderList( $args = array() )
    {
        return $this->render( $this->findTemplatePath('list.html') , $args);
    }





    public function renderEditModal($args = array())
    {
        return $this->render($this->findTemplatePath('modal.html') , $args);
    }


    /**
     * Render dialog region tempilate.
     */
    public function renderEditDialog( $args = array() )
    {
        return $this->render($this->findTemplatePath('dialog.html') , $args);
    }

    /**
     * Render edit region template.
     *
     * @param array $args template arguments.
     * @return string template content.
     */
    public function renderEdit($args = array())
    {
        return $this->render($this->findTemplatePath('edit.html') , $args);
    }


    /**
     * Render record in read-only view page
     *
     * @param array $args
     * @return string template content.
     */
    public function renderView($args = array())
    {
        return $this->render($this->findTemplatePath('view.html'), $args);
    }


    /**
     * Render general item region for ajax UI update.
     *
     * @param array $args template arguments
     */
    public function renderItem( $args = array() )
    {
        return $this->render( $this->findTemplatePath('item.html') , $args);
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
        return $this->render( $this->findTemplatePath('page.html') , $args);
    }


    public function renderCrudIndex( $args = array() )
    {
        return $this->render( $this->findTemplatePath('index.html') , $args);
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
    public function getRecordAction(BaseModel $record)
    {
        $action = $record->id
            ? $record->asUpdateAction()
            : $record->asCreateAction()
            ;
        return $action;
    }

    public function getCurrentAction()
    {
        if ($this->currentAction) {
            return $this->currentAction;
        }
        $record = $this->getCurrentRecord();
        return $this->currentAction = $this->getRecordAction($record);
    }

    /**
     *
     */
    public function getActionView()
    {
        if (isset($this->bundle)) {
            if ($this->bundle->config('with_lang')) {
                return $this->createActionView($this->currentAction);
            } else {
                return $this->createActionView($this->currentAction,null,array(
                    'skips' => array('lang')
                ));
            }
        }
        return $this->createActionView($this->currentAction);
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

    public function getCSRFToken()
    {
        if ($action = $this->getCurrentAction()) {
            if ($token = $action->getCSRFToken()) {
                return $token;
            }
        }
        return $this->kernel->actionService['csrf_token'];
    }

    /**
     * Create Action View from Action object.
     *
     * @param ActionKit\RecordAction
     */
    public function createActionView(Action $action, $viewClass = NULL, array $viewOptions = NULL)
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

    /* editRegionAction_{{ id }} template must be declare */
    // TODO: Support create with pre-defined value 
    public function editRegionAction()
    {
        $this->editRegionActionPrepare();
        return $this->renderEdit();
    }

    public function viewRegionActionPrepare()
    {
        $record = $this->getCurrentRecord();
        if (! $record->id) {
            throw new Exception('Record not found.');
        }
        $this->assignCRUDVars(array(
            'Action' => $this->getCurrentAction(),
            'Record' => $record,
        ));
    }

    public function viewRegionAction()
    {
        $this->viewRegionActionPrepare();
        return $this->renderView();
    }


    public function createRegionActionPrepare()
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
    }

    public function createRegionAction()
    {
        if (!$this->canCreate) {
            throw new Exception('Creating new record requires permission.');
        }
        $this->createRegionActionPrepare();
        return $this->renderEdit();
    }


    public function itemRegionAction()
    {
        if (!$this->canUpdate) {
            throw new Exception('Creating new record requires permission.');
        }
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
        return $this->render( $this->findTemplatePath('quick_create.html') , array());
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

        // please note that we will get all items in list region since we don't have constraint
        $collection = $this->getCollection();

        $this->assignCRUDVars([
            // so here is the number of total items
            'NumberOfTotalItems' => $collection->queryCount(),
        ]);

        return $this->renderList([]);
    }

    public function summaryJsonAction()
    {
        // handle unfiltered collection
        $collection = $this->getCollection();
        return $this->toJson([
            'numberOfTotalItems' => $collection->queryCount(),
        ]);
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





    // route for pages
    // -----------------------------------
    public function createAction()
    {
        $tiles = array();
        // the old way: this renders the content in the same request.
        // $tiles[] = $this->editRegionAction();

        // here we clone the request for the region.
        $tiles[] = $createRegion = Region::create( $this->getCreateRegionPath(), array_merge($_REQUEST, [ 
            '_form_controls' => true,
        ]));
        return $this->renderPageWrapper([
            'tiles' => $tiles,
            'createRegion' => $createRegion,
        ]);
    }


    /**
     * Provide full editing page.
     */
    public function editAction()
    {
        $tiles = [];
        // Reuse the parameters from $_REQUEST
        // If we are going to render a full page for edit form, we shall also render the _form_controls
        $tiles[] = Region::create($this->getEditRegionPath(), array_merge($_REQUEST, [
            '_form_controls' => true,
        ]));
        return $this->renderPageWrapper(array( 'tiles' => $tiles ));
    }

    /**
     * Provide read only form page
     */
    public function viewAction()
    {
        $tiles = [];
        // Reuse the parameters from $_REQUEST
        // If we are going to render a full page for edit form, we shall also render the _form_controls
        $tiles[] = Region::create($this->getViewRegionPath(), array_merge($_REQUEST, [
            '_form_controls' => true,
        ]));
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
