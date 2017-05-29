<?php return array (
  'cli' => 
  array (
    'bootstrap' => 'bootstrap.php',
  ),
  'schema' => 
  array (
    'auto_id' => true,
    'loaders' => 
    array (
      0 => 'Phifty::Schema::Loader::AppSchemaLoader',
      1 => 
      array (
        'name' => 'ComposerSchemaLoader',
        'args' => 
        array (
          0 => 'composer.json',
        ),
      ),
    ),
  ),
  'seeds' => NULL,
  'databases' => 
  array (
    'master' => 
    array (
      'driver' => 'mysql',
      'host' => 'localhost',
      'database' => 'phifty',
      'user' => 'root',
      'pass' => NULL,
      'password' => NULL,
      'query_options' => 
      array (
      ),
      'connection_options' => 
      array (
        1002 => 'SET NAMES utf8',
      ),
      'dsn' => 'mysql:host=localhost;dbname=phifty',
    ),
  ),
);