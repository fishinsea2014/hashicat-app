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
map.set('Jason','Hello from Jason');

//Convert a map to an object
function strMapToObj(strMap) {
    let arr = [];
    for (let [k, v] of strMap) {
        let obj = {};
        obj.key = k;
        obj.value = v;
        arr.push(obj);
    }
    return arr;
}

//Convert a map to a JSON object
function strMapToJson(strMap) {
    let jsonStr = JSON.stringify(strMapToObj(strMap));
    console.log('res string: ',jsonStr);
    return jsonStr;
}

var app = connect()
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({extended: true}))
    .use(serveStatic(__dirname)) //Static directories
    //Add a new message from client into map
    .use(function (req, res, next) {
        //Allow Ajax cross domain access
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,X-Session-Token');
		res.writeHead(200, {"Content-Type": "text/plain;charset=utf-8"});
		next();

    })
    .use('/list/add', function(req,res,next){
        console.log(req.body);
        map.set(req.body.name, req.body.message);
        console.log('map: ', map);
        var data = {"code":200, "msg":"success"};
        res.end(JSON.stringify(data));
        next();
    })
    .use('/list/get', function(req, res, next) {
        console.log('body of get',req.body);
        console.log('body of res',res);
        res.end(strMapToJson(map));
		next();
	})
    .listen(3000);
    
console.log('Message baord server started on port 3000');

