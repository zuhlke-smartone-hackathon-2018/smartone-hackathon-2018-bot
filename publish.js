var zipFolder = require('zip-folder');
var path = require('path');
var fs = require('fs');
var request = require('request');

var rootFolder = path.resolve('.');
var zipPath = path.resolve(rootFolder, '../smartone-hackathon-2018.zip');
var kuduApi = 'https://smartone-hackathon-2018.scm.azurewebsites.net/api/zip/site/wwwroot';
var userName = '$smartone-hackathon-2018';
var password = 'qJumXLumBHGtMzs2J04K6eu20uSMrNorMqbnehmAYZWyYc7BqrFcriyv9b9M';

function uploadZip(callback) {
  fs.createReadStream(zipPath).pipe(request.put(kuduApi, {
    auth: {
      username: userName,
      password: password,
      sendImmediately: true
    },
    headers: {
      "Content-Type": "applicaton/zip"
    }
  }))
  .on('response', function(resp){
    if (resp.statusCode >= 200 && resp.statusCode < 300) {
      fs.unlink(zipPath);
      callback(null);
    } else if (resp.statusCode >= 400) {
      callback(resp);
    }
  })
  .on('error', function(err) {
    callback(err)
  });
}

function publish(callback) {
  zipFolder(rootFolder, zipPath, function(err) {
    if (!err) {
      uploadZip(callback);
    } else {
      callback(err);
    }
  })
}

publish(function(err) {
  if (!err) {
    console.log('smartone-hackathon-2018 publish');
  } else {
    console.error('failed to publish smartone-hackathon-2018', err);
  }
});