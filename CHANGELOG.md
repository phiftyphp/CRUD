CHANGELOG
=========

VERSION 4.0.x-dev
-----------------

1. Removed renderPageWrapper method from CRUDHandler.
2. Renamed `findTemplatePath` with `findTemplate`.
3. Renamed `getDefaultData` with `getDefaultRecordArgs`.
4. `loadRecord` is now `loadCurrentRecord` and only returns record if loaded.
5. Remove all CRUD dialog related methods.

VERSION 3.0.x-dev
-----------------

1. Updated expand method with Pux\Controller\ExpandableController

2. Migrate RESTful controller to Pux

replace this:

    kernel()->restful->registerResource('product','ProductBundle\\RESTful\\ProductHandler');
    kernel()->restful->registerResource('product_type','ProductBundle\\RESTful\\ProductTypeHandler');

to

    kernel()->restful->addResource('product','ProductBundle\\RESTful\\ProductHandler');
    kernel()->restful->addResource('product_type','ProductBundle\\RESTful\\ProductTypeHandler');

Update RESTful implementation, here is the diff:

     <?php
     namespace ProductBundle\RESTful;
    -use CRUD\RESTful\ResourceHandler;
    +use CRUD\Controller\RESTfulResourceController;

    -class ProductHandler extends ResourceHandler
    +class ProductHandler extends RESTfulResourceController
     {
         public $recordClass = 'ProductBundle\\Model\\Product';
     }




