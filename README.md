







React List App

To enable react list app, define the property here:

    protected $reactListApp = '....';

Has Many Editor

    use CRUD\CRUDReactHasManyEditor;

    /**
     * itemDesc describes the relationship between data and the placeholder designed in the UI
     * and defines how the cover view should be built
     *
     * @return array
     */
    public function itemDesc()
    {
        $controls = [];
        if ($this->canCreate) {
            $controls[] = ['action' => 'create'];
        }
        if ($this->canUpdate) {
            $controls[] = ['action' => 'edit'];
        }
        if ($this->canDelete) {
            $controls[] = ['action' => 'delete'];
        }
        return [
            "view" => "ImageCoverView",
            "display" => "float",
            "coverImage" => [
                "field" => ["thumb", "image"],
                "width" => 200,
                "height" => 100,
                "backgroundSize" => "cover"
            ],
            "title" => ["field" => "title" ],
            "controls" => $controls,
        ];
    }

    /**
     * itemDesc describes the relationship between data and the placeholder designed in the UI
     * and defines how the cover view should be built
     *
     * @return array
     */
    public function itemDesc()
    {
        $controls = [];
        if ($this->canUpdate) {
            $controls[] = ['action' => 'edit'];
        }
        if ($this->canDelete) {
            $controls[] = ['action' => 'delete'];
        }
        return [
            "view" => "TextCoverView",
            "display" => "block",
            "title" => [ "field" => "name" ],
            "subtitle" => ["format" => "備註: {comment}"],
            "desc" => [ "field" => "description" ],
            "footer" => [
                "columns" => [
                    [ "text" => [ 'format' => '數量 {quantity}' ] ],
                    [ "text" => [ 'format' => '價格 $ {price}' ] ]
                ]
            ],
            "controls" => $controls,
        ];
    }



    /**
     * itemDesc describes the relationship between data and the placeholder designed in the UI
     * and defines how the cover view should be built
     *
     * @return array
     */
    public function itemDesc()
    {
        $controls = [];
        if ($this->canUpdate) {
            $controls[] = ['action' => 'edit'];
        }
        if ($this->canDelete) {
            $controls[] = ['action' => 'delete'];
        }
        return [
            "view" => "TextCoverView",
            "display" => "block",
            "title" => [ "field" => "name" ],
            "subtitle" => [ "format" => "{address} {cellphone}" ],
            "desc" => [ "field" => "identity_no" ],
            "footer" => [
                /*
                "columns" => [
                    [ "text" => [ 'format' => '費用 $ {fee}' ] ],
                    [ "text" => [ 'format' => '距離 {distance} km' ] ],
                    [ "tags" => [ [ 'format' => '$ {fee}' ], [ 'format' => '{distance} km' ] ] ]
                ]
                */
            ],
            "controls" => $controls,
        ];
    }

    /**
     * itemDesc describes the relationship between data and the placeholder designed in the UI
     * and defines how the cover view should be built
     *
     * @return array
     */
    public function itemDesc()
    {
        $controls = [];
        if ($this->canCreate) {
            $controls[] = ['action' => 'create'];
        }
        if ($this->canUpdate) {
            $controls[] = ['action' => 'edit'];
        }
        if ($this->canDelete) {
            $controls[] = ['action' => 'delete'];
        }
        return [
            'columns' => [
                [ 'label' => '姓名', 'key' => 'name' ],
                [ 'label' => '性別', 'key' => 'gender' ],
                [ 'label' => '身份證字號', 'key' => 'identity_no' ],
                [ 'label' => '手機', 'key' => 'cellphone' ],
                [ 'label' => '地址', 'key' => 'address', 'style' => [ 'maxWidth' => 180, 'display' => 'inline-block' ]],
                [ 'label' => '組別', 'key' => 'event_group_title', ],
                [ 'label' => '費用', 'key' => 'total_amount' ],
            ],
            'controls' => $controls,
        ];
    }




    public function itemViewBuilder()
    {
        return 'EventRatingViewBuilder';
    }


Using React Editor in the templates


    public function createRegionActionPrepare()
    {
        parent::createRegionActionPrepare();
        $record = $this->getCurrentRecord();

        $controller = new EventProductCRUDHandler;
        $this->assign('productEditAppConfig', $controller->buildReactHasManyEditorConfig($record, 'products')); // it belongs to reviews
    }

    {% reactapp "CRUDHasManyEditor" with productTypeEditAppConfig %}


Override Search Action

    /**
     * @override searchAction
     */
    public function searchAction()
    {
        $collection = $this->search($this->getRequest());
        $items = [];
        foreach ($collection as $record) {
            $array = $record->toInflatedArray();
            $array['product'] = $record->product->toInflatedArray();
            $items[] = $array;
        }
        return $this->toJson($items);
    }

    /**
     * Provide the search functionality to return matched collection in JSON
     * format response.
     */
    public function searchAction()
    {
        $collection = $this->search($this->getRequest());
        return $this->toJson(array_map(function($item) {
            $array = $item->toInflatedArray();
            $array['gender'] = $item->display('gender');
            $array['total_amount'] = $item->calculateTotalAmount();
            if ($item->event_group_id) {
                $array['event_group_title'] = $item->event_group->title;
            }
            return $array;
        }, $collection->items()));
    }



