<?php

namespace CRUD\Testing;

use UserBundle\Model\UserSchema;

abstract class CRUDTestCase extends \Phifty\Testing\ModelTestCase
{
    public function models()
    {
        return [new UserSchema];
    }
}
