var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

exports.serveAssets = function(res, asset, callback) {
  if(asset === "/" || asset === undefined){
    asset = '/index.html'; // might not be the best place
  }
  var filePath = path.join(__dirname, "/public" + asset);
  //console.log(filePath);
  fs.readFile(filePath, function(err, file){
    if(err){
      //throw err;
      // console.log('error');
      fs.readFile(path.join(__dirname, "../archives/sites" + asset), function(err, file){
        // console.log(path.join(__dirname, "../archives/sites" + asset));
        if(err){
          //throw err;
          res.writeHead(404, exports.headers);
          res.end();
        } else {
          // console.log('file: ', file);
          res.write(file);
          res.end();
        }
      });
    } else {
      // console.log('file: ', file);
      //should serve archived sites
      res.write(file);
      res.end();
    }
  });
};

exports.saveAsset = function(res, asset, callback){
  // console.log(asset);
  if(!archive.isUrlInList(asset)){
    // console.log(!archive.isUrlInList(asset));
    archive.addUrlToList(asset);
    exports.serveAssets(res, "/loading.html");
  } else {
    exports.serveAssets(res, "/"+asset);
  }
  // res.end();
  // archive.isUrlInList(asset.slice(1), function(found){
  //   if(found){
  //     //do something
  //   }
  // });
  // if(!archive.isUrlInList(asset.substring(1))){
  //   archive.downloadUrls(asset.substring(1));
  // }
  // res.end();
  // // res.write();
};

// As you progress, keep thinking about what helper functions you can put here!
