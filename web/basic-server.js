var http = require("http");
var handler = require("./request-handler");
var initialize = require("./initialize.js");
// added require
var urlParser = require('url');


// Why do you think we have this here?
// HINT:It has to do with what's in .gitignore
initialize();

var port = 8080;
var ip = "127.0.0.1";

var routes = {
  "/www.yahoo.com": handler.handleRequest,
  "/styles.css": handler.handleRequest,
  "/" : handler.handleRequest,
  "/index.html" : handler.handleRequest,
  "/loading.html" : handler.handleRequest // note: this might be different
};

// var server = http.createServer(handler.handleRequest);

var server = http.createServer(function(request, response){
  console.log("Serving request type " + request.method + " for url " + request.url);

  var parts = urlParser.parse(request.url);
  var route = routes[parts.pathname];
  if( route ){
    route(request, response, parts.pathname);
  } else {
    //404
    response.end();
    // handler.handleRequest(request, response, parts.pathname);
    //utils.sendResponse(response, "Not Found", 404);
    //http.sendResponse instead?
  }
});


console.log("Listening on http://" + ip + ":" + port);
server.listen(port, ip);
