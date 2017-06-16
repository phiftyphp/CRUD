

Implement The Button with parent record key:

      <span class="CRUDCreateButton" data-base-url="/bs/product-category" data-parent-record-key="{{c.id}}" data-label="Create Subcategory"> </span>

Setup the CRUD properties:

    public $parentKeyRecordClass = Category::class;

    public $parentKeyField = 'parent_id';

