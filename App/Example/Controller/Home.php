<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
namespace App\Example\Controller;

/**
 * Description of Home
 *
 * @author calixto
 */
class Home extends \Productive\Tier\Controller {

    public function hello() {
        return $this->view;
    }
    
    public function alou() {
        x('aqui agora');
    }

}
