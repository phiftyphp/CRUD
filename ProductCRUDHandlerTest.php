<?php

namespace CRUD;

use PHPUnit\Framework\TestCase;

use Funk\Environment;
use Pux\Mux;
use Pux\RouteRequest;
use Pux\RouteExecutor;
use CRUD\Testing\CRUDTestCase;

use ProductBundle\Model\Product;
use ProductBundle\Model\ProductSchema;
use ProductBundle\Model\Category;
use ProductBundle\Model\CategorySchema;

use ProductBundle\Model\ProductToCategorySchema;

use ProductBundle\ProductCRUDHandler;
use Phifty\Testing\ModelTestCase;

class ProductCRUDHandlerTest extends CRUDTestCase
{
    protected $handler;

    protected $mux;

    public function setUp()
    {
        parent::setUp();
        $app = new \Phifty\App($this->kernel);
        $app->boot();

        $this->handler = new ProductCRUDHandler;
        $this->mux = new Mux;
        $this->mux->mount('/bs/product', $this->handler);
    }

    public function models()
    {
        return [new ProductSchema, new CategorySchema, new ProductToCategorySchema];
    }

    public function testCreateWithRel()
    {
        $ret = Category::create(['name' => 'Testing Cate']);
        $this->assertResultSuccess($ret);

        $environment = $this->createEnvironment('GET', '/bs/product/crud/create', [
            'rel' => 'category',
            'relKey' => $ret->key,
        ]);
        $req = RouteRequest::createFromEnv($environment);
        $route = $this->mux->dispatchRequest($req);

        $response = RouteExecutor::execute($route, $environment, []);
        $this->assertNotEmpty($response);
    }
}


