<?php
ini_set('display_errors', 'On');
include_once('../Productive/autoload.php');
include_once('../Productive/debug.php');
(new Productive\Application())
        ->setFolderController('Controle')
        ->setFolderView('Visao')
        ->setMainTemplate('public/layout.phtml')
        ->run();
