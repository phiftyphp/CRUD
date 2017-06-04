<?php

namespace CRUD;

use PHPUnit\Framework\TestCase;

use UserBundle\UserBundle;
use UserBundle\UserCRUDHandler;
use UserBundle\Model\UserCollection;
use UserBundle\Model\User;
use UserBundle\Model\UserSchema;
use UserBundle\Model\UserSchemaProxy;
use Funk\Environment;
use Pux\Mux;
use Pux\RouteRequest;
use Pux\RouteExecutor;

class CRUDHandlerTest extends \CRUD\Testing\CRUDTestCase
{
    public function setUp()
    {
        parent::setUp();
        $app = new \Phifty\App($this->kernel);
        $app->boot();
    }

    public function testNewRecordShouldReturnTheRecordWithDefaultArgs()
    {
        $environment = $this->createEnvironment('GET', '/bs/user');

        $c = new UserCRUDHandler;
        $mux = new Mux;
        $mux->mount('/bs/user', $c);

        $req = RouteRequest::createFromEnv($environment);
        $route = $mux->dispatchRequest($req);
        $response = RouteExecutor::execute($route, $environment, []);

        $record = $c->newRecord([ 'email' => 'new_user@gmail.com' ]);
        $this->assertInstanceOf(User::class, $record);
        $this->assertEquals('new_user@gmail.com', $record->email);
    }

    public function testLoadCurrentRecordShouldReturnModelInstance()
    {
        $environment = $this->createEnvironment('GET', '/bs/user');

        $c = new UserCRUDHandler;
        $mux = new Mux;
        $mux->mount('/bs/user', $c);

        $req = RouteRequest::createFromEnv($environment);
        $route = $mux->dispatchRequest($req);
        $response = RouteExecutor::execute($route, $environment, []);


        $record = $c->loadCurrentRecord();
        $this->assertFalse($record);
    }

    public function testDefaultCollectionShouldReturnUserCollection()
    {
        $environment = $this->createEnvironment('GET', '/bs/user');

        $c = new UserCRUDHandler;
        $mux = new Mux;
        $mux->mount('/bs/user', $c);

        $req = RouteRequest::createFromEnv($environment);
        $route = $mux->dispatchRequest($req);
        $response = RouteExecutor::execute($route, $environment, []);


        $collection = $c->createDefaultCollection();
        $this->assertInstanceOf(UserCollection::class, $collection);
    }

    public function testGetModelSchemaShouldReturnUserSchemaProxy()
    {
        $environment = $this->createEnvironment('GET', '/bs/user');

        $c = new UserCRUDHandler;
        $mux = new Mux;
        $mux->mount('/bs/user', $c);

        $req = RouteRequest::createFromEnv($environment);
        $route = $mux->dispatchRequest($req);
        $response = RouteExecutor::execute($route, $environment, []);


        $schema = $c->getModelSchema();
        $this->assertInstanceOf(UserSchemaProxy::class, $schema);
    }

    public function testGetRoutePrefixShouldReturnTheMountPath()
    {
        $environment = $this->createEnvironment('GET', '/bs/user');

        $c = new UserCRUDHandler;
        $mux = new Mux;
        $mux->mount('/bs/user', $c);

        $req = RouteRequest::createFromEnv($environment);
        $route = $mux->dispatchRequest($req);
        $response = RouteExecutor::execute($route, $environment, []);

        $prefix = $c->getRoutePrefix();
        $this->assertEquals('/bs/user', $prefix);
    }

    public function testOrderCollectionByRequest()
    {
        $environment = $this->createEnvironment('GET', '/bs/user', [ '_order_column' => 'id', '_order_by' => 'ASC' ]);


        $c = new UserCRUDHandler;
        $mux = new Mux;
        $mux->mount('/bs/user', $c);

        $req = RouteRequest::createFromEnv($environment);
        $route = $mux->dispatchRequest($req);
        $response = RouteExecutor::execute($route, $environment, []);



        $collection = $c->orderCollection(new UserCollection);
        $this->assertInstanceOf(UserCollection::class, $collection);

        $sql = $collection->getCurrentQuery()->toSql(new \Magsql\Driver\MySQLDriver, new \Magsql\ArgumentArray);
        $this->assertContains('ORDER BY id ASC', $sql);
        $users = $collection->items();
        $this->assertNotNull($users, 'the query executed successfully.');
    }



    public function crudPathDataProvider()
    {
        return [
            ['/bs/user','the index page.'],
            ['/bs/user','the region action in the index page.'],
            ['/bs/user/crud/create', 'the create form action'],
            ['/bs/user/crud/list', 'list region action.'],
            ['/bs/user/crud/list_inner', 'list region action.'],
        ];
    }

    /**
     * @dataProvider crudPathDataProvider
     */
    public function testRouteExecute($pathInfo)
    {
        $environment = $this->createEnvironment('GET', $pathInfo);

        $c = new UserCRUDHandler;
        $mux = new Mux;
        $mux->mount('/bs/user', $c);

        $req = RouteRequest::createFromEnv($environment);
        $route = $mux->dispatchRequest($req);

        $this->assertNotEmpty($route);

        $response = RouteExecutor::execute($route, $environment, []);
        $this->assertNotEmpty($response);
    }
}
