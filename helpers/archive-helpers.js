var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  'siteAssets' : path.join(__dirname, '../web/public'),
  'archivedSites' : path.join(__dirname, '../archives/sites'),
  'list' : path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for jasmine tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!
var listOfFiles = [];

exports.readListOfUrls = function(callback){
  //get the file and read it
  // var fileData = require(exports.paths.list);
  fs.readFile(exports.paths.list, {encoding: 'utf-8'}, function(err, file){
    if(err){
        throw err;
    }
    var files = file.split("\n");

    callback(files);
      // for(var i = 0; i < files.length; i++){
      //   callback(files[i]);
      // }

    // listOfFiles = file.split("\n");

    // var temp = file.split("\n");
    // _.each(temp, function(site){
    //   listOfFiles[site] = true;
    // });
    // console.log(listOfFiles);
  });
  //loop through exports.paths.list
  //read the data
  //store it
};

exports.isUrlInList = function(url){

  //linear lookup time, object variable would give it constant time.
  return listOfFiles.indexOf(url) >= 0;
  // if(listOfFiles.indexOf(url) >= 0){
  //   return true;
  // } else {
  //   return false;
  // }
};

exports.addUrlToList = function(url){
  fs.appendFile(exports.paths.list, url + "\n");
  listOfFiles.push(url);
  exports.downloadUrls(url);
};

exports.isURLArchived = function(url){
  return fs.exists(exports.paths.archivedSites + "/" + url, function(exists){
    return exists;
  });
};

exports.downloadUrls = function(url){
  // //console.log("downloadUrls!");
  if(Array.isArray(url)){
    for(var i = 0; i < url.length; i++){
      var request = http.request({
        hostname: url[i],
        port: 80,
        method: "GET"
      }, function(response){
        response.setEncoding('utf8');
        response.on('data', function(data){
          //console.log("response.on data: ", data);
          fs.writeFile(exports.paths.archivedSites + "/" + url[i], data);
        });
      });
      request.on('success', function(){
        exports.addUrlToList(url[i]);
      });
      request.end();
    }
  } else {
    var request = http.request({
      hostname: url,
      port: 80,
      method: "GET"
    }, function(response){
      response.setEncoding('utf8');
      response.on('data', function(data){
          //console.log("response.on data: ", data);
          fs.writeFile(exports.paths.archivedSites + "/" + url, data);
        });
    });
    request.on('success', function(){
      exports.addUrlToList(url);
    });
    request.end();
  }
};
