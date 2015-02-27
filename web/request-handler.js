var path = require('path');
var archive = require('../helpers/archive-helpers');
// require more modules/folders here!
var http = require('./http-helpers');
var urlParser = require('url');
// var fs = require('fs'); //http-helper already has this. Consider refactoring fs into http-helper

var actions = {
  'GET': function(req, res, path){
    res.writeHead(200, http.headers);
    http.serveAssets(res, path);
  },

  "POST": function(req, res, path){
    res.writeHead(302, http.headers);
    var input;
    req.on('data', function(data){
      // console.log(data);
      input += data;
    });
    req.on('end', function(){
      console.log(input.split("=")[1]);
      http.saveAsset(res, input.split("=")[1]);

    });
  }
};

exports.handleRequest = function (req, res) {
  // archive.downloadUrls('www.yahoo.com');
  var action = actions[req.method];
  // console.log(req);
  //var parts = urlParser.parse(req.url);
  var parts = urlParser.parse(req.url);
  //console.log(parts);
  if(action){
    action(req, res, parts.pathname);
  } else {
    res.end(archive.paths.list);

  }
};
