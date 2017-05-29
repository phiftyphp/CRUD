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
}
