<?php
include_once('../vendor/autoload.php');
(new Productive\Application())
        ->loadDebug()
        ->setFolderController('Controle')
        ->setFolderView('Visao')
        ->setMainTemplate('public/layout.phtml')
        ->run();
