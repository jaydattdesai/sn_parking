var logger = require('morgan');
var express = require('express')
  , app = express();

  var fs = require('fs'); 
eval(fs.readFileSync('search.js')+'');


console.log('Running at: http://localhost:8000');

app
  .get('/', function(req, res) {
    return res.sendfile(__dirname + '/views/index.html')
  })
  .use(express.static(__dirname + '/'))
  .use(logger('dev'))
  .listen(8000);
