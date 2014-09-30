var url = require('url');

app.get('/search', function(req, res){   
  console.log('searched for something...');
  res.writeHead(200, {"Content-Type": "application/json","Access-Control-Allow-Origin": "*"});
  var otherArray = ["jaydatt", "jiri", "michael"];
  var searchedValue = url.parse(req.url,true).query.search.trim();

   if(searchedValue != '')
  for (var i = otherArray.length - 1; i >= 0; i--) {
  	if(!otherArray[i].startsWith(searchedValue)) {
  		otherArray.splice( otherArray.indexOf( otherArray[i] ), 1 );
  	}
  };
  var otherObject = { name: "item1val", name: "item2val" };
  var json = JSON.stringify({ 
    anObject: otherObject, 
    anArray: otherArray, 
    another: "item"
  });
  res.end(json);
});  

app.get('/searchParking', function(req, res){  
  var locationValue = url.parse(req.url,true).query.location.trim();
  console.log("searched for: " + locationValue);
  res.writeHead(200, {"Content-Type": "application/json","Access-Control-Allow-Origin": "*"});

  var locations = [{lat:"37.779",lon:"-122.3892"}
                  ,{lat:"23.006126",lon:"72.521721"}
                  ,{lat:"52.5167",lon:"13.3833"}
                  ,{lat:"52.498555",lon:"13.442965"}
                  ,{lat:"53.5167",lon:"13.3833"}
                  ];
  var json = JSON.stringify({ 
      locations: locations

  });

  res.end(json);
});


if (typeof String.prototype.startsWith != 'function') {
  // see below for better implementation!
  String.prototype.startsWith = function (str){
    return this.indexOf(str) == 0;
  };
}