$(document).ready(function () {
    System.Msg.confirm('Hello this is my first script, my file is hello.js</br> Do you read me?', function () {
        System.Msg.ok("Let's go!");
    }, function () {
        System.Msg.error("No you won't.");
    });
});