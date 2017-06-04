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

class CRUDHandlerTest extends \CRUD\Testing\CRUDTestCase
{
    public function testNewRecordShouldReturnTheRecordWithDefaultArgs()
    {
        $environment = $this->createEnvironment('GET', '/bs/user');
        $response = [];
        $matchedRoute = [false, '/bs/user', [UserCRUDHandler::class, 'indexAction'], [ 'mount_path' => '/bs/user' ]];
        $handler = new UserCRUDHandler($environment, $response, $matchedRoute);
        $handler->init();

        $record = $handler->newRecord([
            'email' => 'new_user@gmail.com',
        ]);
        $this->assertInstanceOf(User::class, $record);
        $this->assertEquals('new_user@gmail.com', $record->email);
    }

    public function testLoadCurrentRecordShouldReturnModelInstance()
    {
        $environment = $this->createEnvironment('GET', '/bs/user');
        $response = [];
        $matchedRoute = [false, '/bs/user', [UserCRUDHandler::class, 'indexAction'], [ 'mount_path' => '/bs/user' ]];
        $handler = new UserCRUDHandler($environment, $response, $matchedRoute);
        $handler->init();

        $record = $handler->loadCurrentRecord();
        $this->assertFalse($record);
    }

    public function testDefaultCollectionShouldReturnUserCollection()
    {
        $environment = $this->createEnvironment('GET', '/bs/user');
        $response = [];
        $matchedRoute = [false, '/bs/user', [UserCRUDHandler::class, 'indexAction'], [ 'mount_path' => '/bs/user' ]];
        $handler = new UserCRUDHandler($environment, $response, $matchedRoute);
        $handler->init();

        $collection = $handler->createDefaultCollection();
        $this->assertInstanceOf(UserCollection::class, $collection);
    }

    public function testGetModelSchemaShouldReturnUserSchemaProxy()
    {
        $environment = $this->createEnvironment('GET', '/bs/user');
        $response = [];
        $matchedRoute = [false, '/bs/user', [UserCRUDHandler::class, 'indexAction'], [ 'mount_path' => '/bs/user' ]];
        $handler = new UserCRUDHandler($environment, $response, $matchedRoute);
        $handler->init();

        $schema = $handler->getModelSchema();
        $this->assertInstanceOf(UserSchemaProxy::class, $schema);
    }

    public function testGetRoutePrefixShouldReturnTheMountPath()
    {
        $environment = $this->createEnvironment('GET', '/bs/user');
        $response = [];
        $matchedRoute = [false, '/bs/user/create', [UserCRUDHandler::class, 'indexAction'], [ 'mount_path' => '/bs/user' ]];
        $handler = new UserCRUDHandler($environment, $response, $matchedRoute);
        $handler->init();

        $prefix = $handler->getRoutePrefix();
        $this->assertEquals('/bs/user', $prefix);
    }

    public function testOrderCollectionByRequest()
    {
        $environment = $this->createEnvironment('GET', '/bs/user', [ '_order_column' => 'id', '_order_by' => 'ASC' ]);

        $response = [];
        $matchedRoute = [false, '/bs/user/create', [UserCRUDHandler::class, 'indexAction'], [ 'mount_path' => '/bs/user' ]];
        $handler = new UserCRUDHandler($environment, $response, $matchedRoute);
        $handler->init();

        $collection = $handler->orderCollection(new UserCollection);
        $this->assertInstanceOf(UserCollection::class, $collection);

        $sql = $collection->getCurrentQuery()->toSql(new \Magsql\Driver\MySQLDriver, new \Magsql\ArgumentArray);
        $this->assertContains('ORDER BY id ASC', $sql);
        $users = $collection->items();
        $this->assertNotNull($users, 'the query executed successfully.');
    }



    public function crudPathDataProvider()
    {
        return [
            ['/bs/user', 'indexAction', 'the index page.'],
            ['/bs/user', 'indexRegionAction', 'the region action in the index page.'],
            ['/bs/user/list', 'listRegionAction', 'list region action.'],
            ['/bs/user/list_inner', 'listInnerRegionAction', 'list region action.'],
        ];
    }

    /**
     * @dataProvider crudPathDataProvider
     */
    public function testRouteExecute($pathInfo, $action)
    {
        $environment = $this->createEnvironment('GET', $pathInfo);
        $route = [false, $pathInfo, [UserCRUDHandler::class, $action], [ 'mount_path' => '/bs/user' ]];
        $response = [];
        $response = \Phifty\Routing\RouteExecutor::execute($route, $environment, $response, $route);
        $this->assertNotEmpty($response);
    }


    public function testListRegionAction()
    {
        $environment = $this->createEnvironment('GET', '/bs/user/list');
        $response = [];
        $matchedRoute = [false, '/bs/user/list', [UserCRUDHandler::class, 'listRegionAction'], [ 'mount_path' => '/bs/user' ]];
        $handler = new UserCRUDHandler($environment, $response, $matchedRoute);
        $handler->init();
        $region = $handler->listRegionAction();
        $this->assertNotEmpty($region);
    }
}
