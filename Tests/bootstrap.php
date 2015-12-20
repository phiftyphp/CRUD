<?php
require 'vendor/autoload.php';
use ConfigKit\ConfigLoader;
use Phifty\Kernel;

function kernel() {
    static $kernel;
    $kernel = new Kernel;
    $configLoader = new ConfigLoader();
    $configLoader->load('framework', 'vendor/corneltek/phifty-core/config/framework.dev.yml');
    $kernel->registerService(new \Phifty\ServiceProvider\ConfigServiceProvider($configLoader));
    $kernel->registerService(new \Phifty\ServiceProvider\EventServiceProvider());
    return $kernel;
}
