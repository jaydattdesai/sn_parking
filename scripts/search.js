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

  var locations;
  if (locationValue.toUpperCase() == 'BERLIN') {
    locations = [{location:"loc4", cost:"3", lat:"52.498555",lon:"13.442965"}
                    ,{location:"loc5", cost:"13", lat:"53.5167",lon:"13.3833"}
                    ,{location:"loc6", cost:"15", lat:"52.517467",lon:"13.404942"}
                    ,{location:"loc7", cost:"4", lat:"52.515900",lon:"13.402024"}
                    ,{location:"loc8", cost:"5", lat:"52.518825",lon:"13.405113"}
                    ,{location:"loc9", cost:"17", lat:"52.520078",lon:"13.405628"}
                    ,{location:"loc10", cost:"2", lat:"52.520809",lon:"13.403397"}
                    ];
  } else if (locationValue.toUpperCase() == 'ALL') {
    locations = [{location:"loc1", cost:"4", lat:"37.779",lon:"-122.3892"}
                    ,{location:"loc2", cost:"5", lat:"23.006126",lon:"72.521721"}
                    ,{location:"loc3", cost:"10", lat:"52.5167",lon:"13.3833"}
                    ,{location:"loc4", cost:"3", lat:"52.498555",lon:"13.442965"}
                    ,{location:"loc5", cost:"13", lat:"53.5167",lon:"13.3833"}
                    ,{location:"loc6", cost:"13", lat:"52.5167",lon:"13.4033"}
                    ];
  }
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