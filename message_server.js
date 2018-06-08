/**
 * @author: Jason Qu
 * This is a message board for exercising the promise 
 */

 // Import dependencies
var connect = require('connect');  
var bodyParser = require('body-parser');   
var serveStatic = require('serve-static');   

// Use a map to store the message data
let map = new Map();

var app = connect()
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({extended: true}))
    .use(serveStatic(__dirname)) //Static directories
    .use(function (req, res, next) {

    })
    .listen(3000);
    
console.log('Message baord server started on port 3000');

