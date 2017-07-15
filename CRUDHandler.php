<?php

namespace CRUD;

// use WebUI\Components\Pager;
use WebUI\Components\Breadcrumbs;
use Phifty\Web\RegionPager;
use Phifty\Web\BootstrapRegionPager;
use Phifty\Web\Region;
use Phifty\Routing\Controller;
use Closure;
use CRUD\Controller\ToolbarItemController;
use CRUD\Controller\FilterWidgetToolbarItemController;
use CRUD\TabPanel;
use CRUD\Action\UploadSessionFile;
use CRUD\Action\UploadExcelFile;
use CRUD\Importer\ExcelImporter;

use Maghead\Runtime\Model;
use Maghead\Runtime\Collection;
use Maghead\Runtime\Repo;

use Pux\Mux;
use WebAction\Action;
use ReflectionClass;
use Exception;
use InvalidArgumentException;
use Universal\Http\HttpRequest;

use WebAction\ActionTemplate\RecordActionTemplate;
use Doctrine\Common\Inflector\Inflector;

use PHPExcel_IOFactory;

use FormKit\Widget\SelectInput;

use Twig_LoaderInterface;
use Twig_ExistsLoaderInterface;


use AdminUI\Action\View\StackView;

/**
 * Current CRUD template structure:
 *
 *    {AppName}/templates/
 *       {templateId}/index.html.twig
 *       {templateId}/edit.html.twig
 *       {templateId}/list.html.twig
 *       {templateId}/page.html.twig
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
abstract class CRUDHandler extends Controller
{
    use CRUDReactListEditor;
    use CRUDExporter;

    use CRUDSearchActions;
    use CRUDListActions;
    use CRUDUploadActions;

    use CRUDPermissions;

    /**
     * @var keyParam is used for getting the key from HTTP request.
     *
     * This is used in request url like:
     *    /bs/product/crud/edit?key=3
     */
    public $keyParam = 'key';

    /**
     * @var parentKeyParam is used for creating new record that belongs to a parent record.
     */
    public $parentKeyParam = 'parent-key';

    public $parentKeyRecordClass;

    public $parentKeyField;

    // FIXME: support "allow relationship" to be used to create records.
    public $allowRelations;





    protected $kernel;

    /**
     * @var string plugin name space
     */
    public $namespace;

    /**
     * @var string Model class, full-qualified model class.
     */
    public $modelClass;

    /**
     * @var string model short class name, optional, can be extracted from 
     *            full-qualified model class name 
     */
    public $modelName;


    /**
     * @var string CRUD ID, which is the namespace of template path or can be used in URL.
     *
     *    /bs/{{ crud_id }}
     *    Templates/{{crud_id}}/edit.html.twig
     *
     */
    public $crudId;


    /**
     * @var string The template path ID (default to crudId)
     */
    public $templateId;


    /**
     * @var string the custom template namespace
     *
     * Fallback to @CRUD namespace if the override template does not exists.
     */
    public $customTemplateNamespace;

    /**
     * @var Phifty\Model model object for cache, please use getModel() method
     */
    protected $_model;



    /**
     * @var ReflectionClass the reflection class of the CRUDHandler.
     */
    private $meta;


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
     * @var boolean whether to disable bulk seletion
     */
    public $disableSelection = false;



    /**
     * @var boolean Can user edit record in new window ?
     */
    public $canEditInNewWindow = false;


    /**
     * @var array predefined data for new record
     */
    public $predefined = array();


    /**
     * @var string[] fields that are allowed to be predefined from request
     * parameters
     */
    protected $applyRequestFields;




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
     * Current action object. (created from currentRecord)
     */
    public $currentAction;



    /**
     * Default action view class for editing.
     */
    public $actionViewClass = StackView::class;

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


    /**
     * @var array register CRUD Action automatically
     */
    public $registerRecordAction = [
        ['prefix' => 'Create'],
        ['prefix' => 'Update'],
        ['prefix' => 'Delete'],
        ['prefix' => 'BulkDelete'],
    ];

    /**
     * @var ToolbarItemController[]
     */
    protected $_toolbarItems = [];

    /**
     * @var Phifty\Model the record object.
     */
    public $currentRecord;


    /**
     * @var integer the default record Limit per page
     */
    public $pageLimit = 10;


    /**
     * @var array template variables, used to render template
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
     * Define filter columns to show the filter widgets
     */
    public $filterColumns = array();


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
        ['label' => '主頁', 'href' => '/bs'],
    ];

    /**
     * @var array An array that defines import field names.
     */
    protected $importFields;


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
        $mux->add('', [$this,'indexAction'], $options);

        $mux->add('/summary' , [$this , 'summaryAction'], $options);
        $mux->add('/search', [$this, 'searchAction'], $options);

        $mux->add('/export/csv'   , [$this , 'exportCsvAction']   , $options);
        $mux->add('/export/excel' , [$this , 'exportExcelAction'] , $options);

        $mux->add('/crud/index'  , [$this,'indexRegionAction'], $options);
        $mux->add('/crud/create' , [$this,'createRegionAction'], $options);
        $mux->add('/crud/edit'   , [$this,'editRegionAction'], $options);
        $mux->add('/crud/delete'   , [$this,'deleteRegionAction'], $options);
        $mux->add('/crud/view'   , [$this,'viewRegionAction'], $options);
        $mux->add('/crud/item'   , [$this,'itemRegionAction'], $options);

        $mux->add('/crud/list'       , [$this , 'listRegionAction'], $options);
        $mux->add('/crud/list_inner' , [$this , 'listInnerRegionAction'], $options);
        $mux->add('/crud/modal'      , [$this , 'modalEditRegionAction'], $options);

        // CRUDUploadActions
        $mux->add('/import/upload'       , [$this , 'importUploadRegionAction'], $options);
        $mux->add('/import/column-map'   , [$this , 'importColumnMapRegionAction'], $options);
        $mux->add('/import/sample'   , [$this , 'importSampleDownloadAction'], $options);

        $mux->add('/view'            , [$this , 'viewAction'], $options);
        $mux->add('/edit'            , [$this , 'editAction'], $options);
        $mux->add('/create'          , [$this , 'createAction'], $options);

        if ($this->primaryFields) {
            $mux->add( '/crud/quick_create', [$this,'quickCreateAction'], $options);
        }

        return $mux;
    }


    /**
     * Auto fill the metadata of the current CRUD handler
     * by using Reflection.
     */
    protected function autofill()
    {
        // Dynamic initialization
        if (! $this->modelName) {
            $modelRefl = new ReflectionClass($this->modelClass);
            $this->modelName = $modelRefl->getShortName();
        }

        if (! $this->crudId) {
            $this->crudId = Inflector::tableize($this->modelName);
        }

        if (! $this->templateId) {
            $this->templateId = $this->crudId;
        }

        $this->meta = new ReflectionClass($this);
        $this->namespace = $ns = $this->meta->getNamespaceName();

        // Find the related bundle class via singleton instance.
        // Currently we use FooBundle\FooBundle as the main bundle class.
        // TODO: let CRUHandler could be registered via Bundle API.
        $bundleClass = "$ns\\$ns";
        if (class_exists($bundleClass, true)) {
            $this->bundle = $this->vars['Bundle'] = $bundleClass::getInstance($this->kernel);
        }
    }


    public function context(array & $environment, array $response)
    {
        parent::context($environment, $response);

        $this->vars['CRUD']['Object'] = $this;
        $this->autofill();

        // Derive options from request
        if ($request = $this->getRequest()) {
            if ($useFormControls = $request->param('_form_controls')) {
                $this->actionViewOptions['submit_btn'] = true;
                $this->actionViewOptions['_form_controls'] = true;
            }
        }

        $this->vars['Handler'] = $this;
        $this->vars['Controller'] = $this;

        // anyway, we have the model classname, and the namespace, 
        // we should be able to registerRecordAction automatically, so we don't have to write the code.
        if ($this->registerRecordAction) {
            $self = $this;
            $this->kernel->event->register('phifty.before_action',function() use($self) {
                $self->kernel->action->registerAction('RecordActionTemplate', array(
                    'namespace' => $self->namespace,
                    'model' => $self->modelName,
                    'types' => (array) $self->registerRecordAction
                ));
            });
        }

        $this->initPermissions();
        $this->initNavBar();

        /*
        // FIX:  Move this to before render CRUD page, keep init method simple
        if ( $this->isI18NEnabled() ) {
            $this->primaryFields[] = 'lang';
        }
        */
    }

    public function getModelSchema()
    {
        return $this->modelClass::getSchema();
    }

    /**
     * Get model object.
     *
     * @return Phifty\Model
     */
    public function getModel()
    {
        if ($this->_model) {
            return $this->_model;
        }
        return $this->_model = new $this->modelClass;
    }

    public function getModelClass()
    {
        return $this->modelClass;
    }

    /**
     * Create the default collection from the repo
     *
     * TODO: handle repo.
     *
     * @return Maghead\Runtime\Collection
     */
    protected function createCollection()
    {
        $class = $this->modelClass::COLLECTION_CLASS;
        return new $class;
    }

    public function createDefaultCollection()
    {
        return $this->createCollection();
    }

    protected function initNavBar()
    {
        $this->navStack[] = [
            'label' => $this->getListTitle(),
            'href'  => $this->getRoutePrefix(),
        ];

    }

    protected function initPermissions()
    {
        if ($this->resourceId && $this->kernel->accessControl) {

            $currentUser = $this->kernel->currentUser;

            $this->canCreate = $currentUser->isAdmin() || $this->kernel->accessControl->can('create', $this->resourceId);

            $this->canUpdate = $currentUser->isAdmin() || $this->kernel->accessControl->can('edit', $this->resourceId);

            $this->canDelete =  $currentUser->isAdmin() || $this->kernel->accessControl->can('delete', $this->resourceId);

            $this->canExport =  $currentUser->isAdmin() || $this->kernel->accessControl->can('export', $this->resourceId);

            $this->canImport =  $currentUser->isAdmin() || $this->kernel->accessControl->can('import', $this->resourceId);

        } else if ($crudConfig = $this->bundle->config($this->meta->getShortName())) {

            // Update CRUDHandler properties from config 
            $properties = ['canCreate', 'canUpdate', 'canDelete', 'canExport', 'canImport'];
            foreach( $properties as $key ) {
                $val = $crudConfig->lookup($key);
                if ( $val !== null ) {
                    $this->$key = $val;
                }
            }

        }
    }

    // Toolbar related methods (used in indexAction)

    protected function addToolbarItem(ToolbarItemController $controller)
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
            throw new \Exception('mount_path is not set in matchedRoute');
        }
        return $this->matchedRoute[3]['mount_path'];
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
     * @param Maghead\Runtime\Model $record
     * @return URL return the url of create page
     */
    public function getEditPageUrl(Model $record)
    {
        return $this->getRoutePrefix() . '/edit?' . http_build_query(['key' => $record->getKey()]);
    }


    /**
     *
     * @param Model $record
     * @return URL return the url of create page
     */
    public function getViewPageUrl(Model $record)
    {
        return $this->getRoutePrefix() . '/view?' . http_build_query(['key' => $record->getKey()]);
    }


    /**
     *
     * @return URL return the url of create region
     */
    public function getCreateRegionUrl()
    {
        return $this->getRoutePrefix() . '/crud/create';
    }

    /**
     *
     * @param Model $record
     * @param array $query
     *
     * @return URL return the url of edit region
     */
    public function getEditRegionUrl(Model $record, array $query = array())
    {
        return $this->getRoutePrefix() . '/crud/edit?' . http_build_query(array_merge([ 'key' => $record->getKey() ], $query));
    }

    /**
     *
     * @param Model $record
     * @param array $query
     *
     * @return URL return the url of view region page
     */
    public function getViewRegionUrl(Model $record, array $query = array())
    {
        return $this->getRoutePrefix() . '/crud/view?' . http_build_query(array_merge([ 'key' => $record->getKey() ], $query));
    }



    /**
     * Add tab to editor.
     *
     * @param string $title
     * @param mixed $renderMethod
     *
     * @deprecated
     */
    public function addTab($title, $renderMethod)
    {
        $tab = new TabPanel($title, $renderMethod);
        $this->tabs[] = $tab;
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

    public function getRecordLabel()
    {
        return $this->getModelSchema()->getLabel();
    }

    public function getCreateButtonLabel() 
    {
        return "建立新的" . $this->getModelSchema()->getLabel();
    }


    public function getCurrentPage()
    {
        static $p;
        if ($p) {
            return $p;
        }
        return $p = $this->request->param('page') ?: 1;
    }


    /**
     * Get the current page size.
     *
     * @return integer
     */
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


    /**
     * Get formatter
     *
     * @param string $name column name
     * @return callable formating handler
     */
    public function getFormatter($name)
    {
        if (isset($this->formatters[$name])) {
            return $this->formatters[$name];
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
    public function assign($name, $value)
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
    public function getEditTitle(Model $record = NULL)
    {
        $schema = $this->getModelSchema();
        if (!$record) {
            $record = $this->getCurrentRecord() ?: $this->newRecord();
        }

        return $record->hasKey()
            ? __('編輯 %1: %2', $schema->getLabel() , $record->dataLabel())
            : __('新建 %1' , $schema->getLabel())
            ;
    }

    public function isI18NEnabled()
    {
        return ($this->kernel->bundle('I18N')
            && $langColumn = $this->getModelSchema()->getColumn('lang')
            && isset($this->bundle) && $this->bundle->config('with_lang') );
    }

    /**
     * Return the collection for list region.
     *
     * @return Maghead\Runtime\Collection
     */
    public function getCollection()
    {
        $collection = $this->createDefaultCollection();

        // find the refer attribute and try to join these table.
        /*
            XXX: since some refer column does not have a relationship, we can not join 
            the table correctly.
        $joined = array();
        foreach ($model->getSchema()->getColumns() as $column ) {
            if ($ref = $column->refer) {
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
            if ($q = $this->request->param('_q')) {
                $this->appendCollectionConditions($collection->where(), $q);
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
     * @param Maghead\Runtime\Collection
     */
    public function orderCollection(Collection $collection)
    {
        list($orderColumn, $orderBy) = $this->getCurrentOrderBy();
        $collection->orderBy($orderColumn , $orderBy);
        return $collection;
    }

    protected function getCurrentOrderBy()
    {
        $orderColumn = $this->request->param('_order_column');
        $orderBy     = $this->request->param('_order_by');

        if ($orderColumn && in_array(strtolower($orderBy), ['asc','desc'])) {
            return [$orderColumn, $orderBy];
        }

        if ($this->getModelSchema()->getColumn("ordering")) {
            return ["ordering", "ASC"];
        }

        return $this->defaultOrder;
    }


    /**
     * Create collection pager object from collection.
     *
     * @param Maghead\Runtime\Collection collection object.
     * @return BootstrapRegionPager
     */
    protected function createCollectionPager(Collection $collection)
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

    protected function findParentTemplatePath(Twig_ExistsLoaderInterface $loader, $namespace, $filename)
    {
        $p = '@' . $namespace . DIRECTORY_SEPARATOR . DIRECTORY_SEPARATOR . $filename;
        if ($loader->exists($p)) {
            return $p;
        }

        if ($loader->exists(preg_replace('/\.twig$/', '', $p))) {
            return $p;
        }

        return false;

    }

    protected function findTemplatePath(Twig_ExistsLoaderInterface $loader, $namespace, $templateId, $filename)
    {
        $p = '@' . $namespace . DIRECTORY_SEPARATOR . $templateId . DIRECTORY_SEPARATOR . $filename;

        if ($loader->exists($p)) {
            return $p;
        }

        // for backward compatiblity
        $p2 = preg_replace('/\.twig$/', '', $p);
        if ($loader->exists($p2)) {
            return $p2;
        }

        return false;
    }

    public function mustFindTemplate($filename)
    {
        $template = $this->findTemplate($filename);
        if (!$template) {
            throw new \LogicException("template $filename not found.");
        }
        return $template;
    }

    // renderer helpers
    // =================================================
    public function findTemplate($filename)
    {
        $loader = $this->kernel->twig->loader;

        // Should we use default template instead of the template override?
        // The default template namespace (could be @CRUD, @AppCRUD or something else)
        if ($this->useDefaultTemplate) {
            if ($templatePath = $this->findParentTemplatePath($loader, $this->getDefaultTemplateNamespace(), $filename)) {
                return $templatePath;
            }
        }

        // Check the template file existence for the current bundle, if the
        // template file is not found in the current bundle, it fallback to
        // default template to use the default one.

        // If we're app bundle
        if ($templatePath = $this->findTemplatePath($loader, $this->namespace, $this->getTemplateId(), $filename)) {
            return $templatePath;
        }

        // find the custom template path for CRUD base templates
        if ($templatePath = $this->findParentTemplatePath($loader, $this->getCustomTemplateNamespace(), $filename)) {
            return $templatePath;
        }

        // Fallback the default template namespace (CRUD by default)
        return $this->findParentTemplatePath($loader, $this->getDefaultTemplateNamespace(), $filename);
    }

    /**
     * Override this if you need to set default data for the form of record 
     * creating.
     *
     * To create a record with its relationship:
     *
     *     /create?rel=category&relKey=3
     *
     * The above query will create the record under the category(3) when the form is submitted.
     *
     * @return array Form data.
     */
    public function getDefaultRecordArgs()
    {
        // The "rel" could be an ID of the relationship or a field name of the column.
        if ($relId = $this->request->param('rel')) {

            $relKey = $this->request->param('relKey');
            $schema = $this->getModelSchema();
            if ($rel = $schema->getRelation($relId)) {
                $localColumn = $rel['self_column'];
                $this->predefined[$localColumn] = $relKey;
            } else if ($schema->column($relId)) {
                $this->predefined[$relId] = $relKey;
            }

        } else if (isset($this->parentKeyRecordClass)) {

            // load parent key if it's in the request parameters
            if ($key = $this->request->param($this->parentKeyParam)) {
                $record = $this->parentKeyRecordClass::findByPrimaryKey($key);
                if (!$record) {
                    throw new \Exception("parent record not found.");
                }
                if (!$this->parentKeyField) {
                    throw new \Exception("parentKeyField is not defined.");
                }

                $this->predefined[$this->parentKeyField] = $key;
            }
        }

        return $this->predefined;
    }


    /**
     * Return the current record
     *
     * @return Maghead\Runtime\Model
     */
    public function getCurrentRecord()
    {
        if ($this->currentRecord) {
            return $this->currentRecord;
        }

        return $this->currentRecord = $this->loadCurrentRecord();
    }

    /**
     * Load record from the primary key (id) of current http request.
     *
     * The record object might be new record object (without loaded data)
     *
     * @return Maghead\Runtime\Model The record object.
     */
    public function loadCurrentRecord()
    {
        $key = $this->request->param($this->keyParam);

        if ($key) {
            return $this->modelClass::findByPrimaryKey($key);
        }

        return false;
    }

    /**
     * TODO: extract to CRUDUtils
     */
    public function newRecord($args = null)
    {
        // if the record is not loaded, we can use predefined values
        $args = $args ?: $this->getDefaultRecordArgs();
        $record = new $this->modelClass;
        foreach ($args as $k => $v) {
            // $record->set($k, $v);
            $record->$k = $v;
        }
        return $record;
    }


    /**
     * Convert record object into Action object.
     *
     * @return WebAction\RecordAction\BaseRecordAction
     *
     * TODO: extract to CRUDUtils
     */
    public function createRecordAction(Model $record)
    {
        return $record->hasKey()
            ? $record->asUpdateAction()
            : $record->asCreateAction()
            ;
    }


    /**
     * Create a CRUD action from existing record object.
     *
     * We only invoke action runenr to load the action class. we don't generate
     * the action class manually here.
     *
     * @param Maghead\Runtime\Model $record
     * @param string $prefix Action prefix
     * @return WebAction\RecordAction\BaseRecordAction
     */
    protected function createModelActionClass(Model $record, $prefix, array $args = array(), $options = array())
    {
        $actionClass = $this->getModelActionClass($record, $prefix);
        // $actionClass = \WebAction\RecordAction\BaseRecordAction::createCRUDClass($class,$type);
        // $options['record'] = $record->getKey() ? $record : null;
        $options['record'] = $record;
        return new $actionClass($args , $options);
    }

    protected function getModelActionClass(Model $record, $prefix)
    {
        $recordClass = get_class($record);
        $refclass = new ReflectionClass($record);
        $actionClassNamespace = str_replace('\\Model','\\Action', $refclass->getNamespaceName());
        $actionClassShortName = ucfirst($prefix) . $refclass->getShortName();
        $actionClass = $actionClassNamespace . '\\' . $actionClassShortName;

        if (!class_exists($actionClass, true)) {
            kernel()->actionRunner->loadActionClass($actionClass);
        }

        // Generate the default action and try to require it.
        if (!class_exists($actionClass)) {
            $baseAction = $prefix . 'RecordAction';
            $template = new RecordActionTemplate;
            if ($generatedAction = $template->generate($actionClass, [
                'extends' => '\\WebAction\\RecordAction\\' . $baseAction,
                'properties' => [
                    'recordClass' => $recordClass,
                ],
            ])) {
                $generatedAction->load();
            }
        }

        if (!class_exists($actionClass)) {
            throw new Exception("Can not load action class '$actionClass' from model " . get_class($record));
        }
        return $actionClass;
    }


    /**
     * getCurrentAction returns the action object of the current
     * record.
     *
     * @return WebAction\RecordAction\BaseRecordAction
     */
    protected function getCurrentAction()
    {
        if ($this->currentAction) {
            return $this->currentAction;
        }

        $record = $this->getCurrentRecord() ?: $this->newRecord();
        return $this->currentAction = $this->createRecordAction($record);
    }

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

    /**
     * Get the action view for modal.
     */
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
     * @param WebAction\RecordAction
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
        return $action->asView($viewClass, $viewOptions);
    }


    /**
     * not used right now.
     */
    public function quickCreateAction()
    {
        return $this->render($this->findTemplate('quick_create.html.twig') , array());
    }



    // ==================================================================
    // Actions for APIs
    // ==================================================================

    public function summaryAction()
    {
        // handle unfiltered collection
        $collection = $this->getCollection();
        return $this->toJson([
            'numberOfTotalItems' => $collection->queryCount(),
        ]);
    }



    // ==================================================================
    // Actions for region display
    // ==================================================================

    public function modalEditRegionAction()
    {
        $this->editRegionActionPrepare();
        return $this->render($this->mustFindTemplate('modal.html.twig'), []);
    }

    public function editRegionActionPrepare()
    {
        $record = $this->getCurrentRecord();
        if (!$record) {
            $record = $this->newRecord();
        }

        // Apply predefined parameters from the query
        $request = $this->getRequest();
        if ($this->applyRequestFields) {
            foreach ($this->applyRequestFields as $fieldName) {
                if ($param = $request->param($fieldName)) {
                    $record->$fieldName = $param;
                }
            }
        }

        // create action after the record data is set
        $action = $this->getCurrentAction();

        $this->assign('RecordAction', $action);
        $this->assign('Record', $record);

        // XXX: deprecated
        $this->assignCRUDVars([
            'Action' => $action,
            'Record' => $record,
        ]);
    }

    /* editRegionAction_{{ id }} template must be declare */
    // TODO: Support create with pre-defined value 
    public function editRegionAction()
    {
        $this->editRegionActionPrepare();
        return $this->render($this->mustFindTemplate('edit.html.twig') , []);
    }

    public function viewRegionActionPrepare()
    {
        $record = $this->getCurrentRecord();
        if (!$record) {
            throw new Exception('Record not found.');
        }

        $this->assign('RecordAction', $action);
        $this->assign('Record', $record);

        // deprecated
        $this->assignCRUDVars(array(
            'Action' => $this->getCurrentAction(),
            'Record' => $record,
        ));
    }

    public function viewRegionAction()
    {
        $this->viewRegionActionPrepare();
        return $this->render($this->mustFindTemplate('view.html.twig'), []);
    }


    public function createRegionActionPrepare()
    {
        $record = $this->newRecord();

        // Create action after the record data is set
        $action = $this->getCurrentAction();

        // Apply predefined parameters from the query
        $request = $this->getRequest();
        if ($this->applyRequestFields) {
            foreach ($this->applyRequestFields as $fieldName) {
                if ($fieldValue = $request->param($fieldName)) {
                    $param = $action->getParam($fieldName);
                    $param->setValue($fieldValue);
                }
            }
        }


        $this->assign('RecordAction', $action);
        $this->assign('Record', $record);

        // XXX: deprecated
        $this->assignCRUDVars([
            'Action' => $action,
            'Record' => $record,
        ]);
    }



    public function createRegionAction()
    {
        if (!$this->canCreate) {
            throw new Exception('Creating new record requires permission.');
        }
        $this->createRegionActionPrepare();
        return $this->render($this->mustFindTemplate('edit.html.twig') , []);
    }

    public function deleteRegionActionPrepare()
    {
        $record = $this->getCurrentRecord();

        // create action after the record data is set
        $action = $record->asDeleteAction();

        $this->assign('RecordAction', $action);
        $this->assign('Record', $record);

        // XXX: deprecated
        $this->assignCRUDVars([
            'Action' => $action,
            'Record' => $record,
        ]);
    }


    public function deleteRegionAction()
    {
        if (!$this->canDelete) {
            throw new Exception('Deleting record requires permission.');
        }

        $this->deleteRegionActionPrepare();
        return $this->render($this->mustFindTemplate('delete.html.twig') , []);
    }


    public function itemRegionAction()
    {
        if (!$this->canUpdate) {
            throw new Exception('Creating new record requires permission.');
        }
        $this->editRegionActionPrepare();
        return $this->render( $this->mustFindTemplate('item.html.twig') , $args);
    }


    public function indexRegionAction()
    {
        $tiles = [];
        // the old way: this renders the content in the same request.
        // $tiles[] = $this->editRegionAction();
        // here we clone the request for the region.
        $tiles[] = $region = Region::create($this->getListRegionPath(), $this->environment['parameters']);
        return $this->render( $this->mustFindTemplate('index.html.twig'), [
            'tiles'      => $tiles,
            'listRegion' => $region,
        ]);
    }




    // ==================================================================
    // Actions for pages
    // ==================================================================


    public function createAction()
    {
        $tiles = array();
        // the old way: this renders the content in the same request.
        // $tiles[] = $this->editRegionAction();

        // here we clone the request for the region.
        $tiles[] = $region = Region::create( $this->getCreateRegionPath(), array_merge($_REQUEST, [ 
            '_form_controls' => true,
        ]));
        return $this->render($this->mustFindTemplate('page.html.twig') , [
            'tiles' => $tiles,
            'createRegion' => $region,
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
        $tiles[] = Region::create($this->getEditRegionPath(), array_merge($this->environment['parameters'], [
            '_form_controls' => true,
        ]));
        return $this->render($this->mustFindTemplate('page.html.twig') , [ 'tiles' => $tiles ]);
    }

    /**
     * Provide read only form page
     */
    public function viewAction()
    {
        $tiles = [];
        // Reuse the parameters from $_REQUEST
        // If we are going to render a full page for edit form, we shall also render the _form_controls
        $tiles[] = $region = Region::create($this->getViewRegionPath(), array_merge($this->environment['parameters'], [
            '_form_controls' => true,
        ]));

        return $this->render($this->mustFindTemplate('page.html.twig'), ['tiles' => $tiles ]);
    }


    /* indexAction is a tiled page,
     * you can use tile to push template blocks into it. */
    public function indexAction()
    {
        $tiles   = array();
        $tiles[] = $region = Region::create($this->getIndexRegionPath(), []);

        return $this->render($this->mustFindTemplate('page.html.twig'), [
            'tiles' => $tiles,
            'indexRegion' => $region,
        ]);
    }
}
