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

class CRUDHandlerTest extends TestCase
{

    public function testDefaultCollectionShouldReturnUserCollection()
    {
        $env = Environment::createFromGlobals();
        $response = [];
        $matchedRoute = [false, '/bs/user', [UserCRUDHandler::class, 'indexAction'], [ 'mount_path' => '/bs/user' ]];
        $handler = new UserCRUDHandler($env, $response, $matchedRoute);
        $handler->init();

        $collection = $handler->createDefaultCollection();
        $this->assertInstanceOf(UserCollection::class, $collection);
    }

    public function testGetModelSchemaShouldReturnUserSchemaProxy()
    {
        $env = Environment::createFromGlobals();
        $response = [];
        $matchedRoute = [false, '/bs/user', [UserCRUDHandler::class, 'indexAction'], [ 'mount_path' => '/bs/user' ]];
        $handler = new UserCRUDHandler($env, $response, $matchedRoute);
        $handler->init();

        $schema = $handler->getModelSchema();
        $this->assertInstanceOf(UserSchemaProxy::class, $schema);
    }

    public function testGetRoutePrefixShouldReturnTheMountPath()
    {
        $env = Environment::createFromGlobals();
        $response = [];
        $matchedRoute = [false, '/bs/user/create', [UserCRUDHandler::class, 'indexAction'], [ 'mount_path' => '/bs/user' ]];
        $handler = new UserCRUDHandler($env, $response, $matchedRoute);
        $handler->init();

        $prefix = $handler->getRoutePrefix();
        $this->assertEquals('/bs/user', $prefix);
    }

    public function testOrderCollectionByRequest()
    {
        $env = Environment::createFromArray([
            '_SERVER' => $_SERVER,
            '_REQUEST' => [ '_order_column' => 'id', '_order_by' => 'ASC' ],
            '_POST' => [],
            '_GET' => [],
            '_COOKIE' => [],
            '_SESSION' => [],
        ]);
        $response = [];
        $matchedRoute = [false, '/bs/user/create', [UserCRUDHandler::class, 'indexAction'], [ 'mount_path' => '/bs/user' ]];
        $handler = new UserCRUDHandler($env, $response, $matchedRoute);
        $handler->init();

        $collection = $handler->orderCollection(new UserCollection);
        $this->assertInstanceOf(UserCollection::class, $collection);

        $sql = $collection->getCurrentQuery()->toSql(new \Magsql\Driver\MySQLDriver, new \Magsql\ArgumentArray);
        $this->assertContains('ORDER BY id ASC', $sql);
        $users = $collection->items();
        $this->assertNotNull($users, 'the query executed successfully.');
    }

}
