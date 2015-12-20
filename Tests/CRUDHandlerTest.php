<?php
use Pux\Mux;
use EmailBundle\EmailTemplateCRUDHandler;
use Phifty\Routing\RouteExecutor;

class CRUDHandlerTest extends PHPUnit_Framework_TestCase
{
    public function testMuxMount()
    {
        $mux = new Mux;
        $mux->mount('/bs', new EmailTemplateCRUDHandler);

        $handler = new EmailTemplateCRUDHandler;
        $mux = $handler->expand();
        $this->assertNotNull($mux);
    }

    public function testIndexAction()
    {
        return $this->markTestSkipped('phifty bootstrap script is not fixed yet');
        $handler = new EmailTemplateCRUDHandler;
        $mux = new Mux;
        $mux->mount('/bs/email', $handler);
        $route = $mux->dispatch('/bs/email');
        $this->assertNotNull($route);
        $response = RouteExecutor::execute($route);
        $this->assertNotNull($response);
    }
}
