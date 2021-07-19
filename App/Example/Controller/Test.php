<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace App\Example\Controller;

/**
 * Description of Test
 *
 * @author calixto
 */
class Test extends \Productive\Tier\Controller{
    /**
     * This execution is callable with route http://localhost/example/test/execution
     * and default view on path App/Example/View/Test/execution.phtml
     */
    public function execution(){
        return $this->view;
    }
}
